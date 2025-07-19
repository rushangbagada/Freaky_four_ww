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
    <div className="match-card">
      <h4>{match.team1} vs {match.team2}</h4>
      <p>{match.category} - {matchDate.toLocaleDateString()} @ {match.time}</p>
      <p>Venue: {match.venue}</p>
      
      {isUpcoming ? (
        <>
          <input
            type="number"
            value={homeScore}
            onChange={e => setHomeScore(e.target.value)}
            placeholder={`${match.homeTeam} score`}
          />
          <input
            type="number"
            value={awayScore}
            onChange={e => setAwayScore(e.target.value)}
            placeholder={`${match.awayTeam} score`}
          />
          <button onClick={handleSubmit}>Submit Prediction</button>
        </>
      ) : (
        <p>Final Score: {match.homeScore} - {match.awayScore}</p>
      )}

      {userPrediction && (
        <p>Your Prediction: {userPrediction.homeScore} - {userPrediction.awayScore}</p>
      )}
    </div>
  );
};

export default MatchCard;
