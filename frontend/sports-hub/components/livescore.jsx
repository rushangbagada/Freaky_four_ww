
import React from 'react';
import './css/livescore.css';

const LiveScore = ({ match, onMatchSelect }) => {

  if (!match) return null;

  const getStatusClass = () => {
    switch (match.status) {
      case 'live': return 'status-live';
      case 'upcoming': return 'status-upcoming';
      case 'finished': return 'status-finished';
      default: return '';
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case 'live': return 'LIVE';
      case 'upcoming': return 'UPCOMING';
      case 'finished': return 'FINAL';
      default: return '';
    }
  };

  return (
    <div 
      className={`score-card ${getStatusClass()}`}
      onClick={() => onMatchSelect(match)}
    >
      <div className="score-header">
        <span className="sport-type">{match.sport}</span>
        <span className={`match-status ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <div className="teams-scores">
        <div className="team-row">
          <span className="team-name">{match.team1}</span>
          <span className="team-score">{match.team1_score}</span>
        </div>
        <div className="vs-divider">VS</div>
        <div className="team-row">
          <span className="team-name">{match.team2}</span>
          <span className="team-score">{match.team2_score}</span>
        </div>
      </div>

      <div className="match-info">
        <div className="match-time">{match.time}</div>
        <div className="match-venue">{match.venue}</div>
      </div>

      {match.status === 'live' && (
        <div className="live-pulse">
          <span className="pulse-dot"></span>
        </div>
      )}
    </div>
  );
};

export default LiveScore;
