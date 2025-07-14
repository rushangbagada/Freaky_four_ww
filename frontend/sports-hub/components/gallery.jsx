import React, { useState, useEffect } from 'react';
import './css/gallery.css';

export default function Gallery() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [likedArray, setLikedArray] = useState([]);
  const [viewArray, setViewArray] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setFilteredData(data);
        setLikedArray(Array(data.length).fill(false));
        setViewArray(Array(data.length).fill(false));
      })
      .catch(err => console.error('Failed to fetch data:', err));
  }, []);

  const handleLike = (index, id) => {
    const updated = [...filteredData];
    const likedCopy = [...likedArray];
    likedCopy[index] = !likedCopy[index];
    updated[index].likes += likedCopy[index] ? 1 : -1;

    setLikedArray(likedCopy);
    setFilteredData(updated);
    handleUpdate(id, updated[index].likes, updated[index].views);
  };

  const handleView = (index, id) => {
    if (viewArray[index]) return;

    const viewedCopy = [...viewArray];
    const updated = [...filteredData];
    viewedCopy[index] = true;
    updated[index].views += 1;

    setViewArray(viewedCopy);
    setFilteredData(updated);
    handleUpdate(id, updated[index].likes, updated[index].views);
  };

  const handleUpdate = (id, likes, views) => {
    fetch('/api/gallery/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, likes, views })
    })
      .then(res => res.json())
      .then(data => console.log('Updated:', data))
      .catch(err => console.error('Update failed:', err));
  };

  const handleFilterChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredData(allData);
      setLikedArray(Array(allData.length).fill(false));
      setViewArray(Array(allData.length).fill(false));
    } else {
      const filtered = allData.filter(item => item.category === category);
      setFilteredData(filtered);
      setLikedArray(Array(filtered.length).fill(false));
      setViewArray(Array(filtered.length).fill(false));
    }
  };

  const sportOptions = ['All', 'Football', 'Basketball', 'Cricket', 'Badminton', 'Volleyball', 'Tennis'];

  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <h1>Photo Gallery</h1>
          <p>Capturing the spirit, passion, and triumph of campus sports</p>
        </div>
      </header>

      <main>
        <section className="gallery-header">
          <h2>Sports Gallery</h2>
          <div className="filter-box">
            <select value={selectedCategory} onChange={handleFilterChange}>
              {sportOptions.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="gallery-grid">
          {filteredData.map((item, index) => (
            <div className="card" key={item.id}>
              <img
                src={item.image}
                alt="Sport moment"
                onClick={() => handleView(index, item.id)}
                style={{ cursor: 'pointer' }}
              />
              <div className="info">
                <span onClick={() => handleLike(index, item.id)} style={{ cursor: 'pointer' }}>
                  <svg
                    className={`heart-icon ${likedArray[index] ? 'liked' : 'unliked'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={likedArray[index] ? 'red' : 'none'}
                    stroke={likedArray[index] ? 'red' : 'gray'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{item.likes}</span>
                </span>
                <span>👁️ <span>{item.views}</span></span>
                <span className={`tag ${item.category?.toLowerCase()}`}>{item.category}</span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

