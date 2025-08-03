import React, { useState, useEffect, useRef } from 'react';
import MatchCard from './matchcard.jsx';
import LiveMatchCard from './liveMatchCard.jsx'; // New component for live matches
import Leaderboard from './leader.jsx';
import UserStats from './userStates.jsx';
import Quiz from './quiz.jsx';
import { useAuth } from '../src/AuthContext';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';
import { apiRequest, getApiUrl, API_ENDPOINTS } from '../src/config/api';
import PredictionScoring from './utils/PredictionScoring.js';
import './css/gamepage.css';

const PredictionGamePage = () => {
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [livePredictions, setLivePredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [predictionUser, setPredictionUser] = useState(null);
  const [finishedMatches, setFinishedMatches] = useState(new Set());
  const { user, isAuthenticated, token } = useAuth();
  const evaluationInProgress = useRef(false);

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
      console.log('🔍 Fetching prediction user for email:', email);
      const endpoint = `${API_ENDPOINTS.USER_BY_EMAIL}?email=${encodeURIComponent(email)}`;
      const predUser = await apiRequest(endpoint);
      console.log('✅ Prediction user found:', predUser);
      setPredictionUser(predUser);
    } catch (error) {
      console.error('❌ Error fetching prediction user:', error);
      setPredictionUser(null);
    }
  };

  // Function to refresh leaderboard
  const refreshLeaderboard = async () => {
    try {
      console.log('🏆 Fetching leaderboard data...');
      const data = await apiRequest(API_ENDPOINTS.LEADERBOARD);
      console.log('📈 Leaderboard data received:', data);
      
      // Handle different data structures
      let leaderboardArray = [];
      if (Array.isArray(data)) {
        leaderboardArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        leaderboardArray = data.data;
      } else {
        console.warn('⚠️ Unexpected leaderboard data structure:', data);
        leaderboardArray = [];
      }
      
      leaderboardArray.sort((a, b) => b.total_point - a.total_point);
      setLeaderboard(leaderboardArray.slice(0, 7));
      console.log('✅ Leaderboard updated successfully');
    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      setLeaderboard([]);
    }
  };

  // Functions for real-time data fetching
  const fetchAllMatchData = async () => {
    try {
      console.log('⚽ Fetching all match data...');
      
      // Fetch matches from multiple sources to get comprehensive data
      const endpoints = [
        { name: 'Admin Matches', endpoint: API_ENDPOINTS.ADMIN_MATCHES },
        { name: 'Admin Live Matches', endpoint: API_ENDPOINTS.ADMIN_LIVE_MATCHES },
        { name: 'Live Matches', endpoint: API_ENDPOINTS.LIVE_MATCHES },
        { name: 'Prediction Matches', endpoint: API_ENDPOINTS.PREDICTION_MATCHES },
        { name: 'Recent Matches', endpoint: API_ENDPOINTS.RECENT_MATCHES },
        { name: 'Upcoming Matches', endpoint: API_ENDPOINTS.UPCOMING_MATCHES }
      ];
      
      let allMatches = [];
      
      for (const { name, endpoint } of endpoints) {
        try {
          console.log(`📊 Fetching ${name}...`);
          const data = await apiRequest(endpoint, {
            headers: {
              'Authorization': `Bearer ${token || localStorage.getItem('token')}`
            }
          });
          
          console.log(`✅ ${name} received:`, data);
          
          // Handle different data structures
          let matches = [];
          if (Array.isArray(data)) {
            matches = data;
          } else if (data && data.data && Array.isArray(data.data)) {
            matches = data.data;
          } else if (data && data.matches && Array.isArray(data.matches)) {
            matches = data.matches;
          } else if (data && typeof data === 'object') {
            matches = [data];
          }
          
          allMatches = [...allMatches, ...matches];
          
        } catch (error) {
          console.warn(`⚠️ Failed to fetch ${name}:`, error.message);
        }
      }
      
      // Remove duplicates based on _id or id
      const uniqueMatches = allMatches.filter((match, index, self) => {
        const id = match._id || match.id;
        return index === self.findIndex(m => (m._id || m.id) === id);
      });
      
      console.log('🔍 Total unique matches found:', uniqueMatches.length);
      
      // Separate matches by status and type
      const liveMatches = uniqueMatches.filter(match => 
        match.status === 'ongoing' || match.status === 'live'
      );
      
      const otherMatches = uniqueMatches.filter(match => 
        match.status !== 'ongoing' && match.status !== 'live'
      );
      
      // Sort live matches by priority (ongoing first, then live)
      liveMatches.sort((a, b) => {
        const statusPriority = { 'ongoing': 2, 'live': 1 };
        return (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
      });
      
      console.log('🔥 Live/Ongoing matches found:', liveMatches.length);
      console.log('📊 Other matches found:', otherMatches.length);
      
      setLiveMatches(liveMatches);
      setMatches(otherMatches);
      
      // Refresh leaderboard
      await refreshLeaderboard();
      
      console.log('✅ All match data fetched successfully');
    } catch (err) {
      console.error('❌ Error fetching match data:', err);
      setMatches([]);
      setLiveMatches([]);
    }
  };

  // Use the custom hook for real-time updates
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchAllMatchData,
    []
  );

  // Function to evaluate predictions for finished matches
  const evaluateFinishedMatches = async () => {
    if (evaluationInProgress.current || !token) {
      return;
    }

    try {
      evaluationInProgress.current = true;
      console.log('🎯 Checking for finished matches to evaluate predictions...');
      
      // Get all matches (live and other)
      const allCurrentMatches = [...liveMatches, ...matches];
      
      // Find newly finished matches
      const newlyFinishedMatches = allCurrentMatches.filter(match => {
        const isFinished = match.status === 'completed' || match.status === 'finished';
        const isNewlyFinished = isFinished && !finishedMatches.has(match._id);
        return isNewlyFinished && match.team1_score !== undefined && match.team2_score !== undefined;
      });
      
      if (newlyFinishedMatches.length > 0) {
        console.log('🏁 Found newly finished matches:', newlyFinishedMatches.map(m => `${m.team1} vs ${m.team2}`));
        
        // Update finished matches set
        setFinishedMatches(prev => {
          const newSet = new Set(prev);
          newlyFinishedMatches.forEach(match => newSet.add(match._id));
          return newSet;
        });
        
        // Trigger prediction evaluation API call for each finished match
        for (const match of newlyFinishedMatches) {
          try {
            console.log(`📊 Triggering evaluation for match: ${match.team1} vs ${match.team2}`);
            
            // Call backend to evaluate all predictions for this match
            await apiRequest(API_ENDPOINTS.EVALUATE_MATCH_PREDICTIONS, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                matchId: match._id,
                finalScore: {
                  team1Score: match.team1_score,
                  team2Score: match.team2_score
                }
              })
            });
            
            console.log(`✅ Successfully triggered evaluation for match ${match._id}`);
          } catch (error) {
            console.error(`❌ Failed to evaluate predictions for match ${match._id}:`, error);
          }
        }
        
        // Refresh user predictions and leaderboard after evaluation
        setTimeout(async () => {
          console.log('🔄 Refreshing data after prediction evaluation...');
          
          // Refresh live predictions
          if (predictionUser && predictionUser._id) {
            try {
              const endpoint = `${API_ENDPOINTS.USER_LIVE_PREDICTIONS}/${predictionUser._id}/live-match-predictions`;
              const data = await apiRequest(endpoint, {
                headers: { "Authorization": `Bearer ${token}` }
              });
              
              if (Array.isArray(data)) {
                setLivePredictions(data);
              } else if (data && data.data && Array.isArray(data.data)) {
                setLivePredictions(data.data);
              }
            } catch (error) {
              console.error('❌ Error refreshing predictions after evaluation:', error);
            }
          }
          
          // Refresh leaderboard
          await refreshLeaderboard();
          
          // Refresh user data
          if (currentUser && currentUser.email) {
            await fetchPredictionUser(currentUser.email);
          }
          
          console.log('✅ Data refresh completed after prediction evaluation');
        }, 2000); // 2 second delay to allow backend processing
      }
    } catch (error) {
      console.error('❌ Error in evaluateFinishedMatches:', error);
    } finally {
      evaluationInProgress.current = false;
    }
  };

  // Monitor for finished matches and trigger evaluation
  useEffect(() => {
    evaluateFinishedMatches();
  }, [liveMatches, matches, token]);

  // Fetch user's predictions if user is logged in
  useEffect(() => {
    const fetchLivePredictions = async () => {
      if (predictionUser && predictionUser._id && token) {
        try {
          console.log('🔮 Fetching live predictions for predictionUser ID:', predictionUser._id);
          const endpoint = `${API_ENDPOINTS.USER_LIVE_PREDICTIONS}/${predictionUser._id}/live-match-predictions`;
          const data = await apiRequest(endpoint, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          console.log('✅ Live predictions fetched:', data);
          
          // Handle different data structures
          if (Array.isArray(data)) {
            setLivePredictions(data);
          } else if (data && data.data && Array.isArray(data.data)) {
            setLivePredictions(data.data);
          } else {
            console.warn('⚠️ Unexpected live predictions data structure:', data);
            setLivePredictions([]);
          }
        } catch (error) {
          console.error('❌ Error fetching live match predictions:', error);
          setLivePredictions([]);
        }
      }
    };
    
    fetchLivePredictions();
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

  // Handle live match prediction submission with enhanced validation
  const handleLivePrediction = (matchId, team1Score, team2Score) => {
    console.log('🎯 handleLivePrediction called with:', { matchId, team1Score, team2Score });
    console.log('🔐 Authentication check:', {
      isAuthenticated: isAuthenticated(),
      currentUser: !!currentUser,
      predictionUser: !!predictionUser,
      hasPredictionUserId: !!predictionUser?._id,
      token: !!token
    });
    
    try {
      // Enhanced authentication validation
      const userId = predictionUser?._id;
      if (!isAuthenticated() || !currentUser || !predictionUser || !userId) {
        console.log('❌ Authentication failed - missing prediction user data');
        alert("Please log in to submit predictions. If you continue to see this error, your account may need to be set up for predictions.");
        return;
      }
      
      // Enhanced input validation using PredictionScoring utility
      const validationResult = PredictionScoring.validatePrediction({
        team1Score,
        team2Score
      });
      
      if (!validationResult.isValid) {
        alert(`Validation Error: ${validationResult.error}`);
        return;
      }
      
      // Additional score validation
      const team1Validation = PredictionScoring.validateScore(team1Score);
      const team2Validation = PredictionScoring.validateScore(team2Score);
      
      if (!team1Validation.isValid) {
        alert(`Team 1 Score Error: ${team1Validation.error}`);
        return;
      }
      
      if (!team2Validation.isValid) {
        alert(`Team 2 Score Error: ${team2Validation.error}`);
        return;
      }
      
      // Use sanitized scores
      const parsedTeam1Score = team1Validation.sanitized;
      const parsedTeam2Score = team2Validation.sanitized;
      
      console.log('✅ Validation successful - proceeding with prediction submission');
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

    // Use the centralized API request function
    apiRequest(API_ENDPOINTS.SUBMIT_LIVE_PREDICTION, {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId: userId,
        matchId,
        team1Score: parsedTeam1Score,
        team2Score: parsedTeam2Score
      })
    })
      .then(data => {
        console.log('✅ Prediction submitted successfully:', data);
        
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
    } catch (error) {
      console.error('❌ Error in handleLivePrediction:', error);
      alert(`Validation Error: ${error.message}`);
    }
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
