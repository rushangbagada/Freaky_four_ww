
import React from 'react';
import NewsFeed from './newsfeed';
import './css/blog.css';

const Blog = () => {
  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="hero-background">
          <div className="hero-particles"></div>
          <div className="hero-gradient-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text-container">
            <span className="hero-badge">
              <span className="badge-icon">📰</span>
              Sports Blog
            </span>
            
            <h1 className="hero-title">
              Campus Sports
              <span className="hero-title-highlight"> Stories</span>
            </h1>
            
            <p className="hero-description">
              Dive into the exciting world of campus athletics. From match highlights 
              to player interviews, discover the stories that make our sports community extraordinary.
            </p>
            
            
            <div className="hero-cta">
              <button className="hero-btn primary">
                <span className="btn-text">Explore Stories</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="hero-btn secondary">
                <span className="btn-text">Fun Facts</span>
                <span className="btn-icon">⚡</span>
              </button>
            </div>
          </div>
          
          <div className="hero-cards">
            <div className="stat-card">
                <span className="stat-icon">🏆</span>
                <div className="stat-info">
                    <span className="stat-number">Championship</span>
                    <span className="stat-label">Victory Stories</span>
                </div>
            </div>
            <div className="stat-card">
                <span className="stat-icon">⚽</span>
                <div className="stat-info">
                    <span className="stat-number">Match</span>
                    <span className="stat-label">Highlights</span>
                </div>
            </div>
            <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div className="stat-info">
                    <span className="stat-number">Player</span>
                    <span className="stat-label">Interviews</span>
                </div>
            </div>
          </div>
        </div>
        
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow">↓</div>
          <span className="scroll-text">Scroll to explore</span>
        </div>
      </section>
      
      {/* Content Section */}
      <main className="blog-content">
        <div className="content-container">
          <NewsFeed />
        </div>
      </main>
    </div>
  );
};

export default Blog;
