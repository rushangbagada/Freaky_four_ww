const mongoose=require('mongoose');
const Player_user=require('./models/player_user');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const raw_players=[
  {
    id: 1,
    name: 'Ryan Thompson',
    totalPoints: 1280,
    predictions: 50,
    wins: 38,
    streak: 12,
    // avatar: '👨‍🏫',
    badges: ['🏆', '🎯', '⚡'],
  },
  {
    id: 2,
    name: 'Chloe Rodriguez',
    totalPoints: 1190,
    predictions: 47,
    wins: 35,
    streak: 9,
    // avatar: '👩‍🍳',
    badges: ['🎯', '📊'],
  },
  {
    id: 3,
    name: 'Daniel Kim',
    totalPoints: 1140,
    predictions: 54,
    wins: 33,
    streak: 11,
    // avatar: '👨‍🚀',
    badges: ['🏆', '🔥', '⭐'],
  },
  {
    id: 4,
    name: 'Ava Patel',
    totalPoints: 1085,
    predictions: 44,
    wins: 30,
    streak: 5,
    // avatar: '👩‍🎨',
    badges: ['📊', '⚡'],
  },
  {
    id: 5,
    name: 'Liam Johnson',
    totalPoints: 1030,
    predictions: 37,
    wins: 28,
    streak: 7,
    // avatar: '👨‍🔬',
    badges: ['⚡', '🎯', '⭐'],
  },
  {
    id: 6,
    name: 'Sophia Lee',
    totalPoints: 970,
    predictions: 31,
    wins: 25,
    streak: 8,
    // avatar: '👩‍💼',
    badges: ['📊'],
  },
  {
    id: 7,
    name: 'Ethan Brown',
    totalPoints: 920,
    predictions: 29,
    wins: 22,
    streak: 6,
    // avatar: '👨‍🎤',
    badges: ['🎯', '⭐'],
  },
  {
    id: 8,
    name: 'Olivia Garcia',
    totalPoints: 880,
    predictions: 34,
    wins: 20,
    streak: 7,
    // avatar: '👩‍🔧',
    badges: ['⭐', '🔥'],
  }
]

// Add calculated accuracy
const all_players = raw_players.map(player => ({
  ...player,
  accuracy: player.predictions === 0 ? 0 : parseFloat(((player.wins / player.predictions) * 100).toFixed(2))
}));

Player_user.insertMany(all_players)
.then((data) => {
  console.log(data);
//   console.log('Users added successfully');
})
.catch((err) => {
  console.log(err);
});