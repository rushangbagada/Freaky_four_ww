const mongoose=require('mongoose');
const Match=require('./models/match');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_match = [
  // Football Matches
  {
    team1: "Engineering Eagles",
    team2: "Business Bears",
    date: new Date("2024-11-15"),
    venue: "University Main Stadium",
    category: "football",
    team1_score: 2,
    team2_score: 1,
    mvp: "Marcus Thompson"
  },
  {
    team1: "Arts Arrows",
    team2: "Science Sharks",
    date: new Date("2024-11-08"),
    venue: "Campus Athletic Field",
    category: "football",
    team1_score: 3,
    team2_score: 2,
    mvp: "David Rodriguez"
  },
  {
    team1: "Medical Mavericks",
    team2: "Law Lions",
    date: new Date("2024-10-25"),
    venue: "Sports Complex Ground",
    category: "football",
    team1_score: 1,
    team2_score: 1,
    mvp: "James Wilson"
  },

  // Basketball Matches
  {
    team1: "Computer Cobras",
    team2: "History Hawks",
    date: new Date("2024-12-01"),
    venue: "Main Gymnasium",
    category: "basketball",
    team1_score: 89,
    team2_score: 76,
    mvp: "Kevin Johnson"
  },
  {
    team1: "Engineering Eagles",
    team2: "Medical Mavericks",
    date: new Date("2024-11-22"),
    venue: "Sports Hall A",
    category: "basketball",
    team1_score: 94,
    team2_score: 91,
    mvp: "Michael Davis"
  },
  {
    team1: "Business Bears",
    team2: "Arts Arrows",
    date: new Date("2024-11-14"),
    venue: "Indoor Basketball Court",
    category: "basketball",
    team1_score: 78,
    team2_score: 85,
    mvp: "Chris Anderson"
  },

  // Tennis Matches (Singles)
  {
    team1: "Rafael Martinez",
    team2: "Lucas Chen",
    date: new Date("2024-12-05"),
    venue: "Tennis Court Center",
    category: "tennis",
    team1_score: 6,
    team2_score: 4,
    mvp: "Rafael Martinez"
  },
  {
    team1: "Elena Petrov",
    team2: "Sophia Lee",
    date: new Date("2024-11-28"),
    venue: "Outdoor Tennis Complex",
    category: "tennis",
    team1_score: 7,
    team2_score: 5,
    mvp: "Elena Petrov"
  },

  // Volleyball Matches
  {
    team1: "Science Sharks",
    team2: "Law Lions",
    date: new Date("2024-12-03"),
    venue: "Sports Hall B",
    category: "volleyball",
    team1_score: 3,
    team2_score: 1,
    mvp: "Sarah Miller"
  },
  {
    team1: "Medical Mavericks",
    team2: "Computer Cobras",
    date: new Date("2024-11-20"),
    venue: "Volleyball Arena",
    category: "volleyball",
    team1_score: 3,
    team2_score: 2,
    mvp: "Emma Garcia"
  },

  // Cricket Matches
  {
    team1: "Engineering Eagles",
    team2: "Business Bears",
    date: new Date("2024-11-30"),
    venue: "Cricket Ground East",
    category: "cricket",
    team1_score: 187,
    team2_score: 165,
    mvp: "Rajesh Sharma"
  },
  {
    team1: "Arts Arrows",
    team2: "Science Sharks",
    date: new Date("2024-11-16"),
    venue: "University Cricket Stadium",
    category: "cricket",
    team1_score: 203,
    team2_score: 198,
    mvp: "Aditya Patel"
  },

  // Hockey Matches
  {
    team1: "History Hawks",
    team2: "Medical Mavericks",
    date: new Date("2024-12-07"),
    venue: "Ice Hockey Rink",
    category: "hockey",
    team1_score: 4,
    team2_score: 2,
    mvp: "Connor O'Brien"
  },
  {
    team1: "Engineering Eagles",
    team2: "Law Lions",
    date: new Date("2024-11-25"),
    venue: "Outdoor Hockey Field",
    category: "hockey",
    team1_score: 3,
    team2_score: 3,
    mvp: "Jake Morrison"
  },

  // Swimming Championships
  {
    team1: "Swimming Club All-Stars",
    team2: "Individual Medley Team",
    date: new Date("2024-12-10"),
    venue: "Aquatic Center Pool",
    category: "swimming",
    team1_score: 145,
    team2_score: 132,
    mvp: "Katie Thompson"
  },

  // Badminton Matches
  {
    team1: "Computer Cobras",
    team2: "Business Bears",
    date: new Date("2024-12-04"),
    venue: "Badminton Hall",
    category: "badminton",
    team1_score: 5,
    team2_score: 3,
    mvp: "Lin Wei"
  },
  {
    team1: "Arts Arrows",
    team2: "Science Sharks",
    date: new Date("2024-11-18"),
    venue: "Indoor Badminton Complex",
    category: "badminton",
    team1_score: 6,
    team2_score: 2,
    mvp: "Priya Sharma"
  }
]

Match.insertMany(all_match)
.then((res) => console.log(res))
.catch((err) => console.log(err));