import React, { useState ,  useEffect } from 'react'
import './css/result.css'

export default function Result() {
  const [dataState,setData]=useState([]);
  const [sport,setSport]=useState("All Sports");
  const [time,setTime]=useState("All Times");
  const [mvp,setMvp]=useState([]);

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
      setData(data);
      find_mvp(data);
    })
    .catch(err => console.error('Failed to fetch data:', err));
  }, [sport, time]);
 return(
  <>

  {/* <!-- Header --> */}
  <section className="header-section">
    <div className="container">
      <div className="header-content">
        <div className="icon">🏆</div>
        <h1 className="header-title">Results & Scores</h1>
      </div>
      <p className="header-subtitle">Celebrate our victories and track our athletic achievements</p>
    </div>
  </section>

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
          </select>
          <select onChange={(e) => setTime(e.target.value)}>
            <option>All Time</option>
            <option>This Month</option>
            <option>This Season</option>
          </select>
        </div>
      </div>
    </div>

    <div className="main-section">
      {/* <!-- Main Section --> */}
      <div className="main-content">
        <div className="stats-cards">
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
        </div>

        {dataState.map((item, index) => (
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

</>
 )
}