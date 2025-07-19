const mongoose = require('mongoose');
const Live_Match = require('./models/live_match');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

main()
  .then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_live_matches = [
  {
    id: '1',
    sport: 'Basketball',
    team1: 'Engineering Eagles',
    team2: 'Business Bears',
    team1_score: 78,
    team2_score: 82,
    status: 'live',
    time: '3rd Quarter - 8:45',
    venue: 'Main Gymnasium',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: '45\'',
        type: 'goal',
        team: 'Engineering Eagles',
        player: 'John Smith',
        description: 'Goal scored from penalty kick'
      },
      {
        time: '38\'',
        type: 'card',
        team: 'Business Bears',
        player: 'Mike Johnson',
        description: 'Yellow card for unsporting behavior'
      },
      {
        time: '22\'',
        type: 'goal',
        team: 'Business Bears',
        player: 'Sarah Davis',
        description: 'Goal from free kick'
      }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shots_on_target: { home: 5, away: 3 },
      fouls: { home: 7, away: 11 }
    }
  },
  {
    id: '2',
    sport: 'Soccer',
    team1: 'Arts Arrows',
    team2: 'Science Sharks',
    team1_score: 2,
    team2_score: 1,
    status: 'live',
    time: '78\'',
    venue: 'Campus Field',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: '45\'',
        type: 'goal',
        team: 'Arts Arrows',
        player: 'John Smith',
        description: 'Goal scored from penalty kick'
      },
      {
        time: '38\'',
        type: 'card',
        team: 'Science Sharks',
        player: 'Mike Johnson',
        description: 'Yellow card for unsporting behavior'
      },
      {
        time: '22\'',
        type: 'goal',
        team: 'Science Sharks',
        player: 'Sarah Davis',
        description: 'Goal from free kick'
      }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shots_on_target: { home: 5, away: 3 },
      fouls: { home: 7, away: 11 }
    }
  },
  {
    id: '3',
    sport: 'Volleyball',
    team1: 'Medical Mavericks',
    team2: 'Law Lions',
    team1_score: 2,
    team2_score: 1,
    status: 'live',
    time: 'Set 4',
    venue: 'Sports Hall B',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: '45\'',
        type: 'goal',
        team: 'Medical Mavericks',
        player: 'John Smith',
        description: 'Goal scored from penalty kick'
      },
      {
        time: '38\'',
        type: 'card',
        team: 'Law Lions',
        player: 'Mike Johnson',
        description: 'Yellow card for unsporting behavior'
      },
      {
        time: '22\'',
        type: 'goal',
        team: 'Law Lions',
        player: 'Sarah Davis',
        description: 'Goal from free kick'
      }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shots_on_target: { home: 5, away: 3 },
      fouls: { home: 7, away: 11 }
    }
  },
  {
    id: '4',
    sport: 'Tennis',
    team1: 'Computer Cobras',
    team2: 'History Hawks',
    team1_score: 6,
    team2_score: 4,
    status: 'finished',
    time: 'Final',
    venue: 'Tennis Courts',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events:[
      {
        time: '45\'',
        type: 'goal',
        team: 'Computer Cobras',
        player: 'John Smith',
        description: 'Goal scored from penalty kick'
      },
      {
        time: '38\'',
        type: 'card',
        team: 'History Hawks',
        player: 'Mike Johnson',
        description: 'Yellow card for unsporting behavior'
      },
      {
        time: '22\'',
        type: 'goal',
        team: 'History Hawks',
        player: 'Sarah Davis',
        description: 'Goal from free kick'
      }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shots_on_target: { home: 5, away: 3 },
      fouls: { home: 7, away: 11 }
    }
  }
];

Live_Match.insertMany(all_live_matches)
  .then((res) => console.log('Inserted Matches:', res))
  .catch((err) => console.log('Error Inserting Matches:', err));


 