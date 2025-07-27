import React, { useState, useEffect } from 'react';
import MatchCard from './matchcard.jsx';
import OldMatchCard from './OldMatchCard.jsx'; // Import the new component
import Leaderboard from './leader.jsx';
import UserStats from './userStates.jsx';
import { useAuth } from '../src/AuthContext';
import './css/gamepage.css';

const PredictionGamePage = () => {
  const [matches, setMatches] = useState([]);
  const [oldMatches, setOldMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [oldMatchPredictions, setOldMatchPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { user, isAuthenticated, token } = useAuth();

  // Set current user from AuthContext
  useEffect(() => {
    console.log('AuthContext state:', { user, isAuthenticated: isAuthenticated(), token: !!token });
    console.log('localStorage contents:', {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      email: localStorage.getItem('email')
    });
    
    if (isAuthenticated() && user) {
      console.log('Setting current user:', user);
      setCurrentUser(user);
    } else {
      console.log('User not authenticated, clearing current user');
      setCurrentUser(null);
    }
  }, [user, isAuthenticated, token]);

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
    const userId = currentUser?._id || currentUser?.id;
    if (currentUser && userId && token) {
      // Fetch live match predictions with authorization
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      fetch(`/api/user/${userId}/live-match-predictions`, {
        headers
      })
        .then(res => res.json())
        .then(data => setOldMatchPredictions(data))
        .catch(err => console.error("Error fetching old match predictions:", err));
    }
  }, [currentUser, token]);

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

  // Handle live match prediction submission
  const handleLivePrediction = (matchId, team1Score, team2Score) => {
    console.log('handleLivePrediction called with:', { matchId, team1Score, team2Score });
    console.log('Authentication check:', {
      isAuthenticated: isAuthenticated(),
      currentUser,
      hasUserId: currentUser?._id || currentUser?.id,
      token: !!token
    });
    
    const userId = currentUser?._id || currentUser?.id;
    if (!isAuthenticated() || !currentUser || !userId) {
      console.log('Authentication failed - showing login alert');
      alert("Please log in to submit predictions");
      return;
    }
    
    // Validate input scores
    if (team1Score === '' || team2Score === '' || team1Score === null || team2Score === null) {
      alert("Please enter scores for both teams");
      return;
    }
    
    const parsedTeam1Score = parseInt(team1Score);
    const parsedTeam2Score = parseInt(team2Score);
    
    if (isNaN(parsedTeam1Score) || isNaN(parsedTeam2Score) || parsedTeam1Score < 0 || parsedTeam2Score < 0) {
      alert("Please enter valid positive numbers for scores");
      return;
    }
    
    console.log('Authentication passed - proceeding with prediction submission');
    console.log('Request payload:', {
      userId: userId,
      matchId,
      team1Score: parsedTeam1Score,
      team2Score: parsedTeam2Score
    });

    const headers = {
      "Content-Type": "application/json"
    };
    
    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log('Request headers:', headers);

    fetch("/api/user/live-match-prediction", {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId: userId,
        matchId,
        team1Score: parsedTeam1Score,
        team2Score: parsedTeam2Score
      })
    })
      .then(res => {
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (!res.ok) {
          return res.text().then(text => {
            console.error('Server error response:', text);
            let errorMessage = 'Failed to submit prediction';
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              console.log('Response is not JSON:', text);
              errorMessage = text || errorMessage;
            }
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Success response:', data);
        
        // Update the live predictions state
        setLivePredictions(prev => {
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
        console.error("Detailed error submitting prediction:", {
          error: err,
          message: err.message,
          stack: err.stack,
          userId,
          matchId,
          team1Score: parsedTeam1Score,
          team2Score: parsedTeam2Score,
          token: !!token
        });
        alert(`Error submitting prediction: ${err.message}`);
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
          {currentUser && <UserStats user={currentUser} />}
          <Leaderboard users={leaderboard} currentUserId={currentUser?._id || currentUser?.id} />
        </div>
      </div>
    </div>
  );
};

export default PredictionGamePage;
