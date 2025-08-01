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

      {/* Real-time Status */}
      <section className="realtime-controls" style={{ padding: '10px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: isPolling ? '#ffc107' : '#28a745',
              display: 'inline-block'
            }}></span>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {isPolling ? 'Checking for updates...' : 'Live monitoring active'}
            </span>
          </div>
          {hasChanges && (
            <div style={{ 
              padding: '4px 8px', 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              borderRadius: '4px', 
              fontSize: '12px',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              📊 Data updated!
            </div>
          )}
          {lastUpdated && (
            <span style={{ fontSize: '12px', color: '#888' }}>
              Last check: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </section>

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
