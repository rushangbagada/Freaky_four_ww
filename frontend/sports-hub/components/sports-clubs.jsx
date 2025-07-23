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
    <>
      {/* Header */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sports Clubs</h1>
          <p>Discover your passion and join our competitive sports teams</p>
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
    </>
  );
}
