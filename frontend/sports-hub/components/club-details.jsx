import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './css/club-details.css';

export default function ClubDetails() {
  const { name } = useParams();

  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

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
          
          // Now fetch related data using the club name with safety check
          if (matchedClub.name) {
            const sport = encodeURIComponent(matchedClub.name.toLowerCase().trim());
            fetchRelatedData(sport);
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
          const sport = encodeURIComponent(data.name.toLowerCase().trim());
          fetchRelatedData(sport);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="error-message">Error: {error}. <Link to="/sports-clubs">Return to clubs list</Link></div>;
  if (!club) return <p>No club data found. <Link to="/sports-clubs">Return to clubs list</Link></p>;

  return (
    <div>
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Link to="/sports-clubs" className="back-link">&larr; Back to Sports Clubs</Link>
          <h1 className="hero-title">{club.name}</h1>
          <p className="hero-description">{club.description}</p>
        </div>
      </header>

      <main className="container">
        <div className="main-content">
          {/* Players */}
          <section className="section">
            <h2 className="section-title">Team Players</h2>
            <div className="grid">
              {players.map((player) => (
                <div className="card player-card" key={player._id}>
                  <div className="player-info">
                    <img src={player.photo || '/default-avatar.png'} alt={player.name} className="avatar" />
                    <div>
                      <h3 className="player-name">{player.name}</h3>
                      <p className="player-position">{player.position}</p>
                      <p className="player-meta">{player.year} • {player.department}</p>
                    </div>
                  </div>
                  <div className="player-stats">
                    <div><strong>{player.matches}</strong><span>Matches</span></div>
                    <div><strong className="green">{player.wins}</strong><span>Wins</span></div>
                    <div><strong className="red">{player.losses}</strong><span>Losses</span></div>
                  </div>
                  {/* <Link to={`/player/${player._id}`} className="button">View Full Profile</Link> */}
                </div>
              ))}
            </div>
          </section>

          {/* Recent Matches */}
          <section className="section">
            <h2 className="section-title">Recent Results</h2>
            <div className="match-list">
              {recentMatches.map((match) => (
                <div className="match" key={match._id}>
                  <div className="match-teams">
                    <div>
                      <div className="team-name">{match.team1}</div>
                      <div className="score blue">{match.team1_score}</div>
                    </div>
                    <div className="vs">vs</div>
                    <div>
                      <div className="team-name">{match.team2}</div>
                      <div className="score gray">{match.team2_score}</div>
                    </div>
                  </div>
                  <div className="match-meta">
                    <p>{new Date(match.date).toLocaleDateString()} | {match.venue}</p>
                    <p className="mvp">MVP: {match.mvp}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="sidebar">
          {/* Club Stats */}
          <div className="card">
            <h3 className="sidebar-title">Club Statistics</h3>
            <ul>
              <li><span>Active Players:</span> <strong>{club.active_players}</strong></li>
              <li><span>Upcoming Matches:</span> <strong>{club.upcoming_matches}</strong></li>
              <li><span>Win Rate:</span> <strong>{club.win_rate || "N/A"}%</strong></li>
            </ul>
          </div>

          {/* Upcoming Matches */}
          <div className="card">
            <h3 className="sidebar-title">Next Matches</h3>
            {upcomingMatches.map(match => (
              <div className="upcoming-match" key={match._id}>
                <strong>{match.team1}</strong>
                <strong>vs {match.team2}</strong>
                <p>{new Date(match.date).toLocaleDateString()} at {match.time}</p>
                <p>{match.venue}</p>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <div className="cta">
            <h3>Ready to Join?</h3>
            <p>Take your athletic journey to the next level with our team.</p>
            <Link to="/register" className="cta-button">Register Now</Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
