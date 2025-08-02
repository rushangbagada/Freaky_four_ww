import React from 'react';
import './css/newFooter.css';
import { Link } from 'react-router-dom';

export default function NewFooter() {
  return (
    <footer className="glass-footer">
      {/* Animated Wave SVG */}
      <div className="wave-container">
        <svg className="wave" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path className="wave-path" d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,74.7C672,75,768,85,864,90.7C960,96,1056,96,1152,90.7C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="url(#waveGradient)" />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-section logo-section">
          <div className="logo-icon">🏆</div>
          <div className="logo-text">Campus Sports Hub</div>
          <p className="footer-description">
            Connecting students through the joy of sports.
          </p>
        </div>
        <div className="footer-section links-section">
          <h3>Create Account</h3>
          <ul>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/student-portal">Student Portal</Link></li>
            <li><Link to="/team-registration">Team Registration</Link></li>
            <li><Link to="/coach-access">Coach Access</Link></li>
          </ul>
        </div>
        <div className="footer-section links-section">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/sports-calendar">Sports Calendar</Link></li>
            <li><Link to="/training-guides">Training Guides</Link></li>
            <li><Link to="/equipment-library">Equipment Library</Link></li>
            <li><Link to="/news-updates">News & Updates</Link></li>
          </ul>
        </div>
        <div className="footer-section links-section">
          <h3>Support</h3>
          <ul>
            <li><Link to="/help-center">Help Center</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="footer-section social-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        © {new Date().getFullYear()} Campus Sports Hub
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
      </div>
    </footer>
  );
}