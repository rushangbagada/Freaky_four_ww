const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Club_player = require('../models/club-player');

const samplePlayers = [
  // Basketball Club Players
  {
    name: "John Smith",
    year: "second year",
    position: "Point Guard",
    department: "Computer Science",
    matches: 15,
    wins: 12,
    losses: 3,
    win_rate: 80,
    club: "Basketball Club"
  },
  {
    name: "Sarah Johnson",
    year: "third year", 
    position: "Shooting Guard",
    department: "Electronics",
    matches: 18,
    wins: 14,
    losses: 4,
    win_rate: 78,
    club: "Basketball Club"
  },
  {
    name: "Mike Davis",
    year: "final year",
    position: "Center",
    department: "Mechanical",
    matches: 20,
    wins: 16,
    losses: 4,
    win_rate: 80,
    club: "Basketball Club"
  },
  {
    name: "Emily Brown",
    year: "first year",
    position: "Power Forward",
    department: "Civil",
    matches: 10,
    wins: 7,
    losses: 3,
    win_rate: 70,
    club: "Basketball Club"
  },

  // Football Club Players
  {
    name: "David Wilson",
    year: "third year",
    position: "Goalkeeper",
    department: "Computer Science",
    matches: 22,
    wins: 18,
    losses: 4,
    win_rate: 82,
    club: "Football Club"
  },
  {
    name: "James Martinez",
    year: "second year",
    position: "Striker",
    department: "Electronics",
    matches: 20,
    wins: 15,
    losses: 5,
    win_rate: 75,
    club: "Football Club"
  },
  {
    name: "Alex Thompson",
    year: "final year",
    position: "Midfielder",
    department: "Mechanical",
    matches: 25,
    wins: 20,
    losses: 5,
    win_rate: 80,
    club: "Football Club"
  },
  {
    name: "Ryan Garcia",
    year: "first year",
    position: "Defender",
    department: "Civil",
    matches: 12,
    wins: 8,
    losses: 4,
    win_rate: 67,
    club: "Football Club"
  },

  // Cricket Club Players
  {
    name: "Raj Patel",
    year: "third year",
    position: "Batsman",
    department: "Computer Science",
    matches: 18,
    wins: 14,
    losses: 4,
    win_rate: 78,
    club: "Cricket Club"
  },
  {
    name: "Priya Sharma",
    year: "second year",
    position: "Bowler",
    department: "Electronics",
    matches: 16,
    wins: 12,
    losses: 4,
    win_rate: 75,
    club: "Cricket Club"
  },
  {
    name: "Arjun Singh",
    year: "final year",
    position: "All-rounder",
    department: "Mechanical",
    matches: 20,
    wins: 16,
    losses: 4,
    win_rate: 80,
    club: "Cricket Club"
  },

  // Tennis Club Players
  {
    name: "Lisa Chen",
    year: "second year",
    position: "Singles Player",
    department: "Computer Science",
    matches: 14,
    wins: 10,
    losses: 4,
    win_rate: 71,
    club: "Tennis Club"
  },
  {
    name: "Mark Anderson",
    year: "third year",
    position: "Doubles Player",
    department: "Electronics",
    matches: 16,
    wins: 12,
    losses: 4,
    win_rate: 75,
    club: "Tennis Club"
  },

  // Swimming Club Players
  {
    name: "Sophie Williams",
    year: "first year",
    position: "Freestyle Swimmer",
    department: "Civil",
    matches: 8,
    wins: 6,
    losses: 2,
    win_rate: 75,
    club: "Swimming Club"
  },
  {
    name: "Chris Lee",
    year: "second year",
    position: "Backstroke Swimmer",
    department: "Mechanical",
    matches: 10,
    wins: 8,
    losses: 2,
    win_rate: 80,
    club: "Swimming Club"
  }
];

async function populatePlayers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully');
    
    // Clear existing players (optional)
    console.log('🧹 Clearing existing players...');
    await Club_player.deleteMany({});
    
    // Insert sample players
    console.log('📝 Inserting sample players...');
    const result = await Club_player.insertMany(samplePlayers);
    
    console.log(`✅ Successfully inserted ${result.length} players`);
    
    // Verify insertion
    const playerCount = await Club_player.countDocuments();
    console.log(`📊 Total players in database: ${playerCount}`);
    
    // Show players by club
    for (const club of ['Basketball Club', 'Football Club', 'Cricket Club', 'Tennis Club', 'Swimming Club']) {
      const clubPlayers = await Club_player.find({ club }).countDocuments();
      console.log(`🏆 ${club}: ${clubPlayers} players`);
    }
    
  } catch (error) {
    console.error('❌ Error populating players:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

populatePlayers();
