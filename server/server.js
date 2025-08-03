/**
 * Professional Business Management Platform - Main Server File
 * 
 * This is the main Express.js server that handles:
 * - Database connections and management
 * - API routes for business analytics, events, and user management
 * - Real-time event simulation and updates
 * - Payment processing integration
 * - Authentication and authorization
 * 
 * @author Web Wonders Team
 * @version 1.0.0
 * @description Professional platform for business analytics, event management, and predictions
 */

// Core dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Server configuration
const port = process.env.PORT || 5000;

// Authentication and security dependencies
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");

// Route handlers
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");

// Database Models - Business Analytics Platform
const Gallery = require('./models/gallery');           // Image gallery management
const User = require('./models/User');                 // User authentication and profiles
const Review = require('./models/review');             // Client testimonials and reviews
const Match = require('./models/match');               // Historical event/match data
const Club = require('./models/club');                 // Organization/team information
const methodoverride = require('method-override');     // HTTP method override for REST APIs
const New_match = require('./models/new_match');       // Upcoming events/matches
const News = require('./models/news');                 // News and announcements
const Facts = require('./models/facts');               // Business facts and insights
const Stats = require('./models/web_stats');           // Website/platform statistics
const Live_Match = require('./models/live_match');     // Real-time event tracking
const Prediction_user = require('./models/prediction_user');  // User prediction analytics
const Prediction_Match = require('./models/prediction_match'); // Event prediction data
const Player_user = require('./models/player_user');   // Player/participant profiles
const Club_Details = require('./models/club-detail');  // Detailed organization info
const Club_player = require('./models/club-player');   // Organization member mapping
const Turf = require('./models/turf');                 // Venue/facility management

// Configure CORS to allow requests from the frontend
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:3000', 
  'http://localhost:5000',
  // Add your Vercel domain when you deploy
  'https://freaky-four-ww.vercel.app',
  // You can also use environment variables
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

console.log('🔧 CORS Configuration:', {
  allowedOrigins,
  timestamp: new Date().toISOString()
});

// Primary CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    console.log('🌐 CORS Check - Origin:', origin);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS - Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS - Origin blocked:', origin);
      console.log('📋 CORS - Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Fallback CORS headers middleware (in case the above doesn't work)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('🔧 Manual CORS header set for:', origin);
  }
  
  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling preflight request for:', req.url);
    res.status(204).end();
    return;
  }
  
  next();
});

