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
        name: 'Sarah Champion',
        totalPoints: 1250,
        predictions: 45,
        wins: 1,
        accuracy: 78,
        streak: 8,
        // avatar: '👩‍💻',
        badges: ['🏆', '🎯', '⚡'],
      },
      {
        id: 2,
        name: 'Mike Predictor',
        totalPoints: 1180,
        predictions: 52,
        wins: 1,
        streak: 5,
        // avatar: '👨‍💼',
        badges: ['🎯', '📊'],
      },
      {
        id: 3,
        name: 'Lisa Winner',
        totalPoints: 1150,
        predictions: 38,
        wins: 1,
        streak: 12,
        // avatar: '👩‍⚕️',
        badges: ['🏆', '🔥', '⭐'],
      },
      {
        id: 4,
        name: 'Tom Guesser',
        totalPoints: 980,
        predictions: 41,
        wins: 1,
        streak: 3,
        // avatar: '👨‍🎨',
        badges: ['📊'],
      },
      {
        id: 5,
        name: 'Emma Sports Fan',
        totalPoints: 920,
        predictions: 35,
        wins: 1,
        streak: 6,
        // avatar: '👩‍🔬',
        badges: ['⚡', '🎯'],
      },
      {
        id: 6,
        name: 'John Student',
        totalPoints: 850,
        predictions: 29,
        wins: 1,
        streak: 4,
        // avatar: '👨‍🎓',
        badges: ['📊'],
      },
      {
        id: 7,
        name: 'Alex Analyst',
        totalPoints: 780,
        predictions: 33,
        wins: 1,
        streak: 2,
        // avatar: '👨‍💻',
        badges: ['🎯'],
      },
      {
        id: 8,
        name: 'Maria Martinez',
        totalPoints: 720,
        predictions: 27,
        wins: 1,
        streak: 7,
        // avatar: '👩‍⚖️',
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