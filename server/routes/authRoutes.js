/**
 * Authentication Routes - Professional Business Platform
 * 
 * Defines all authentication-related API endpoints including registration,
 * login, OTP verification, password management, and user profile access.
 * 
 * @description RESTful API routes for user authentication and account management
 * @author Web Wonders Team
 * @version 1.0.0
 */

// Dependencies
const express = require("express");  // Express router
const { 
  register, 
  verifyOTP, 
  resendOTP, 
  verifyResetToken, 
  login, 
  forgotPassword, 
  resetPassword 
} = require("../controllers/authController");  // Authentication controller functions
const { protect } = require("../middlewares/authMiddleware");  // JWT authentication middleware
const User = require("../models/User");                       // User model
const Prediction_user = require("../models/prediction_user"); // Prediction user model

// Create Express router instance
const router = express.Router();

// ===== AUTHENTICATION ROUTES =====

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 * @body    { name, email, password, mobile?, year?, department? }
 * @returns { message, email } - Success message with email for OTP verification
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and complete login process
 * @access  Public
 * @body    { email, otp }
 * @returns { message, token, user } - JWT token and user information
 */
router.post("/verify-otp", verifyOTP);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP for email verification
 * @access  Public
 * @body    { email }
 * @returns { message } - Confirmation of OTP resend
 */
router.post("/resend-otp", resendOTP);

/**
 * @route   POST /api/auth/verify-reset-token
 * @desc    Verify password reset token
 * @access  Public
 * @body    { email, otp }
 * @returns { message } - Token verification status
 */
router.post("/verify-reset-token", verifyResetToken);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and send OTP
 * @access  Public
 * @body    { email, password }
 * @returns { message, email } - OTP sent confirmation
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset token
 * @access  Public
 * @body    { email }
 * @returns { message } - Reset token sent confirmation
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset user password with token
 * @access  Public
 * @body    { email, resetToken, newPassword }
 * @returns { message } - Password reset confirmation
 */
router.post("/reset-password", resetPassword);

// ===== USER PROFILE ROUTES =====

/**
 * Get Current User Profile
 * 
 * Retrieves the authenticated user's profile information.
 * Currently returns test user data - should be updated to use JWT token.
 * 
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (requires Authorization header)
 * @headers { Authorization: "Bearer <token>" }
 * @returns { _id, id, name, email, total_point } - User profile data
 * 
 * @todo    Implement proper JWT token decoding instead of hardcoded user ID
 * @todo    Add proper error handling for malformed tokens
 */
router.get("/me", async (req, res) => {
  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "Access denied. No token provided.",
        error: "MISSING_TOKEN"
      });
    }

    // Verify JWT token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    // Find user in main User collection
    const user = await User.findById(userId).select('-password -otp -otpExpires -resetToken -resetExpires');
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        error: "USER_NOT_FOUND"
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ 
        message: "Account is deactivated",
        error: "ACCOUNT_DEACTIVATED"
      });
    }

    // Try to find prediction user data for additional stats
    let predictionUser = null;
    try {
      predictionUser = await Prediction_user.findOne({ email: user.email });
    } catch (err) {
      console.log('No prediction user found for:', user.email);
    }

    // Return comprehensive user profile
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      year: user.year,
      department: user.department,
      role: user.role,
      club: user.club,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
    
    // Add prediction stats if available
    if (predictionUser) {
      userProfile.predictionStats = {
        id: predictionUser.id,
        total_point: predictionUser.total_point,
        accuracy: predictionUser.accuracy,
        wins: predictionUser.wins,
        streak: predictionUser.streak,
        badges: predictionUser.badges
      };
    }
    
    res.json(userProfile);
    
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: "Invalid token",
        error: "INVALID_TOKEN"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token has expired",
        error: "TOKEN_EXPIRED"
      });
    }
    
    res.status(500).json({ 
      message: "Server error while fetching user profile", 
      error: error.message 
    });
  }
});

module.exports = router;
