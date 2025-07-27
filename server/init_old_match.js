const mongoose = require('mongoose');
const Old_match = require('./models/old_match');
const connectDB = require('./config/db');

connectDB();

const old_matches = [
  {
    team1: "Basketball Team A",
    team2: "Basketball Team C",
    date: new Date('2024-03-15'),
    venue: "Main Basketball Court",
    time: "2:00 PM",
    category: "Basketball",
    team1_score: 78,
    team2_score: 65
  },
  {
    team1: "Tennis Club A",
    team2: "Tennis Club C",
    date: new Date('2024-03-18'),
    venue: "Tennis Court 2",
    time: "4:00 PM",
    category: "Tennis",
    team1_score: 3,
    team2_score: 2
  },
  {
    team1: "Football Team A",
    team2: "Football Team C",
    date: new Date('2024-03-20'),
    venue: "Football Ground",
    time: "6:00 PM",
    category: "Football",
    team1_score: 2,
    team2_score: 1
  },
  {
    team1: "Badminton Team A",
    team2: "Badminton Team C",
    date: new Date('2024-03-22'),
    venue: "Badminton Court",
    time: "3:00 PM",
    category: "Badminton",
    team1_score: 21,
    team2_score: 18
  },
  {
    team1: "Cricket Team A",
    team2: "Cricket Team C",
    date: new Date('2024-03-25'),
    venue: "Cricket Ground",
    time: "9:00 AM",
    category: "Cricket",
    team1_score: 156,
    team2_score: 142
  },
  {
    team1: "Swimming Team A",
    team2: "Swimming Team C",
    date: new Date('2024-03-28'),
    venue: "Swimming Pool",
    time: "5:00 PM",
    category: "Swimming",
    team1_score: 3,
    team2_score: 2
  }
];

// First, clear existing old matches
Old_match.deleteMany({})
  .then(() => {
    console.log("✅ Cleared existing old matches");
    
    // Then insert the new ones with scores
    return Old_match.insertMany(old_matches);
  })
  .then((res) => {
    console.log("✅ Old matches initialized successfully:", res.length, "matches added");
    process.exit(0); // Only exit here, after all operations are complete
  })
  .catch((err) => {
    console.log("❌ Error initializing old matches:", err);
    process.exit(1);
  });

// REMOVE OR COMMENT OUT THIS SECTION
// The upcoming_matches section is redundant and causing the crash
// If you need both types of matches, combine them into a single operation
const upcoming_matches = [
  {
    team1: "Basketball Team A",
    team2: "Basketball Team C",
    date: new Date('2024-03-15'),
    venue: "Main Basketball Court",
    time: "2:00 PM",
    category: "Basketball"
  },
  {
    team1: "Tennis Club A",
    team2: "Tennis Club C",
    date: new Date('2024-03-18'),
    venue: "Tennis Court 2",
    time: "4:00 PM",
    category: "Tennis"
  },
  {
    team1: "Football Team A",
    team2: "Football Team C",
    date: new Date('2024-03-20'),
    venue: "Football Ground",
    time: "6:00 PM",
    category: "Football"
  },
  {
    team1: "Badminton Team A",
    team2: "Badminton Team C",
    date: new Date('2024-03-22'),
    venue: "Badminton Court",
    time: "3:00 PM",
    category: "Badminton"
  },
  {
    team1: "Cricket Team A",
    team2: "Cricket Team C",
    date: new Date('2024-03-25'),
    venue: "Cricket Ground",
    time: "9:00 AM",
    category: "Cricket"
  },
  {
    team1: "Swimming Team A",
    team2: "Swimming Team C",
    date: new Date('2024-03-28'),
    venue: "Swimming Pool",
    time: "5:00 PM",
    category: "Swimming"
  }
];

Old_match.insertMany(upcoming_matches)
  .then((res) => {
    console.log("✅ Upcoming matches initialized successfully:", res.length, "matches added");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error initializing upcoming matches:", err);
    process.exit(1);
  });