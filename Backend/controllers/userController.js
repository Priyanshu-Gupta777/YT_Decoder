const User = require("../models/user");
const { verifyMail } = require("../VerifyMail/verifyMail");
const { Session } = require("../models/session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendOtpMail } = require("../VerifyMail/sendOTPMail");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "length should be greater than 4" });
    }

    //check username already exist
    const existusername = await User.findOne({ username: username });
    if (existusername) {
      return res.status(400).json({ message: "username already exist" });
    }

    //check for email exist
    const existemail = await User.findOne({ email: email });
    if (existemail) {
      return res.status(400).json({ message: "email already exist" });
    }

    //check for password length
    if (password.length <= 5) {
      return res.status(400).json({ message: "increase length of password" });
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    verifyMail(token, email); //send mail only

    newUser.token = token;
    await newUser.save();

    return res.status(200).json({
      success: "true",
      message: "SignUP Successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res
        .status(400)
        .json({ message: "Unauthorized Access or Invalid email" });
    }
    const passwordCheck = await bcrypt.compare(password, existUser.password);
    if (!passwordCheck) {
      return res.status(402).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    //check if user is verified
    if (existUser.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Verify your account than login",
      });
    }

    // check for existing session and delete it
    const existingSession = await Session.findOne({ userId: existUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existUser._id });
    }

    //create a new session
    await Session.create({ userId: existUser._id });

    //Generate tokens
    const accessToken = jwt.sign(
      { id: existUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );
    const refreshToken = jwt.sign(
      { id: existUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    existUser.isLoggedIn = true;
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: `Welcome back ${existUser.username}`,
      accessToken,
      refreshToken,
      existUser,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: "OOPs! some error please check" });
  }
};

const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: "false",
        message: "Authorization token is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoder;
    try {
      decoder = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({
          success: "false",
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }
    console.log(decoder);
    const user = await User.findById(decoder.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();

    console.log(user);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    user.otpVerified = false;

    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is requried",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already verified",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one",
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified = true;

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.params.email;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: "false",
      message: "Reset token is missing",
    });
  }

  const resetToken = authHeader.split(" ")[1];

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password do not match",
    });
  }

  try {
    let decoded;

    try {
      decoded = jwt.verify(resetToken, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const user = await User.findOne({ _id: decoded.id, email, resetToken });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 15);

    user.password = hashedPassword;

    user.resetToken = null;
    user.resetTokenExpiry = null;
    user.otpVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successsfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verification,
  logoutUser,
  verifyOTP,
  forgotPassword,
  changePassword,
};
