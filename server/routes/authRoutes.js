const express = require("express");
const { register, verifyOTP, resendOTP, verifyResetToken, login, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Prediction_user = require("../models/prediction_user");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-reset-token", verifyResetToken);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Add the missing /me endpoint
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // For now, return the test user we created
    // In a real app, you'd decode the JWT token and fetch the actual user
    const testUser = await Prediction_user.findById('6868bd2405488200315811b8');
    
    if (!testUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: testUser._id,
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
      total_point: testUser.total_point
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
