



const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path=require('path');
const port=process.env.PORT || 5000;
const cors=require('cors');
dotenv.config();

const jwt = require("jsonwebtoken"); 
// Add this line with the other imports at the top
// Add this line
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");
const { protect } = require('./middlewares/authMiddleware');
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const gameRoutes = require("./routes/gameRoutes");

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
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
  await mongoose.connect(process.env.MONGO_URI);
  
}



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/game", gameRoutes);




app.get("/", async (req, res) => {
    res.send("Hello");
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

app.get("/api/user", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  Prediction_user.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
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
    
    // Get club directly from the Club collection
    const club = await Club.findOne({ _id: id }).lean();
    
    if (!club) {
      console.log(`Club not found with ID: ${id}, trying by name...`);
      // Try to find by name
      const clubByName = await Club.findOne({ name: { $regex: new RegExp(`^${id}$`, 'i') } }).lean();
      
      if (!clubByName) {
        console.log(`Club not found with name: ${id}`);
        return res.status(404).json({ message: "Club not found" });
      }
      
      // Return the club found by name, with additional fields
      console.log(`Found club by name:`, clubByName);
      return res.json({
        ...clubByName,
        active_players: clubByName.players || 0,
        upcoming_matches: clubByName.matches || 0,
        win_rate: 75 // Default value
      });
    }
    
    // Return the club found by ID, with additional fields
    console.log(`Found club by ID:`, club);
    return res.json({
      ...club,
      active_players: club.players || 0,
      upcoming_matches: club.matches || 0,
      win_rate: 75 // Default value
    });
  } catch (err) {
    console.error("Error fetching club by ID:", err);
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

// Import the OldMatchPrediction model
const OldMatchPrediction = require('./models/old_match_prediction');
const Old_match = require('./models/old_match');

// Get all old matches for the game page
app.get("/api/game/old-matches", (req, res) => {
  Old_match.find()
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Submit a prediction for an old match - add the protect middleware
app.post("/api/user/old-match-prediction", protect, async (req, res) => {
  try {
    const { userId, matchId, team1Score, team2Score } = req.body;
    
    // Verify that the userId in the request matches the authenticated user
    if (userId !== req.userId) {
      return res.status(403).json({ message: "You can only submit predictions for your own account" });
    }
    
    if (!userId || !matchId || team1Score === undefined || team2Score === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Check if user exists
    const user = await Prediction_user.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if match exists
    const match = await Old_match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    // Create or update prediction
    const prediction = await OldMatchPrediction.findOneAndUpdate(
      { userId, matchId },
      { 
        userId,
        matchId,
        predictedTeam1Score: team1Score,
        predictedTeam2Score: team2Score,
        isProcessed: false
      },
      { upsert: true, new: true }
    );
    
    res.status(201).json({
      message: "Prediction submitted successfully",
      prediction
    });
  } catch (error) {
    console.error("Error submitting prediction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Also protect the endpoint for fetching user predictions
app.get("/api/user/:userId/old-match-predictions", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify that the userId in the request matches the authenticated user
    if (userId !== req.userId) {
      return res.status(403).json({ message: "You can only view your own predictions" });
    }
    
    const predictions = await OldMatchPrediction.find({ userId })
      .populate('matchId')
      .sort({ createdAt: -1 });
    
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin endpoint to update old match scores and calculate points
app.post("/api/admin/old-matches/:matchId/update-scores", async (req, res) => {
  try {
    const { matchId } = req.params;
    const { team1_score, team2_score } = req.body;
    
    // Update the match scores
    const updatedMatch = await Old_match.findByIdAndUpdate(
      matchId,
      { team1_score, team2_score },
      { new: true }
    );
    
    if (!updatedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    // Find all predictions for this match
    const predictions = await OldMatchPrediction.find({ matchId, isProcessed: false });
    
    // Process each prediction
    for (const prediction of predictions) {
      let points = 0;
      
      // Exact score match (correct prediction) - 10 points
      if (prediction.predictedTeam1Score === team1_score && 
          prediction.predictedTeam2Score === team2_score) {
        points = 10;
      }
      // Partial correct prediction (correct winner/draw) - 5 points
      else if (
        (team1_score > team2_score && prediction.predictedTeam1Score > prediction.predictedTeam2Score) ||
        (team1_score < team2_score && prediction.predictedTeam1Score < prediction.predictedTeam2Score) ||
        (team1_score === team2_score && prediction.predictedTeam1Score === prediction.predictedTeam2Score)
      ) {
        points = 5;
      }
      
      // Update prediction with points
      await OldMatchPrediction.findByIdAndUpdate(
        prediction._id,
        { points, isProcessed: true }
      );
      
      // Update user's total points
      await Prediction_user.findByIdAndUpdate(
        prediction.userId,
        { $inc: { total_point: points } }
      );
    }
    
    res.json({
      message: "Match scores updated and predictions processed",
      match: updatedMatch,
      predictionsProcessed: predictions.length
    });
  } catch (error) {
    console.error("Error updating match scores:", error);
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

// Game routes are already registered above
