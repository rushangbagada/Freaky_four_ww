const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function() { 
      // Password is only required for local authentication
      return this.authProvider === 'local'; 
    }
  },
  mobile: {
    type: String
  },
  year: {
    type: String
  },
  department: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'club_leader', 'admin'],
    default: 'user'
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetExpires: Date,

  // OAuth-specific fields for Google login
  googleId: {
    type: String,
    unique: true, // Each Google user has a unique ID
    sparse: true  // Allows multiple null values, but ensures uniqueness for actual values
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'], // Can be expanded for other providers like Facebook
    default: 'local'
  },
  profilePicture: {
    type: String // URL to profile picture from OAuth provider
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
