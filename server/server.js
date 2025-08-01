



const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path=require('path');
const cors=require('cors');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const port=process.env.PORT || 5000;

const jwt = require("jsonwebtoken"); // Add this line
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");

const Gallery=require('./models/gallery');
const User=require('./models/User');
const Review=require('./models/review');
const Match=require('./models/match');
const Club=require('./models/club');
const methodoverride=require('method-override');
const New_match = require('./models/new_match');
const News = require('./models/news');
const Facts = require('./models/facts');
const Stats = require('./models/web_stats');
const Live_Match = require('./models/live_match');
const Prediction_user = require('./models/prediction_user');
const Prediction_Match = require('./models/prediction_match');
const Player_user = require('./models/player_user');
const Club_Details = require('./models/club-detail');
const Club_player = require('./models/club-player');

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodoverride('_method'));



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
  Live_Match.find({ status: "live" })
    .then(matches => res.json(matches))
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
    let match = await Live_Match.findOne({ id: matchId });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Return full match with stats and events
    res.json(match);
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
    
    // If match is finished, calculate points for all predictions
    if (status === "finished") {
      // Find all predictions for this match
      const predictions = await LiveMatchPrediction.find({ matchId, isProcessed: false });
      
      // Process each prediction
      for (const prediction of predictions) {
        let points = 0;
        
        // Exact score match (10 points)
        if (prediction.predictedTeam1Score === team1_score && 
            prediction.predictedTeam2Score === team2_score) {
          points = 10;
        }
        // Correct winner or draw prediction (5 points)
        else if (
          (team1_score > team2_score && prediction.predictedTeam1Score > prediction.predictedTeam2Score) ||
          (team1_score < team2_score && prediction.predictedTeam1Score < prediction.predictedTeam2Score) ||
          (team1_score === team2_score && prediction.predictedTeam1Score === prediction.predictedTeam2Score)
        ) {
          points = 5;

          // Partial score match: correct team score (2 points each)
          if (prediction.predictedTeam1Score === team1_score) {
            points += 2;
          }
          if (prediction.predictedTeam2Score === team2_score) {
            points += 2;
          }
        }

        // Update prediction with points
        prediction.points = points;
        prediction.isProcessed = true;
        await prediction.save();

        // Update user's total points and stats
        const user = await Prediction_user.findById(prediction.userId);
        if (user) {
          // Increment total points
          user.total_point = (user.total_point || 0) + points;
          
          // Update prediction count
          const currentPredictions = parseInt(user.prediction || "0");
          user.prediction = (currentPredictions + 1).toString();
          
          // Update wins if user scored points
          if (points > 0) {
            user.wins = (user.wins || 0) + 1;
          }
          
          // Calculate accuracy (wins / total predictions * 100)
          const totalPredictions = currentPredictions + 1;
          const totalWins = user.wins || 0;
          user.accuracy = totalPredictions > 0 ? Math.round((totalWins / totalPredictions) * 100) : 0;
          
          await user.save();
        }
      }
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
      success_url: "http://localhost:5173/payment/PaymentSuccess", // ✅ make sure this exists in frontend
      cancel_url: "http://localhost:5173/payment/PaymentFailed",   // ✅ make sure this exists in frontend
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ message: "Stripe checkout failed", error: err.message });
  }
});



const { exec } = require('child_process');
// const path = require('path');
// Import the game routes module
const gameRoutes = require('./routes/gameRoutes');

// Use the game routes for the /api endpoint
app.use('/api', gameRoutes);
