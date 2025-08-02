import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../src/config/api';
import './css/player-management.css';

export default function PlayerManagement({ user, selectedClubProp }) {
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubPlayers, setClubPlayers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerActionLoading, setPlayerActionLoading] = useState(false);
  const [playerActionError, setPlayerActionError] = useState('');
  const [addPlayerMode, setAddPlayerMode] = useState('new'); // 'existing' or 'new'
  const [newPlayerData, setNewPlayerData] = useState({
    name: '',
    email: '',
    mobile: '',
    year: 'first year',
    department: '',
    position: ''
  });

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchClubs();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedClubProp) {
      setSelectedClub(selectedClubProp);
      fetchClubPlayers(selectedClubProp._id);
    }
  }, [selectedClubProp, users]);

  useEffect(() => {
    if (!selectedClubProp) {
      const selectedClubId = localStorage.getItem('selectedClubId');
      if (selectedClubId && clubs.length > 0) {
        const club = clubs.find(c => c._id === selectedClubId);
        if (club) {
          setSelectedClub(club);
          fetchClubPlayers(selectedClubId);
          localStorage.removeItem('selectedClubId');
        }
      }
    }
  }, [clubs, selectedClubProp]);

  const fetchClubs = async () => {
    try {
      let url = getApiUrl('/api/clubs');
      if (!isAdmin) {
        url = getApiUrl('/api/clubs/my-club');
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const clubsData = Array.isArray(data) ? data : [data];
        setClubs(clubsData);

        if (!isAdmin && clubsData.length === 1) {
          setSelectedClub(clubsData[0]);
          fetchClubPlayers(clubsData[0]._id);
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
      const response = await fetch(getApiUrl('/api/admin/users'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchClubPlayers = async (clubId) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/clubs/${clubId}/players`), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClubPlayers(data.players || []);

        if (users && users.length > 0) {
          const clubPlayerIds = data.players ? data.players.map(player => player._id) : [];
          const available = users.filter(user =>
            (!user.club || user.club === null) &&
            !clubPlayerIds.includes(user._id) &&
            user.role === 'user'
          );
          setAvailableUsers(available);
        } else {
          setAvailableUsers([]);
        }
      }
    } catch (error) {
      console.error('Error fetching club players:', error);
      setAvailableUsers([]);
    }
  };

  const handleAddExistingPlayer = async (e) => {
    e.preventDefault();
    if (!selectedPlayer) return;
    setPlayerActionLoading(true);
    setPlayerActionError('');
    try {
      const response = await fetch(getApiUrl('/api/admin/clubs/add-player'), {
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

  const handleAddNewPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerData.name || !newPlayerData.email) {
      setPlayerActionError('Name and email are required');
      return;
    }
    setPlayerActionLoading(true);
    setPlayerActionError('');
    try {
      const response = await fetch(getApiUrl('/api/admin/clubs/add-new-player'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          playerData: newPlayerData,
          clubId: selectedClub._id
        })
      });
      if (response.ok) {
        fetchClubPlayers(selectedClub._id);
        setNewPlayerData({
          name: '',
          email: '',
          mobile: '',
          year: 'first year',
          department: '',
          position: ''
        });
        fetchClubs();
      } else {
        const data = await response.json();
        setPlayerActionError(data.message || 'Failed to add new player');
      }
    } catch (error) {
      setPlayerActionError('Error adding new player to club');
    } finally {
      setPlayerActionLoading(false);
    }
  };

  const handleRemovePlayer = async (userId) => {
    setPlayerActionLoading(true);
    setPlayerActionError('');
    try {
      const response = await fetch(getApiUrl('/api/admin/clubs/remove-player'), {
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
            <h4>Current Players ({clubPlayers.length})</h4>
            {clubPlayers.length === 0 ? (
              <p className="no-players">No players in this club.</p>
            ) : (
              <div className="player-cards-container">
                {clubPlayers.map(player => (
                  <div key={player._id} className="player-card">
                    <div className="player-info">
                      <span className="player-name">{player.name}</span>
                      <span className="player-email">{player.email}</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemovePlayer(player._id)}
                      disabled={playerActionLoading}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="add-player-section">
            <h4>Add Player</h4>

            <div className="add-player-mode-selector">
              <label className={addPlayerMode === 'new' ? 'active' : ''}>
                <input
                  type="radio"
                  value="new"
                  checked={addPlayerMode === 'new'}
                  onChange={(e) => setAddPlayerMode(e.target.value)}
                />
                <span>Add New Player</span>
              </label>
              <label className={addPlayerMode === 'existing' ? 'active' : ''}>
                <input
                  type="radio"
                  value="existing"
                  checked={addPlayerMode === 'existing'}
                  onChange={(e) => setAddPlayerMode(e.target.value)}
                />
                <span>Add Existing User</span>
              </label>
            </div>

            {addPlayerMode === 'new' ? (
              <form onSubmit={handleAddNewPlayer} className="add-new-player-form">
                 <div className="form-row">
                  <input
                    type="text"
                    placeholder="Player Name *"
                    value={newPlayerData.name}
                    onChange={(e) => setNewPlayerData({...newPlayerData, name: e.target.value})}
                    disabled={playerActionLoading}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newPlayerData.email}
                    onChange={(e) => setNewPlayerData({...newPlayerData, email: e.target.value})}
                    disabled={playerActionLoading}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={newPlayerData.mobile}
                    onChange={(e) => setNewPlayerData({...newPlayerData, mobile: e.target.value})}
                    disabled={playerActionLoading}
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={newPlayerData.department}
                    onChange={(e) => setNewPlayerData({...newPlayerData, department: e.target.value})}
                    disabled={playerActionLoading}
                  />
                </div>
                <div className="form-row">
                  <select
                    value={newPlayerData.year}
                    onChange={(e) => setNewPlayerData({...newPlayerData, year: e.target.value})}
                    disabled={playerActionLoading}
                  >
                    <option value="first year">First Year</option>
                    <option value="second year">Second Year</option>
                    <option value="third year">Third Year</option>
                    <option value="fourth year">Fourth Year</option>
                    <option value="alumni">Alumni</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Position (e.g., Forward, Midfielder)"
                    value={newPlayerData.position}
                    onChange={(e) => setNewPlayerData({...newPlayerData, position: e.target.value})}
                    disabled={playerActionLoading}
                  />
                </div>
                <button
                  className="add-btn"
                  type="submit"
                  disabled={!newPlayerData.name || !newPlayerData.email || playerActionLoading}
                >
                  {playerActionLoading ? 'Adding...' : 'Add Player'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddExistingPlayer} className="add-player-form">
                <div className="existing-user-section">
                  <select
                    value={selectedPlayer}
                    onChange={e => setSelectedPlayer(e.target.value)}
                    disabled={playerActionLoading}
                    className="user-select"
                  >
                    <option value="">Select a registered user</option>
                    {availableUsers.length === 0 ? (
                      <option disabled>No available users found</option>
                    ) : (
                      availableUsers.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))
                    )}
                  </select>
                  <button
                    className="add-btn"
                    type="submit"
                    disabled={!selectedPlayer || playerActionLoading || availableUsers.length === 0}
                  >
                    {playerActionLoading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
                {availableUsers.length === 0 && (
                  <p className="no-users-message">
                    No available users to add. Users must be registered and not already belong to a club.
                  </p>
                )}
              </form>
            )}

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

