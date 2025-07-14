const mongoose = require('mongoose');
const LiveMatchPrediction = require('./models/live_match_prediction');
const Prediction_user = require('./models/prediction_user');
const Live_Match = require('./models/live_match');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

main()
  .then(() => {
    console.log('Test predictions added successfully');
    process.exit(0); // Exit after adding predictions
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

async function main() {
  // Use MongoDB URL from .env file
  await mongoose.connect(process.env.MONGO_URI);
  
  // Get test users
  const users = await Prediction_user.find({ email: /test-user.*@example\.com/ });
  if (users.length === 0) {
    console.log('No test users found. Please run init_test_prediction_users.js first.');
    return;
  }
  
  // Get test matches
  const matches = await Live_Match.find({ id: /test-match-.*/ });
  if (matches.length === 0) {
    console.log('No test matches found. Please run init_test_live_matches.js first.');
    return;
  }
  
  // Delete existing test predictions
  await LiveMatchPrediction.deleteMany({
    userId: { $in: users.map(user => user._id) }
  });
  
  // Create test predictions
  const predictions = [];
  
  // Each user predicts on each match
  for (const user of users) {
    for (const match of matches) {
      // Skip predictions for finished matches
      if (match.status === 'finished') continue;
      
      // Generate random predictions
      const team1ScorePrediction = Math.floor(Math.random() * 5);
      const team2ScorePrediction = Math.floor(Math.random() * 5);
      
      predictions.push({
        userId: user._id,
        matchId: match._id,
        predictedTeam1Score: team1ScorePrediction,
        predictedTeam2Score: team2ScorePrediction,
        points: 0, // Points will be calculated when match is finished
        isProcessed: false
      });
    }
  }
  
  if (predictions.length === 0) {
    console.log('No predictions to add.');
    return;
  }
  
  // Insert the test predictions
  const result = await LiveMatchPrediction.insertMany(predictions);
  console.log(`${result.length} test predictions added successfully`);
  return result;
}