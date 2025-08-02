import React, { useEffect, useState } from "react";
import "./css/sports-clubs.css";
import { Link } from "react-router-dom";
import { getApiUrl, API_ENDPOINTS, apiRequest } from '../src/config/api';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';

export default function SportsClubs() {
  const [clubs, setClubs] = useState([]);
  const [type, setType] = useState("All");
  const [searchtext, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log('🏆 [SPORTS-CLUBS DEBUG] Component state:', {
    clubsLength: clubs.length,
    type,
    searchtext,
    loading,
    error
  });

  const fetchClubs = async () => {
    console.log('🚀 [SPORTS-CLUBS DEBUG] Starting fetchClubs with type:', type);
    setLoading(true);
    setError(null);
    
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (type && type !== 'All') {
        queryParams.append('type', type);
        console.log('🎯 [SPORTS-CLUBS DEBUG] Added type filter:', type);
      }
      
      const endpoint = `${API_ENDPOINTS.CLUBS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🌐 [SPORTS-CLUBS DEBUG] API endpoint:', endpoint);
      
      const data = await apiRequest(endpoint);
      console.log('📊 [SPORTS-CLUBS DEBUG] Raw API response:', data);
      
      // Handle different data structures
      let clubsArray = [];
      if (Array.isArray(data)) {
        console.log('✅ [SPORTS-CLUBS DEBUG] Data is direct array');
        clubsArray = data;
      } else if (data && data.value && Array.isArray(data.value)) {
        console.log('✅ [SPORTS-CLUBS DEBUG] Data has value property with array');
        clubsArray = data.value;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('✅ [SPORTS-CLUBS DEBUG] Data has data property with array');
        clubsArray = data.data;
      } else {
        console.warn('⚠️ [SPORTS-CLUBS DEBUG] Unexpected data structure:', data);
        console.log('🔍 [SPORTS-CLUBS DEBUG] Available properties:', Object.keys(data || {}));
        clubsArray = [];
      }
      
      console.log('📝 [SPORTS-CLUBS DEBUG] Processed clubs array:', clubsArray);
      console.log('📊 [SPORTS-CLUBS DEBUG] Clubs array length:', clubsArray.length);
      
      if (clubsArray.length > 0) {
        console.log('🎯 [SPORTS-CLUBS DEBUG] First club sample:', clubsArray[0]);
      }
      
      setClubs(clubsArray);
      console.log('✅ [SPORTS-CLUBS DEBUG] Clubs state updated successfully');
      
    } catch (err) {
      console.error('💥 [SPORTS-CLUBS DEBUG] Error fetching clubs:', err);
      console.error('💥 [SPORTS-CLUBS DEBUG] Error stack:', err.stack);
      setError(err.message || 'Failed to fetch clubs');
      setClubs([]);
    } finally {
      setLoading(false);
      console.log('✅ [SPORTS-CLUBS DEBUG] Set loading to false');
    }
  };

  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchClubs,
    [type]
  );


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
              <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="All">All Categories</option>
              <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="Team Sports">🏀 Team Sports</option>
              <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="Racket Sports">🏸 Racket Sports</option>
              <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="Individual Sports">🏃 Individual Sports</option>
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
