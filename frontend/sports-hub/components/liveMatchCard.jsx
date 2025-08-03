import React, { useState, useEffect } from 'react';
import PredictionScoring from './utils/PredictionScoring';
import './css/liveMatchCard.css';

const LiveMatchCard = ({ match, onPredict, userPrediction }) => {
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate points if match is finished and we have prediction data
  const calculateCurrentPoints = () => {
    if (!userPrediction || !match || (match.status !== 'completed' && match.status !== 'finished')) {
      return userPrediction?.points || 0;
    }
    
    // If points are already calculated from backend, use them
    if (userPrediction.points !== undefined && userPrediction.points !== null) {
      return userPrediction.points;
    }
    
    // Use enhanced calculation with error handling
    try {
      const result = PredictionScoring.calculatePoints(
        userPrediction.predictedTeam1Score,
        userPrediction.predictedTeam2Score,
        match.team1_score,
        match.team2_score,
        { debug: process.env.NODE_ENV === 'development' }
      );
      
      if (!result.isValid) {
        console.warn('⚠️ Prediction calculation failed:', result.errors);
        return 0;
      }
      
      return result.points;
    } catch (error) {
      console.error('❌ Error calculating prediction points:', error);
      return 0;
    }
  };
  
  // Format the prediction object for display
  const formattedPrediction = userPrediction ? {
    team1Score: userPrediction.predictedTeam1Score,
    team2Score: userPrediction.predictedTeam2Score,
    points: calculateCurrentPoints()
  } : null;

  // Calculate prediction points based on accuracy
  const calculatePoints = (predicted1, predicted2, actual1, actual2) => {
    const pred1 = parseInt(predicted1);
    const pred2 = parseInt(predicted2);
    const act1 = parseInt(actual1);
    const act2 = parseInt(actual2);
    
    // Exact score match: 5 points
    if (pred1 === act1 && pred2 === act2) {
      return 5;
    }
    
    // Correct result (winner) with correct goal difference: 3 points
    const predDiff = pred1 - pred2;
    const actDiff = act1 - act2;
    const predResult = predDiff > 0 ? 'home' : predDiff < 0 ? 'away' : 'draw';
    const actResult = actDiff > 0 ? 'home' : actDiff < 0 ? 'away' : 'draw';
    
    if (predResult === actResult && predDiff === actDiff) {
      return 3;
    }
    
    // Correct result (winner) only: 1 point
    if (predResult === actResult) {
      return 1;
    }
    
    // No points for incorrect prediction
    return 0;
  };

  // Get scoring explanation for display
  const getScoreExplanation = (points) => {
    switch (points) {
      case 5:
        return '🎯 Perfect! Exact score match';
      case 3:
        return '🎉 Great! Correct result and goal difference';
      case 1:
        return '👍 Good! Correct match result';
      case 0:
        return '😔 Better luck next time!';
      default:
        return '⏳ Pending evaluation';
    }
  };

  const handleSubmit = async () => {
    if (team1Score === '' || team2Score === '') {
      console.log('Please enter scores for both teams');
      return;
    }
    
    if (formattedPrediction) {
      console.log('You have already made a prediction for this match!');
      return;
    }
    
    if (match.status === 'completed' || match.status === 'finished') {
      console.log('This match has already finished. Predictions are no longer allowed.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onPredict(match._id, team1Score, team2Score);
      // Clear the input fields after successful submission
      setTeam1Score('');
      setTeam2Score('');
    } catch (error) {
      console.error('Error submitting prediction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`live-match-card ${match.status}`}>
      <div className="match-status">
        {match.status === 'live' || match.status === 'ongoing' ? (
          <span className="live-indicator">{match.status === 'ongoing' ? 'ONGOING' : 'LIVE'}</span>
        ) : match.status === 'upcoming' || match.status === 'scheduled' ? (
          <span className="upcoming-indicator">{match.status === 'scheduled' ? 'SCHEDULED' : 'UPCOMING'}</span>
        ) : match.status === 'completed' || match.status === 'finished' ? (
          <span className="finished-indicator">FINISHED</span>
        ) : (
          <span className="unknown-indicator">{match.status?.toUpperCase() || 'UNKNOWN'}</span>
        )}
      </div>

      <h3 className="team-names">{match.team1} vs {match.team2}</h3>
      <p className="match-details">{match.sport} - {match.venue}</p>
      
      {(match.status === 'live' || match.status === 'ongoing') && (
        <div className="live-score">
          <span className="team">{match.team1}</span>
          <span className="score">{match.team1_score || 0}</span>
          <span className="vs">VS</span>
          <span className="score">{match.team2_score || 0}</span>
          <span className="team">{match.team2}</span>
        </div>
      )}

      {(match.status === 'finished' || match.status === 'completed') ? (
        <div className="final-score">
          <p>Final Score: {match.team1_score} - {match.team2_score}</p>
          {formattedPrediction && (
            <div className="user-prediction">
              <p>Your Prediction: {formattedPrediction.team1Score} - {formattedPrediction.team2Score}</p>
              <p className="points-earned">Points earned: {formattedPrediction.points}</p>
              <p className="score-explanation">{getScoreExplanation(formattedPrediction.points)}</p>
            </div>
          )}
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
                disabled={match.status === 'finished' || match.status === 'completed'}
              >
                Submit Prediction
              </button>
            </>
          ) : (
            <div className="user-prediction">
              <p>Your Prediction: {formattedPrediction.team1Score} - {formattedPrediction.team2Score}</p>
              {(match.status === 'finished' || match.status === 'completed') && (
                <>
                  <p className="points-earned">Points earned: {formattedPrediction.points}</p>
                  <p className="score-explanation">{getScoreExplanation(formattedPrediction.points)}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {(match.status === 'live' || match.status === 'ongoing') && (
        <div className="match-events">
          <h4>Recent Events</h4>
          <ul>
            {match.events && match.events.length > 0 ? (
              match.events.slice(0, 3).map((event, index) => (
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
            {match.events && match.events.length > 3 && (
              <li className="more-events-indicator">
                <span className="more-text">+{match.events.length - 3} more events...</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveMatchCard;