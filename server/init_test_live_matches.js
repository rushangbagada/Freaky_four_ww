const mongoose = require('mongoose');
const Live_Match = require('./models/live_match');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

main()
  .then(() => {
    console.log('Test live matches added successfully');
    process.exit(0); // Exit after adding matches
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

async function main() {
  // Use MongoDB URL from .env file
  await mongoose.connect(process.env.MONGO_URI);
  
  // Delete existing test matches if needed
  await Live_Match.deleteMany({ id: /test-match-.*/ });
  
  // Create test live matches with different statuses
  const testMatches = [
    {
      id: "test-match-1",
      sport: "Football",
      team1: "Red Dragons",
      team2: "Blue Eagles",
      team1_score: 2,
      team2_score: 1,
      status: "live",
      time: "65:00",
      venue: "Central Stadium",
      events: [
        {
          time: "23:15",
          type: "Goal",
          team: "Red Dragons",
          player: "John Smith",
          description: "Header from corner"
        },
        {
          time: "42:30",
          type: "Goal",
          team: "Blue Eagles",
          player: "Mike Johnson",
          description: "Penalty kick"
        },
        {
          time: "58:12",
          type: "Goal",
          team: "Red Dragons",
          player: "Alex Brown",
          description: "Long-range shot"
        }
      ],
      stats: {
        possession: {
          home: 55,
          away: 45
        },
        shots: {
          home: 12,
          away: 8
        },
        shots_on_target: {
          home: 7,
          away: 4
        },
        fouls: {
          home: 6,
          away: 9
        }
      }
    },
    {
      id: "test-match-2",
      sport: "Basketball",
      team1: "City Sharks",
      team2: "Mountain Lions",
      team1_score: 78,
      team2_score: 82,
      status: "live",
      time: "Q3 4:15",
      venue: "Sports Arena",
      events: [
        {
          time: "Q1 8:45",
          type: "3-Pointer",
          team: "Mountain Lions",
          player: "James Wilson",
          description: "From downtown"
        },
        {
          time: "Q2 2:30",
          type: "Dunk",
          team: "City Sharks",
          player: "Kevin Thomas",
          description: "Alley-oop"
        }
      ],
      stats: {
        possession: {
          home: 48,
          away: 52
        },
        shots: {
          home: 65,
          away: 70
        },
        shots_on_target: {
          home: 32,
          away: 38
        },
        fouls: {
          home: 12,
          away: 10
        }
      }
    },
    {
      id: "test-match-3",
      sport: "Cricket",
      team1: "Royal Challengers",
      team2: "Super Kings",
      team1_score: 156,
      team2_score: 0,
      status: "upcoming",
      time: "19:00",
      venue: "International Cricket Ground",
      events: [],
      stats: {
        possession: {
          home: 0,
          away: 0
        },
        shots: {
          home: 0,
          away: 0
        },
        shots_on_target: {
          home: 0,
          away: 0
        },
        fouls: {
          home: 0,
          away: 0
        }
      }
    },
    {
      id: "test-match-4",
      sport: "Tennis",
      team1: "Sarah Williams",
      team2: "Emma Davis",
      team1_score: 6,
      team2_score: 4,
      status: "finished",
      time: "Completed",
      venue: "Grand Slam Arena",
      events: [
        {
          time: "Set 1",
          type: "Set Won",
          team: "Sarah Williams",
          player: "Sarah Williams",
          description: "6-4"
        },
        {
          time: "Set 2",
          type: "Set Won",
          team: "Sarah Williams",
          player: "Sarah Williams",
          description: "6-3"
        }
      ],
      stats: {
        possession: {
          home: 52,
          away: 48
        },
        shots: {
          home: 45,
          away: 38
        },
        shots_on_target: {
          home: 30,
          away: 25
        },
        fouls: {
          home: 2,
          away: 3
        }
      }
    }
  ];

  // Insert the test matches
  const result = await Live_Match.insertMany(testMatches);
  console.log(`${result.length} test live matches added successfully`);
  return result;
}