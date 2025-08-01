
import React, { useState, useEffect } from 'react';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';

const MatchViewer = ({ match, onClose }) => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});

  // Function for real-time data fetching
  const fetchMatchData = async () => {
    try {
      const response = await fetch(`/api/match/${match.id}`);
      const data = await response.json();
      setEvents(data.events || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error("Error fetching match data:", err);
    }
  };

  // Use the custom hook for real-time updates
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchMatchData,
    [match.id]
  );


//   const [stats] = useState({
//     possession: { home: 58, away: 42 },
//     shots: { home: 12, away: 8 },
//     shots_on_target: { home: 5, away: 3 },
//     fouls: { home: 7, away: 11 },
//   });


  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'card': return '🟨';
      case 'substitution': return '🔄';
      case 'timeout': return '⏸️';
      default: return '📝';
    }
  };

  return (
    <div className="match-viewer-overlay">
      <div className="match-viewer">
        <div className="viewer-header">
          <div className="match-title">
            <h2>{match.team1} vs {match.team2}</h2>
            <div className="match-meta">
              <span className="sport-badge">{match.sport}</span>
              <span className="venue-info">{match.venue}</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="viewer-content">
          
          <div className="match-scoreboard">
            <div className="team-section">
              <div className="team-name">{match.team1}</div>
              <div className="team-score">{match.team1_score}</div>
            </div>
            <div className="match-center">
              <div className="match-time-display">{match.time}</div>
              <div className={`status-badge status-${match.status}`}>
                {match.status.toUpperCase()}
              </div>
            </div>
            <div className="team-section">
              <div className="team-score">{match.team2}</div>
              <div className="team-name">{match.team2_score}</div>
            </div>
          </div>

          <div className="viewer-tabs">
            <div className="tab-content">
              <div className="events-section">
                <h3>Live Events</h3>
                <div className="events-list">
                  {events.map((event, index) => (
                    <div key={index} className="event-item">
                      <div className="event-time">{event.time}</div>
                      <div className="event-icon">{getEventIcon(event.type)}</div>
                      <div className="event-details">
                        <div className="event-team">{event.team}</div>
                        <div className="event-description">
                          <strong>{event.player}</strong> - {event.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stats-section">
  <h3>Match Statistics</h3>
  <div className="stats-grid">
    {stats?.possession && (
      <div className="stat-row">
        <span className="stat-label">Possession</span>
        <div className="stat-bar">
          <div className="stat-home" style={{width: `${stats.possession.home}%`}}>
            {stats.possession.home}%
          </div>
          <div className="stat-away" style={{width: `${stats.possession.away}%`}}>
            {stats.possession.away}%
          </div>
        </div>
      </div>
    )}

    {stats?.shots && (
      <div className="stat-item">
        <span>Shots: {stats.shots.home} - {stats.shots.away}</span>
      </div>
    )}

    {stats?.fouls && (
      <div className="stat-item">
        <span>Fouls: {stats.fouls.home} - {stats.fouls.away}</span>
      </div>
    )}

    {stats?.corners && (
      <div className="stat-item">
        <span>Corners: {stats.corners.home} - {stats.corners.away}</span>
      </div>
    )}
  </div>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchViewer;
