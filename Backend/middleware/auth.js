const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "No token found!!" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({
        message:
          "OOPs!! Something went wrong (T_T) OR Invalid or expired token ",
      });
  }
};

const protectVerifyOtp = async (req, res, next) => {
  const { email } = req.params;

  if (!email) return res.status(400).json({ message: "Email is missing" });

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!user.otp || !user.otpExpiry)
    return res
      .status(400)
      .json({ message: "OTP not generated, please request OTP first!!" });

  if (user.otpExpiry < Date.now())
    return res
      .status(400)
      .json({ message: "OTP has expired, request a new one" });

  next();
};

const protectChangePassword = async (req, res, next) => {
  const { email } = req.params;
  const authHeader = req.headers.authorization;

  if (!email) return res.status(400).json({ message: "Email is missing" });

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Reset token is missing, Please retry" });

  const resetToken = authHeader.split(" ")[1];

  if (!resetToken) {
    return res
      .status(401)
      .json({ success: false, message: "Reset token is missing or invalid" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetToken || user.resetTokenExpiry < Date.now()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired reset token. Please request OTP again",
        });
    }

    const decoded = jwt.verify(resetToken, process.env.SECRET_KEY);

    if (decoded.id !== user._id.toString() || resetToken !== user.resetToken) {
      return res.status(401).json({
        success: false,
        message: "Token mismatch",
      });
    }

    // Attach user to request for controller use
    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { authenticateToken, protectVerifyOtp, protectChangePassword };
