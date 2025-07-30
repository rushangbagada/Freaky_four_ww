
import React, { useState, useEffect } from 'react';
import LiveScore from './livescore';
import MatchViewer from './matchviewer';
import './css/livesports.css';

const LiveSports = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/live_matches")
      .then(res => res.json())
      .then(data => 
        {
            // console.log(data);
            setMatches(data)
        })
      .catch(err => console.error(err));
  }, []);

  const [selectedMatch, setSelectedMatch] = useState(null);

  // Simulate live score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prevMatches) => 
        prevMatches.map(match => {
          if (match.status === 'live' && Math.random() > 0.7) {
            const isHomeScore = Math.random() > 0.5;
            return {
              ...match,
              team1_score: isHomeScore ? match.team1_score + 1 : match.team1_score,
              team2_score: !isHomeScore ? match.team2_score + 1 : match.team2_score,
            };
          }
          return match;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const liveMatches = matches.filter(match => match.status === 'live');

  return (
    <div className="live-sports-container">
      <header className="sports-header">
        <h1>Campus Sports Live</h1>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>LIVE</span>
        </div>
      </header>

      <div className="sports-content">
        <div className="scores-section">
          <h2>Live Scores</h2>
          <div className="live-scores-grid">
            {liveMatches.map(match => (
              <LiveScore 
                key={match.id}
                match={match}
                onMatchSelect={setSelectedMatch}
              />
            ))}
          </div>

          {/* {otherMatches.length > 0 && (
            <>
              <h3>Recent & Upcoming</h3>
              <div className="other-scores-grid">
                {otherMatches.map(match => (
                  <LiveScore 
                    key={match.id}
                    match={match}
                    onMatchSelect={setSelectedMatch}
                  />
                ))}
              </div>
            </>
          )} */}
          
            
          {liveMatches.length === 0 && (
            <div className="no-matches">
              <p>No live matches at the moment</p>
            </div>
          )}


        </div>

        {selectedMatch && (
          <div className="match-viewer-section">
            <MatchViewer 
              match={selectedMatch}
              onClose={() => setSelectedMatch(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSports;
