/**
 * User Model - Professional Business Platform User Management
 * 
 * This model defines the user schema for the business analytics platform,
 * supporting both local authentication and OAuth providers (Google).
 * 
 * @description MongoDB schema for user accounts with role-based access control
 * @author Web Wonders Team
 * @version 1.0.0
 */

const mongoose = require("mongoose");

/**
 * User Schema Definition
 * 
 * Supports multiple authentication methods and user roles for the
 * professional business analytics and event management platform.
 * 
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
  // === Core User Information ===
  /** @property {String} name - Full name of the user (required) */
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  
  /** @property {String} email - Unique email address for user identification */
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  
  /** @property {String} password - Hashed password (only required for local auth) */
  password: {
    type: String,
    required: function() { 
      // Password is only required for local authentication
      return this.authProvider === 'local'; 
    },
    minlength: 6
  },
  
  // === Professional/Academic Information ===
  /** @property {String} mobile - Contact phone number */
  mobile: {
    type: String,
    trim: true
  },
  
  /** @property {String} year - Academic year or experience level */
  year: {
    type: String,
    trim: true
  },
  
  /** @property {String} department - Department, division, or specialization */
  department: {
    type: String,
    trim: true
  },
  
  // === Role and Access Control ===
  /** @property {String} role - User role determining access permissions */
  role: {
    type: String,
    enum: {
      values: ['user', 'club_leader', 'admin'],
      message: 'Role must be either user, club_leader, or admin'
    },
    default: 'user'
  },
  
  /** @property {ObjectId} club - Reference to associated club/organization */
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  },
  
  /** @property {Boolean} isActive - Account status (active/suspended) */
  isActive: {
    type: Boolean,
    default: true
  },
  
  // === Security and Password Recovery ===
  /** @property {String} otp - One-time password for verification */
  otp: {
    type: String,
    select: false  // Don't include in queries by default
  },
  
  /** @property {Date} otpExpires - Expiration time for OTP */
  otpExpires: {
    type: Date,
    select: false
  },
  
  /** @property {String} resetToken - Password reset token */
  resetToken: {
    type: String,
    select: false
  },
  
  /** @property {Date} resetExpires - Expiration time for reset token */
  resetExpires: {
    type: Date,
    select: false
  },

  // === OAuth Integration ===
  /** @property {String} googleId - Google OAuth unique identifier */
  googleId: {
    type: String,
    unique: true,    // Each Google user has a unique ID
    sparse: true,    // Allows multiple null values, ensures uniqueness for actual values
    select: false    // Don't include in queries by default
  },
  
  /** @property {String} authProvider - Authentication method used */
  authProvider: {
    type: String,
    enum: {
      values: ['local', 'google'],
      message: 'Auth provider must be either local or google'
    },
    default: 'local'
  },
  
  /** @property {String} profilePicture - URL to user's profile picture */
  profilePicture: {
    type: String,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return !v || /^https?:\/\//.test(v);
      },
      message: 'Profile picture must be a valid URL'
    }
  }
}, { 
  timestamps: true,  // Automatically adds createdAt and updatedAt
  toJSON: { 
    transform: function(doc, ret) {
      // Remove sensitive fields when converting to JSON
      delete ret.password;
      delete ret.otp;
      delete ret.otpExpires;
      delete ret.resetToken;
      delete ret.resetExpires;
      delete ret.googleId;
      return ret;
    }
  }
});

module.exports = mongoose.model("User", userSchema);
