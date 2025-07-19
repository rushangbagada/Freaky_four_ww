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

const all_match=[
    {
        team1:"team A",
        team2:"team B",
        date:new Date("2025-07-02"),
        venue:"Main Stadium",
        category:"football",
        team1_score:30,
        team2_score:22,
        mvp:"player C"
    },
    {
        team1:"hawks",
        team2:"raptors",
        date:new Date("2025-06-11"),
        venue:"home Stadium",
        category:"basketball",
        team1_score:23,
        team2_score:25,
        mvp:"player D"
    },
    {
        team1:"serena",
        team2:"federer",
        date:new Date("2025-01-01"),
        venue:"bombay Stadium",
        category:"tennis",
        team1_score:86,
        team2_score:42,
        mvp:"player E"
    }
]

Match.insertMany(all_match)
.then((res) => console.log(res))
.catch((err) => console.log(err));