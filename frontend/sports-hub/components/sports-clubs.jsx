import React, { useEffect, useState } from "react";
import "./css/sports-clubs.css";
import { Link } from "react-router-dom";

// Custom hook for database change detection
function useDatabaseChangeDetection(fetchData, dependencies = []) {
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const pollAndDetectChanges = async () => {
    setIsPolling(true);
    try {
      await fetchData();
      const now = new Date();
      if (lastUpdated && (now - lastUpdated) < 15000) {
        setHasChanges(true);
        setTimeout(() => setHasChanges(false), 3000);
      }
      setLastUpdated(now);
    } catch (error) {
      console.error('Error during polling:', error);
    } finally {
      setIsPolling(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    setLastUpdated(new Date());
    
    // Set up polling interval
    const intervalId = setInterval(pollAndDetectChanges, 10000); // Poll every 10 seconds
    
    return () => clearInterval(intervalId);
  }, dependencies);

  return { isPolling, hasChanges, lastUpdated };
}

export default function SportsClubs() {
  const [clubs, setClubs] = useState([]);
  const [type, setType] = useState("All");
  const [searchtext, setSearchText] = useState("");

  const fetchClubs = async () => {
    const response = await fetch(`/api/clubs?type=${type}`);
    const data = await response.json();
    setClubs(data);
  };

  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchClubs,
    [type]
  );


  return (
    <div className="sports-clubs-container">
      {/* Header */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sports Clubs</h1>
          <p>Discover your passion and join our competitive sports teams</p>
        </div>
      </section>


      {/* Search & Filter */}
      <section className="search-filter">
        <div className="search-box">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search clubs..." 
              className="search-input"
              value={searchtext}
              onChange={(e) => setSearchText(e.target.value)} 
            />
            {searchtext && (
              <button 
                className="clear-search"
                onClick={() => setSearchText('')}
                title="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="filter-dropdown">
          <div className="dropdown-wrapper">
            <svg className="filter-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            <select 
              id="categorySelect" 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="modern-select"
            >
              <option value="All">All Categories</option>
              <option value="Team Sports">🏀 Team Sports</option>
              <option value="Racket Sports">🏸 Racket Sports</option>
              <option value="Individual Sports">🏃 Individual Sports</option>
            </select>
            <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
          
          {/* Active filter indicator */}
          {type !== "All" && (
            <div className="active-filter">
              <span className="filter-tag">
                {type}
                <button 
                  className="remove-filter"
                  onClick={() => setType("All")}
                  title="Remove filter"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>
        
        {/* Results counter */}
        <div className="results-info">
          <span className="results-count">
            {clubs.filter((club) => club.name.toLowerCase().includes(searchtext.toLowerCase())).length} clubs found
          </span>
          {(isPolling || hasChanges) && (
            <div className="live-indicator">
              <div className={`pulse-dot ${isPolling ? 'pulsing' : hasChanges ? 'updated' : ''}`}></div>
              <span>{isPolling ? 'Updating...' : hasChanges ? 'Updated!' : 'Live'}</span>
            </div>
          )}
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
