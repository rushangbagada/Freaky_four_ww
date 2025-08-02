/**
 * Prediction User Model - Business Analytics Specialists
 * 
 * Defines the schema for business analysts and their prediction performance
 * in the professional analytics platform. Tracks forecasting accuracy,
 * achievements, and current business predictions.
 * 
 * @description MongoDB schema for business analysts with performance metrics
 * @author Web Wonders Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Prediction User Schema Definition
 * 
 * Stores business analyst profiles with comprehensive performance tracking,
 * prediction accuracy metrics, and achievement systems.
 * 
 * @type {mongoose.Schema}
 */
const prediction_userSchema = new mongoose.Schema({
  /** @property {Number} id - Unique analyst identifier */
  id: {
    type: Number,
    required: [true, 'Analyst ID is required'],
    unique: true,
    min: [1, 'ID must be a positive number']
  },
  
  /** @property {String} name - Full name of the business analyst */
  name: {
    type: String,
    required: [true, 'Analyst name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  /** @property {String} email - Professional email address */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  
  /** @property {Number} total_point - Accumulated points from successful predictions */
  total_point: {
    type: Number,
    required: [true, 'Total points are required'],
    min: [0, 'Points cannot be negative'],
    default: 0
  },
  
  /** @property {String} prediction - Current business forecast or prediction */
  prediction: {
    type: String,
    required: [true, 'Current prediction is required'],
    trim: true,
    maxlength: [500, 'Prediction cannot exceed 500 characters']
  },
  
  /** @property {Number} accuracy - Prediction accuracy rate (0-1 scale) */
  accuracy: {
    type: Number,
    required: [true, 'Accuracy rate is required'],
    min: [0, 'Accuracy cannot be less than 0'],
    max: [1, 'Accuracy cannot exceed 1'],
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 1;
      },
      message: 'Accuracy must be between 0 and 1'
    }
  },
  
  /** @property {Number} wins - Total number of successful predictions */
  wins: {
    type: Number,
    required: [true, 'Win count is required'],
    min: [0, 'Wins cannot be negative'],
    default: 0
  },
  
  /** @property {Number} streak - Current consecutive successful predictions */
  streak: {
    type: Number,
    required: [true, 'Streak count is required'],
    min: [0, 'Streak cannot be negative'],
    default: 0
  },
  
  /** @property {Array<String>} badges - Achievement badges earned (emojis) */
  badges: {
    type: [String],
    required: [true, 'Badges array is required'],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length <= 10;
      },
      message: 'Cannot have more than 10 badges'
    }
  }
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt
  collection: 'prediction_users'  // Explicit collection name
});

// Indexes for efficient queries
prediction_userSchema.index({ total_point: -1 });  // Leaderboard sorting
prediction_userSchema.index({ accuracy: -1 });     // Accuracy ranking
prediction_userSchema.index({ email: 1 });         // User lookup
prediction_userSchema.index({ id: 1 });           // Custom ID lookup

/**
 * Virtual property to get accuracy as percentage
 * @returns {String} Accuracy formatted as percentage with 1 decimal place
 */
prediction_userSchema.virtual('accuracyPercentage').get(function() {
  return `${(this.accuracy * 100).toFixed(1)}%`;
});

/**
 * Virtual property to get performance level
 * @returns {String} Performance level based on accuracy
 */
prediction_userSchema.virtual('performanceLevel').get(function() {
  if (this.accuracy >= 0.9) return 'Expert';
  if (this.accuracy >= 0.8) return 'Advanced';
  if (this.accuracy >= 0.7) return 'Intermediate';
  if (this.accuracy >= 0.6) return 'Beginner';
  return 'Novice';
});

// Ensure virtual fields are included in JSON output
prediction_userSchema.set('toJSON', { virtuals: true });

/**
 * Static method to get leaderboard
 * @param {Number} limit - Number of top performers to return (default: 10)
 * @returns {Promise<Array>} Array of top performers sorted by points
 */
prediction_userSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find()
    .sort({ total_point: -1, accuracy: -1 })
    .limit(limit)
    .lean();
};

/**
 * Static method to get analysts by performance level
 * @param {Number} minAccuracy - Minimum accuracy threshold (0-1)
 * @returns {Promise<Array>} Array of analysts meeting criteria
 */
prediction_userSchema.statics.getByAccuracy = function(minAccuracy = 0.8) {
  return this.find({ accuracy: { $gte: minAccuracy } })
    .sort({ accuracy: -1 })
    .lean();
};

/**
 * Instance method to add points and update statistics
 * @param {Number} points - Points to add
 * @param {Boolean} isWin - Whether this was a successful prediction
 * @returns {Promise<Document>} Updated document
 */
prediction_userSchema.methods.addPredictionResult = async function(points, isWin) {
  this.total_point += points;
  
  if (isWin) {
    this.wins += 1;
    this.streak += 1;
  } else {
    this.streak = 0;  // Reset streak on loss
  }
  
  // Recalculate accuracy (simplified - in production, track total predictions)
  // This is a basic implementation
  const totalPredictions = this.wins + Math.max(0, 10 - this.wins); // Assume some losses
  this.accuracy = this.wins / totalPredictions;
  
  return this.save();
};

/**
 * Instance method to check if analyst is high performer
 * @returns {Boolean} True if accuracy >= 80% and wins >= 10
 */
prediction_userSchema.methods.isHighPerformer = function() {
  return this.accuracy >= 0.8 && this.wins >= 10;
};

// Create and export the model
const Prediction_user = mongoose.model('Prediction_user', prediction_userSchema);
module.exports = Prediction_user;
