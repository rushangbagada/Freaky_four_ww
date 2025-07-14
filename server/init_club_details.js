const mongoose=require('mongoose');
const Club_Details=require('./models/club-detail');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;


main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const ClubDetails = [
    {
        name: "football",
        description: "hello",
        image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        upcoming_matches: 5,
        active_players: 10,
        win_rate: 50
    },
    {
        name: "cricket",
        description: "hello",
        image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        upcoming_matches: 5,
        active_players: 10,
        win_rate: 50
    },
    {
        name: "basketball",
        description: "hello",
        image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        upcoming_matches: 5,
        active_players: 10,
        win_rate: 50
    },
    {
        name: "volleyball",
        description: "hello",
        image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        upcoming_matches: 5,
        active_players: 10,
        win_rate: 50
    },
    {
        name: "tennis",
        description: "hello",
        image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        upcoming_matches: 5,
        active_players: 10,
        win_rate: 50
    },
    {
        name: "hockey",
        description: "hello",
        image: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        upcoming_matches: 5,
        active_players: 10,
        win_rate: 50
    }
]


Club_Details.insertMany(ClubDetails)
.then((res) => console.log(res))
.catch(err => console.log(err));