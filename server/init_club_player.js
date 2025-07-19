const mongoose=require('mongoose');
const Club_Player=require('./models/club-player');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;


main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_club_players=[
    {
        name:"player A",
        year:"second year",
        position:"stricker",
        department:"cse",
        matches:"100",
        wins:"50",
        losses:"50",
        club:"football"
    },
    {
        name:"player B",
        year:"second year",
        position:"shooter",
        department:"ece",
        matches:"100",
        wins:"50",
        losses:"50",
        club:"basketball"
    },
    {
        name:"player C",
        year:"second year",
        position:"golekeeper",
        department:"mech",
        matches:"100",
        wins:"50",
        losses:"50",
        club:"football"
    },
    {
        name:"player D",
        year:"second year",
        position:"defender",
        department:"msc",
        matches:"100",
        wins:"50",
        losses:"50",
        club:"football"
    },
    {
        name:"player E",
        year:"second year",
        position:"forward",
        department:"cse",
        matches:"100",
        wins:"50",
        losses:"50",
        club:"cricket"
    }
]

const all_players = all_club_players.map(player => ({
  ...player,
  win_rate: player.matches === 0 ? 0 : parseFloat(((player.wins / player.matches) * 100).toFixed(2))
}));


Club_Player.insertMany(all_players)
.then((res) => console.log(res))
.catch((err) => console.log(err));