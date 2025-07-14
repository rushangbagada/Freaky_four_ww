import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import './css/profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Not Logged In</h2>
          <p>Please log in to view your profile</p>
          <Link to="/login" className="profile-button">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <h2>{user.name || 'User'}</h2>
          <p>{user.email}</p>
        </div>
        
        <div className="profile-details">
          <div className="profile-info-item">
            <span className="label">Username:</span>
            <span className="value">{user.username || 'Not set'}</span>
          </div>
          <div className="profile-info-item">
            <span className="label">Role:</span>
            <span className="value">{user.role || 'User'}</span>
          </div>
        </div>

        <div className="profile-actions">
          {user.role === 'admin' && (
            <Link to="/admin" className="profile-button admin-button">
              Admin Dashboard
            </Link>
          )}
          <button onClick={logout} className="profile-button logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;