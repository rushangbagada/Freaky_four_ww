const mongoose=require('mongoose');
const Prediction_Match=require('./models/prediction_match');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_prediction_match=[
    {
        id:1,
        team1:"Team 1",
        team2:"Team 2",
        date:new Date("2023-01-01"),
        time:"12:00 PM",
        venue:"Venue 1",
        category:"Football",
        status:"upcoming",
    },
    {
        id:2,
        team1:"Team 3",
        team2:"Team 4",
        date:new Date("2023-01-02"),
        time:"1:00 PM",
        venue:"Venue 2",
        category:"Baseball",
        status:"upcoming",
    },
    {
        id:3,
        team1:"Team 5",
        team2:"Team 6",
        date:new Date("2023-01-03"),
        time:"2:00 PM",
        venue:"Venue 3",
        category:"Tennis",
        status:"upcoming",
    },
    {
        id:4,
        team1:"Team 7",
        team2:"Team 8",
        date:new Date("2023-01-04"),
        time:"3:00 PM",
        venue:"Venue 4",
        category:"Basketball",
        status:"upcoming",
    },
    {
        id:5,
        team1:"Team 9",
        team2:"Team 10",
        date:new Date("2026-01-05"),
        time:"4:00 PM",
        venue:"Venue 5",
        category:"Volleyball",
        status:"upcoming",
    },
    {
        id:6,
        team1:"Team 11",
        team2:"Team 12",
        date:new Date("2025-07-11"),
        time:"4:00 PM",
        venue:"Venue 5",
        category:"Volleyball",
        status:"upcoming",
    }
]

Prediction_Match.insertMany(all_prediction_match)
.then(data => console.log(data))
.catch(err => console.log(err));