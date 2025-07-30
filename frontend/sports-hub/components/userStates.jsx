import React from 'react';
import './css/userStates.css';

const UserStats = ({ user, predictionUser }) => {
  // Use predictionUser data if available, fallback to user data
  const displayUser = predictionUser || user;
  
  return (
    <div className="user-stats">
      <h3>Your Stats</h3>
      <div className="stats-content">
        <p><strong>Name:</strong> {displayUser?.name || 'N/A'}</p>
        <p><strong>Points:</strong> {displayUser?.total_point || 0}</p>
        <p><strong>Predictions:</strong> {displayUser?.prediction || 0}</p>
        <p><strong>Accuracy:</strong> {displayUser?.accuracy || 0}%</p>
        <p><strong>Wins:</strong> {displayUser?.wins || 0}</p>
        <p><strong>Streak:</strong> {displayUser?.streak || 0}</p>
      </div>
    </div>
  );
};

export default UserStats;