// Security: Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict rate limiting for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 admin requests per windowMs
  message: {
    error: 'Too many admin requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Apply admin rate limiting to admin routes
app.use('/api/admin', adminLimiter);

app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({extended:true, limit: '10mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodoverride('_method'));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});



main()
.then(() => {
  const server = app.listen(port, () => {
    console.log(`✅ Server is listening on port ${port}`);
    console.log(`🌐 Server URL: http://localhost:${port}`);
    console.log(`🎮 Game launch endpoints ready at /api/:gameId`);
  });
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Please use a different port or stop the existing server.`);
    } else {
      console.error(`❌ Server error:`, error.message);
    }
    process.exit(1);
  });
})
.catch(err => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});

async function main() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
}



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);




app.get("/", async (req, res) => {
    res.send("Hello");
})

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        state: dbStates[dbState],
        connected: dbState === 1
      },
      server: {
        port: process.env.PORT || 5000,
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
})

app.get("/api/gallery", async (req, res) => {
    try
    {
        const data=await Gallery.find({});
        res.json(data);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ message: "Error" });
    }
});

app.put("/api/gallery/update", async (req, res) => {
    const { id, likes, views } = req.body;

    const result = await Gallery.updateOne({ id }, { $set: { likes, views } });

    if(result.modifiedCount > 0) {
        res.status(200).json({ message: "Success" });
    }
    else
    {
        res.status(500).json({ message: "Error" });
    }
});

app.post("/api/register",async (req,res)=>{

    try{
        const {name,email,mobile,year,department}=req.body;
    const existing_user=await User.findOne({$or :[{mobile},{email}]});
    if(existing_user)
    {
        return res.status(400).json({message:"User already exists"});
    }


    const newUser = new User({
      name,
      email,
      mobile,
      year,
      department
    });

    const savedUser = await newUser.save();
    console.log("Registered user:", savedUser);
    res.status(201).json({ message: "User registered successfully", user: savedUser });

}
    catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error", error: err });
  }

});

app.get("/api/review",(req,res)=>
{
    Review.find({})
    .then((reviews) => res.json(reviews))
    .catch((err) => 
        {
            console.log(err);
            res.status(500).json({ message: "Server error", error: err });
        });
});

app.get("/api/result",(req,res)=>{
  const { sport, time } = req.query;

  const filter = {};

  if (sport !== "All Sports") {
    // Use case-insensitive regex for category matching
    filter.category = { $regex: new RegExp("^" + sport + "$", "i") };
  }

  const now = new Date();

  if (time === "This Month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // 0 for last day of the previous month
    filter.date = { $gte: start, $lte: end };
  } else if (time === "This Season") {
    const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    filter.date = { $gte: start, $lte: now };
  }

  Match.find(filter)
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});


app.get("/api/upcoming_matches", (req, res) => {

  New_match.find()
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
  
})

app.get("/api/recent_matches", (req, res) => {
  const sorted_data=Match.find().sort({date:-1}).limit(3);
  sorted_data
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
})

app.get("/api/clubs", (req, res) => {
  
  const filter={};
  if(req.query.type && req.query.type!=="All")
    {
      filter.type=req.query.type;
    }

  Club.find(filter)
    .then(clubs => res.json(clubs))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
  })

// Debug endpoint to verify club existence
app.get("/api/debug/club/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log(`Debug endpoint - Checking club with ID: ${id}`);
    
    // Try different lookup methods
    const results = {
      byId: null,
      byName: null,
      allClubs: []
    };
    
    // Get all clubs for reference
    const allClubs = await Club.find().lean();
    results.allClubs = allClubs.map(club => ({
      id: club._id,
      name: club.name
    }));
    
    // Try direct ID lookup
    try {
      const clubById = await Club.findById(id).lean();
      if (clubById) {
        results.byId = {
          found: true,
          id: clubById._id,
          name: clubById.name
        };
      }
    } catch (e) {
      results.byId = { error: e.message };
    }
    
    // Try name lookup
    try {
      const clubByName = await Club.findOne({ name: id }).lean();
      if (clubByName) {
        results.byName = {
          found: true,
          id: clubByName._id,
          name: clubByName.name
        };
      }
    } catch (e) {
      results.byName = { error: e.message };
    }
    
    res.json({
      requestedId: id,
      results
    });
  } catch (err) {
    console.error("Error in debug endpoint:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
})

  app.get("/api/events", async (req, res) => {
  try {
    const pastMatches = await Match.find({});
    const upcomingMatches = await New_match.find({});

    const allMatches = [...upcomingMatches, ...pastMatches].sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(allMatches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const news = await News.find({}).sort({ date: -1 });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
})


app.get("/api/funfacts", async (req, res) => {
  try {
    const facts = await Facts.find({})
    res.json(facts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
})

app.get("/api/stats", async (req, res) => {
  try {
    const stats = await Stats.find({})
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
})

app.get("/api/live_matches", (req, res) => {
  // Return all matches but prioritize live ones
  Live_Match.find({})
    .sort({ 
      // Sort by status (live first), then by most recent updates
      status: 1, // This will put 'finished' before 'live' and 'upcoming', so we need custom logic
      updatedAt: -1 
    })
    .then(matches => {
      // Custom sort to prioritize live matches
      const sortedMatches = matches.sort((a, b) => {
        const statusPriority = { 'live': 3, 'upcoming': 2, 'finished': 1 };
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[b.status] - statusPriority[a.status];
        }
        // If same status, sort by update time (most recent first)
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
      
      res.json(sortedMatches);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
})

app.get("/api/live_matches/:id", (req, res) => {
  Live_Match.findById(req.params.id)
    .then(match => res.json(match))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
})

app.get("/api/match/:id", async (req, res) => {
  try {
    const matchId = req.params.id;

    // First try live matches
    let match = await Live_Match.findById(matchId).populate('events stats');

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Return the match with populated stats and events
    res.json({
      team1: match.team1,
      team2: match.team2,
      team1_score: match.team1_score,
      team2_score: match.team2_score,
      status: match.status,
      time: match.time,
      events: match.events,
      stats: match.stats
    });
  } catch (err) {
    console.error("Error fetching match:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

app.get("/api/prediction_match", (req, res) => {
  Prediction_Match.find()
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
})

app.get("/api/user", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // First try to find existing prediction user
    let predictionUser = await Prediction_user.findOne({ email });
    
    if (!predictionUser) {
      console.log(`No prediction user found for email: ${email}, checking main User collection...`);
      
      // Check if user exists in main User collection
      const mainUser = await User.findOne({ email });
      
      if (!mainUser) {
        return res.status(404).json({ message: "User not found in system" });
      }
      
      console.log(`Found main user, creating prediction user for: ${email}`);
      
      // Get the highest existing ID to generate next ID
      const highestUser = await Prediction_user.findOne().sort({ id: -1 }).limit(1);
      const nextId = highestUser ? highestUser.id + 1 : 1001;
      
      // Create new prediction user based on main user data
      predictionUser = new Prediction_user({
        id: nextId,
        name: mainUser.name,
        email: mainUser.email,
        total_point: 0,
        prediction: "0",
        accuracy: 0,
        wins: 0,
        streak: 0,
        badges: []
      });
      
      await predictionUser.save();
      console.log(`Created new prediction user with ID: ${nextId}`);
    }
    
    res.json(predictionUser);
  } catch (err) {
    console.error("Error in /api/user endpoint:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/leader", (req, res) => {
  Prediction_user.find()
    .then(leader => res.json(leader))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
})

app.get("/api/leaderboard", (req, res) => {
  Player_user.find()
    .then(leaderboard => res.json(leaderboard))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    })
})

// Simplified endpoint to get club by exact ID
app.get("/api/club-details/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log(`Received request for club details with ID: ${id}`);
    
    let club = null;
    
    // First try to find by name (most common case)
    try {
      club = await Club.findOne({ name: { $regex: new RegExp(`^${id}$`, 'i') } }).lean();
      if (club) {
        console.log(`Found club by name:`, club.name);
      }
    } catch (nameError) {
      console.log('Name search failed:', nameError.message);
    }
    
    // If not found by name, try by MongoDB ObjectId (only if id looks like an ObjectId)
    if (!club && id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        club = await Club.findById(id).lean();
        if (club) {
          console.log(`Found club by ID:`, club.name);
        }
      } catch (idError) {
        console.log('ID search failed:', idError.message);
      }
    }
    
    if (!club) {
      console.log(`Club not found with identifier: ${id}`);
      return res.status(404).json({ message: "Club not found" });
    }
    
    // Return the club with additional fields
    return res.json({
      ...club,
      active_players: club.players || 0,
      upcoming_matches: club.matches || 0,
      win_rate: 75 // Default value
    });
  } catch (err) {
    console.error("Error fetching club details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// New endpoint to get club by exact name
app.get("/api/club-by-name/:name", async (req, res) => {
  try {
    const {name} = req.params;
    console.log(`Received request for club details with name: ${name}`);
    
    // Get club directly from the Club collection by name
    const club = await Club.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }).lean();
    
    if (!club) {
      console.log(`Club not found with name: ${name}`);
      return res.status(404).json({ message: "Club not found" });
    }
    
    // Return the club with additional fields
    console.log(`Found club by name:`, club);
    return res.json({
      ...club,
      active_players: club.players || 0,
      upcoming_matches: club.matches || 0,
      win_rate: 75 // Default value
    });
  } catch (err) {
    console.error("Error fetching club by name:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/club_players/:name", async (req, res) => {
  const { name } = req.params;
  if (!name) return res.status(400).json({ message: "Club name required" });

  try {
    const players = await Club_player.find({ club: { $regex: new RegExp(`^${name}$`, 'i') } });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

app.get("/api/matches", (req, res) => {
  Match.find({})
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

app.get("/api/recent_matches/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const matches = await Match.find({category:name}).sort({ date: -1 }).limit(10);
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

app.get("/api/upcoming_matches/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const matches = await New_match.find({category:name}).sort({ date: 1 }).limit(10);
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Import the LiveMatchPrediction model
const LiveMatchPrediction = require('./models/live_match_prediction');

// Get all live matches for the game page
app.get("/api/game/live-matches", (req, res) => {
  Live_Match.find()
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Submit a prediction for a live match
app.post("/api/user/live-match-prediction", async (req, res) => {
  try {
    console.log('Live match prediction request received:', {
      body: req.body,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
    
    const { userId, matchId, team1Score, team2Score } = req.body;
    
    // Validate required fields
    if (!userId || !matchId || team1Score === undefined || team2Score === undefined) {
      console.log('Missing required fields:', { userId: !!userId, matchId: !!matchId, team1Score, team2Score });
      return res.status(400).json({ 
        message: "Missing required fields",
        details: {
          userId: !userId ? 'Missing' : 'Present',
          matchId: !matchId ? 'Missing' : 'Present',
          team1Score: team1Score === undefined ? 'Missing' : 'Present',
          team2Score: team2Score === undefined ? 'Missing' : 'Present'
        }
      });
    }
    
    // Validate score values
    if (typeof team1Score !== 'number' || typeof team2Score !== 'number' || team1Score < 0 || team2Score < 0) {
      console.log('Invalid score values:', { team1Score, team2Score, team1Type: typeof team1Score, team2Type: typeof team2Score });
      return res.status(400).json({ 
        message: "Invalid score values. Scores must be non-negative numbers",
        received: { team1Score, team2Score }
      });
    }
    
    console.log('Checking if user exists:', userId);
    // Check if user exists - try both _id and custom id field
    let user;
    try {
      // First try with MongoDB _id
      user = await Prediction_user.findById(userId);
    } catch (error) {
      console.log('Failed to find user by _id, error:', error.message);
    }
    
    // If not found by _id, try by custom id field
    if (!user) {
      try {
        user = await Prediction_user.findOne({ id: userId });
        console.log('Tried finding user by custom id field:', userId);
      } catch (error) {
        console.log('Failed to find user by custom id, error:', error.message);
      }
    }
    
    if (!user) {
      console.log('User not found with either _id or custom id:', userId);
      return res.status(404).json({ message: "User not found" });
    }
    console.log('User found:', { _id: user._id, customId: user.id, name: user.name || user.username });
    
    console.log('Checking if match exists:', matchId);
    // Check if match exists
    const match = await Live_Match.findById(matchId);
    if (!match) {
      console.log('Match not found:', matchId);
      return res.status(404).json({ message: "Match not found" });
    }
    console.log('Match found:', { id: match._id, status: match.status, teams: `${match.team1} vs ${match.team2}` });
    
    // Check if match is still open for predictions (not finished)
    if (match.status === "finished") {
      console.log('Match already finished:', { matchId, status: match.status });
      return res.status(400).json({ message: "Match is already finished, predictions closed" });
    }
    
    // Check if user has already made a prediction for this match
    console.log('Checking for existing prediction:', { userId: user._id, matchId });
    const existingPrediction = await LiveMatchPrediction.findOne({ userId: user._id, matchId });
    
    if (existingPrediction) {
      console.log('User has already made a prediction for this match:', existingPrediction._id);
      return res.status(400).json({ 
        message: "You have already made a prediction for this match. Each user can predict only once per match.",
        existingPrediction: {
          predictedTeam1Score: existingPrediction.predictedTeam1Score,
          predictedTeam2Score: existingPrediction.predictedTeam2Score,
          createdAt: existingPrediction.createdAt
        }
      });
    }
    
    console.log('Creating new prediction:', { userId: user._id, matchId, team1Score, team2Score });
    // Create new prediction - always use the MongoDB _id for the relationship
    const prediction = new LiveMatchPrediction({
      userId: user._id,
      matchId,
      predictedTeam1Score: team1Score,
      predictedTeam2Score: team2Score,
      isProcessed: false
    });
    
    await prediction.save();
    
    console.log('Prediction saved successfully:', prediction);
    
    res.status(201).json({
      message: "Prediction submitted successfully",
      prediction
    });
  } catch (error) {
    console.error("Error submitting prediction:", {
      error: error.message,
      stack: error.stack,
      body: req.body,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's predictions for live matches
app.get("/api/user/:userId/live-match-predictions", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const predictions = await LiveMatchPrediction.find({ userId })
      .populate('matchId')
      .sort({ createdAt: -1 });
    
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API endpoint to fetch turf data
app.get("/api/turfs", async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (error) {
    console.error("Error fetching turfs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin endpoint to create a new turf
app.post("/api/admin/turfs", async (req, res) => {
  try {
    const { name, location, price, imageUrl } = req.body;
    
    // Get the highest existing ID and increment it
    const lastTurf = await Turf.findOne().sort({ id: -1 });
    const newId = lastTurf ? lastTurf.id + 1 : 1;
    
    const newTurf = new Turf({
      id: newId,
      name,
      location,
      price: price || 500,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75',
      availability: true
    });
    
    const savedTurf = await newTurf.save();
    res.status(201).json(savedTurf);
  } catch (error) {
    console.error("Error creating turf:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin endpoint to update turf
app.put("/api/admin/turfs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedTurf = await Turf.findOneAndUpdate(
      { id: parseInt(id) },
      updates,
      { new: true }
    );
    
    if (!updatedTurf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    
    res.json(updatedTurf);
  } catch (error) {
    console.error("Error updating turf:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin endpoint to delete turf
app.delete("/api/admin/turfs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTurf = await Turf.findOneAndDelete({ id: parseInt(id) });
    
    if (!deletedTurf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    
    res.json({ message: "Turf deleted successfully", turf: deletedTurf });
  } catch (error) {
    console.error("Error deleting turf:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin endpoint to update match scores and calculate points
app.post("/api/admin/live-matches/:matchId/update-scores", async (req, res) => {
  try {
    const { matchId } = req.params;
    const { team1_score, team2_score, status } = req.body;
    
    // Update the match scores
    const updatedMatch = await Live_Match.findByIdAndUpdate(
      matchId,
      { team1_score, team2_score, status },
      { new: true }
    );
    
    if (!updatedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    
    res.json({
      message: "Match scores updated successfully",
      match: updatedMatch
    });
  } catch (error) {
    console.error("Error updating scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post("/api/booking", async (req, res) => {
  const { price, name, location } = req.body;

  if (!price || !name || !location) {
    return res.status(400).json({ message: "Price, name, and location are required" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { 
              name: `Turf Booking - ${name}`,
              description: `Location: ${location}`
            },
            unit_amount: price * 100, // price in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://freaky-four-ww.vercel.app/payment/PaymentSuccess", // ✅ make sure this exists in frontend
      cancel_url: "https://freaky-four-ww.vercel.app/payment/PaymentFailed",   // ✅ make sure this exists in frontend
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ message: "Stripe checkout failed", error: err.message });
  }
});



// Live match score simulation
let scoreSimulationInterval = null;

// Function to simulate live match score updates
const simulateLiveMatchScores = async () => {
  try {
    // Find all live matches
    const liveMatches = await Live_Match.find({ status: 'live' });
    
    if (liveMatches.length > 0) {
      console.log(`🎮 Simulating scores for ${liveMatches.length} live matches...`);
    }
    
    for (const match of liveMatches) {
      let team1_score = match.team1_score || 0;
      let team2_score = match.team2_score || 0;
      let hasScoreChanged = false;
      
      // Higher chance for score updates (60% chance per interval)
      if (Math.random() > 0.4) {
        // Random chance for each team to score (15% chance per team per interval)
        if (Math.random() > 0.85) {
          team1_score += 1;
          hasScoreChanged = true;
          console.log(`⚽ ${match.team1} SCORED! New score: ${team1_score}-${team2_score}`);
        }
        
        if (Math.random() > 0.85) {
          team2_score += 1;
          hasScoreChanged = true;
          console.log(`⚽ ${match.team2} SCORED! New score: ${team1_score}-${team2_score}`);
        }
        
        // Update match time (simulate match progress)
        let currentTime = parseInt(match.time?.replace("'", "")) || 0;
        if (currentTime < 90) {
          currentTime += Math.floor(Math.random() * 2) + 1; // Increment by 1-2 minutes
        }
        
        // Don't auto-finish matches - let admin control this
        let status = match.status;
        
        // Update the match in database
        const updatedMatch = await Live_Match.findByIdAndUpdate(
          match._id,
          { 
            team1_score, 
            team2_score, 
            time: `${currentTime}'`,
            status,
            updatedAt: new Date() // Add timestamp for real-time detection
          },
          { new: true }
        );
        
        if (hasScoreChanged) {
          console.log(`📊 Updated match: ${updatedMatch.team1} ${updatedMatch.team1_score} - ${updatedMatch.team2_score} ${updatedMatch.team2} (${updatedMatch.time})`);
        }
        
        // Add random events (25% chance)
        if (Math.random() > 0.75) {
          const events = match.events || [];
          const eventTypes = ['goal', 'yellow-card', 'substitution', 'foul', 'corner', 'offside'];
          const players = [
            'Alex Johnson', 'Mike Smith', 'Sarah Wilson', 'Tom Brown', 'Lisa Davis',
            'Chris Lee', 'Emma Taylor', 'Jake Miller', 'Anna Garcia', 'Ryan Clark'
          ];
          
          const randomEvent = {
            time: `${currentTime}'`,
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            team: Math.random() > 0.5 ? match.team1 : match.team2,
            player: players[Math.floor(Math.random() * players.length)],
            description: hasScoreChanged ? 'Goal scored!' : 'Match event occurred'
          };
          
          events.push(randomEvent);
          
          // Keep only last 10 events to avoid too much data
          const recentEvents = events.slice(-10);
          
          // Update events in database
          await Live_Match.findByIdAndUpdate(
            match._id,
            { events: recentEvents, updatedAt: new Date() },
            { new: true }
          );
          
          console.log(`📝 Added event: ${randomEvent.type} by ${randomEvent.player} (${randomEvent.team})`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in live match simulation:', error);
  }
};

// Start live match simulation when server starts
const startLiveMatchSimulation = () => {
  if (scoreSimulationInterval) {
    clearInterval(scoreSimulationInterval);
  }
  
  console.log('🎮 Starting live match score simulation...');
  console.log('⚡ Score updates will occur every 3 seconds for live matches');
  // Run simulation every 3 seconds for real-time updates
  scoreSimulationInterval = setInterval(simulateLiveMatchScores, 3000);
};

// Stop live match simulation
const stopLiveMatchSimulation = () => {
  if (scoreSimulationInterval) {
    clearInterval(scoreSimulationInterval);
    scoreSimulationInterval = null;
    console.log('⏹️ Live match score simulation stopped.');
  }
};

// Start simulation when server is ready
startLiveMatchSimulation();

// Gracefully stop simulation on server shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down...');
  stopLiveMatchSimulation();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server terminating...');
  stopLiveMatchSimulation();
  process.exit(0);
});

const { exec } = require('child_process');
// const path = require('path');
// Import the game routes module
// const gameRoutes = require('./routes/gameRoutes');

// Use the game routes for the /api endpoint
// app.use('/api', gameRoutes);

// CORS fix deployment - January 2025 - Updated
