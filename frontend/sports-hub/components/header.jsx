import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/header.css';
import { useAuth } from '../src/AuthContext';

// import { Link, useLocation } from 'react-router-dom';


export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  
  const toggleMenu = () => {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.classList.toggle('show');
    }
  };

  return (
    <>
      <header className="header">
        <div className="container" id ="headerContainer">
          <div className="navbar">
            <Link to="/" className="brand">
              <div className="icon-bg">🏆</div>
              <div className="brand-text">
                <span className="brand-main">Campus Sports</span>
                <span className="brand-sub">Hub</span>
              </div>
            </Link>

            <nav className="nav-desktop">
  <Link to="/" className={`nav-link ${isActive('/')}`}>
    <div className="nav-item">
      <div className="nav-icon">🏠</div>
      <div className="nav-label">Home</div>
    </div>
  </Link>

  <Link to="/sports-clubs" className={`nav-link ${isActive('/sports-clubs')}`}>
    <div className="nav-item">
      <div className="nav-icon">🏃‍♂️</div>
      <div className="nav-label">Sports Clubs</div>
    </div>
  </Link>

  <Link to="/calender" className={`nav-link ${isActive('/calender')}`}>
    <div className="nav-item">
      <div className="nav-icon">📅</div>
      <div className="nav-label">Calendar</div>
    </div>
  </Link>

  <Link to="/result" className={`nav-link ${isActive('/result')}`}>
    <div className="nav-item">
      <div className="nav-icon">🏆</div>
      <div className="nav-label">Results</div>
    </div>
  </Link>

  <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`}>
    <div className="nav-item">
      <div className="nav-icon">🖼️</div>
      <div className="nav-label">Gallery</div>
    </div>
  </Link>

  <Link to="/register" className={`nav-link ${isActive('/register')}`}>
    <div className="nav-item">
      <div className="nav-icon">📝</div>
      <div className="nav-label">Register</div>
    </div>
  </Link>

  <Link to="/aboutus" className={`nav-link ${isActive('/aboutus')}`}>
    <div className="nav-item">
      <div className="nav-icon">ℹ️</div>
      <div className="nav-label">About</div>
    </div>
  </Link>

  <Link to="/gamepage" className={`nav-link ${isActive('/gamepage')}`}>
    <div className="nav-item">
      <div className="nav-icon">🎮</div>
      <div className="nav-label">Game Page</div>
    </div>
  </Link>

  <Link to="/blog" className={`nav-link ${isActive('/blog')}`}>
    <div className="nav-item">
      <div className="nav-icon">📰</div>
      <div className="nav-label">Blog</div>
    </div>
  </Link>

  <Link to="/livesports" className={`nav-link ${isActive('/livesports')}`}>
    <div className="nav-item">
      <div className="nav-icon">📺</div>
      <div className="nav-label">Live Sports</div>
    </div>
  </Link>

  {!isAuthenticated() ? (
    <Link to="/login" className={`nav-link ${isActive('/login')}`}>
      <div className="nav-item">
        <div className="nav-icon">🔐</div>
        <div className="nav-label">Login</div>
      </div>
    </Link>
  ) : (
    <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
      <div className="nav-item">
        <div className="nav-icon">👤</div>
        <div className="nav-label">Profile</div>
      </div>
    </Link>
  )}
</nav>


            <button className="menu-toggle" onClick={toggleMenu}>☰</button>
          </div>

          <div className="nav-mobile" id="mobileMenu">
            <Link to="/" className={`nav-link ${isActive('/')}`}>🏠 Home</Link>
            <Link to="/sports-clubs" className={`nav-link ${isActive('/sports-clubs')}`}>🏃‍♂️ Sports Clubs</Link>
            <Link to="/calender" className={`nav-link ${isActive('/calender')}`}>📅 Calendar</Link>
            <Link to="/result" className={`nav-link ${isActive('/result')}`}>🏆 Results</Link>
            <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`}>🖼️ Gallery</Link>
            <Link to="/register" className={`nav-link ${isActive('/register')}`}>📝 Register</Link>
            <Link to="/aboutus" className={`nav-link ${isActive('/aboutus')}`}>ℹ️ About</Link>
            <Link to="/gamepage" className={`nav-link ${isActive('/gamepage')}`}>🎮 Game Page</Link>
            <Link to="/blog" className={`nav-link ${isActive('/blog')}`}>📰 Blog</Link>
            <Link to="/livesports" className={`nav-link ${isActive('/livesports')}`}>📺 Live Sports</Link>
            {!isAuthenticated() ? (
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>🔐 Login</Link>
            ) : (
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>👤 Profile</Link>
            )}

          </div>
        </div>
      </header>
    </>
  );
}
