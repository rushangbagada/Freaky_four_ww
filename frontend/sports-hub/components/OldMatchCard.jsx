import React, { useState } from 'react';
import './css/liveMatchCard.css'; // Reusing the same CSS for now

const OldMatchCard = ({ match, onPredict, userPrediction }) => {
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');

  // Format the prediction object for display
  const formattedPrediction = userPrediction ? {
    team1Score: userPrediction.predictedTeam1Score,
    team2Score: userPrediction.predictedTeam2Score,
    points: userPrediction.points
  } : null;

  const handleSubmit = () => {
    if (team1Score !== '' && team2Score !== '') {
      onPredict(match._id, team1Score, team2Score);
      // Clear the input fields after submission
      setTeam1Score('');
      setTeam2Score('');
    } else {
      alert('Please enter scores for both teams');
    }
  };

  return (
    <div className="live-match-card old-match">
      <div className="match-status">
        <span className="old-match-indicator">OLD MATCH</span>
      </div>

      <h3>{match.team1} vs {match.team2}</h3>
      <p className="match-details">{match.category} - {match.venue}</p>
      
      <div className="final-score">
        <p>Final Score: {match.team1_score} - {match.team2_score}</p>
      </div>

      <div className="prediction-form">
        {!formattedPrediction ? (
          <>
            <div className="score-inputs">
              <div className="team-input">
                <label>{match.team1}</label>
                <input
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="team-input">
                <label>{match.team2}</label>
                <input
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <button onClick={handleSubmit}>
              Submit Prediction
            </button>
          </>
        ) : (
          <div className="user-prediction">
            <p>Your Prediction: {formattedPrediction.team1Score} - {formattedPrediction.team2Score}</p>
            <p className="points-earned">Points earned: {formattedPrediction.points}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OldMatchCard;