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


import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './css/home.css';
import blogImg from './css/blog.jpg';
import calendarImage from './css/calendar.jpg';
import gallery1 from './css/gallery1.jpg';
import gallery2 from './css/gallery2.jpg';
import gallery3 from './css/gallery3.jpg';
import gallery4 from './css/gallery4.jpg';
import gallery5 from './css/gallery5.jpg';
import gallery6 from './css/gallery6.jpg';

const slides = [
  {
    title: "Unite, Compete, Celebrate",
    subtitle: "Your Journey Begins Here",
    description: "Join the ultimate college sports experience. Discover your passion, build lifelong friendships, and compete at the highest level.",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "Join a Club Today →",
    link: "/register",
    highlight: "Unite",
  },
  {
    title: "Live Matches & Scores",
    subtitle: "Real-Time Action",
    description: "Never miss a moment of the action. Get real-time updates, live scores, and watch matches as they happen.",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "Watch Live →",
    link: "/livesports",
    highlight: "Live",
  },
  {
    title: "Explore Sports Clubs",
    subtitle: "Find Your Perfect Match",
    description: "Find your perfect team. Browse through dozens of sports clubs and find the one that fits your passion.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "Explore Sports →",
    link: "/sports-clubs",
    highlight: "Explore",
  },
  {
    title: "Train Like Champions",
    subtitle: "Excellence Through Practice",
    description: "Access world-class training facilities and expert coaching. Push your limits and achieve peak performance.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "Start Training →",
    link: "/training",
    highlight: "Champions",
  },
  {
    title: "Victory Awaits",
    subtitle: "Taste of Success",
    description: "Be part of championship teams. Experience the thrill of victory and the spirit of true sportsmanship.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "Join Winners →",
    link: "/championships",
    highlight: "Victory",
  },
  {
    title: "Game Day Energy",
    subtitle: "Feel the Excitement",
    description: "Feel the electrifying atmosphere of game day. Join thousands of fans cheering for our teams.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "Get Tickets →",
    link: "/tickets",
    highlight: "Energy",
  },
];

export default function Home() {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // Auto-rotate every 5 seconds for more dynamic feel
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  useEffect(() => {
    fetch('/api/recent_matches')
      .then(res => res.json())
      .then(data => setRecentMatches(data))
      .catch(err => console.error(err));

    fetch('/api/clubs')
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-container">
      {/* 3D Hero Carousel */}
      <section className="hero-carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => {
            let slideClass = 'carousel-slide';
            if (index === currentSlide) {
              slideClass += ' active';
            } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
              slideClass += ' prev';
            }
            
            return (
            <div
              key={index}
              className={slideClass}
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${slide.image})`,
                zIndex: index === currentSlide ? 10 : 1
              }}
            >
              {/* 3D Floating Sports Elements */}
              <div className="hero-3d-elements">
                <div className="floating-element">⚽</div>
                <div className="floating-element">🏀</div>
                <div className="floating-element">🏈</div>
                <div className="floating-element">🎾</div>
                <div className="floating-element">🏐</div>
              </div>
              
              {/* 3D Geometric Shapes */}
              <div className="hero-3d-shapes">
                <div className="shape-3d"></div>
                <div className="shape-3d"></div>
                <div className="shape-3d"></div>
              </div>
              
              <div className="hero-content">
                <div className="hero-subtitle">{slide.subtitle}</div>
                <h1 className="hero-title">
                  {slide.title.split(slide.highlight).map((part, index) => (
                    index === 1 ? (
                      <span key={index}>
                        <span className="highlight-text">{slide.highlight}</span>
                        {part}
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  ))}
                </h1>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-button-wrapper">
                  <Link to={slide.link} className="btn primary hero-btn">
                    <span className="btn-text">{slide.buttonText}</span>
                    <span className="btn-glow"></span>
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        
        {/* Navigation Controls */}
        <button className="carousel-control prev" onClick={prevSlide}>‹</button>
        <button className="carousel-control next" onClick={nextSlide}>›</button>
        
        {/* Slide Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
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

<section className="gallery-promo-section">
  <div className="gallery-promo-content">
    <div className="gallery-promo-images">
      <div className="gallery-grid">
        <div className="gallery-item">
          <img src={gallery1} alt="Basketball Game" className="gallery-img" />
        </div>
        
      </div>
    </div>
    <div className="gallery-promo-text">
      <h2>
        <span className="gallery-promo-gradient-text">
          Explore Our Gallery
        </span>
      </h2>
      <p>
        Relive the best moments from our events and matches. Browse photos and memories from our vibrant campus sports community!
      </p>
      <a href="/gallery" className="gallery-promo-btn">
        View Gallery
      </a>
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
