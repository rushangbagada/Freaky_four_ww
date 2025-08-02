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
        time: 'Q3 9:12',
        type: 'three_pointer',
        team: 'Business Bears',
        player: 'Marcus Thompson',
        description: 'Three-pointer from beyond the arc'
      },
      {
        time: 'Q3 7:30',
        type: 'slam_dunk',
        team: 'Engineering Eagles',
        player: 'David Rodriguez',
        description: 'Powerful slam dunk off the fast break'
      },
      {
        time: 'Q2 15:45',
        type: 'timeout',
        team: 'Business Bears',
        player: 'Coach Williams',
        description: 'Timeout called to strategize'
      }
    ],
    stats: {
      field_goals: { home: 28, away: 31 },
      three_pointers: { home: 8, away: 12 },
      free_throws: { home: 14, away: 8 },
      rebounds: { home: 24, away: 22 },
      assists: { home: 18, away: 20 },
      turnovers: { home: 9, away: 7 }
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
        time: '65\'',
        type: 'goal',
        team: 'Arts Arrows',
        player: 'Elena Rodriguez',
        description: 'Beautiful curling shot into the top corner'
      },
      {
        time: '52\'',
        type: 'yellow_card',
        team: 'Science Sharks',
        player: 'Ahmed Hassan',
        description: 'Yellow card for tactical foul'
      },
      {
        time: '34\'',
        type: 'goal',
        team: 'Science Sharks',
        player: 'Lucas Chen',
        description: 'Header from corner kick'
      },
      {
        time: '18\'',
        type: 'goal',
        team: 'Arts Arrows',
        player: 'Sophia Martinez',
        description: 'First goal from penalty kick'
      }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shots_on_target: { home: 5, away: 3 },
      corners: { home: 6, away: 4 },
      fouls: { home: 7, away: 11 },
      offsides: { home: 3, away: 5 }
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
    time: 'Set 4 - 18-15',
    venue: 'Sports Hall B',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: 'Set 4',
        type: 'spike',
        team: 'Medical Mavericks',
        player: 'Sarah Miller',
        description: 'Powerful spike down the line'
      },
      {
        time: 'Set 3',
        type: 'block',
        team: 'Law Lions',
        player: 'Emma Garcia',
        description: 'Outstanding block at the net'
      },
      {
        time: 'Set 3',
        type: 'ace',
        team: 'Medical Mavericks',
        player: 'Ashley Taylor',
        description: 'Service ace to win the set'
      }
    ],
    stats: {
      kills: { home: 34, away: 28 },
      blocks: { home: 8, away: 12 },
      aces: { home: 6, away: 4 },
      digs: { home: 45, away: 38 },
      assists: { home: 32, away: 26 },
      errors: { home: 14, away: 18 }
    }
  },
  {
    id: '4',
    sport: 'Tennis',
    team1: 'Rafael Martinez',
    team2: 'Elena Petrov',
    team1_score: 6,
    team2_score: 4,
    status: 'finished',
    time: 'Final - Set 3',
    venue: 'Tennis Courts',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: 'Set 3',
        type: 'match_point',
        team: 'Rafael Martinez',
        player: 'Rafael Martinez',
        description: 'Match-winning ace down the T'
      },
      {
        time: 'Set 2',
        type: 'break_point',
        team: 'Elena Petrov',
        player: 'Elena Petrov',
        description: 'Crucial break to level the match'
      },
      {
        time: 'Set 1',
        type: 'winner',
        team: 'Rafael Martinez',
        player: 'Rafael Martinez',
        description: 'Forehand winner down the line'
      }
    ],
    stats: {
      aces: { home: 8, away: 5 },
      double_faults: { home: 2, away: 4 },
      first_serve_percentage: { home: 72, away: 68 },
      winners: { home: 24, away: 18 },
      unforced_errors: { home: 15, away: 22 },
      break_points_won: { home: 3, away: 2 }
    }
  }
];

Live_Match.insertMany(all_live_matches)
  .then((res) => console.log('Inserted Matches:', res))
  .catch((err) => console.log('Error Inserting Matches:', err));


 