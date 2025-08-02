const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const New_match = require('../models/new_match');

// Generate future dates
const today = new Date();
const getRandomFutureDate = (daysFromNow) => {
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromNow);
  return futureDate;
};

const sampleUpcomingMatches = [
  // Basketball matches
  {
    id: 1001,
    team1: "Basketball Club",
    team2: "Engineering Basketball Team",
    date: getRandomFutureDate(3),
    venue: "Main Basketball Court",
    time: "4:00 PM",
    category: "Basketball"
  },
  {
    id: 1002,
    team1: "Basketball Club",
    team2: "Medical College Basketball",
    date: getRandomFutureDate(10),
    venue: "Indoor Sports Complex",
    time: "3:30 PM",
    category: "Basketball"
  },
  {
    id: 1003,
    team1: "Basketball Club",
    team2: "Commerce College Team",
    date: getRandomFutureDate(17),
    venue: "Main Basketball Court",
    time: "5:00 PM",
    category: "Basketball"
  },

  // Football matches
  {
    id: 1004,
    team1: "Football Club",
    team2: "Technical College FC",
    date: getRandomFutureDate(5),
    venue: "Football Ground",
    time: "4:30 PM",
    category: "Football"
  },
  {
    id: 1005,
    team1: "Football Club",
    team2: "Arts College United",
    date: getRandomFutureDate(12),
    venue: "Main Football Stadium",
    time: "3:00 PM",
    category: "Football"
  },
  {
    id: 1006,
    team1: "Football Club",
    team2: "Science College XI",
    date: getRandomFutureDate(19),
    venue: "Football Ground",
    time: "4:00 PM",
    category: "Football"
  },

  // Cricket matches
  {
    id: 1007,
    team1: "Cricket Club",
    team2: "Engineering Cricket Team",
    date: getRandomFutureDate(7),
    venue: "Cricket Ground",
    time: "2:00 PM",
    category: "Cricket"
  },
  {
    id: 1008,
    team1: "Cricket Club",
    team2: "Law College Cricket",
    date: getRandomFutureDate(14),
    venue: "Main Cricket Stadium",
    time: "1:30 PM",
    category: "Cricket"
  },
  {
    id: 1009,
    team1: "Cricket Club",
    team2: "Management College XI",
    date: getRandomFutureDate(21),
    venue: "Cricket Ground",
    time: "2:30 PM",
    category: "Cricket"
  },

  // Tennis matches
  {
    id: 1010,
    team1: "Tennis Club",
    team2: "Engineering Tennis Team",
    date: getRandomFutureDate(4),
    venue: "Tennis Court 1",
    time: "5:30 PM",
    category: "Tennis"
  },
  {
    id: 1011,
    team1: "Tennis Club",
    team2: "Medical College Tennis",
    date: getRandomFutureDate(11),
    venue: "Tennis Court 2",
    time: "4:30 PM",
    category: "Tennis"
  },

  // Swimming matches
  {
    id: 1012,
    team1: "Swimming Club",
    team2: "Aquatic Sports Academy",
    date: getRandomFutureDate(6),
    venue: "Swimming Pool",
    time: "6:00 PM",
    category: "Swimming"
  },
  {
    id: 1013,
    team1: "Swimming Club",
    team2: "Water Sports College",
    date: getRandomFutureDate(13),
    venue: "Olympic Pool",
    time: "5:30 PM",
    category: "Swimming"
  },

  // Badminton matches
  {
    id: 1014,
    team1: "Badminton Club",
    team2: "Shuttlers United",
    date: getRandomFutureDate(8),
    venue: "Badminton Hall",
    time: "6:30 PM",
    category: "Badminton"
  },
  {
    id: 1015,
    team1: "Badminton Club",
    team2: "Racket Sports Academy",
    date: getRandomFutureDate(15),
    venue: "Indoor Sports Complex",
    time: "5:00 PM",
    category: "Badminton"
  }
];

async function populateUpcomingMatches() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully');
    
    // Clear existing upcoming matches
    console.log('🧹 Clearing existing upcoming matches...');
    await New_match.deleteMany({});
    
    // Insert sample upcoming matches
    console.log('📝 Inserting sample upcoming matches...');
    const result = await New_match.insertMany(sampleUpcomingMatches);
    
    console.log(`✅ Successfully inserted ${result.length} upcoming matches`);
    
    // Verify insertion
    const matchCount = await New_match.countDocuments();
    console.log(`📊 Total upcoming matches in database: ${matchCount}`);
    
    // Show matches by category
    const categories = ['Basketball', 'Football', 'Cricket', 'Tennis', 'Swimming', 'Badminton'];
    for (const category of categories) {
      const categoryMatches = await New_match.find({ category }).countDocuments();
      if (categoryMatches > 0) {
        console.log(`🏆 ${category}: ${categoryMatches} upcoming matches`);
      }
    }
    
    // Show next 5 upcoming matches
    console.log('\n📅 Next 5 upcoming matches:');
    const nextMatches = await New_match.find().sort({ date: 1 }).limit(5);
    nextMatches.forEach((match, index) => {
      const formattedDate = match.date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      console.log(`${index + 1}. ${match.team1} vs ${match.team2} - ${formattedDate} at ${match.time} (${match.venue})`);
    });
    
  } catch (error) {
    console.error('❌ Error populating upcoming matches:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

populateUpcomingMatches();
