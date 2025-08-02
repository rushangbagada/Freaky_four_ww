const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Prediction_user = require('./models/prediction_user');

// Load environment variables
dotenv.config();

async function createTestUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // The user ID from the frontend error
    const targetUserId = '6868bd2405488200315811b8';
    
    // Check if user already exists
    const existingUser = await Prediction_user.findById(targetUserId);
    if (existingUser) {
      console.log('✅ User already exists:', existingUser);
      return;
    }

    // Create a new user with this specific MongoDB _id
    const newUser = new Prediction_user({
      _id: new mongoose.Types.ObjectId(targetUserId),
      id: 999, // Custom ID field (number)
      name: "Test Frontend User",
      email: "frontend-test-user@example.com",
      total_point: 0,
      prediction: "New user from frontend",
      accuracy: 0,
      wins: 0,
      streak: 0,
      badges: []
    });

    const savedUser = await newUser.save();
    console.log('✅ Test user created successfully:', savedUser);

    // Also create a live match for testing
    const Live_Match = require('./models/live_match');
    const matchId = '68761201a44cdadaa5363543';
    
    const existingMatch = await Live_Match.findById(matchId);
    if (!existingMatch) {
      const newMatch = new Live_Match({
        _id: new mongoose.Types.ObjectId(matchId),
        id: 'test-match-001',
        sport: 'Football',
        team1: 'Test Team A',
        team2: 'Test Team B',
        team1_score: 0,
        team2_score: 0,
        status: 'live',
        time: '45\'',
        venue: 'Test Stadium',
        events: [],
        stats: {
          possession: { home: 50, away: 50 },
          shots: { home: 0, away: 0 },
          shots_on_target: { home: 0, away: 0 },
          fouls: { home: 0, away: 0 }
        }
      });

      const savedMatch = await newMatch.save();
      console.log('✅ Test match created successfully:', savedMatch._id);
    } else {
      console.log('✅ Test match already exists:', existingMatch._id);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
}

createTestUser();
