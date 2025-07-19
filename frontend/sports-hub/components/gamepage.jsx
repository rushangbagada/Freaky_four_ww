import React, { useState, useEffect } from 'react';
import MatchCard from './matchcard.jsx';
import LiveMatchCard from './liveMatchCard.jsx'; // New component for live matches
import Leaderboard from './leader.jsx';
import UserStats from './userStates.jsx';
import './css/gamepage.css';

const PredictionGamePage = () => {
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [livePredictions, setLivePredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) return;

    fetch(`/api/user?email=${encodeURIComponent(email)}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(data => setCurrentUser(data)) // set full user object
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  // Fetch matches, live matches, and leaderboard
  useEffect(() => {
    // Fetch regular matches
    fetch("/api/prediction_match")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("Error fetching prediction matches:", err));

    // Fetch live matches
    fetch("/api/game/live-matches")
      .then(res => res.json())
      .then(data => setLiveMatches(data))
      .catch(err => console.error("Error fetching live matches:", err));

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
    if (currentUser && currentUser._id) {
      // Fetch live match predictions
      fetch(`/api/user/${currentUser._id}/live-match-predictions`)
        .then(res => res.json())
        .then(data => setLivePredictions(data))
        .catch(err => console.error("Error fetching live match predictions:", err));
    }
  }, [currentUser]);

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

    if (currentUser) {
      setCurrentUser(prev => ({
        ...prev,
        predictions: (prev.predictions || 0) + 1
      }));
    }
  };

  // Handle live match prediction submission
  const handleLivePrediction = (matchId, team1Score, team2Score) => {
    if (!currentUser || !currentUser._id) {
      alert("Please log in to submit predictions");
      return;
    }

    fetch("/api/user/live-match-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: currentUser._id,
        matchId,
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit prediction");
        return res.json();
      })
      .then(data => {
        // Update the live predictions state
        setLivePredictions(prev => {
          const existing = prev.find(p => p.matchId._id === matchId);
          if (existing) {
            return prev.map(p => p.matchId._id === matchId ? data.prediction : p);
          }
          return [...prev, data.prediction];
        });

        // Update user stats
        setCurrentUser(prev => ({
          ...prev,
          predictions: (prev.predictions || 0) + 1
        }));

        alert("Prediction submitted successfully!");
      })
      .catch(err => {
        console.error("Error submitting prediction:", err);
        alert("Error submitting prediction. Please try again.");
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
          {/* Live Matches Section */}
          <h2>Live Matches</h2>
          <div className="matches-grid">
            {liveMatches.length > 0 ? (
              liveMatches.map(match => (
                <LiveMatchCard
                  key={match._id}
                  match={match}
                  onPredict={handleLivePrediction}
                  userPrediction={livePredictions.find(p => p.matchId._id === match._id)}
                />
              ))
            ) : (
              <p>No live matches currently available</p>
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
          {currentUser && <UserStats user={currentUser} />}
          <Leaderboard users={leaderboard} currentUserId={currentUser?._id} />
        </div>
      </div>
    </div>
  );
};

export default PredictionGamePage;
