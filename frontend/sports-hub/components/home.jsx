// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import './css/home.css';

// export default function Home() {
//   const [upcomingMatches, setUpcomingMatches] = useState([]);
//   const [recentMatches, setRecentMatches] = useState([]);
//   const [clubs, setClubs] = useState([]);

//   useEffect(() => {
//     fetch('/api/upcoming_matches')
//       .then(res => res.json())
//       .then(data => setUpcomingMatches(data))
//       .catch(err => console.error(err));

//     fetch('/api/recent_matches')
//       .then(res => res.json())
//       .then(data => setRecentMatches(data))
//       .catch(err => console.error(err));

//     fetch('/api/clubs')
//       .then(res => res.json())
//       .then(data => setClubs(data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div className="container">
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-overlay"></div>
//         <div className="hero-content">
//           <h1>Unite, Compete, <span className="highlight">Celebrate</span></h1>
//           <p>
//             Join the ultimate college sports experience. Discover your passion,
//             build lifelong friendships, and compete at the highest level.
//           </p>
//           <div className="hero-buttons">
//             <Link to="/register" className="btn primary">Join a Club Today →</Link>
//             <Link to="/sports-clubs" className="btn secondary">Explore Sports</Link>
//           </div>
//         </div>
//       </section>

//       {/* Popular Sports Clubs */}
//       <section className="section sports">
//         <div className="section-header">
//           <h2>Popular Sports Clubs</h2>
//           <p>Find your sport and join our competitive teams</p>
//         </div>
//         <div className="cards">
//           {clubs.map((item, index) => (
//             <div className="card" key={index}>
//               <div className="icon">🏆</div>
//               <h3>{item.name}</h3>
//               <p>{item.description}</p>
//               <div className="card-meta">
//                 <span>{item.players} players</span>
//                 <span>{item.matches} matches</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Upcoming Matches */}


//       {/* Recent Results */}
//       <section className="section results">
//         <div className="section-header white">
//           <h2>Recent Match Results</h2>
//           <p>Celebrate our latest victories</p>
//         </div>
//         <div className="cards">
//           {recentMatches.map((item, index) => (
//             <div className="result-card" key={index}>
//               <div className="star">★</div>
//               <h3>{item.category}</h3>
//               <p className="score">{item.team1_score} - {item.team2_score}</p>
//               <p className="opponent">vs {item.team2}</p>
//               <div className={`status ${item.team1_score > item.team2_score ? 'win' : 'loss'}`}>
//                 {item.team1_score > item.team2_score ? 'Win' : 'Loss'}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="cta">
//         <h2>Ready to Make Your Mark?</h2>
//         <p>
//           Join thousands of students who have discovered their athletic potential
//           with Campus Sports Hub.
//         </p>
//         <Link to="/register" className="btn cta-btn">Start Your Journey ⚡</Link>
//       </section>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/home.css';
import blogImg from './css/blog.jpg';
import calendarImage from './css/calendar.jpg'; // adjust the path accordingly


export default function Home() {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/upcoming_matches')
      .then(res => res.json())
      .then(data => setUpcomingMatches(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/recent_matches')
      .then(res => res.json())
      .then(data => setRecentMatches(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/clubs')
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Unite, Compete, <span className="highlight">Celebrate</span></h1>
          <p>
            Join the ultimate college sports experience. Discover your passion,
            build lifelong friendships, and compete at the highest level.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn primary">Join a Club Today →</Link>
            <Link to="/sports-clubs" className="btn secondary">Explore Sports</Link>
          </div>
        </div>
      </section>

      {/* Popular Sports Clubs */}
      <section className="sports-section">
        <div className="section-header">
          <h2>Popular Sports Clubs</h2>
          <p>Find your sport and join our competitive teams</p>
        </div>
        <div className="cards">
          {clubs.map((item, index) => (
            <div className="card" key={index}>
              <div className="icon">🏆</div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="card-meta">
                <span>{item.players} players</span>
                <span>{item.matches} matches</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Recent Results */}
      <section className="section results">
        <div className="section-header white">
          <h2>Recent Match Results</h2>
          <p>Celebrate our latest victories</p>
        </div>
        <div className="cards">
          {recentMatches.map((item, index) => (
            <div className="result-card" key={index}>
              <div className="star">★</div>
              <h3>{item.category}</h3>
              <p className="score">{item.team1_score} - {item.team2_score}</p>
              <p className="opponent">vs {item.team2}</p>
              <div className={`status ${item.team1_score > item.team2_score ? 'win' : 'loss'}`}>
                {item.team1_score > item.team2_score ? 'Win' : 'Loss'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Promo Section */}
{/* import blogImg from './css/blog.jpg'; // Import the image properly */}

<section className="blog-promo-section">
  <div className="blog-promo-content">
    <div className="blog-promo-image">
      <img src={blogImg} alt="Blog Visual" className="blog-promo-img-3d" />
    </div>
    <div className="blog-promo-text">
      <h2>
        <span className="blog-promo-gradient-text">
          Explore Fun Facts and Articles
        </span>
      </h2>
      <p>
        Discover behind-the-scenes stories, tech insights, and more.
      </p>
      <a href="/blog" className="blog-promo-btn">
        Read the Blog
      </a>
    </div>
  </div>
</section>
<section className="calendar-promo-section">
  <div className="calendar-promo-content">
    <div className="calendar-promo-text">
      <h2>
        <span className="calendar-promo-gradient-text">
          Never Miss an Event Again
        </span>
      </h2>
      <p>
        Get a centralized view of all upcoming college events — plan your week in seconds.
      </p>
      <a href="/calender" className="calendar-promo-btn">
        View Calendar
      </a>
    </div>
    <div className="calendar-promo-image">
      <img src={calendarImage} alt="Calendar Preview" className="calendar-promo-img-3d" />
    </div>
  </div>
</section>



      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Make Your Mark?</h2>
        <p>
          Join thousands of students who have discovered their athletic potential
          with Campus Sports Hub.
        </p>
        <Link to="/register" className="btn cta-btn">Start Your Journey ⚡</Link>
      </section>
    </div>
  );
}
