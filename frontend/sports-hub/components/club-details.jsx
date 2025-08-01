import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './css/club-details.css';

const sportsEmojis = {
  'football': '⚽',
  'basketball': '🏀',
  'cricket': '🏏',
  'tennis': '🎾',
  'volleyball': '🏐',
  'badminton': '🏸',
  'swimming': '🏊',
  'athletics': '🏃',
  'boxing': '🥊',
  'wrestling': '🤼',
  'hockey': '🏒',
  'default': '🏆'
};

const getRandomGradient = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

// Helper function to extract sport name from club name
const extractSportFromClubName = (clubName) => {
  if (!clubName) return null;
  
  const lowerName = clubName.toLowerCase();
  const sportMapping = {
    'basketball': 'Basketball',
    'football': 'Football', 
    'cricket': 'Cricket',
    'tennis': 'Tennis',
    'swimming': 'Swimming',
    'badminton': 'Badminton',
    'volleyball': 'Volleyball',
    'hockey': 'Hockey',
    'athletics': 'Athletics',
    'boxing': 'Boxing',
    'wrestling': 'Wrestling'
  };
  
  // Find the sport in the club name
  for (const [sportKey, sportValue] of Object.entries(sportMapping)) {
    if (lowerName.includes(sportKey)) {
      return sportValue;
    }
  }
  
  // If no sport found, return the first word capitalized
  const firstWord = clubName.split(' ')[0];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
};

