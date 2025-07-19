const mongoose = require('mongoose');
const Prediction_user = require('./models/prediction_user');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

main()
  .then(() => {
    console.log('Test prediction users added successfully');
    process.exit(0); // Exit after adding users
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

async function main() {
  // Use MongoDB URL from .env file
  await mongoose.connect(process.env.MONGO_URI);
  
  // Delete existing test users if needed
  await Prediction_user.deleteMany({ email: /test-user.*@example\.com/ });
  
  // Create test users with different skill levels
  const testUsers = [
    {
      id: 101,
      name: "Alex Expert",
      email: "test-user1@example.com",
      total_point: 120,
      prediction: "Expert predictor",
      accuracy: 85,
      wins: 17,
      streak: 5,
      badges: ["🏆", "🎯", "⚡", "🔥"]
    },
    {
      id: 102,
      name: "Jamie Average",
      email: "test-user2@example.com",
      total_point: 75,
      prediction: "Average predictor",
      accuracy: 60,
      wins: 9,
      streak: 2,
      badges: ["🎯"]
    },
    {
      id: 103,
      name: "Taylor Newbie",
      email: "test-user3@example.com",
      total_point: 30,
      prediction: "New predictor",
      accuracy: 40,
      wins: 4,
      streak: 1,
      badges: []
    },
    {
      id: 104,
      name: "Morgan Analyst",
      email: "test-user4@example.com",
      total_point: 95,
      prediction: "Statistical analyst",
      accuracy: 75,
      wins: 12,
      streak: 3,
      badges: ["📊", "🎯"]
    },
    {
      id: 105,
      name: "Casey Lucky",
      email: "test-user5@example.com",
      total_point: 65,
      prediction: "Lucky guesser",
      accuracy: 55,
      wins: 7,
      streak: 4,
      badges: ["🍀"]
    }
  ];

  // Insert the test users
  const result = await Prediction_user.insertMany(testUsers);
  console.log(`${result.length} test users added successfully`);
  return result;
}