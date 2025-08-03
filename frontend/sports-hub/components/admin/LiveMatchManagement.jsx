import React, { useState, useEffect } from 'react';
import { getApiUrl, API_ENDPOINTS, apiRequest } from '../../src/config/api';
import useDatabaseChangeDetection from '../../hooks/useDatabaseChangeDetection';
import './css/live-match-management.css';

export default function LiveMatchManagement({ user }) {
  const [liveMatches, setLiveMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [currentMatchForEvent, setCurrentMatchForEvent] = useState(null);
  const [showUpdateStats, setShowUpdateStats] = useState(false);
  const [currentMatchForStats, setCurrentMatchForStats] = useState(null);

  const [newMatch, setNewMatch] = useState({
    id: Math.floor(Math.random() * 10000),
    sport: '',
    team1: '',
    team2: '',
    team1_score: 0,
    team2_score: 0,
    status: 'live',
    time: '',
    venue: '',
    url: '',
    events: [],
    stats: {
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      shots_on_target: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 }
    }
  });

  const [newEvent, setNewEvent] = useState({
    time: '',
    type: '',
    team: '',
    player: '',
    description: ''
  });

  const isAdmin = user.role === 'admin';

  const fetchLiveMatches = async () => {
    try {
      console.log('\ud83d\udd04 [ADMIN] Fetching live matches from admin API...');
      console.log('\ud83d\udd10 [ADMIN] User role:', user?.role);
      console.log('\ud83d\udd11 [ADMIN] Token exists:', !!localStorage.getItem('token'));
      
      // Use the admin endpoint from API_ENDPOINTS
      const endpoint = API_ENDPOINTS.ADMIN_LIVE_MATCHES;
      console.log('\ud83c\udf10 [ADMIN] Using endpoint:', endpoint);
      
      const data = await apiRequest(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('\u2705 [ADMIN] Fetched live matches data:', data);
      console.log('\ud83d\udd0d [ADMIN] Data type:', typeof data, 'Is array:', Array.isArray(data));
      
      let matchArray = [];
      if (Array.isArray(data)) {
        matchArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        matchArray = data.data;
      } else if (data && data.matches && Array.isArray(data.matches)) {
        matchArray = data.matches;
      } else {
        console.warn('\u26a0\ufe0f [ADMIN] Unexpected data structure:', data);
        console.log('\ud83d\udd0d [ADMIN] Available properties:', Object.keys(data || {}));
        matchArray = [];
      }

      // Collect matches from additional endpoints
      console.log('🔄 [ADMIN] Trying to fetch from general live matches endpoint...');
      const fallbackMatches = await apiRequest(API_ENDPOINTS.LIVE_MATCHES, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).catch((err) => {
        console.log('⚠️ [ADMIN] General live matches fetch failed:', err.message);
        return [];
      });

      if (Array.isArray(fallbackMatches)) {
        matchArray = matchArray.concat(fallbackMatches);
      }

      // Try prediction matches endpoint as well
      console.log('🔄 [ADMIN] Trying to fetch from prediction matches endpoint...');
      const predictionMatches = await apiRequest(API_ENDPOINTS.PREDICTION_MATCHES, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).catch((err) => {
        console.log('⚠️ [ADMIN] Prediction matches fetch failed:', err.message);
        return [];
      });

      if (Array.isArray(predictionMatches)) {
        matchArray = matchArray.concat(predictionMatches);
      }

      console.log('🔍 [ADMIN] Total matches before deduplication:', matchArray.length);

      // Remove duplicates (check both id and _id fields)
      matchArray = matchArray.reduce((unique, o) => {
        const matchId = o.id || o._id;
        if (!unique.some(obj => (obj.id === matchId || obj._id === matchId))) {
          unique.push(o);
        }
        return unique;
      }, []);

      console.log('🔍 [ADMIN] Total matches after deduplication:', matchArray.length);

      // Sort matches by status priority (live -> upcoming -> finished)
      const statusPriority = { 'live': 3, 'upcoming': 2, 'finished': 1 };
      matchArray.sort((a, b) => {
        const aPriority = statusPriority[a.status] || 0;
        const bPriority = statusPriority[b.status] || 0;
        return bPriority - aPriority;
      });

      console.log('🔍 [ADMIN] Match statuses after sorting:', matchArray.map(m => m.status));

      // Sorting or further processing can be done here

      console.log('\ud83d\udcca [ADMIN] Setting live matches:', matchArray.length, 'matches');
      if (matchArray.length > 0) {
        console.log('\ud83c\udfaf [ADMIN] First match sample:', matchArray[0]);
      }
      setLiveMatches(matchArray);
      
    } catch (error) {
      console.error('\u274c [ADMIN] Error fetching live matches:', error);
      console.error('\u274c [ADMIN] Error stack:', error.stack);
      
      // Try fallback to general live matches endpoint
      console.log('\ud83d\udd04 [ADMIN] Trying fallback to general live matches...');
      try {
        const fallbackData = await apiRequest(API_ENDPOINTS.LIVE_MATCHES, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('\u2705 [ADMIN] Fallback data:', fallbackData);
        const fallbackArray = Array.isArray(fallbackData) ? fallbackData : [];
        setLiveMatches(fallbackArray);
        console.log('\ud83d\udd04 [ADMIN] Using fallback data with', fallbackArray.length, 'matches');
        
      } catch (fallbackError) {
        console.error('\u274c [ADMIN] Fallback also failed:', fallbackError);
        setLiveMatches([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Use the custom hook for real-time updates
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchLiveMatches,
    []
  );

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch(getApiUrl('/api/clubs'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClubs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleAddLiveMatch = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting new match:', newMatch);
      
      const response = await fetch(getApiUrl('/api/admin/live-matches'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newMatch)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        
        setShowAddMatch(false);
        setNewMatch({
          id: Math.floor(Math.random() * 10000),
          sport: '',
          team1: '',
          team2: '',
          team1_score: 0,
          team2_score: 0,
          status: 'live',
          time: '',
          venue: '',
          url: '',
          events: [],
          stats: {
            possession: { home: 50, away: 50 },
            shots: { home: 0, away: 0 },
            shots_on_target: { home: 0, away: 0 },
            fouls: { home: 0, away: 0 }
          }
        });
        fetchLiveMatches();
        alert('Live match added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        alert(`Failed to add live match: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding live match:', error);
      alert(`Error adding live match: ${error.message}`);
    }
  };

  const handleUpdateLiveMatch = async (matchId, updatedData) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/live-matches/${matchId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingMatch(null);
        fetchLiveMatches();
      }
    } catch (error) {
      console.error('Error updating live match:', error);
    }
  };

  const handleDeleteLiveMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this live match?')) {
      try {
        const response = await fetch(getApiUrl(`/api/admin/live-matches/${matchId}`), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          fetchLiveMatches();
          alert('Live match deleted successfully!');
        } else {
          alert('Failed to delete live match');
        }
      } catch (error) {
        console.error('Error deleting live match:', error);
        alert('Error deleting live match');
      }
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!currentMatchForEvent) return;

    try {
      const match = liveMatches.find(m => m._id === currentMatchForEvent._id);
      if (!match) return;

      const updatedEvents = [...match.events, newEvent];
      const response = await fetch(getApiUrl(`/api/admin/live-matches/${match._id}/events`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ events: updatedEvents })
      });

      if (response.ok) {
        setShowAddEvent(false);
        setCurrentMatchForEvent(null);
        setNewEvent({
          time: '',
          type: '',
          team: '',
          player: '',
          description: ''
        });
        fetchLiveMatches();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateStats = async (e) => {
    e.preventDefault();
    if (!currentMatchForStats) return;

    try {
      const response = await fetch(getApiUrl(`/api/admin/live-matches/${currentMatchForStats._id}/stats`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ stats: currentMatchForStats.stats })
      });

      if (response.ok) {
        setShowUpdateStats(false);
        setCurrentMatchForStats(null);
        fetchLiveMatches();
      }
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  // Function to update live match scores in real-time without changing status
  const handleUpdateLiveScores = async (matchId, team1Score, team2Score, preserveStatus = true) => {
    try {
      const currentMatch = liveMatches.find(m => m._id === matchId);
      if (!currentMatch) return;

      const response = await fetch(getApiUrl(`/api/admin/live-matches/${matchId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...currentMatch,
          team1_score: parseInt(team1Score),
          team2_score: parseInt(team2Score),
          status: preserveStatus ? currentMatch.status : 'finished'
        })
      });
  
      if (response.ok) {
        console.log(`✅ Live scores updated: ${team1Score}-${team2Score}`);
        // Immediately update local state for instant UI feedback
        setLiveMatches(prevMatches => 
          prevMatches.map(match => 
            match._id === matchId ? {
              ...match,
              team1_score: parseInt(team1Score),
              team2_score: parseInt(team2Score)
            } : match
          )
        );
      } else {
        console.error('❌ Failed to update live scores');
      }
    } catch (error) {
      console.error('Error updating live scores:', error);
    }
  };

  // Function to finish match and calculate points
  const handleFinishMatchAndCalculatePoints = async (matchId, team1Score, team2Score) => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/api/admin/live-matches/${matchId}/update-scores`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          team1_score: parseInt(team1Score),
          team2_score: parseInt(team2Score),
          status: 'finished'
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to finish match and calculate points');
      }
  
      const data = await response.json();
      console.log('Match finished and points calculated:', data);
      
      // Update the match in the UI
      setLiveMatches(prevMatches => 
        prevMatches.map(match => 
          match._id === matchId ? data.match : match
        )
      );
  
      alert('Match finished and user points calculated successfully!');
    } catch (error) {
      console.error('Error finishing match:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading live matches...</p>
        <p style={{fontSize: '12px', color: '#666'}}>Debug: User role - {user?.role}</p>
        <p style={{fontSize: '12px', color: '#666'}}>Debug: Token exists - {!!localStorage.getItem('token') ? 'Yes' : 'No'}</p>
      </div>
    );
  }

  return (
    <div className="live-match-management">
      <div className="live-match-management-header">
        <h2>Live Match Management</h2>
        {isAdmin && (
          <button 
            className="add-live-match-btn"
            onClick={() => setShowAddMatch(true)}
          >
            + Add Live Match
          </button>
        )}
      </div>


      {/* Live Matches List */}
      <div className="live-matches-list">
        {liveMatches.length > 0 ? (
          liveMatches.slice(0, 7).map((match) => (
            <div key={match._id} className="live-match-card">
              <div className="match-header">
                <h3>{match.sport} Match</h3>
                <div className="match-status">
                  <span className={`status-badge ${match.status}`}>{match.status.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="teams-container">
                <div className="team team-home">
                  <div className="team-name">{match.team1}</div>
                  <div className="team-score">{match.team1_score}</div>
                </div>
                
                <div className="vs">VS</div>
                
                <div className="team team-away">
                  <div className="team-name">{match.team2}</div>
                  <div className="team-score">{match.team2_score}</div>
                </div>
              </div>
              
              <div className="match-details">
                <div className="match-time">Time: {match.time}</div>
                <div className="match-venue">Venue: {match.venue}</div>
              </div>
              
              <div className="match-events">
                <div className="events-header">
                  <h4>Recent Events</h4>
                  <div className="events-counter">
                    <span className="counter-badge">{match.events?.length || 0}</span>
                    <span className="counter-text">Events</span>
                  </div>
                </div>
                
                {match.events && match.events.length > 0 ? (
                  <div className="events-list">
                    {match.events.slice(-3).map((event, index) => (
                      <div key={index} className={`event-item ${event.type}-event`}>
                        <div className="event-icon-wrapper">
                          <div className="event-icon">
                            {event.type === 'goal' && '⚽'}
                            {event.type === 'yellow-card' && '🟨'}
                            {event.type === 'red-card' && '🟥'}
                            {event.type === 'substitution' && '🔄'}
                            {event.type === 'penalty' && '⚡'}
                            {!['goal', 'yellow-card', 'red-card', 'substitution', 'penalty'].includes(event.type) && '📝'}
                          </div>
                          <div className="event-pulse"></div>
                        </div>
                        
                        <div className="event-content">
                          <div className="event-header">
                            <div className="event-time-badge">{event.time}'</div>
                            <div className="event-type-badge">{event.type.replace('-', ' ').toUpperCase()}</div>
                          </div>
                          
                          <div className="event-details">
                            <div className="event-team-player">
                              <span className="event-team">{event.team}</span>
                              <span className="event-separator">•</span>
                              <span className="event-player">{event.player}</span>
                            </div>
                            <div className="event-description">{event.description}</div>
                          </div>
                        </div>
                        
                        <div className="event-status">
                          <div className="event-indicator"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-events">
                    <div className="no-events-icon">📋</div>
                    <div className="no-events-text">No events recorded yet</div>
                    <div className="no-events-subtext">Add match events to track the game progress</div>
                  </div>
                )}
                
                <div className="events-actions">
                  <button 
                    className="add-event-button"
                    onClick={() => {
                      setCurrentMatchForEvent(match);
                      setShowAddEvent(true);
                    }}
                  >
                    <span className="button-icon">➕</span>
                    <span>Add Event</span>
                  </button>
                  
                  {match.events && match.events.length > 3 && (
                    <button className="view-all-events-button">
                      <span>View All ({match.events.length})</span>
                      <span className="button-arrow">→</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="match-stats">
                <h4>Match Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-label">Possession</div>
                    <div className="stat-values">
                      <span>{match.stats?.possession?.home || 0}%</span>
                      <span>{match.stats?.possession?.away || 0}%</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Shots</div>
                    <div className="stat-values">
                      <span>{match.stats?.shots?.home || 0}</span>
                      <span>{match.stats?.shots?.away || 0}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Shots on Target</div>
                    <div className="stat-values">
                      <span>{match.stats?.shots_on_target?.home || 0}</span>
                      <span>{match.stats?.shots_on_target?.away || 0}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Fouls</div>
                    <div className="stat-values">
                      <span>{match.stats?.fouls?.home || 0}</span>
                      <span>{match.stats?.fouls?.away || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="stats-actions">
                  <button 
                    className="action-btn update-stats-btn"
                    onClick={() => {
                      setCurrentMatchForStats(match);
                      setShowUpdateStats(true);
                    }}
                    title="Update match statistics"
                  >
                    <span className="btn-icon">📈</span>
                    <span className="btn-text">Update Stats</span>
                  </button>
                </div>
              </div>
              
              <div className="match-actions">
                <div className="action-section primary-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => setEditingMatch(match)}
                    title="Edit match details"
                  >
                    <span className="btn-icon">✏️</span>
                    <span className="btn-text">Edit</span>
                  </button>
                  
                  <button 
                    className="action-btn score-btn"
                    onClick={() => {
                      const team1Score = prompt(`Enter new score for ${match.team1}:`, match.team1_score);
                      const team2Score = prompt(`Enter new score for ${match.team2}:`, match.team2_score);
                      
                      if (team1Score !== null && team2Score !== null) {
                        handleUpdateLiveScores(match._id, team1Score, team2Score, true);
                      }
                    }}
                    title="Update match scores"
                  >
                    <span className="btn-icon">📊</span>
                    <span className="btn-text">Update Score</span>
                  </button>
                  
                  {match.status !== 'finished' && (
                    <button 
                      className="action-btn finish-btn"
                      onClick={() => {
                        const team1Score = prompt(`Enter final score for ${match.team1}:`, match.team1_score);
                        const team2Score = prompt(`Enter final score for ${match.team2}:`, match.team2_score);
                        
                        if (team1Score !== null && team2Score !== null) {
                          handleFinishMatchAndCalculatePoints(match._id, team1Score, team2Score);
                        }
                      }}
                      title="Finish match and calculate points"
                    >
                      <span className="btn-icon">🏁</span>
                      <span className="btn-text">Finish Match</span>
                    </button>
                  )}
                </div>
                
                <div className="action-section secondary-actions">
                  <button 
                    className="action-btn test-btn"
                    onClick={async () => {
                      const newScore1 = match.team1_score + Math.floor(Math.random() * 3) + 1;
                      const newScore2 = match.team2_score + Math.floor(Math.random() * 3) + 1;
                      console.log(`🧪 Testing live score update: ${match.team1} ${newScore1} - ${newScore2} ${match.team2}`);
                      
                      await handleUpdateLiveScores(match._id, newScore1, newScore2, true);
                    }}
                    title="Test random score update"
                  >
                    <span className="btn-icon">🧪</span>
                    <span className="btn-text">Test Update</span>
                  </button>
                  
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteLiveMatch(match._id)}
                    title="Delete this match"
                  >
                    <span className="btn-icon">🗑️</span>
                    <span className="btn-text">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-matches">
            <div className="no-matches-content">
              <h3>No live matches found</h3>
              <div className="debug-info" style={{marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '12px'}}>
                <h4>Debug Information:</h4>
                <p><strong>User Role:</strong> {user?.role || 'undefined'}</p>
                <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
                <p><strong>Token Exists:</strong> {!!localStorage.getItem('token') ? 'Yes' : 'No'}</p>
                <p><strong>Live Matches Array Length:</strong> {liveMatches.length}</p>
                <p><strong>Admin Endpoint:</strong> {API_ENDPOINTS.ADMIN_LIVE_MATCHES}</p>
                <p><strong>Fallback Endpoint:</strong> {API_ENDPOINTS.LIVE_MATCHES}</p>
                <button 
                  onClick={() => {
                    console.log('🔍 Manual debug - Current state:');
                    console.log('User:', user);
                    console.log('Live matches:', liveMatches);
                    console.log('Loading:', loading);
                    console.log('Is admin:', isAdmin);
                    fetchLiveMatches();
                  }}
                  style={{marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                >
                  🔍 Debug & Retry Fetch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Live Match Modal */}
      {showAddMatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Live Match</h3>
            <form onSubmit={handleAddLiveMatch}>
              <div className="form-group">
                <label>Sport</label>
                <select
                  required
                  value={newMatch.sport}
                  onChange={(e) => setNewMatch({...newMatch, sport: e.target.value})}
                >
                  <option value="">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    required
                    value={newMatch.team1}
                    onChange={(e) => setNewMatch({...newMatch, team1: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    required
                    value={newMatch.team2}
                    onChange={(e) => setNewMatch({...newMatch, team2: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1 Score</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={newMatch.team1_score}
                    onChange={(e) => setNewMatch({...newMatch, team1_score: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Team 2 Score</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={newMatch.team2_score}
                    onChange={(e) => setNewMatch({...newMatch, team2_score: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  required
                  value={newMatch.status}
                  onChange={(e) => setNewMatch({...newMatch, status: e.target.value})}
                >
                  <option value="live">Live</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time (e.g., "First Half", "45'", etc.)</label>
                <input 
                  type="text" 
                  required
                  value={newMatch.time}
                  onChange={(e) => setNewMatch({...newMatch, time: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input 
                  type="text" 
                  required
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({...newMatch, venue: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>URL (optional)</label>
                <input 
                  type="text" 
                  value={newMatch.url}
                  onChange={(e) => setNewMatch({...newMatch, url: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Add Live Match</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddMatch(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Live Match Modal */}
      {editingMatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Live Match</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateLiveMatch(editingMatch._id, editingMatch);
            }}>
              <div className="form-group">
                <label>Sport</label>
                <select
                  required
                  value={editingMatch.sport}
                  onChange={(e) => setEditingMatch({...editingMatch, sport: e.target.value})}
                >
                  <option value="">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    required
                    value={editingMatch.team1}
                    onChange={(e) => setEditingMatch({...editingMatch, team1: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    required
                    value={editingMatch.team2}
                    onChange={(e) => setEditingMatch({...editingMatch, team2: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1 Score</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={editingMatch.team1_score}
                    onChange={(e) => setEditingMatch({...editingMatch, team1_score: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Team 2 Score</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={editingMatch.team2_score}
                    onChange={(e) => setEditingMatch({...editingMatch, team2_score: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  required
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({...editingMatch, status: e.target.value})}
                >
                  <option value="live">Live</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="text" 
                  required
                  value={editingMatch.time}
                  onChange={(e) => setEditingMatch({...editingMatch, time: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input 
                  type="text" 
                  required
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({...editingMatch, venue: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>URL (optional)</label>
                <input 
                  type="text" 
                  value={editingMatch.url || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, url: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Update Match</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setEditingMatch(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && currentMatchForEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Event for {currentMatchForEvent.team1} vs {currentMatchForEvent.team2}</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Time (minutes)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., 45"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Event Type</label>
                <select
                  required
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="">Select Type</option>
                  <option value="goal">Goal</option>
                  <option value="yellow-card">Yellow Card</option>
                  <option value="red-card">Red Card</option>
                  <option value="substitution">Substitution</option>
                  <option value="penalty">Penalty</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Team</label>
                <select
                  required
                  value={newEvent.team}
                  onChange={(e) => setNewEvent({...newEvent, team: e.target.value})}
                >
                  <option value="">Select Team</option>
                  <option value={currentMatchForEvent.team1}>{currentMatchForEvent.team1}</option>
                  <option value={currentMatchForEvent.team2}>{currentMatchForEvent.team2}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Player</label>
                <input 
                  type="text" 
                  required
                  value={newEvent.player}
                  onChange={(e) => setNewEvent({...newEvent, player: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  required
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Add Event</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowAddEvent(false);
                    setCurrentMatchForEvent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Stats Modal */}
      {showUpdateStats && currentMatchForStats && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Stats for {currentMatchForStats.team1} vs {currentMatchForStats.team2}</h3>
            <form onSubmit={handleUpdateStats}>
              <div className="stats-form">
                <div className="stats-header">
                  <div className="stats-team-header">{currentMatchForStats.team1}</div>
                  <div className="stats-label-header">Stat</div>
                  <div className="stats-team-header">{currentMatchForStats.team2}</div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      required
                      value={currentMatchForStats.stats?.possession?.home || 0}
                      onChange={(e) => {
                        const homeValue = parseInt(e.target.value);
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            possession: {
                              home: homeValue,
                              away: 100 - homeValue
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Possession (%)</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      required
                      value={currentMatchForStats.stats?.possession?.away || 0}
                      onChange={(e) => {
                        const awayValue = parseInt(e.target.value);
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            possession: {
                              home: 100 - awayValue,
                              away: awayValue
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots?.home || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots: {
                              ...currentMatchForStats.stats?.shots,
                              home: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Shots</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots?.away || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots: {
                              ...currentMatchForStats.stats?.shots,
                              away: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots_on_target?.home || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots_on_target: {
                              ...currentMatchForStats.stats?.shots_on_target,
                              home: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Shots on Target</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots_on_target?.away || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots_on_target: {
                              ...currentMatchForStats.stats?.shots_on_target,
                              away: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.fouls?.home || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            fouls: {
                              ...currentMatchForStats.stats?.fouls,
                              home: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Fouls</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.fouls?.away || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            fouls: {
                              ...currentMatchForStats.stats?.fouls,
                              away: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Update Stats</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowUpdateStats(false);
                    setCurrentMatchForStats(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