export default function ClubDetails() {
  const { name } = useParams();

  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug log for name parameter
    console.log('Club-details component received name parameter:', name);
    if (!name) {
      console.error('Warning: name parameter is undefined or null');
      setError('Invalid club identifier.');
      setLoading(false);
      return;
    }

    // Try first to get all clubs to have fallback data
    const fetchAllClubs = async () => {
      try {
        const response = await fetch('/api/clubs');
        if (!response.ok) throw new Error(`Failed to fetch clubs list`);
        const clubs = await response.json();
        console.log('Fetched clubs list:', clubs);
        
        // Find the club with matching ID or name, with safety check for name property
        const matchedClub = clubs.find(c => 
          c._id === name || (c.name && c.name.toLowerCase() === name?.toLowerCase())
        );
        
        if (matchedClub) {
          console.log('Found club in clubs list:', matchedClub);
          // Format the club to match expected shape
          const formattedClub = {
            ...matchedClub,
            active_players: matchedClub.players || 0,
            upcoming_matches: matchedClub.matches || 0,
            win_rate: 75 // Default value
          };
          setClub(formattedClub);
          
          // Now fetch related data using the extracted sport name
          if (matchedClub.name) {
            const sportName = extractSportFromClubName(matchedClub.name);
            console.log('Extracted sport name:', sportName, 'from club name:', matchedClub.name);
            fetchRelatedData(matchedClub.name, sportName);
          } else {
            console.error('Error: Matched club is missing name property');
            setError('Club data is missing name property');
            setLoading(false);
          }
        } else {
          // If not found in clubs list, try direct endpoint
          fetchClubByName(name);
        }
      } catch (err) {
        console.error('Error fetching clubs list:', err);
        // Fall back to direct endpoint
        fetchClubByName(name);
      }
    };
    
    // Fetch club by name using direct endpoint
    const fetchClubByName = async (clubName) => {
      try {
        console.log(`Fetching club details for name: ${clubName}`);
        const response = await fetch(`/api/club-details/${clubName}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Club data received:', data);
        setClub(data);
        
        // Use club name for related data with safety check
        if (data.name) {
          const sportName = extractSportFromClubName(data.name);
          console.log('Extracted sport name:', sportName, 'from club name:', data.name);
          fetchRelatedData(data.name, sportName);
        } else {
          console.error('Error: Club data is missing name property');
          setError('Club data is missing name property');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching club details:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    // Fetch related data (players, matches)
    const fetchRelatedData = async (sport) => {
      try {
        console.log('Using sport name for further queries:', sport);
        
        // Fetch players
        try {
          const playersResponse = await fetch(`/api/club_players/${sport}`);
          if (!playersResponse.ok) throw new Error(`Players fetch error! Status: ${playersResponse.status}`);
          const playersData = await playersResponse.json();
          console.log('Players data received:', playersData);
          setPlayers(playersData);
        } catch (err) {
          console.error('Error fetching players:', err);
        }
        
        // Fetch recent matches
        try {
          const recentMatchesResponse = await fetch(`/api/recent_matches/${sport}`);
          if (!recentMatchesResponse.ok) throw new Error(`Recent matches fetch error! Status: ${recentMatchesResponse.status}`);
          const recentMatchesData = await recentMatchesResponse.json();
          console.log('Recent matches data received:', recentMatchesData);
          setRecentMatches(recentMatchesData);
        } catch (err) {
          console.error('Error fetching recent matches:', err);
        }
        
        // Fetch upcoming matches
        try {
          const upcomingMatchesResponse = await fetch(`/api/upcoming_matches/${sport}`);
          if (!upcomingMatchesResponse.ok) throw new Error(`Upcoming matches fetch error! Status: ${upcomingMatchesResponse.status}`);
          const upcomingMatchesData = await upcomingMatchesResponse.json();
          console.log('Upcoming matches data received:', upcomingMatchesData);
          setUpcomingMatches(upcomingMatchesData);
        } catch (err) {
          console.error('Error fetching upcoming matches:', err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching related data:', err);
        setLoading(false);
      }
    };
    
    // Start the fetching process
    setLoading(true);
    setError(null);
    fetchAllClubs();
  }, [name]);

  const getSportEmoji = (clubName) => {
    const name = clubName?.toLowerCase() || '';
    for (const [sport, emoji] of Object.entries(sportsEmojis)) {
      if (name.includes(sport)) return emoji;
    }
    return sportsEmojis.default;
  };

  if (loading) {
    return (
      <div className="club-loading">
        <div className="loading-spinner"></div>
        <p>Loading club details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="club-error">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>Error: {error}</p>
        <Link to="/sports-clubs" className="error-back-btn">← Return to clubs list</Link>
      </div>
    );
  }
  
  if (!club) {
    return (
      <div className="club-not-found">
        <div className="not-found-icon">🔍</div>
        <h2>Club not found</h2>
        <p>We couldn't find the club you're looking for.</p>
        <Link to="/sports-clubs" className="error-back-btn">← Return to clubs list</Link>
      </div>
    );
  }

  return (
    <div className="club-details-container">
      {/* Modern Hero Section */}
      <section className="club-hero">
        <div className="hero-background" style={{ background: getRandomGradient() }}></div>
        <div className="hero-3d-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        <div className="hero-content">
          <Link to="/sports-clubs" className="modern-back-link">
            <span className="back-icon">←</span>
            Back to Sports Clubs
          </Link>
          <div className="club-title-section">
            <div className="club-emoji">{getSportEmoji(club.name)}</div>
            <h1 className="club-title">{club.name}</h1>
            <p className="club-subtitle">{club.description}</p>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{club.active_players || 0}</span>
              <span className="stat-label">Active Players</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{club.upcoming_matches || 0}</span>
              <span className="stat-label">Upcoming Matches</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{club.win_rate || 'N/A'}%</span>
              <span className="stat-label">Win Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="club-navigation">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">📊</span>
            Overview
          </button>
          <button 
            className={`nav-tab ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            <span className="tab-icon">👥</span>
            Players
          </button>
          <button 
            className={`nav-tab ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            <span className="tab-icon">⚽</span>
            Matches
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <main className="club-main-content">
        {activeTab === 'overview' && (
          <div className="tab-content overview-content">
            <div className="overview-grid">
              <div className="overview-card club-info-card">
                <div className="card-header">
                  <h3>Club Information</h3>
                  <span className="card-icon">ℹ️</span>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Sport:</span>
                    <span className="info-value">{club.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Founded:</span>
                    <span className="info-value">{club.founded || '2020'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{club.category || 'Sports Club'}</span>
                  </div>
                </div>
              </div>

              <div className="overview-card achievements-card">
                <div className="card-header">
                  <h3>Recent Achievements</h3>
                  <span className="card-icon">🏆</span>
                </div>
                <div className="card-content">
                  <div className="achievement-item">
                    <span className="achievement-medal">🥇</span>
                    <span>Inter-College Championship 2024</span>
                  </div>
                  <div className="achievement-item">
                    <span className="achievement-medal">🥈</span>
                    <span>Regional Tournament 2023</span>
                  </div>
                  <div className="achievement-item">
                    <span className="achievement-medal">🏅</span>
                    <span>Best Sportsmanship Award</span>
                  </div>
                </div>
              </div>

              <div className="overview-card upcoming-events-card">
                <div className="card-header">
                  <h3>Upcoming Events</h3>
                  <span className="card-icon">📅</span>
                </div>
                <div className="card-content">
                  {upcomingMatches.slice(0, 3).map(match => (
                    <div className="event-item" key={match._id}>
                      <div className="event-date">
                        {new Date(match.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="event-details">
                        <div className="event-title">{match.team1} vs {match.team2}</div>
                        <div className="event-venue">{match.venue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="tab-content players-content">
            <div className="players-header">
              <h2>Team Roster</h2>
              <p>Meet our talented athletes</p>
            </div>
            <div className="players-grid">
              {players.map((player, index) => (
                <div className="modern-player-card" key={player._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="player-card-header" style={{ background: getRandomGradient() }}>
                    <img 
                      src={player.photo || `https://ui-avatars.com/api/?name=${player.name}&background=random&size=120`} 
                      alt={player.name} 
                      className="player-avatar" 
                    />
                    <div className="player-rank">#{index + 1}</div>
                  </div>
                  <div className="player-card-body">
                    <h3 className="player-name">{player.name}</h3>
                    <p className="player-position">{player.position}</p>
                    <p className="player-details">{player.year} • {player.department}</p>
                    
                    <div className="player-stats-modern">
                      <div className="stat-circle">
                        <div className="stat-value">{player.matches || 0}</div>
                        <div className="stat-label">Matches</div>
                      </div>
                      <div className="stat-circle wins">
                        <div className="stat-value">{player.wins || 0}</div>
                        <div className="stat-label">Wins</div>
                      </div>
                      <div className="stat-circle losses">
                        <div className="stat-value">{player.losses || 0}</div>
                        <div className="stat-label">Losses</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="tab-content matches-content">
            <div className="matches-section">
              <h2>Recent Results</h2>
              <div className="modern-matches-grid">
                {recentMatches.map((match, index) => (
                  <div className="modern-match-card" key={match._id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="match-date">
                      {new Date(match.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="match-teams-modern">
                      <div className="team-section home">
                        <div className="team-name">{match.team1}</div>
                        <div className="team-score">{match.team1_score}</div>
                      </div>
                      <div className="match-vs">
                        <span>VS</span>
                      </div>
                      <div className="team-section away">
                        <div className="team-name">{match.team2}</div>
                        <div className="team-score">{match.team2_score}</div>
                      </div>
                    </div>
                    <div className="match-details">
                      <div className="match-venue">
                        <span className="venue-icon">📍</span>
                        {match.venue}
                      </div>
                      {match.mvp && (
                        <div className="match-mvp">
                          <span className="mvp-icon">⭐</span>
                          MVP: {match.mvp}
                        </div>
                      )}
                    </div>
                    <div className={`match-result ${match.team1_score > match.team2_score ? 'win' : 'loss'}`}>
                      {match.team1_score > match.team2_score ? '🏆 WIN' : '😞 LOSS'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Call to Action Section */}
      <section className="club-cta-section">
        
      </section>
    </div>
  );
}
