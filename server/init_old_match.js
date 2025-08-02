const mongoose = require('mongoose');
const Old_match = require('./models/old_match');
const connectDB = require('./config/db');

connectDB();

const historical_matches = [
  // 2024 Season 1 (January - March)
  {
    team1: "Engineering Eagles",
    team2: "Computer Cobras",
    date: new Date('2024-03-15'),
    venue: "Main Gymnasium",
    time: "7:00 PM",
    category: "Basketball",
    team1_score: 82,
    team2_score: 76,
    status: "completed",
    mvp: "Kevin Johnson"
  },
  {
    team1: "Rafael Martinez",
    team2: "Lucas Chen",
    date: new Date('2024-03-18'),
    venue: "Tennis Court Center",
    time: "10:00 AM",
    category: "Tennis",
    team1_score: 6,
    team2_score: 3,
    status: "completed",
    mvp: "Rafael Martinez"
  },
  {
    team1: "Arts Arrows",
    team2: "Medical Mavericks",
    date: new Date('2024-03-20'),
    venue: "University Main Stadium",
    time: "4:00 PM",
    category: "Football",
    team1_score: 2,
    team2_score: 1,
    status: "completed",
    mvp: "Marcus Thompson"
  },
  {
    team1: "Business Bears",
    team2: "Science Sharks",
    date: new Date('2024-03-22'),
    venue: "Badminton Hall",
    time: "3:00 PM",
    category: "Badminton",
    team1_score: 4,
    team2_score: 2,
    status: "completed",
    mvp: "Lin Wei"
  },
  {
    team1: "History Hawks",
    team2: "Law Lions",
    date: new Date('2024-03-25'),
    venue: "Cricket Ground East",
    time: "1:00 PM",
    category: "Cricket",
    team1_score: 156,
    team2_score: 142,
    status: "completed",
    mvp: "Rajesh Sharma"
  },
  {
    team1: "Swimming All-Stars",
    team2: "Aquatic Masters",
    date: new Date('2024-03-28'),
    venue: "Aquatic Center Pool",
    time: "9:00 AM",
    category: "Swimming",
    team1_score: 128,
    team2_score: 115,
    status: "completed",
    mvp: "Katie Thompson"
  },

  // 2024 Season 2 (April - June)
  {
    team1: "Medical Mavericks",
    team2: "Computer Cobras",
    date: new Date('2024-04-12'),
    venue: "Sports Hall B",
    time: "5:00 PM",
    category: "Volleyball",
    team1_score: 3,
    team2_score: 1,
    status: "completed",
    mvp: "Sarah Miller"
  },
  {
    team1: "Engineering Eagles",
    team2: "History Hawks",
    date: new Date('2024-04-18'),
    venue: "Ice Hockey Rink",
    time: "7:30 PM",
    category: "Hockey",
    team1_score: 3,
    team2_score: 2,
    status: "completed",
    mvp: "Connor O'Brien"
  },
  {
    team1: "Elena Petrov",
    team2: "Sophia Lee",
    date: new Date('2024-04-25'),
    venue: "Outdoor Tennis Complex",
    time: "11:30 AM",
    category: "Tennis",
    team1_score: 6,
    team2_score: 4,
    status: "completed",
    mvp: "Elena Petrov"
  },
  {
    team1: "Arts Arrows",
    team2: "Business Bears",
    date: new Date('2024-05-08'),
    venue: "Indoor Basketball Court",
    time: "6:30 PM",
    category: "Basketball",
    team1_score: 88,
    team2_score: 92,
    status: "completed",
    mvp: "Michael Davis"
  },
  {
    team1: "Science Sharks",
    team2: "Law Lions",
    date: new Date('2024-05-15'),
    venue: "Campus Athletic Field",
    time: "3:30 PM",
    category: "Football",
    team1_score: 1,
    team2_score: 1,
    status: "completed",
    mvp: "David Rodriguez"
  },
  {
    team1: "Computer Cobras",
    team2: "Medical Mavericks",
    date: new Date('2024-05-22'),
    venue: "University Cricket Stadium",
    time: "12:30 PM",
    category: "Cricket",
    team1_score: 178,
    team2_score: 165,
    status: "completed",
    mvp: "Aditya Patel"
  },

  // 2023 Season Archives (September - December)
  {
    team1: "History Hawks",
    team2: "Engineering Eagles",
    date: new Date('2023-09-14'),
    venue: "Table Tennis Hall",
    time: "2:30 PM",
    category: "Table Tennis",
    team1_score: 6,
    team2_score: 4,
    status: "completed",
    mvp: "Wang Li"
  },
  {
    team1: "Business Bears",
    team2: "Arts Arrows",
    date: new Date('2023-09-28'),
    venue: "Athletic Track Stadium",
    time: "10:00 AM",
    category: "Track & Field",
    team1_score: 89,
    team2_score: 76,
    status: "completed",
    mvp: "Usain Roberts"
  },
  {
    team1: "Medical Mavericks",
    team2: "Science Sharks",
    date: new Date('2023-10-12'),
    venue: "Volleyball Arena",
    time: "4:00 PM",
    category: "Volleyball",
    team1_score: 3,
    team2_score: 0,
    status: "completed",
    mvp: "Emma Garcia"
  },
  {
    team1: "Law Lions",
    team2: "Computer Cobras",
    date: new Date('2023-10-26'),
    venue: "Outdoor Hockey Field",
    time: "6:00 PM",
    category: "Hockey",
    team1_score: 2,
    team2_score: 4,
    status: "completed",
    mvp: "Jake Morrison"
  },
  {
    team1: "Arts Arrows",
    team2: "History Hawks",
    date: new Date('2023-11-09'),
    venue: "Indoor Badminton Complex",
    time: "5:30 PM",
    category: "Badminton",
    team1_score: 5,
    team2_score: 3,
    status: "completed",
    mvp: "Priya Sharma"
  },
  {
    team1: "Engineering Eagles",
    team2: "Medical Mavericks",
    date: new Date('2023-11-23'),
    venue: "Sports Hall A",
    time: "8:00 PM",
    category: "Basketball",
    team1_score: 95,
    team2_score: 88,
    status: "completed",
    mvp: "Chris Anderson"
  },
  {
    team1: "Science Sharks",
    team2: "Business Bears",
    date: new Date('2023-12-07'),
    venue: "Sports Complex Ground",
    time: "2:00 PM",
    category: "Football",
    team1_score: 3,
    team2_score: 1,
    status: "completed",
    mvp: "James Wilson"
  },
  {
    team1: "Championship All-Stars",
    team2: "Regional Champions",
    date: new Date('2023-12-21'),
    venue: "Championship Arena",
    time: "6:00 PM",
    category: "Multi-Sport",
    team1_score: 156,
    team2_score: 142,
    status: "completed",
    mvp: "Tyler Brown"
  }
];

Old_match.insertMany(historical_matches)
  .then((res) => {
    console.log("✅ Historical matches initialized successfully:", res.length, "matches added");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error initializing historical matches:", err);
    process.exit(1);
  });
