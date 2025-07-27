const express = require("express");
const { register, verifyOTP, resendOTP, verifyResetToken, login, forgotPassword, resetPassword, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-reset-token", verifyResetToken);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Add the new /me endpoint with the protect middleware
router.get("/me", protect, getCurrentUser);

module.exports = router;
