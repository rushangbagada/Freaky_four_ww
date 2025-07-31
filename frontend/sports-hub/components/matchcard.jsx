import React, { useState } from 'react';

const MatchCard = ({ match, onPredict, userPrediction }) => {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  const handleSubmit = () => {
    if (homeScore !== '' && awayScore !== '') {
      onPredict(match.id, parseInt(homeScore), parseInt(awayScore));
    }
  };

  const now = new Date();
  const matchDate = new Date(match.date);
  const isUpcoming = matchDate > now;

  return (
    <div className={`match-card ${isUpcoming ? 'upcoming' : 'finished'}`}>
      <h4 className="team-names">{match.team1} vs {match.team2}</h4>
      <p className="match-details">{match.category} - {matchDate.toLocaleDateString()} @ {match.time}</p>
      <p className="match-details">Venue: {match.venue}</p>
      
      {isUpcoming ? (
        <div className="prediction-form">
          <div className="score-inputs">
            <input
              type="number"
              value={homeScore}
              onChange={e => setHomeScore(e.target.value)}
              placeholder={`${match.team1} score`}
            />
            <input
              type="number"
              value={awayScore}
              onChange={e => setAwayScore(e.target.value)}
              placeholder={`${match.team2} score`}
            />
          </div>
          <button onClick={handleSubmit}>Submit Prediction</button>
        </div>
      ) : (
        <div className="final-score">
          <p className="final-score-label">Final Score: 
            <span className="score">{match.homeScore} - {match.awayScore}</span>
          </p>
        </div>
      )}

      {userPrediction && (
        <div className="user-prediction">
          <p>Your Prediction: {userPrediction.homeScore} - {userPrediction.awayScore}</p>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
