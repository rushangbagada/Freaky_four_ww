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
        event:"Annual Tech Conference",
        organizer:"Tech Innovations Inc.",
        date:new Date("2025-09-15"),
        time:"10:00 AM",
        venue:"Grand Convention Center",
        category:"Technology",
        status:"upcoming",
    },
    {
        id:2,
        event:"Global Business Summit",
        organizer:"World Enterprises",
        date:new Date("2025-10-20"),
        time:"09:00 AM",
        venue:"International Expo Hall",
        category:"Business",
        status:"upcoming",
    },
    {
        id:3,
        event:"Healthcare Analytics Forum",
        organizer:"HealthTech Group",
        date:new Date("2025-11-05"),
        time:"11:00 AM",
        venue:"City Conference Plaza",
        category:"Healthcare",
        status:"upcoming",
    },
    {
        id:4,
        event:"Renewable Energy Conference",
        organizer:"EcoFuture Network",
        date:new Date("2025-12-01"),
        time:"01:00 PM",
        venue:"GreenTech Center",
        category:"Environment",
        status:"upcoming",
    },
    {
        id:5,
        event:"Artificial Intelligence Symposium",
        organizer:"AI Minds",
        date:new Date("2026-01-12"),
        time:"02:00 PM",
        venue:"Digital Hub",
        category:"AI",
        status:"upcoming",
    },
    {
        id:6,
        event:"Blockchain Expo",
        organizer:"CryptoWorld",
        date:new Date("2026-02-25"),
        time:"03:00 PM",
        venue:"Tech Expo Arena",
        category:"Blockchain",
        status:"upcoming",
    }
]

Prediction_Match.insertMany(all_prediction_match)
.then(data => console.log(data))
.catch(err => console.log(err));