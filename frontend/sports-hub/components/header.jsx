import React from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';
import { useAuth } from '../src/AuthContext';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  
  const toggleMenu = () => {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.classList.toggle('show');
    }
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="navbar">
            <Link to="/" className="brand">
              <div className="icon-bg">🏆</div>
              <div className="brand-text">
                <span className="brand-main">Campus Sports</span>
                <span className="brand-sub">Hub</span>
              </div>
            </Link>

            <nav className="nav-desktop">
              <Link to="/" className="nav-link active">🏆 Home</Link>
              <Link to="/sports-clubs" className="nav-link">👥 Sports Clubs</Link>
              <Link to="/calender" className="nav-link">🗓️ Calendar</Link>
              <Link to="/result" className="nav-link">🏅 Results</Link>
              <Link to="/gallery" className="nav-link">📸 Gallery</Link>
              <Link to="/register" className="nav-link">👤 Register</Link>
              <Link to="/aboutus" className="nav-link">ℹ️ About</Link>
              <Link to="/gamepage" className="nav-link">ℹ️ gamepage</Link>
              <Link to="/blog" className="nav-link">ℹ️ blog</Link>
              <Link to="/livesports" className="nav-link">ℹ️ livesports</Link>
              {!isAuthenticated() ? (
                <Link to="/login" className="nav-link">ℹ️ login</Link>
              ) : (
                <Link to="/profile" className="nav-link">👤 Profile</Link>
              )}
            </nav>

            <button className="menu-toggle" onClick={toggleMenu}>☰</button>
          </div>

          <div className="nav-mobile" id="mobileMenu">
            <Link to="/" className="nav-link active">🏆 Home</Link>
            <Link to="/sports-clubs" className="nav-link">👥 Sports Clubs</Link>
            <Link to="/calender" className="nav-link">🗓️ Calendar</Link>
            <Link to="/result" className="nav-link">🏅 Results</Link>
            <Link to="/gallery" className="nav-link">📸 Gallery</Link>
            <Link to="/register" className="nav-link">👤 Register</Link>
            <Link to="/aboutus" className="nav-link">ℹ️ About</Link>
            <Link to="/gamepage" className="nav-link">ℹ️ gamepage</Link>
            <Link to="/blog" className="nav-link">ℹ️ blog</Link>
            <Link to="/livesports" className="nav-link">ℹ️ livesports</Link>
            {!isAuthenticated() ? (
              <Link to="/login" className="nav-link">ℹ️ login</Link>
            ) : (
              <Link to="/profile" className="nav-link">👤 Profile</Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
