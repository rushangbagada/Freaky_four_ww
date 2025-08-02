import React, { useState, useEffect } from 'react';
import MatchCard from './matchcard.jsx';
import LiveMatchCard from './liveMatchCard.jsx'; // New component for live matches
import Leaderboard from './leader.jsx';
import UserStats from './userStates.jsx';
import Quiz from './quiz.jsx';
import { useAuth } from '../src/AuthContext';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';
import './css/gamepage.css';

const PredictionGamePage = () => {
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [livePredictions, setLivePredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [predictionUser, setPredictionUser] = useState(null);
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
      
      // Fetch prediction user data using email
      fetchPredictionUser(user.email);
    } else {
      console.log('User not authenticated, clearing current user');
      setCurrentUser(null);
      setPredictionUser(null);
    }
  }, [user, isAuthenticated, token]);
  
  // Function to fetch prediction user data
  const fetchPredictionUser = async (email) => {
    try {
      console.log('Fetching prediction user for email:', email);
      const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const predUser = await response.json();
        console.log('Prediction user found:', predUser);
        setPredictionUser(predUser);
      } else {
        console.log('Prediction user not found, response status:', response.status);
        setPredictionUser(null);
      }
    } catch (error) {
      console.error('Error fetching prediction user:', error);
      setPredictionUser(null);
    }
  };

  // Function to refresh leaderboard
  const refreshLeaderboard = () => {
    fetch("/api/leader")
      .then(res => res.json())
      .then(data => {
        data.sort((a, b) => b.total_point - a.total_point);
        setLeaderboard(data.slice(0, 7));
      })
      .catch(err => console.error("Error fetching leaderboard:", err));
  };

  // Functions for real-time data fetching
  const fetchAllMatchData = async () => {
    try {
      // Fetch regular matches
      const predictionRes = await fetch("/api/prediction_match");
      const predictionData = await predictionRes.json();
      setMatches(predictionData);

      // Fetch live matches
      const liveRes = await fetch("/api/game/live-matches");
      const liveData = await liveRes.json();
      setLiveMatches(liveData);

      // Refresh leaderboard
      refreshLeaderboard();
    } catch (err) {
      console.error("Error fetching match data:", err);
    }
  };

  // Use the custom hook for real-time updates
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchAllMatchData,
    []
  );

  // Fetch user's predictions if user is logged in
  useEffect(() => {
    if (predictionUser && predictionUser._id && token) {
      // Fetch live match predictions with authorization using predictionUser's _id
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      console.log('Fetching live predictions for predictionUser ID:', predictionUser._id);
      fetch(`/api/user/${predictionUser._id}/live-match-predictions`, {
        headers
      })
        .then(res => res.json())
        .then(data => {
          console.log('Live predictions fetched:', data);
          setLivePredictions(data);
        })
        .catch(err => console.error("Error fetching live match predictions:", err));
    }
  }, [predictionUser, token]);

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
    console.log('handleLivePrediction called with:', { matchId, team1Score, team2Score });
    console.log('Authentication check:', {
      isAuthenticated: isAuthenticated(),
      currentUser,
      predictionUser,
      hasPredictionUserId: predictionUser?.id,
      token: !!token
    });
    
    // Use the prediction user's MongoDB _id for the API call
    const userId = predictionUser?._id;
    if (!isAuthenticated() || !currentUser || !predictionUser || !userId) {
      console.log('Authentication failed - missing prediction user data');
      alert("Please log in to submit predictions. If you continue to see this error, your account may need to be set up for predictions.");
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
          const existing = prev.find(p => p.matchId?._id === matchId);
          if (existing) {
            return prev.map(p => p.matchId?._id === matchId ? data.prediction : p);
          }
          return [...prev, data.prediction];
        });

        // Update user stats and refresh prediction user data
        setCurrentUser(prev => ({
          ...prev,
          predictions: (prev.predictions || 0) + 1
        }));
        
        // Refresh prediction user data to get updated stats
        if (currentUser && currentUser.email) {
          fetchPredictionUser(currentUser.email);
        }
        
        // Refresh leaderboard to show updated rankings
        refreshLeaderboard();

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
        <div className="hero-content">
          <h1 className="hero-title">Campus Sports Prediction Game</h1>
          <p className="hero-subtitle">
            Join the excitement and predict match outcomes to climb the <span className="accent-word">leaderboard</span>!
          </p>
        </div>
      </div>

      <div className="game-container">
        <div className="matches-section">
          
          {/* Live Matches Section */}
          <h2>Live Matches</h2>
          <div className="matches-grid">
            {liveMatches.length > 0 ? (
              liveMatches.slice(0, 7).map(match => (
                <LiveMatchCard
                  key={match._id}
                  match={match}
                  onPredict={handleLivePrediction}
                  userPrediction={livePredictions.find(p => p.matchId?._id === match._id)}
                />
              ))
            ) : (
              <p>No live matches currently available</p>
            )}
          </div>

        </div>

        <div className="sidebar">
          {(currentUser || predictionUser) && <UserStats user={currentUser} predictionUser={predictionUser} />}
          <Quiz onPointsEarned={refreshLeaderboard} />
          <Leaderboard users={leaderboard} currentUserId={predictionUser?._id || currentUser?._id || currentUser?.id} />
        </div>
      </div>
    </div>
  );
};

export default PredictionGamePage;
