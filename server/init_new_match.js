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
  {
    id: 1,
    team1: "Team 1",
    team2: "Team 2",
    date: new Date("2023-01-01"),
    venue: "Venue 1",
    time: "12:00 PM",
    category: "football",
  },
  {
    id: 2,
    team1: "Team 3",
    team2: "Team 4",
    date: new Date("2023-01-02"),
    venue: "Venue 2",
    time: "1:00 PM",
    category: "baseball",
  },
  {
    id: 3,
    team1: "Team 5",
    team2: "Team 6",
    date: new Date("2023-01-03"),
    venue: "Venue 3",
    time: "2:00 PM",
    category: "tennis",
  },
];

New_match.insertMany(all_new_matches)
.then((res) => console.log(res))
.catch((err) => console.log(err));