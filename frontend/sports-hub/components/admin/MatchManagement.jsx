import React, { useState, useEffect } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../../src/config/api';
import './css/match-management.css';

export default function MatchManagement({ user }) {
  const [matches, setMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    date: '',
    venue: '',
    category: '',
    team1_score: 0,
    team2_score: 0,
    mvp: '',
    status: 'scheduled'
  });

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchMatches();
    fetchClubs();
  }, []);

  const fetchMatches = async () => {
    console.log('⚽ [MATCH MGMT] Fetching matches...');
    setLoading(true);
    
    try {
      // Try admin matches endpoint first (for comprehensive data)
      let response;
      let data = [];
      
      if (isAdmin) {
        console.log('⚽ [MATCH MGMT] Fetching from admin endpoint...');
        response = await fetch(getApiUrl(API_ENDPOINTS.ADMIN_MATCHES), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          data = await response.json();
          console.log('✅ [MATCH MGMT] Admin matches fetched:', data);
        } else {
          console.warn('⚠️ [MATCH MGMT] Admin endpoint failed, trying fallback...');
        }
      }
      
      // If admin endpoint failed or user is not admin, try regular endpoints
      if (!response || !response.ok || !data || data.length === 0) {
        console.log('⚽ [MATCH MGMT] Trying regular matches endpoints...');
        
        // Try multiple endpoints to get comprehensive match data
        const endpoints = [
          '/api/matches',
          API_ENDPOINTS.RECENT_MATCHES,
          API_ENDPOINTS.UPCOMING_MATCHES,
          '/api/result'
        ];
        
        let allMatches = [];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`⚽ [MATCH MGMT] Trying endpoint: ${endpoint}`);
            const resp = await fetch(getApiUrl(endpoint), {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (resp.ok) {
              const endpointData = await resp.json();
              console.log(`✅ [MATCH MGMT] Data from ${endpoint}:`, endpointData);
              
              if (Array.isArray(endpointData)) {
                allMatches = [...allMatches, ...endpointData];
              } else if (endpointData && typeof endpointData === 'object') {
                allMatches.push(endpointData);
              }
            }
          } catch (endpointError) {
            console.warn(`⚠️ [MATCH MGMT] Endpoint ${endpoint} failed:`, endpointError);
          }
        }
        
        data = allMatches;
      }
      
      // Remove duplicates based on _id or id
      const uniqueMatches = data.filter((match, index, self) => {
        const id = match._id || match.id;
        return index === self.findIndex(m => (m._id || m.id) === id);
      });
      
      console.log('✅ [MATCH MGMT] Final matches data:', uniqueMatches);
      setMatches(uniqueMatches || []);
      
    } catch (error) {
      console.error('❌ [MATCH MGMT] Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await fetch(getApiUrl('/api/clubs'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClubs(Array.isArray(data) ? data : (data ? [data] : []));
      } else {
        setClubs([]);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setClubs([]);
    }
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();
    console.log('⚽ [MATCH MGMT] Adding new match:', newMatch);
    
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.ADMIN_MATCHES), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newMatch)
      });
      
      console.log('⚽ [MATCH MGMT] Add match response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ [MATCH MGMT] Match added successfully:', result);
        
        setShowAddMatch(false);
        setNewMatch({
          team1: '',
          team2: '',
          date: '',
          venue: '',
          category: '',
          team1_score: 0,
          team2_score: 0,
          mvp: '',
          status: 'scheduled'
        });
        
        // Refresh matches list
        await fetchMatches();
        alert('Match added successfully!');
      } else {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }
        
        console.error('❌ [MATCH MGMT] Failed to add match:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage
        });
        
        alert(`Failed to add match: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ [MATCH MGMT] Network error adding match:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  const handleUpdateMatch = async (matchId, updatedData) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/matches/${matchId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingMatch(null);
        fetchMatches();
      }
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        if (!matchId) {
          alert('Invalid match ID');
          return;
        }
        
        const endpoint = isAdmin 
          ? getApiUrl(`/api/admin/matches/${matchId}`) 
          : getApiUrl(`/api/admin/my-matches/${matchId}`);
        
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          fetchMatches();
          alert('Match deleted successfully!');
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          alert(`Failed to delete match: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting match:', error);
        alert('Failed to delete match. Please try again.');
      }
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      (match.team1 && match.team1.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (match.team2 && match.team2.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (match.venue && match.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || (match.status && match.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'scheduled';
      case 'ongoing': return 'ongoing';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'scheduled';
    }
  };

  if (loading) {
    return <div className="loading">Loading matches...</div>;
  }

  return (
    <div className="match-management">
      <div className="match-management-header">
        <h2>Match Management</h2>
        <div className="header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="refresh-btn"
            onClick={fetchMatches}
            style={{
              background: 'transparent',
              color: 'var(--accent-blue)',
              border: '1px solid var(--accent-blue)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            disabled={loading}
          >
            <span style={{ transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform 1s ease' }}>🔄</span>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            className="add-match-btn"
            onClick={() => setShowAddMatch(true)}
          >
            + Schedule New Match
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Match Statistics Summary */}
      <div className="match-stats-summary" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="stat-card" style={{
          background: 'var(--card-dark)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>⚽</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{matches.length}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Matches</div>
        </div>
        
        <div className="stat-card" style={{
          background: 'var(--card-dark)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>📅</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {matches.filter(m => m.status === 'scheduled').length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Scheduled</div>
        </div>
        
        <div className="stat-card" style={{
          background: 'var(--card-dark)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--accent-finished)', marginBottom: '0.5rem' }}>✅</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {matches.filter(m => m.status === 'completed').length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Completed</div>
        </div>
        
        <div className="stat-card" style={{
          background: 'var(--card-dark)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', color: 'var(--accent-live)', marginBottom: '0.5rem' }}>🔴</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {matches.filter(m => m.status === 'ongoing').length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Live</div>
        </div>
      </div>

      {/* Matches List */}
      <div className="matches-list">
        {loading ? (
          <div className="loading-container" style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="no-matches-container" style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-secondary)',
            background: 'var(--card-dark)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚽</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {matches.length === 0 ? 'No matches yet' : 'No matches found'}
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              {matches.length === 0 
                ? "Get started by scheduling your first match!"
                : `No matches match your current filters (${filterStatus} status${searchTerm ? `, "${searchTerm}" search` : ''}).`
              }
            </p>
            {matches.length === 0 && (
              <button 
                className="add-match-btn"
                onClick={() => setShowAddMatch(true)}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                + Schedule Your First Match
              </button>
            )}
            {matches.length > 0 && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                style={{
                  background: 'transparent',
                  color: 'var(--accent-blue)',
                  border: '1px solid var(--accent-blue)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredMatches.map(match => (
            <div key={match._id} className="match-card">
            <div className="match-header">
              <h3>{match.team1} vs {match.team2}</h3>
              <span className={`status-badge ${getStatusColor(match.status || 'scheduled')}`}>
                {match.status || 'scheduled'}
              </span>
            </div>

            <div className="match-details">
              <div className="match-teams">
                <div className="team">
                  <span className="team-name">{match.team1 || 'TBD'}</span>
                  <span className="vs">vs</span>
                  <span className="team-name">{match.team2 || 'TBD'}</span>
                </div>
              </div>
              
              <div className="match-info">
                <div className="info-item">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(match.date).toLocaleDateString()}</span>
                </div>

                {match.time && (
                  <div className="info-item">
                    <span className="label">Time:</span>
                    <span className="value">{match.time}</span>
                  </div>
                )}

                <div className="info-item">
                  <span className="label">Venue:</span>
                  <span className="value">{match.venue}</span>
                </div>

                {match.description && (
                  <div className="info-item">
                    <span className="label">Description:</span>
                    <span className="value">{match.description}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="match-actions">
              <button
                className="edit-btn"
                onClick={() => setEditingMatch(match)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteMatch(match._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Match Modal */}
      {showAddMatch && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Schedule New Match</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddMatch(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddMatch} className="match-form">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newMatch.category}
                  onChange={(e) => setNewMatch({...newMatch, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                    required
                  />
                </div>
                

              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({...newMatch, venue: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    value={newMatch.team1}
                    onChange={(e) => setNewMatch({...newMatch, team1: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    value={newMatch.team2}
                    onChange={(e) => setNewMatch({...newMatch, team2: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>
                        {club.name}
                      </option>
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
                    value={newMatch.team1_score}
                    onChange={(e) => setNewMatch({...newMatch, team1_score: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Team 2 Score</label>
                  <input
                    type="number"
                    min="0"
                    value={newMatch.team2_score}
                    onChange={(e) => setNewMatch({...newMatch, team2_score: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>MVP (Most Valuable Player)</label>
                <input
                  type="text"
                  value={newMatch.mvp}
                  onChange={(e) => setNewMatch({...newMatch, mvp: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newMatch.status}
                  onChange={(e) => setNewMatch({...newMatch, status: e.target.value})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Schedule Match</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddMatch(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Match</h3>
              <button 
                className="close-btn"
                onClick={() => setEditingMatch(null)}
              >
                ×
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateMatch(editingMatch._id, editingMatch);
              }} 
              className="match-form"
            >
              <div className="form-group">
                <label>Match Title</label>
                <input
                  type="text"
                  value={editingMatch.title}
                  onChange={(e) => setEditingMatch({...editingMatch, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={editingMatch.date.split('T')[0]}
                    onChange={(e) => setEditingMatch({...editingMatch, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={editingMatch.time}
                    onChange={(e) => setEditingMatch({...editingMatch, time: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({...editingMatch, venue: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    value={editingMatch.team1 || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, team1: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    value={editingMatch.team2 || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, team2: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingMatch.description || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({...editingMatch, status: e.target.value})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Update Match</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingMatch(null)}
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

