import React, { useState, useEffect } from 'react';
import './css/liveMatchCard.css';

const LiveMatchCard = ({ match, onPredict, userPrediction }) => {
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
    <div className={`live-match-card ${match.status}`}>
      <div className="match-status">
        {match.status === 'live' ? (
          <span className="live-indicator">LIVE</span>
        ) : match.status === 'upcoming' ? (
          <span className="upcoming-indicator">UPCOMING</span>
        ) : (
          <span className="finished-indicator">FINISHED</span>
        )}
      </div>

      <h3 className="team-names">{match.team1} vs {match.team2}</h3>
      <p className="match-details">{match.sport} - {match.venue}</p>
      
      {match.status === 'live' && (
        <div className="live-score">
          <span className="team">{match.team1}</span>
          <span className="score">{match.team1_score}</span>
          <span className="vs">VS</span>
          <span className="score">{match.team2_score}</span>
          <span className="team">{match.team2}</span>
        </div>
      )}

      {match.status === 'finished' ? (
        <div className="final-score">
          <p>Final Score: {match.team1_score} - {match.team2_score}</p>
        </div>
      ) : (
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
              <button 
                onClick={handleSubmit}
                disabled={match.status === 'finished'}
              >
                Submit Prediction
              </button>
            </>
          ) : (
            <div className="user-prediction">
              <p>Your Prediction: {formattedPrediction.team1Score} - {formattedPrediction.team2Score}</p>
              {match.status === 'finished' && (
                <p className="points-earned">Points earned: {formattedPrediction.points}</p>
              )}
            </div>
          )}
        </div>
      )}

      {match.status === 'live' && (
        <div className="match-events">
          <h4>Match Events</h4>
          <ul>
            {match.events && match.events.length > 0 ? (
              match.events.map((event, index) => (
                <li key={index}>
                  <span className="event-time">{event.time}</span>
                  <span className="event-type">{event.type}</span>
                  <span className="event-team">{event.team}</span>
                  <span className="event-player">{event.player}</span>
                </li>
              ))
            ) : (
              <li>No events yet</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveMatchCard;