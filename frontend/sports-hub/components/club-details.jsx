import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './css/club-details.css';

export default function ClubDetails() {
  const { name } = useParams();

  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  useEffect(() => {
    // Fetch club info
    fetch(`/api/club-details/${name}`)
      .then(res => res.json())
      .then(data => {
        setClub(data);

        // Now use the club name/type to fetch others
        const sport = encodeURIComponent((data.name || data.type).toLowerCase().trim());

        fetch(`/api/club_players/${sport}`)
          .then(res => res.json())
          .then(setPlayers)
          .catch(console.error);

        fetch(`/api/recent_matches/${sport}`)
          .then(res => res.json())
          .then(setRecentMatches)
          .catch(console.error);

        fetch(`/api/upcoming_matches/${sport}`)
          .then(res => res.json())
          .then(setUpcomingMatches)
          .catch(console.error);
      })
      .catch(console.error);
  }, [name]);

  if (!club) return <p>Loading...</p>;

  return (
    <>
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
              <li><span>Active Players:</span> <strong>{club.activePlayers}</strong></li>
              <li><span>Upcoming Matches:</span> <strong>{club.upcomingMatches}</strong></li>
              <li><span>Win Rate:</span> <strong>{club.winRate || "N/A"}%</strong></li>
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
    </>
  );
}
