const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Match = require('./models/match');
const { getAllMatches } = require('./controllers/adminController');

// Create test app
const app = express();
app.use(express.json());

// Mock middleware for testing
const mockMiddleware = (req, res, next) => {
  req.user = { role: 'admin', email: 'test@admin.com' };
  next();
};

// Test route
app.get('/test/matches', mockMiddleware, getAllMatches);

// Connect to MongoDB and test
const testRoute = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Check if matches exist
    const matchCount = await Match.countDocuments();
    console.log(`📊 Total matches in database: ${matchCount}`);

    if (matchCount === 0) {
      console.log('⚠️ No matches found in database');
    } else {
      // Try to get matches
      const matches = await Match.find().sort({ date: -1 }).limit(5);
      console.log('📋 Sample matches:');
      matches.forEach((match, index) => {
        console.log(`  ${index + 1}. ${match.team1} vs ${match.team2} - ${match.date}`);
      });
    }

    console.log('✅ Route test completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testRoute();
