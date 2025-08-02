import React, { useState ,  useEffect } from 'react'
import './css/result.css'

export default function Result() {
  const [dataState,setData]=useState([]);
  const [sport,setSport]=useState("All Sports");
  const [time,setTime]=useState("All Times");
  const [mvp,setMvp]=useState([]);
  const [sortBy, setSortBy] = useState("date"); // Add sorting state

  const find_mvp=async(data)=>
  {
    let sorted_map=[];
    const countMap=new Map();
    data.forEach((item) => {
      if (countMap.has(item.mvp)) {
        countMap.set(item.mvp, countMap.get(item.mvp) + 1);
      } else {
        countMap.set(item.mvp, 1);
      }

    });
    sorted_map=Array.from(countMap).sort((a, b) => {
      if(a[1]!==b[1]) return b[1]-a[1];

      return a[0].localeCompare(b[0]);
    });
    setMvp(sorted_map);
  }

  useEffect(() => {
    fetch(`/api/result?sport=${sport}&time=${time}`)
    .then(res => res.json())
    .then(data => {
      // Sort data based on sortBy value
      let sortedData = [...data];
      if (sortBy === "date") {
        sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortBy === "team1") {
        sortedData.sort((a, b) => a.team1.localeCompare(b.team1));
      } else if (sortBy === "team2") {
        sortedData.sort((a, b) => a.team2.localeCompare(b.team2));
      } else if (sortBy === "venue") {
        sortedData.sort((a, b) => a.venue.localeCompare(b.venue));
      } else if (sortBy === "score") {
        sortedData.sort((a, b) => (b.team1_score + b.team2_score) - (a.team1_score + a.team2_score));
      }
      
      setData(sortedData);
      find_mvp(sortedData);
    })
    .catch(err => console.error('Failed to fetch data:', err));
  }, [sport, time, sortBy]);
 return(
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
            <option>All Sports</option>
            <option>football</option>
            <option>cricket</option>
            <option>basketball</option>
            <option>volleyball</option>
            <option>tennis</option>
          </select>
          <select onChange={(e) => setTime(e.target.value)}>
            <option>All Time</option>
            <option>This Month</option>
            <option>This Season</option>
          </select>
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="team1">Sort by Team 1</option>
            <option value="team2">Sort by Team 2</option>
            <option value="venue">Sort by Venue</option>
            <option value="score">Sort by Score</option>
          </select>
        </div>
      </div>
    </div>

    <div className="main-section">
      {/* <!-- Main Section --> */}
      <div className="main-content">
        {/* <div className="stats-cards">
          <div className="card green">
            <p>Win Rate</p>
            <p className="value">{(dataState.reduce((total, item) => total + (item.team1_score > item.team2_score ? 1 : 0), 0) / dataState.length * 100).toFixed(2)}%</p>
          </div>
          <div className="card blue">
            <p>Total Matches</p>
            <p className="value">{dataState.length}</p>
          </div>
          <div className="card orange">
            <p>Total Goals</p>
            <p className="value">{dataState.reduce((total, item) => total + item.team1_score , 0)}</p>
          </div>
        </div> */}

        {dataState.slice(0, 7).map((item, index) => (
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