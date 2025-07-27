const mongoose = require('mongoose');

const oldMatchPredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction_user',
    required: true
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Old_match',
    required: true
  },
  predictedTeam1Score: {
    type: Number,
    required: true
  },
  predictedTeam2Score: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can only have one prediction per match
oldMatchPredictionSchema.index({ userId: 1, matchId: 1 }, { unique: true });

const OldMatchPrediction = mongoose.model('OldMatchPrediction', oldMatchPredictionSchema);
module.exports = OldMatchPrediction;