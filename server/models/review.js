/**
 * Review Model - Professional Client Testimonials
 * 
 * Defines the schema for client testimonials and professional reviews
 * used throughout the business analytics platform.
 * 
 * @description MongoDB schema for storing client testimonials and business reviews
 * @author Web Wonders Team
 * @version 1.0.0
 */

const mongoose = require("mongoose");

/**
 * Review Schema Definition
 * 
 * Stores professional testimonials from clients and business partners.
 * Used to showcase client satisfaction and business credibility.
 * 
 * @type {mongoose.Schema}
 */
const reviewSchema = new mongoose.Schema({
  /** @property {String} name - Full name of the client/reviewer (required) */
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  /** @property {String} image - URL to professional headshot or company logo */
  image: {
    type: String,
    required: [true, 'Profile image URL is required'],
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  
  /** @property {String} position - Job title and company name */
  position: {
    type: String,
    required: [true, 'Position/title is required'],
    trim: true,
    maxlength: [150, 'Position cannot exceed 150 characters']
  },
  
  /** @property {String} review - Detailed testimonial text */
  review: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters long'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  }
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt
  collection: 'reviews'  // Explicit collection name
});

// Index for efficient queries
reviewSchema.index({ createdAt: -1 });  // Sort by newest first
reviewSchema.index({ name: 1 });        // Search by client name

/**
 * Virtual property to get review excerpt
 * @returns {String} First 100 characters of the review
 */
reviewSchema.virtual('excerpt').get(function() {
  return this.review.length > 100 
    ? this.review.substring(0, 100) + '...' 
    : this.review;
});

// Ensure virtual fields are included in JSON output
reviewSchema.set('toJSON', { virtuals: true });

/**
 * Static method to get featured reviews
 * @param {Number} limit - Number of reviews to return (default: 5)
 * @returns {Promise<Array>} Array of featured reviews
 */
reviewSchema.statics.getFeatured = function(limit = 5) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Instance method to check if review is recent
 * @returns {Boolean} True if review was created within last 30 days
 */
reviewSchema.methods.isRecent = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.createdAt > thirtyDaysAgo;
};

// Create and export the model
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
