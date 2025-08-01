import React, { useState, useEffect } from 'react';
import './css/gallery.css';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';
import RealTimeStatusIndicator from './RealTimeStatusIndicator';

export default function Gallery() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [likedArray, setLikedArray] = useState([]);
  const [viewArray, setViewArray] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try the backend API first
      const response = await fetch('http://localhost:5000/api/gallery');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setAllData(data);
        setFilteredData(data);
        setLikedArray(Array(data.length).fill(false));
        setViewArray(Array(data.length).fill(false));
      } else {
        // Use mock data if no data from API
        useMockData();
      }
    } catch (err) {
      console.error('Failed to fetch gallery data:', err);
      setError(err.message);
      // Fallback to mock data on error
      useMockData();
    } finally {
      setLoading(false);
    }
  };

  // Use the custom hook for real-time updates
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchGalleryData,
    []
  );

  const useMockData = () => {
    const mockData = [
      {
        id: 1,
        title: "Football Championship",
        image: "https://images.unsplash.com/photo-1606851095339-98c0e88e5071?auto=format&fit=crop&w=800&q=80",
        description: "Exciting football match moment",
        category: "Football",
        likes: 12,
        views: 45
      },
      {
        id: 2,
        title: "Basketball Finals",
        image: "https://images.unsplash.com/photo-1599058917212-dc596dbe5396?auto=format&fit=crop&w=800&q=80",
        description: "High-flying slam dunk",
        category: "Basketball",
        likes: 8,
        views: 32
      },
      {
        id: 3,
        title: "Tennis Tournament",
        image: "https://images.unsplash.com/photo-1599058916791-57c42a5e15cb?auto=format&fit=crop&w=800&q=80",
        description: "Tennis court action",
        category: "Tennis",
        likes: 15,
        views: 28
      },
      {
        id: 4,
        title: "Volleyball Match",
        image: "https://images.unsplash.com/photo-1613482180640-1706ae24f648?auto=format&fit=crop&w=800&q=80",
        description: "Teamwork at the net",
        category: "Volleyball",
        likes: 6,
        views: 19
      },
      {
        id: 5,
        title: "Cricket Championship",
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
        description: "Perfect batting stance",
        category: "Cricket",
        likes: 22,
        views: 67
      },
      {
        id: 6,
        title: "Badminton Finals",
        image: "https://images.unsplash.com/photo-1606851096394-6b2b0f3329c2?auto=format&fit=crop&w=800&q=80",
        description: "Smash shot in action",
        category: "Badminton",
        likes: 9,
        views: 23
      }
    ];
    
    setAllData(mockData);
    setFilteredData(mockData);
    setLikedArray(Array(mockData.length).fill(false));
    setViewArray(Array(mockData.length).fill(false));
  };

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

  const handleUpdate = async (id, likes, views) => {
    try {
      const response = await fetch('http://localhost:5000/api/gallery/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, likes, views })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Updated successfully:', data);
      } else {
        console.error('Update failed:', response.status);
      }
    } catch (err) {
      console.error('Update failed:', err);
      // Don't fail silently - the UI state has already been updated optimistically
    }
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
    <div className="gallery-container">
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

        {/* Real-time Status Indicator */}
        <RealTimeStatusIndicator 
          isPolling={isPolling}
          hasChanges={hasChanges}
          lastUpdated={lastUpdated}
        />

        <section className="gallery-grid">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading gallery...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>⚠️ Using offline data (Server connection failed)</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="no-data-container">
              <p>No images found for the selected category.</p>
            </div>
          ) : (
            filteredData.map((item, index) => (
            <div className="gallery-card" key={item.id}>
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
          ))
          )}
        </section>
      </main>
    </div>
  );
}

