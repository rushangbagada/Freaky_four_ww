import React, { useState, useEffect } from 'react'
import { getApiUrl, API_ENDPOINTS, apiRequest } from '../src/config/api'
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection'
import './css/result.css'

export default function Result() {
  const [dataState,setData]=useState([]);
  const [sport,setSport]=useState("All Sports");
  const [time,setTime]=useState("All Times");
  const [mvp,setMvp]=useState([]);
  const [sortBy, setSortBy] = useState("date"); // Add sorting state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log('🎭 [RESULT DEBUG] Component state:', {
    dataStateLength: dataState.length,
    sport,
    time,
    sortBy,
    mvpLength: mvp.length,
    loading,
    error
  });

  const find_mvp=async(data)=>
  {
    console.log('🏆 [MVP DEBUG] Starting find_mvp with data:', data);
    console.log('🏆 [MVP DEBUG] Data length:', data.length);
    
    if (!data || data.length === 0) {
      console.log('⚠️ [MVP DEBUG] No data provided, setting empty MVP');
      setMvp([]);
      return;
    }
    
    let sorted_map=[];
    const countMap=new Map();
    
    data.forEach((item, index) => {
      console.log(`🔍 [MVP DEBUG] Processing item ${index}:`, item);
      
      if (!item.mvp) {
        console.warn(`⚠️ [MVP DEBUG] Item ${index} has no MVP property:`, item);
        return;
      }
      
      if (countMap.has(item.mvp)) {
        const currentCount = countMap.get(item.mvp);
        countMap.set(item.mvp, currentCount + 1);
        console.log(`📈 [MVP DEBUG] Updated count for ${item.mvp}: ${currentCount + 1}`);
      } else {
        countMap.set(item.mvp, 1);
        console.log(`🆕 [MVP DEBUG] First occurrence of ${item.mvp}`);
      }
    });
    
    console.log('🗺️ [MVP DEBUG] MVP count map:', Object.fromEntries(countMap));
    
    sorted_map=Array.from(countMap).sort((a, b) => {
      if(a[1]!==b[1]) return b[1]-a[1];
      return a[0].localeCompare(b[0]);
    });
    
    console.log('🏅 [MVP DEBUG] Sorted MVP list:', sorted_map);
    setMvp(sorted_map);
    console.log('✅ [MVP DEBUG] MVP state updated');
  }

  // Function to fetch results with filters
  const fetchResults = async () => {
    console.log('🚀 [RESULT DEBUG] Starting fetchResults function');
    console.log('🔧 [RESULT DEBUG] Current state:', { sport, time, sortBy });
    
    try {
      setLoading(true);
      setError(null);
      console.log('⏳ [RESULT DEBUG] Set loading to true');
      
      console.log('🏆 [RESULT DEBUG] Fetching results data...', { sport, time, sortBy });
      
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (sport && sport !== 'All Sports') {
        queryParams.append('sport', sport.toLowerCase());
        console.log('🎯 [RESULT DEBUG] Added sport filter:', sport.toLowerCase());
      }
      if (time && time !== 'All Time' && time !== 'All Times') {
        queryParams.append('time', time.toLowerCase());
        console.log('⏰ [RESULT DEBUG] Added time filter:', time.toLowerCase());
      }
      
      console.log('📋 [RESULT DEBUG] Query params constructed:', queryParams.toString());
      
      // Try both endpoints
      let endpoint = `/api/result${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🌐 [RESULT DEBUG] Primary endpoint:', endpoint);
      
      let data;
      try {
        data = await apiRequest(endpoint);
        console.log('📊 [RESULT DEBUG] Primary endpoint response:', data);
        
        // Check if result endpoint has data
        if (!data || (data.value && data.value.length === 0) || (Array.isArray(data) && data.length === 0)) {
          console.log('⚠️ [RESULT DEBUG] Primary endpoint empty, trying recent_matches');
          endpoint = `/api/recent_matches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          console.log('🌐 [RESULT DEBUG] Fallback endpoint:', endpoint);
          data = await apiRequest(endpoint);
          console.log('📊 [RESULT DEBUG] Fallback endpoint response:', data);
        }
      } catch (primaryError) {
        console.error('❌ [RESULT DEBUG] Primary endpoint failed:', primaryError);
        console.log('🔄 [RESULT DEBUG] Trying fallback endpoint...');
        endpoint = `/api/recent_matches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        data = await apiRequest(endpoint);
        console.log('📊 [RESULT DEBUG] Fallback endpoint response:', data);
      }
      
      console.log('🔍 [RESULT DEBUG] Final data received:', data);
      console.log('🔍 [RESULT DEBUG] Data type:', typeof data);
      console.log('🔍 [RESULT DEBUG] Is array:', Array.isArray(data));
      
      // Handle different data structures
      let resultsArray = [];
      if (Array.isArray(data)) {
        console.log('✅ [RESULT DEBUG] Data is direct array');
        resultsArray = data;
      } else if (data && data.value && Array.isArray(data.value)) {
        console.log('✅ [RESULT DEBUG] Data has value property with array');
        resultsArray = data.value;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('✅ [RESULT DEBUG] Data has data property with array');
        resultsArray = data.data;
      } else {
        console.warn('⚠️ [RESULT DEBUG] Unexpected data structure for results:', data);
        console.log('🔍 [RESULT DEBUG] Available properties:', Object.keys(data || {}));
        resultsArray = [];
      }
      
      console.log('📝 [RESULT DEBUG] Extracted results array:', resultsArray);
      console.log('📊 [RESULT DEBUG] Results array length:', resultsArray.length);
      
      if (resultsArray.length > 0) {
        console.log('🎯 [RESULT DEBUG] First result sample:', resultsArray[0]);
      }
      
      // Sort data based on sortBy value
      let sortedData = [...resultsArray];
      console.log('🔄 [RESULT DEBUG] Sorting by:', sortBy);
      
      if (sortBy === "date") {
        sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log('📅 [RESULT DEBUG] Sorted by date');
      } else if (sortBy === "team1") {
        sortedData.sort((a, b) => a.team1.localeCompare(b.team1));
        console.log('🏟️ [RESULT DEBUG] Sorted by team1');
      } else if (sortBy === "team2") {
        sortedData.sort((a, b) => a.team2.localeCompare(b.team2));
        console.log('🏟️ [RESULT DEBUG] Sorted by team2');
      } else if (sortBy === "venue") {
        sortedData.sort((a, b) => a.venue.localeCompare(b.venue));
        console.log('📍 [RESULT DEBUG] Sorted by venue');
      } else if (sortBy === "score") {
        sortedData.sort((a, b) => (b.team1_score + b.team2_score) - (a.team1_score + a.team2_score));
        console.log('⚽ [RESULT DEBUG] Sorted by score');
      }
      
      console.log('✅ [RESULT DEBUG] Final processed results data:', sortedData);
      console.log('📊 [RESULT DEBUG] Setting data state with', sortedData.length, 'items');
      
      setData(sortedData);
      
      console.log('🏆 [RESULT DEBUG] Calling find_mvp with data');
      find_mvp(sortedData);
      
      console.log('🎉 [RESULT DEBUG] fetchResults completed successfully');
      setLoading(false);
      console.log('✅ [RESULT DEBUG] Set loading to false');
      
    } catch (err) {
      console.error('💥 [RESULT DEBUG] Failed to fetch results data:', err);
      console.error('💥 [RESULT DEBUG] Error stack:', err.stack);
      console.log('🧹 [RESULT DEBUG] Setting empty state due to error');
      setData([]);
      setMvp([]);
      setError(err.message || 'Failed to fetch data');
      setLoading(false);
      console.log('❌ [RESULT DEBUG] Set loading to false due to error');
    }
  };
  
  // Use the real-time database change detection hook for automatic updates
  // Only poll when filters change or on initial load
  useDatabaseChangeDetection(fetchResults, []);
  
  // Handle filter changes separately to avoid excessive polling
  useEffect(() => {
    console.log('🔧 [RESULT DEBUG] Filter changed, fetching new data');
    fetchResults();
  }, [sport, time, sortBy]);
  
  return (
    <div className="result-container">

  {/* Hero Section - Calendar Style */}
  <div className="result-hero">
    <div className="hero-content">
      <div className="hero-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h1 className="hero-title">Results & Scores</h1>
      <p className="hero-subtitle">Celebrate our victories and track our athletic achievements</p>
    </div>
    <div className="hero-stats">
      <div className="stat-card">
        <span className="stat-number">{dataState.length}</span>
        <span className="stat-label">Total Matches</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{dataState.filter(item => item.team1_score > item.team2_score).length}</span>
        <span className="stat-label">Victories</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{dataState.reduce((total, item) => total + item.team1_score, 0)}</span>
        <span className="stat-label">Total Goals</span>
      </div>
    </div>
  </div>

  <div className="container">
    {/* <!-- Filters --> */}
    <div className="filter-box">
      <div className="filter-header">
        <h2 className="filter-title">Match Results</h2>
        <div className="filter-controls">
          <select onChange={(e) => setSport(e.target.value)}>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>All Sports</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>football</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>cricket</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>basketball</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>volleyball</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>tennis</option>
          </select>
          <select onChange={(e) => setTime(e.target.value)}>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>All Time</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>This Month</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>This Season</option>
          </select>
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="date" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>Sort by Date</option>
            <option value="team1" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>Sort by Team 1</option>
            <option value="team2" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>Sort by Team 2</option>
            <option value="venue" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>Sort by Venue</option>
            <option value="score" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>Sort by Score</option>
          </select>
        </div>  
      </div>
    </div>

    <div className="main-section">
      {/* <!-- Main Section --> */}
      <div className="main-content">
       

        {loading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>🔄 Loading match results...</p>
          </div>
        )}

        {error && (
          <div className="error-section">
            <h3>❌ Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        )}

        {!loading && !error && dataState.length === 0 && (
          <div className="no-data-section">
            <h3>📭 No Match Results Found</h3>
            <p>No match results are available at the moment. Please check back later or try adjusting your filters.</p>
          </div>
        )}

        {!loading && !error && dataState.length > 0 && dataState.slice(0, 7).map((item, index) => (
              <div className="match-list" key={index}>
                <div className="match-card">
                  <div className="match-info">
                    <div className="labels">
                      <span className="label result">
                        {item.team1_score > item.team2_score ? 'WON' : 'LOST'}
                      </span>
                      <span className="label sport">{item.category}</span>
                    </div>
                    <div className="meta">
                      <div>📅 {new Date(item.date).toLocaleDateString()}</div>
                      <div>📍 {item.venue}</div>
                    </div>
                  </div>

                  <div className="teams">
                    <div className="team">
                      <h3>{item.team1}</h3>
                      <div className="score blue">{item.team1_score}</div>
                    </div>
                    <div className="versus">VS</div>
                    <div className="team">
                      <h3>{item.team2}</h3>
                      <div className="score gray">{item.team2_score}</div>
                    </div>
                  </div>

                  <div className="mvp">⭐ MVP: {item.mvp}</div>
                </div>
              </div>
            ))}
            
            {/* Show indicator if there are more matches */}
            {dataState.length > 7 && (
              <div className="more-matches-indicator">
                <div className="indicator-card">
                  <div className="indicator-content">
                    <span className="matches-count">
                      Showing 7 of {dataState.length} matches
                    </span>
                    <p className="indicator-text">
                      🔍 Use filters above to refine your search and see specific matches
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>


      {/* <!-- Sidebar --> */}
      <div className="sidebar">
        <div className="sidebar-box">
          <h3 className="sidebar-title">Top Performers</h3>
          <ul className="performers">
            {mvp.map((item, index) =>(
              <li className="performer" key={index}>
              <div className="rank gold">{index + 1}</div>
              <span className="name">{item[0]}</span>
              <span className="mvp-count">{item[1]}</span>
            </li>
            )
            )}
            {/* <!-- More performers --> */}
          </ul>
        </div>
      </div>
    </div>
  </div>

</div>)
}