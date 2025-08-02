import React from 'react';
import './css/leader.css';

const Leaderboard = ({ users, currentUserId }) => {
  return (
    <div className="leaderboard">
      <h3>Prediction Leaderboard</h3>
      {users.length > 0 ? (
        <ul>
          {users.map((user, index) => (
            <li 
              key={user.id || user._id} 
              className={`${(user.id === currentUserId || user._id === currentUserId) ? 'highlight' : ''} ${index < 3 ? 'top-three' : ''}`}
            >
              <span className="rank">{index + 1}</span>
              <span className="name">{user.name}</span>
              <span className="points">{user.total_point || 0} pts</span>
              {user.accuracy && <span className="accuracy">({user.accuracy}%)</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data">No leaderboard data available</p>
      )}
    </div>
  );
};

export default Leaderboard;
