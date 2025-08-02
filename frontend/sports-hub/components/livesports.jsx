
import React, { useState, useEffect } from 'react';
import LiveScore from './livescore';
import MatchViewer from './matchviewer';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';
import { getApiUrl, API_ENDPOINTS } from '../src/config/api';
import './css/livesports.css';

const LiveSports = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Function to fetch live matches from the backend
  const fetchLiveMatches = async () => {
    try {
      console.log('🔄 Fetching live matches for public view...');
      const response = await fetch(getApiUrl('/api/live_matches'));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched live matches:', data);
        const matchArray = Array.isArray(data) ? data : [];
        setMatches(matchArray);
      } else {
        console.error('❌ Failed to fetch live matches:', response.status);
        setMatches([]);
      }
    } catch (error) {
      console.error('❌ Error fetching live matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Use the real-time database change detection hook
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchLiveMatches,
    []
  );

  const liveMatches = matches.filter(match => match.status === 'live');
  const otherMatches = matches.filter(match => match.status !== 'live');

  if (loading) {
    return (
      <div className="live-sports-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading live sports data...</p>
        </div>
      </div>
    );
  }

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
            {liveMatches.slice(0, 7).map(match => (
              <LiveScore 
                key={match._id || match.id}
                match={match}
                onMatchSelect={setSelectedMatch}
              />
            ))}
          </div>

          {otherMatches.length > 0 && (
            <>
              <h3>Recent & Upcoming</h3>
              <div className="other-scores-grid">
                {otherMatches.slice(0, 7).map(match => (
                  <LiveScore 
                    key={match._id || match.id}
                    match={match}
                    onMatchSelect={setSelectedMatch}
                  />
                ))}
              </div>
            </>
          )}
          
            
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
