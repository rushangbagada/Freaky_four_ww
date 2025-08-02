
import React, { useState, useEffect } from 'react';
import './css/funfacts.css';

const FunFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [funFacts, setfunFacts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [stats,setStats]=useState([]);

//   const funFacts = [
//     {
//       id: 1,
//       icon: "🏃‍♂️",
//       title: "Speed Demon",
//       fact: "The fastest recorded human sprint speed is 27.8 mph, achieved by Usain Bolt!",
//       category: "Track & Field"
//     },
//     {
//       id: 2,
//       icon: "🏀",
//       title: "Slam Dunk Stats",
//       fact: "A basketball hoop is exactly 10 feet high, the same height it was when the game was invented in 1891!",
//       category: "Basketball"
//     },
//     {
//       id: 3,
//       icon: "⚽",
//       title: "Soccer Science",
//       fact: "A soccer ball can travel up to 70 mph during a professional game kick!",
//       category: "Soccer"
//     },
//     {
//       id: 4,
//       icon: "🏊‍♂️",
//       title: "Swimming Sensation",
//       fact: "Swimming burns more calories per hour than most other sports - up to 650 calories!",
//       category: "Swimming"
//     },
//     {
//       id: 5,
//       icon: "🎾",
//       title: "Tennis Trivia",
//       fact: "Tennis balls are replaced every 7-9 games in professional matches because they lose their bounce!",
//       category: "Tennis"
//     },
//     {
//       id: 6,
//       icon: "🏈",
//       title: "Football Facts",
//       fact: "The average NFL game has only 11 minutes of actual gameplay, despite lasting 3+ hours!",
//       category: "Football"
//     },
//     {
//       id: 7,
//       icon: "🏋️‍♂️",
//       title: "Strength Stats",
//       fact: "The world record for deadlift is over 1,100 pounds - that's like lifting a small car!",
//       category: "Weightlifting"
//     },
//     {
//       id: 8,
//       icon: "🏐",
//       title: "Volleyball Victory",
//       fact: "Volleyball was originally called 'Mintonette' and was invented as a gentler alternative to basketball!",
//       category: "Volleyball"
//     }
//   ];

  // const campusStats = [
  //   { label: "Active Sports Teams", value: "24", icon: "🏆" },
  //   { label: "Student Athletes", value: "850+", icon: "👥" },
  //   { label: "Championships Won", value: "47", icon: "🥇" },
  //   { label: "Sports Facilities", value: "12", icon: "🏟️" }
  // ];
  
  useEffect(() => {
  const fetchData = async () => {
    try {
      const factsRes = await fetch('/api/funfacts');
      const factsData = await factsRes.json();
      console.log(factsData);
      setfunFacts(Array.isArray(factsData) ? factsData : []);


      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      console.log(statsData);
      setStats(Array.isArray(statsData) ? statsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [funFacts.length]);

//   const currentFact = funFacts[currentFactIndex];
// const currentFact = funFacts.length;
const currentFact = funFacts.length > 0 ? funFacts[currentFactIndex] : null;



  return (
    <div className="funfacts-container">
      <div className="section-header">
        <h2>⚡ Amazing Sports Facts</h2>
        <p>Discover incredible facts about sports and athletics</p>
      </div>

      
        {currentFact && (
  <div className="featured-fact-container">
    <div className={`featured-fact ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="fact-icon">{currentFact.image}</div>
      <div className="fact-content">
        <h3 className="fact-title">{currentFact.title}</h3>
        <p className="fact-text">{currentFact.description}</p>
        <span className="fact-category">{currentFact.category}</span>
      </div>
    </div>
  </div>
)}

        
        <div className="fact-navigation">
          {funFacts.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentFactIndex ? 'active' : ''}`}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentFactIndex(index);
                  setIsVisible(true);
                }, 300);
              }}
            />
          ))}
        </div>
      

      <div className="campus-stats">
        <h3 className="stats-title">📊 Campus Sports Statistics</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.image}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="all-facts-grid">
        <h3 className="grid-title">🎯 Quick Facts Collection</h3>
        <div className="facts-grid">
          {funFacts.map((fact, index) => (
            <div key={index} className="mini-fact-card">
              <div className="mini-fact-icon">{fact.image}</div>
              <div className="mini-fact-content">
                <h4>{fact.title}</h4>
                <p>{fact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunFacts;
