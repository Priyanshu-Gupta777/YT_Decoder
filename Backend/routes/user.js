const express = require("express");
const router = express.Router();

const { analyzeWithGemini } = require("../controllers/commentController");

const {
  authenticateToken,
  protectVerifyOtp,
  protectChangePassword,
} = require("../middleware/auth.js");

const {
  registerUser,
  loginUser,
  verification,
  logoutUser,
  forgotPassword,
  verifyOTP,
  changePassword,
} = require("../controllers/userController.js");
const { isAuthenticated } = require("../middleware/isAuthenticated.js");

router.post("/signup", registerUser);

router.post("/signin", loginUser);

router.post("/signout", isAuthenticated, logoutUser);

router.post("/verify", verification);

router.post("/forget-password", forgotPassword);

router.post("/verifyotp/:email", protectVerifyOtp, verifyOTP);

router.post("/change-password/:email", protectChangePassword, changePassword);

router.post("/analyze", authenticateToken, analyzeWithGemini);

router.get("/test", authenticateToken, (req, res) => {
  return res
    .status(500)
    .json({ message: "Middleware work successfully (>_o)" });
});

module.exports = router;
