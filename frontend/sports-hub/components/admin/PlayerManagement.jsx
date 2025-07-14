import React, { useState, useEffect } from 'react';
import './css/player-management.css';

export default function PlayerManagement({ user }) {
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubPlayers, setClubPlayers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerActionLoading, setPlayerActionLoading] = useState(false);
  const [playerActionError, setPlayerActionError] = useState('');

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchClubs();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchClubs = async () => {
    try {
      let url = 'http://localhost:5000/api/clubs';
      if (!isAdmin) {
        // Club leaders can only see their own club
        url = `http://localhost:5000/api/clubs/my-club`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle both array and object responses
        if (data && (Array.isArray(data) || typeof data === 'object')) {
          const clubsData = Array.isArray(data) ? data : [data];
          setClubs(clubsData);
          
          // If club leader, automatically select their club
          if (!isAdmin && clubsData.length === 1) {
            setSelectedClub(clubsData[0]);
            fetchClubPlayers(clubsData[0]._id);
          }
        } else {
          setClubs([]);
        }
      } else {
        setClubs([]);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setClubs([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Fix: Extract users from the data.users property
        setUsers(data.users || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  // Fetch players for a specific club
  const fetchClubPlayers = async (clubId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/clubs/${clubId}/players`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClubPlayers(data.players || []);
        
        // Fix: Make sure we have users before filtering
        if (users && users.length > 0) {
          // Get the IDs of users who are already in the club
          const clubPlayerIds = data.players ? data.players.map(player => player._id) : [];
          
          // Filter available users (those not in any club and not already in this club)
          const availableUsers = users.filter(user => 
            (!user.club || user.club === null) && 
            !clubPlayerIds.includes(user._id) && 
            user.role === 'user'
          );
          setAvailableUsers(availableUsers);
        } else {
          setAvailableUsers([]);
        }
      }
    } catch (error) {
      console.error('Error fetching club players:', error);
      setAvailableUsers([]);
    }
  };

  // Add player to club
  const handleAddPlayer = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPlayer) return;
    setPlayerActionLoading(true);
    setPlayerActionError('');
    try {
      const response = await fetch('http://localhost:5000/api/admin/clubs/add-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: selectedPlayer,
          clubId: selectedClub._id
        })
      });
      if (response.ok) {
        fetchClubPlayers(selectedClub._id);
        setSelectedPlayer('');
        fetchClubs();
      } else {
        const data = await response.json();
        setPlayerActionError(data.message || 'Failed to add player');
      }
    } catch (error) {
      setPlayerActionError('Error adding player to club');
    } finally {
      setPlayerActionLoading(false);
    }
  };

  // Remove player from club
  const handleRemovePlayer = async (userId) => {
    setPlayerActionLoading(true);
    setPlayerActionError('');
    try {
      const response = await fetch('http://localhost:5000/api/admin/clubs/remove-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          clubId: selectedClub._id
        })
      });
      if (response.ok) {
        fetchClubPlayers(selectedClub._id);
        fetchClubs();
      } else {
        const data = await response.json();
        setPlayerActionError(data.message || 'Failed to remove player');
      }
    } catch (error) {
      setPlayerActionError('Error removing player from club');
    } finally {
      setPlayerActionLoading(false);
    }
  };

  // Handle club selection change
  const handleClubChange = (e) => {
    const clubId = e.target.value;
    if (!clubId) {
      setSelectedClub(null);
      setClubPlayers([]);
      setAvailableUsers([]);
      return;
    }
    
    const club = clubs.find(c => c._id === clubId);
    setSelectedClub(club);
    fetchClubPlayers(clubId);
  };

  return (
    <div className="player-management-container">
      <h2>Player Management</h2>
      
      {isAdmin && (
        <div className="club-selector">
          <label>Select Club:</label>
          <select 
            value={selectedClub?._id || ''} 
            onChange={handleClubChange}
          >
            <option value="">Select a club</option>
            {clubs.map(club => (
              <option key={club._id} value={club._id}>{club.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedClub ? (
        <div className="player-management-content">
          <div className="club-info">
            <h3>{selectedClub.name}</h3>
            <p>{selectedClub.description}</p>
          </div>

          <div className="players-section">
            <h4>Current Players</h4>
            {clubPlayers.length === 0 ? (
              <p className="no-players">No players in this club.</p>
            ) : (
              <ul className="players-list">
                {clubPlayers.map(player => (
                  <li key={player._id} className="player-item">
                    <span>{player.name} ({player.email})</span>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemovePlayer(player._id)} 
                      disabled={playerActionLoading}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="add-player-section">
            <h4>Add Player</h4>
            <form onSubmit={handleAddPlayer} className="add-player-form">
              <select 
                value={selectedPlayer} 
                onChange={e => setSelectedPlayer(e.target.value)} 
                disabled={playerActionLoading}
              >
                <option value="">Select User</option>
                {availableUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <button 
                className="add-btn" 
                type="submit" 
                disabled={!selectedPlayer || playerActionLoading}
              >
                Add Player
              </button>
            </form>
            {playerActionError && (
              <div className="error-message">{playerActionError}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-club-selected">
          {isAdmin ? (
            <p>Please select a club to manage its players.</p>
          ) : (
            <p>You don't have any club assigned to manage.</p>
          )}
        </div>
      )}
    </div>
  );
}