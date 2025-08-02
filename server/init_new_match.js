const mongoose=require('mongoose');
const New_match=require('./models/new_match');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_new_matches = [
  // Football Upcoming Matches
  {
    id: 1,
    team1: "Engineering Eagles",
    team2: "Computer Cobras",
    date: new Date("2025-01-15"),
    venue: "University Main Stadium",
    time: "3:00 PM",
    category: "football"
  },
  {
    id: 2,
    team1: "Business Bears",
    team2: "Medical Mavericks",
    date: new Date("2025-01-18"),
    venue: "Campus Athletic Field",
    time: "4:30 PM",
    category: "football"
  },
  {
    id: 3,
    team1: "Arts Arrows",
    team2: "Law Lions",
    date: new Date("2025-01-22"),
    venue: "Sports Complex Ground",
    time: "2:00 PM",
    category: "football"
  },

  // Basketball Upcoming Matches
  {
    id: 4,
    team1: "History Hawks",
    team2: "Science Sharks",
    date: new Date("2025-01-20"),
    venue: "Main Gymnasium",
    time: "7:00 PM",
    category: "basketball"
  },
  {
    id: 5,
    team1: "Engineering Eagles",
    team2: "Arts Arrows",
    date: new Date("2025-01-25"),
    venue: "Sports Hall A",
    time: "6:30 PM",
    category: "basketball"
  },
  {
    id: 6,
    team1: "Business Bears",
    team2: "Computer Cobras",
    date: new Date("2025-01-28"),
    venue: "Indoor Basketball Court",
    time: "8:00 PM",
    category: "basketball"
  },

  // Tennis Upcoming Matches
  {
    id: 7,
    team1: "Rafael Martinez",
    team2: "Elena Petrov",
    date: new Date("2025-01-16"),
    venue: "Tennis Court Center",
    time: "10:00 AM",
    category: "tennis"
  },
  {
    id: 8,
    team1: "Lucas Chen",
    team2: "Sophia Lee",
    date: new Date("2025-01-19"),
    venue: "Outdoor Tennis Complex",
    time: "11:30 AM",
    category: "tennis"
  },

  // Volleyball Upcoming Matches
  {
    id: 9,
    team1: "Medical Mavericks",
    team2: "History Hawks",
    date: new Date("2025-01-21"),
    venue: "Sports Hall B",
    time: "5:00 PM",
    category: "volleyball"
  },
  {
    id: 10,
    team1: "Science Sharks",
    team2: "Engineering Eagles",
    date: new Date("2025-01-24"),
    venue: "Volleyball Arena",
    time: "4:00 PM",
    category: "volleyball"
  },

  // Cricket Upcoming Matches
  {
    id: 11,
    team1: "Computer Cobras",
    team2: "Law Lions",
    date: new Date("2025-01-26"),
    venue: "Cricket Ground East",
    time: "1:00 PM",
    category: "cricket"
  },
  {
    id: 12,
    team1: "Medical Mavericks",
    team2: "Arts Arrows",
    date: new Date("2025-01-30"),
    venue: "University Cricket Stadium",
    time: "12:30 PM",
    category: "cricket"
  },

  // Hockey Upcoming Matches
  {
    id: 13,
    team1: "Business Bears",
    team2: "Science Sharks",
    date: new Date("2025-01-23"),
    venue: "Ice Hockey Rink",
    time: "7:30 PM",
    category: "hockey"
  },
  {
    id: 14,
    team1: "Engineering Eagles",
    team2: "History Hawks",
    date: new Date("2025-01-27"),
    venue: "Outdoor Hockey Field",
    time: "6:00 PM",
    category: "hockey"
  },

  // Swimming Championships
  {
    id: 15,
    team1: "Freestyle Specialists",
    team2: "Stroke Masters",
    date: new Date("2025-01-31"),
    venue: "Aquatic Center Pool",
    time: "9:00 AM",
    category: "swimming"
  },

  // Badminton Upcoming Matches
  {
    id: 16,
    team1: "Arts Arrows",
    team2: "Computer Cobras",
    date: new Date("2025-01-17"),
    venue: "Badminton Hall",
    time: "3:30 PM",
    category: "badminton"
  },
  {
    id: 17,
    team1: "Medical Mavericks",
    team2: "Law Lions",
    date: new Date("2025-01-29"),
    venue: "Indoor Badminton Complex",
    time: "5:30 PM",
    category: "badminton"
  },

  // Table Tennis Upcoming Matches
  {
    id: 18,
    team1: "History Hawks",
    team2: "Business Bears",
    date: new Date("2025-02-01"),
    venue: "Table Tennis Hall",
    time: "2:30 PM",
    category: "table_tennis"
  },

  // Track & Field Championship
  {
    id: 19,
    team1: "Sprint Squad",
    team2: "Distance Runners",
    date: new Date("2025-02-03"),
    venue: "Athletic Track Stadium",
    time: "10:00 AM",
    category: "track_field"
  },

  // Inter-University Championship Finals
  {
    id: 20,
    team1: "University All-Stars",
    team2: "Regional Champions",
    date: new Date("2025-02-05"),
    venue: "Championship Arena",
    time: "6:00 PM",
    category: "multi_sport"
  }
];

New_match.insertMany(all_new_matches)
.then((res) => console.log(res))
.catch((err) => console.log(err));