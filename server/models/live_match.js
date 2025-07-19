const mongoose = require('mongoose');

const live_matchSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  team1: {
    type: String,
    required: true
  },
  team2: {
    type: String,
    required: true
  },
  team1_score: {
    type: Number,
    required: true
  },
  team2_score: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: false  // Change from true to false to make it optional
  },
  events: [
    {
      time: { type: String, required: true },
      type: {
        type: String,
        required: true
      },
      team: { type: String, required: true },
      player: { type: String, required: true },
      description: { type: String }
    }
  ],
  stats: {
    possession: {
      home: { type: Number, required: true },
      away: { type: Number, required: true }
    },
    shots: {
      home: { type: Number, required: true },
      away: { type: Number, required: true }
    },
    shots_on_target: {
      home: { type: Number, required: true },
      away: { type: Number, required: true }
    },
    fouls: {
      home: { type: Number, required: true },
      away: { type: Number, required: true }
    },
    
  }
});

const Live_match = mongoose.model('Live_Match', live_matchSchema);
module.exports = Live_match;
