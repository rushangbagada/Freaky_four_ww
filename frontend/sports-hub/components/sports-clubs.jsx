import React,{ useEffect , useState } from "react";
import "./css/sports-clubs.css";
import { Link } from "react-router-dom";

export default function SportsClubs() {
  const [clubs, setClubs] = useState([]);
  const [type, setType] = useState("All");
  const [searchtext, setSearchText] = useState("");

  useEffect(() => {
    fetch(`/api/clubs?type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setClubs(data);
      });
      
  }, [type]);


  return (
    <div className="sports-clubs-container">
      {/* Hero Section - Calendar Style */}
      <div className="sports-clubs-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1 className="hero-title">Sports Clubs</h1>
          <p className="hero-subtitle">Discover your passion and join our competitive sports teams</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{clubs.length}</span>
            <span className="stat-label">Total Clubs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{clubs.reduce((total, club) => total + club.players, 0)}</span>
            <span className="stat-label">Active Players</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{clubs.reduce((total, club) => total + club.matches, 0)}</span>
            <span className="stat-label">Upcoming Matches</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <section className="search-filter">
        {/* <div className="search-box">
          <input type="text" placeholder="Search sports..." id="searchInput" onChange={(e)=>{setSearchText(e.target.value)}} />
        </div> */}
        <div className="filter-box">
          <select id="categorySelect" onChange={(e)=>{setType(e.target.value)}}>
            <option value="All">All</option>
            <option value="Team Sports">Team Sports</option>
            <option value="Racket Sports">Racket Sports</option>
            <option value="Individual Sports">Individual Sports</option>
          </select>
        </div>
      </section>

      {/* Sports Cards */}
      <section className="sports-grid">
        {clubs.filter((club) => club.name.toLowerCase().includes(searchtext.toLowerCase())).map((item,index) => 
        (
          <div className="card" key={index}>
          <div className="card-header team-sport">
            <div className="badge">{item.type}</div>
            <div className="icon">🏆</div>
          </div>
          <div className="card-body">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="stats">
              <span>{item.players} players</span>
              <span>{item.matches} upcoming</span>
            </div>
            <Link 
              to={`/club-details/${item._id || item.name}`} 
              className="details-btn"
              onClick={(e) => {
                // Debug info in case of navigation issues
                console.log(`Navigating to club: ${item.name} with ID: ${item._id}`);
              }}
            >
              View Club Details
            </Link>
          </div>
        </div>
        ))}

        {/* Add more cards manually or dynamically here */}
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Found Your Perfect Sport?</h2>
        <p>Join our community of dedicated athletes and start your journey today.</p>
        <Link to="/register" className="register-btn">Register Now</Link>
      </section>
    </div>
  );
}
