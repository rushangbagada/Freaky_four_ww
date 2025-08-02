import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/AuthContext';
import { getApiUrl, API_ENDPOINTS } from '../../src/config/api';
import './css/admin-dashboard.css';
import UserManagement from './UserManagement';
import ClubManagement from './ClubManagement';
import MatchManagement from './MatchManagement';
import Analytics from './Analytics';
import GalleryManagement from './GalleryManagement';
import NewsManagement from './NewsManagement';
import LiveMatchManagement from './LiveMatchManagement';
import PlayerManagement from './PlayerManagement';
import QuizManagement from './QuizManagement';
import TurfManagement from './TurfManagement';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClubForPlayers, setSelectedClubForPlayers] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    totalMatches: 0,
    activeLeaders: 0
  });

  useEffect(() => {
    fetchDashboardStats();
    
    // Listen for custom event to switch to player management
    const handleSwitchToPlayerManagement = (event) => {
      setActiveTab('players');
    };
    
    window.addEventListener('switchToPlayerManagement', handleSwitchToPlayerManagement);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('switchToPlayerManagement', handleSwitchToPlayerManagement);
    };
  }, []);

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      const response = await fetch(getApiUrl('/api/admin/dashboard'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received:', data);
        
        setStats({
          totalUsers: data.stats?.totalUsers || 0,
          totalClubs: data.stats?.totalClubs || 0,
          totalMatches: data.stats?.totalMatches || 0,
          activeLeaders: data.recentUsers?.filter(user => user.role === 'club_leader')?.length || 0
        });
      } else {
        const errorText = await response.text();
        console.error('Error response:', response.status, errorText);
        
        // Set default stats if API fails
        setStats({
          totalUsers: 0,
          totalClubs: 0,
          totalMatches: 0,
          activeLeaders: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Set default stats if request fails
      setStats({
        totalUsers: 0,
        totalClubs: 0,
        totalMatches: 0,
        activeLeaders: 0
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user || (user.role !== 'admin' && user.role !== 'club_leader')) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <button 
              className="back-btn" 
              onClick={() => window.location.href = '/'}
              title="Back to Main Site"
            >
              ← Back to Site
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-user-info">
            <span>Welcome, {user.name}</span>
            <span className="role-badge">{user.role}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 User Management
          </button>
        )}
        
        <button 
          className={`nav-btn ${activeTab === 'clubs' ? 'active' : ''}`}
          onClick={() => setActiveTab('clubs')}
        >
          🏆 Club Management
        </button>

        <button 
          className={`nav-btn ${activeTab === 'turf' ? 'active' : ''}`}
          onClick={() => setActiveTab('turf')}
        >
          🌱 Turf Management
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          ⚽ Match Management
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          👤 Player Management
        </button>
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'live-matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('live-matches')}
          >
            🔴 Live Match Management
          </button>
        )}
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            📰 News Management
          </button>
        )}
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        )}
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery Management
          </button>
        )}
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            ❓ Quiz Management
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3>{stats.totalClubs}</h3>
                  <p>Total Clubs</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚽</div>
                <div className="stat-info">
                  <h3>{stats.totalMatches}</h3>
                  <p>Total Matches</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-info">
                  <h3>{stats.activeLeaders}</h3>
                  <p>Active Leaders</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                {isAdmin && (
                  <>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('users')}
                    >
                      Add New User
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('clubs')}
                    >
                      Create Club
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('news')}
                    >
                      Add News
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('live-matches')}
                    >
                      Manage Live Matches
                    </button>
                  </>
                )}
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('matches')}
                >
                  Schedule Match
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    👥
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">2 hours ago</div>
                    <div className="activity-text">New user registered</div>
                    <div className="activity-subtext">john@example.com joined the platform</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    ⚽
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">4 hours ago</div>
                    <div className="activity-text">Match scheduled</div>
                    <div className="activity-subtext">Football match scheduled for tomorrow</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    👑
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">1 day ago</div>
                    <div className="activity-text">Leader assigned</div>
                    <div className="activity-subtext">Basketball club leader assigned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && isAdmin && <UserManagement />}
        {activeTab === 'clubs' && <ClubManagement user={user} onManagePlayersClick={(club) => {
          setSelectedClubForPlayers(club);
          setActiveTab('players');
        }} />}
        {activeTab === 'matches' && <MatchManagement user={user} />}
        {activeTab === 'players' && <PlayerManagement user={user} selectedClubProp={selectedClubForPlayers} />}
        {activeTab === 'live-matches' && isAdmin && <LiveMatchManagement user={user} />}
        {activeTab === 'news' && isAdmin && <NewsManagement user={user} />}
        {activeTab === 'analytics' && isAdmin && <Analytics />}
        {activeTab === 'gallery' && isAdmin && <GalleryManagement user={user} />}
        {activeTab === 'quiz' && isAdmin && <QuizManagement user={user} />}
        {activeTab === 'turf' && <TurfManagement />}
      </main>
    </div>
  );
}
