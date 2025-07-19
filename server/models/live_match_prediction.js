const mongoose = require('mongoose');

const liveMatchPredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction_user',
    required: true
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Live_Match',
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
liveMatchPredictionSchema.index({ userId: 1, matchId: 1 }, { unique: true });

const LiveMatchPrediction = mongoose.model('LiveMatchPrediction', liveMatchPredictionSchema);
module.exports = LiveMatchPrediction;