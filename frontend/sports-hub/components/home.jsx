import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/home.css';
import './css/animations.css';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [sports, setSports] = useState([]);
  const [stats] = useState({
    totalMembers: 2840,
    activeSports: 18,
    weeklyEvents: 45,
    trophiesWon: 89
  });

  useEffect(() => {
    // Mock data for demonstration
    setFeaturedEvents([
      {
        id: 1,
        title: "Championship Finals",
        sport: "Basketball",
        date: "2024-02-15",
        time: "19:00",
        venue: "Main Arena",
        teams: ["Eagles", "Tigers"]
      },
      {
        id: 2,
        title: "Soccer Tournament",
        sport: "Soccer",
        date: "2024-02-18",
        time: "16:30",
        venue: "Sports Complex",
        teams: ["Lions", "Wolves"]
      },
      {
        id: 3,
        title: "Swimming Gala",
        sport: "Swimming",
        date: "2024-02-20",
        time: "14:00",
        venue: "Aquatic Center",
        teams: ["Dolphins", "Sharks"]
      }
    ]);

    setAchievements([
      { title: "Regional Champions", sport: "Basketball", year: "2024" },
      { title: "Best Team Spirit", sport: "Volleyball", year: "2023" },
      { title: "Most Improved Club", sport: "Tennis", year: "2023" }
    ]);

    setSports([
      { name: "Basketball", icon: "🏀", members: 180, active: true },
      { name: "Soccer", icon: "⚽", members: 220, active: true },
      { name: "Tennis", icon: "🎾", members: 95, active: true },
      { name: "Swimming", icon: "🏊", members: 140, active: true },
      { name: "Volleyball", icon: "🏐", members: 110, active: true },
      { name: "Track & Field", icon: "🏃", members: 85, active: true }
    ]);
  }, []);

  return (
    <div className="container">
      {/* Darker Sports Background with New Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #030712 0%, #0c1426 30%, #1a1a2e 60%, #0c1426 90%, #030712 100%)',
        backgroundSize: '600% 600%',
        animation: 'gradientShift 12s ease infinite'
      }}>
        {/* Darker Stadium Lights Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(ellipse 600px 300px at 15% 5%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 400px 200px at 85% 95%, rgba(168, 85, 247, 0.06) 0%, transparent 65%),
            radial-gradient(ellipse 350px 175px at 35% 70%, rgba(34, 197, 94, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 250px 125px at 75% 25%, rgba(251, 191, 36, 0.07) 0%, transparent 55%)
          `,
          animation: 'stadiumLights 14s ease-in-out infinite'
        }}></div>
        
        {/* Organic Flow Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(ellipse 400px 200px at 10% 20%, rgba(34, 197, 94, 0.02) 0%, transparent 80%),
            radial-gradient(ellipse 300px 600px at 90% 80%, rgba(59, 130, 246, 0.015) 0%, transparent 75%),
            radial-gradient(ellipse 500px 250px at 60% 40%, rgba(168, 85, 247, 0.01) 0%, transparent 70%),
            conic-gradient(from 45deg at 30% 70%, transparent 0deg, rgba(34, 197, 94, 0.008) 90deg, transparent 180deg),
            conic-gradient(from 180deg at 70% 30%, transparent 0deg, rgba(59, 130, 246, 0.01) 120deg, transparent 240deg)
          `,
          animation: 'organicFlow 18s ease-in-out infinite'
        }}></div>
        
        {/* Particle Effects */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle 2px at 15% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle 1px at 85% 15%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle 3px at 70% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle 2px at 30% 85%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle 1px at 50% 40%, rgba(251, 191, 36, 0.12) 0%, transparent 50%)
          `,
          animation: 'particles 20s linear infinite'
        }}></div>
        
        {/* Moving Streaks */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 25%, transparent 50%),
            linear-gradient(-45deg, transparent 0%, rgba(168, 85, 247, 0.03) 30%, transparent 70%)
          `,
          animation: 'streaks 10s ease-in-out infinite'
        }}></div>
        
        {/* Floating Sports Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.4)',
          animation: 'float 6s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.5)',
          animation: 'float 8s ease-in-out infinite reverse',
          boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '70%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(251, 191, 36, 0.6)',
          animation: 'float 5s ease-in-out infinite',
          boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)'
        }}></div>
        
        {/* Energy Waves */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.02) 0%, transparent 70%)',
          animation: 'energyWave 15s linear infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 70%)',
          animation: 'energyWave 12s linear infinite reverse'
        }}></div>
        
        {/* Additional Atmospheric Layers */}
        {/* Nebula-like clouds */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '25%',
          width: '300px',
          height: '180px',
          background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.03) 0%, rgba(59, 130, 246, 0.015) 40%, transparent 80%)',
          borderRadius: '60% 40% 70% 30%',
          animation: 'cloudDrift 25s ease-in-out infinite',
          transform: 'rotate(-15deg)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '10%',
          width: '250px',
          height: '150px',
          background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.025) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 85%)',
          borderRadius: '50% 60% 40% 70%',
          animation: 'cloudDrift 20s ease-in-out infinite reverse',
          transform: 'rotate(25deg)'
        }}></div>
        
        {/* Scattered light dots */}
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '15%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.6)',
          animation: 'twinkle 4s ease-in-out infinite',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '55%',
          right: '30%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.7)',
          animation: 'twinkle 6s ease-in-out infinite 1s',
          boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '40%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'rgba(251, 191, 36, 0.5)',
          animation: 'twinkle 5s ease-in-out infinite 2s',
          boxShadow: '0 0 12px rgba(251, 191, 36, 0.3)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '40%',
          left: '60%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.8)',
          animation: 'twinkle 7s ease-in-out infinite 0.5s',
          boxShadow: '0 0 6px rgba(168, 85, 247, 0.6)'
        }}></div>
        
        {/* Ambient light rays */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          width: '2px',
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
          transform: 'rotate(25deg)',
          animation: 'lightRay 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '35%',
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to top, rgba(34, 197, 94, 0.08) 0%, transparent 100%)',
          transform: 'rotate(-35deg)',
          animation: 'lightRay 10s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          width: '1.5px',
          height: '100px',
          background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.06) 0%, transparent 100%)',
          transform: 'rotate(60deg)',
          animation: 'lightRay 12s ease-in-out infinite 4s'
        }}></div>
        
        {/* Subtle geometric shapes */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '25%',
          width: '40px',
          height: '40px',
          background: 'conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.02), transparent)',
          borderRadius: '50%',
          animation: 'geometricSpin 20s linear infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '35%',
          right: '45%',
          width: '30px',
          height: '30px',
          background: 'conic-gradient(from 45deg, transparent, rgba(168, 85, 247, 0.015), transparent)',
          borderRadius: '50%',
          animation: 'geometricSpin 15s linear infinite reverse'
        }}></div>
        
        {/* Depth layers */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle 800px at 5% 15%, rgba(59, 130, 246, 0.005) 0%, transparent 60%),
            radial-gradient(circle 600px at 95% 85%, rgba(34, 197, 94, 0.008) 0%, transparent 65%),
            radial-gradient(circle 400px at 25% 75%, rgba(168, 85, 247, 0.003) 0%, transparent 70%)
          `,
          animation: 'depthShift 30s ease-in-out infinite'
        }}></div>
        
        {/* Advanced Cinematic Elements */}
        {/* Flowing aurora-like streams */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: '120%',
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 20%, rgba(168, 85, 247, 0.15) 50%, rgba(34, 197, 94, 0.08) 80%, transparent 100%)',
          borderRadius: '50px',
          animation: 'auroraFlow 16s ease-in-out infinite',
          transform: 'rotate(-5deg)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          right: '-10%',
          width: '110%',
          height: '2px',
          background: 'linear-gradient(-90deg, transparent 0%, rgba(251, 191, 36, 0.12) 30%, rgba(59, 130, 246, 0.08) 70%, transparent 100%)',
          borderRadius: '50px',
          animation: 'auroraFlow 20s ease-in-out infinite reverse',
          transform: 'rotate(8deg)'
        }}></div>
        
        {/* Constellation-like dot clusters */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '20%',
          width: '80px',
          height: '60px',
          background: `
            radial-gradient(circle 1px at 10% 20%, rgba(59, 130, 246, 0.8) 0%, transparent 30%),
            radial-gradient(circle 1.5px at 60% 10%, rgba(168, 85, 247, 0.6) 0%, transparent 40%),
            radial-gradient(circle 0.8px at 80% 40%, rgba(251, 191, 36, 0.9) 0%, transparent 25%),
            radial-gradient(circle 1.2px at 30% 70%, rgba(34, 197, 94, 0.7) 0%, transparent 35%),
            radial-gradient(circle 0.6px at 90% 80%, rgba(59, 130, 246, 0.5) 0%, transparent 20%)
          `,
          animation: 'constellation 12s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          width: '70px',
          height: '50px',
          background: `
            radial-gradient(circle 1px at 20% 30%, rgba(34, 197, 94, 0.9) 0%, transparent 30%),
            radial-gradient(circle 1.3px at 70% 20%, rgba(251, 191, 36, 0.7) 0%, transparent 35%),
            radial-gradient(circle 0.9px at 50% 80%, rgba(168, 85, 247, 0.8) 0%, transparent 28%),
            radial-gradient(circle 0.7px at 10% 90%, rgba(59, 130, 246, 0.6) 0%, transparent 22%)
          `,
          animation: 'constellation 15s ease-in-out infinite 3s'
        }}></div>
        
        {/* Smooth morphing blobs */}
        <div style={{
          position: 'absolute',
          top: '35%',
          right: '8%',
          width: '120px',
          height: '80px',
          background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.04) 0%, rgba(168, 85, 247, 0.02) 50%, transparent 80%)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          animation: 'morphingBlob 18s ease-in-out infinite',
          filter: 'blur(1px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '25%',
          width: '100px',
          height: '90px',
          background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.03) 0%, rgba(251, 191, 36, 0.015) 60%, transparent 85%)',
          borderRadius: '40% 60% 70% 30% / 50% 60% 40% 50%',
          animation: 'morphingBlob 22s ease-in-out infinite reverse',
          filter: 'blur(0.5px)'
        }}></div>
        
        {/* Floating energy orbs with trails */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '40%',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)',
          animation: 'orbitalMove 14s ease-in-out infinite',
          boxShadow: `
            0 0 20px rgba(59, 130, 246, 0.4),
            0 0 40px rgba(59, 130, 246, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1)
          `
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%)',
            transform: 'translateX(-100%) translateY(-50%)',
            borderRadius: '2px',
            animation: 'energyTrail 14s ease-in-out infinite'
          }}></div>
        </div>
        
        {/* Prismatic light effects */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '30%',
          width: '200px',
          height: '100px',
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg,
              rgba(59, 130, 246, 0.03) 60deg,
              rgba(168, 85, 247, 0.025) 120deg,
              rgba(34, 197, 94, 0.02) 180deg,
              rgba(251, 191, 36, 0.03) 240deg,
              rgba(59, 130, 246, 0.025) 300deg,
              transparent 360deg
            )
          `,
          borderRadius: '50%',
          animation: 'prismaticSpin 25s linear infinite',
          filter: 'blur(2px)',
          opacity: 0.7
        }}></div>
        
        {/* Ripple effects */}
        <div style={{
          position: 'absolute',
          bottom: '40%',
          right: '25%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          animation: 'rippleExpand 8s ease-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '40%',
          right: '25%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '1px solid rgba(168, 85, 247, 0.08)',
          animation: 'rippleExpand 8s ease-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '40%',
          right: '25%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '1px solid rgba(34, 197, 94, 0.06)',
          animation: 'rippleExpand 8s ease-out infinite 4s'
        }}></div>
        
        {/* Subtle gradient waves */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(45deg, 
              transparent 0%, 
              rgba(59, 130, 246, 0.005) 25%, 
              transparent 50%, 
              rgba(168, 85, 247, 0.003) 75%, 
              transparent 100%
            )
          `,
          animation: 'gradientWave 35s ease-in-out infinite'
        }}></div>
        
        {/* Floating geometric shapes */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          width: '12px',
          height: '12px',
          background: 'rgba(251, 191, 36, 0.3)',
          borderRadius: '2px',
          animation: 'geometricFloat 11s ease-in-out infinite',
          transform: 'rotate(45deg)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          width: '8px',
          height: '16px',
          background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.4) 0%, transparent 100%)',
          borderRadius: '4px',
          animation: 'geometricFloat 13s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '60%',
          width: '10px',
          height: '10px',
          background: 'rgba(168, 85, 247, 0.35)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          animation: 'geometricFloat 9s ease-in-out infinite 4s'
        }}></div>
      </div>
      
{/* Hero Section */}
      <section className="hero fade-in">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="gradient-text">Welcome to the Future of Sports</h1>
          <p>
            Where athletes of all levels come to enhance their skills and reach new heights.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn primary smooth-hover btn-press">Get Involved Today →</Link>
            <Link to="/sports-clubs" className="btn secondary smooth-hover btn-press">Discover Your Team</Link>
          </div>
        </div>
      </section>

{/* Popular Sports Clubs */}
      <section className="section sports slide-in-left">
        <div className="section-header">
          <h2>Explore Top Clubs</h2>
          <p>Join a club, enhance your game, and achieve greatness</p>
        </div>
        <div className="cards">
          {sports.map((item, index) => (
            <div className="card smooth-hover stagger-item" key={index}>
              <div className="icon">{item.icon}</div>
              <h3>{item.name}</h3>
              <p>Join our {item.name.toLowerCase()} community and compete at the highest level</p>
              <div className="card-meta">
                <span>Members: {item.members}</span>
                <span>Status: {item.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="section matches slide-in-right">
        <div className="section-header">
          <h2>Upcoming Matches</h2>
          <p>Don't miss out on the action - mark your calendar</p>
        </div>
        <div className="cards">
          {featuredEvents.map((item, index) => (
            <div className="match-card smooth-hover stagger-item" key={index}>
              <div className="match-date">
                <span className="day">{new Date(item.date).getDate()}</span>
                <span className="month">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className="match-info">
                <h3>{item.title}</h3>
                <p className="teams">{item.teams.join(' vs ')}</p>
                <p className="venue">📍 {item.venue}</p>
                <span className="time">⏰ {item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Results */}
      <section className="section results slide-in-right">
        <div className="section-header white">
          <h2>Latest Victories</h2>
          <p>Relive the excitement of our recent games</p>
        </div>
        <div className="cards">
          {achievements.map((item, index) => (
            <div className="result-card smooth-hover stagger-item" key={index}>
              <h3>{item.sport}</h3>
              <p className="score">{item.title}</p>
              <p className="opponent">{item.year}</p>
              <div className="status win">
                Champion
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section stats fade-in">
        <div className="section-header">
          <h2>Our Impact</h2>
          <p>Numbers that speak for our community</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card smooth-hover">
            <div className="stat-number">{stats.totalClubs}</div>
            <div className="stat-label">Active Clubs</div>
          </div>
          <div className="stat-card smooth-hover">
            <div className="stat-number">{stats.activePlayers}</div>
            <div className="stat-label">Active Players</div>
          </div>
          <div className="stat-card smooth-hover">
            <div className="stat-number">{stats.matchesPlayed}</div>
            <div className="stat-label">Matches Played</div>
          </div>
          <div className="stat-card smooth-hover">
            <div className="stat-number">{stats.championships}</div>
            <div className="stat-label">Championships Won</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section cta fade-in">
        <h2>Ready to Join the Action?</h2>
        <p>
          Take the first step towards becoming part of our thriving sports community.
          Connect with Campus Sports Hub and unlock your athletic potential.
        </p>
        <Link to="/register" className="btn cta-btn smooth-hover btn-press">Start Your Journey ⚡</Link>
      </section>
    </div>
  );
}
