import React, { useState, useEffect } from 'react';
import MatchCard from './matchcard.jsx';
import OldMatchCard from './OldMatchCard.jsx'; // Import the new component
import Leaderboard from './leader.jsx';
import UserStats from './userStates.jsx';
import { useAuth } from '../src/AuthContext'; // Import useAuth
import './css/gamepage.css';

const PredictionGamePage = () => {
  const [matches, setMatches] = useState([]);
  const [oldMatches, setOldMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [oldMatchPredictions, setOldMatchPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const { user, token } = useAuth(); // Use the auth context

  // Fetch matches, old matches, and leaderboard
  useEffect(() => {
    // Fetch regular matches
    fetch("/api/prediction_match")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("Error fetching prediction matches:", err));

    // Fetch old matches
    fetch("/api/game/old-matches")
      .then(res => res.json())
      .then(data => setOldMatches(data))
      .catch(err => console.error("Error fetching old matches:", err));

    // Fetch leaderboard
    fetch("/api/leader")
      .then(res => res.json())
      .then(data => {
        data.sort((a, b) => b.total_point - a.total_point);
        setLeaderboard(data.slice(0, 7));
      })
      .catch(err => console.error("Error fetching leaderboard:", err));
  }, []);

  // Fetch user's predictions if user is logged in
  useEffect(() => {
    if (user && user._id) {
      // Fetch old match predictions
      fetch(`/api/user/${user._id}/old-match-predictions`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add token to request
        }
      })
        .then(res => res.json())
        .then(data => setOldMatchPredictions(data))
        .catch(err => console.error("Error fetching old match predictions:", err));
    }
  }, [user, token]);

  // Handle regular match prediction submission
  const handlePrediction = (matchId, homeScore, awayScore) => {
    const newPrediction = {
      matchId,
      homeScore,
      awayScore,
      points: 0
    };

    setPredictions(prev => {
      const existing = prev.find(p => p.matchId === matchId);
      if (existing) {
        return prev.map(p => p.matchId === matchId ? newPrediction : p);
      }
      return [...prev, newPrediction];
    });
  };

  // Handle old match prediction submission
  const handleOldMatchPrediction = (matchId, team1Score, team2Score) => {
    if (!user || !user._id) {
      alert("Please log in to submit predictions");
      return;
    }

    fetch("/api/user/old-match-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` // Add token to request
      },
      body: JSON.stringify({
        userId: user._id,
        matchId,
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score)
      })
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("You are not logged in or your session has expired");
          }
          throw new Error("Failed to submit prediction");
        }
        return res.json();
      })
      .then(data => {
        // Update the old match predictions state
        setOldMatchPredictions(prev => {
          const existing = prev.find(p => p.matchId._id === matchId);
          if (existing) {
            return prev.map(p => p.matchId._id === matchId ? data.prediction : p);
          }
          return [...prev, data.prediction];
        });

        // Remove the setCurrentUser code

        alert("Prediction submitted successfully!");
      })
      .catch(err => {
        console.error("Error submitting prediction:", err);
        alert(err.message || "Error submitting prediction. Please try again.");
      });
  };

  const now = new Date();

  return (
    <div className="prediction-game">
      <div className="hero-section">
        <h1>Campus Sports Prediction Game</h1>
        <p>Predict match outcomes and climb the leaderboard!</p>
      </div>

      <div className="game-container">
        <div className="matches-section">
          {/* Old Matches Section */}
          <h2>Old Matches</h2>
          <div className="matches-grid">
            {oldMatches.length > 0 ? (
              oldMatches.map(match => (
                <OldMatchCard
                  key={match._id}
                  match={match}
                  onPredict={handleOldMatchPrediction}
                  userPrediction={oldMatchPredictions.find(p => p.matchId._id === match._id)}
                />
              ))
            ) : (
              <p>No old matches currently available</p>
            )}
          </div>

          <h2>Upcoming Matches</h2>
          <div className="matches-grid">
            {matches
              .filter(match => match.date && new Date(match.date).getTime() > now.getTime())
              .map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onPredict={handlePrediction}
                  userPrediction={predictions.find(p => p.matchId === match.id)}
                />
              ))}
          </div>

          <h2>Recent Results</h2>
          <div className="matches-grid">
            {matches
              .filter(match => match.date && new Date(match.date).getTime() <= now.getTime())
              .map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onPredict={handlePrediction}
                  userPrediction={predictions.find(p => p.matchId === match.id)}
                />
              ))}
          </div>
        </div>

        <div className="sidebar">
          {user && <UserStats user={user} />}
          <Leaderboard users={leaderboard} currentUserId={user?._id} />
        </div>
      </div>
    </div>
  );
};

export default PredictionGamePage;
