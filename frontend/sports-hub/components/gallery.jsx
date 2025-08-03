import React, { useState, useEffect } from 'react';
import './css/gallery.css';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';
import { getApiUrl, API_ENDPOINTS } from '../src/config/api';

export default function Gallery() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [likedItems, setLikedItems] = useState(new Set());
  const [viewedItems, setViewedItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🖼️ [GALLERY] Fetching gallery data...');
      
      const response = await fetch(getApiUrl(API_ENDPOINTS.GALLERY));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ [GALLERY] Fetched data:', data);
      
      if (data && data.length > 0) {
        setAllData(data);
        setFilteredData(data);
        // Initialize liked and viewed sets from localStorage if available
        const savedLikes = JSON.parse(localStorage.getItem('gallery-likes') || '[]');
        const savedViews = JSON.parse(localStorage.getItem('gallery-views') || '[]');
        setLikedItems(new Set(savedLikes));
        setViewedItems(new Set(savedViews));
      } else {
        console.warn('⚠️ [GALLERY] No data received from API');
        setAllData([]);
        setFilteredData([]);
      }
    } catch (err) {
      console.error('❌ [GALLERY] Failed to fetch gallery data:', err);
      setError(err.message);
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Use the custom hook for real-time updates
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchGalleryData,
    []
  );

  useEffect(() => {
    fetchGalleryData();
  }, []);

  // Handle like functionality
  const handleLike = async (id) => {
    console.log('❤️ [GALLERY] Toggling like for item:', id);
    
    const newLikedItems = new Set(likedItems);
    const isCurrentlyLiked = likedItems.has(id);
    
    if (isCurrentlyLiked) {
      newLikedItems.delete(id);
    } else {
      newLikedItems.add(id);
    }
    
    setLikedItems(newLikedItems);
    
    // Update localStorage
    localStorage.setItem('gallery-likes', JSON.stringify([...newLikedItems]));
    
    // Update the item's like count in filteredData and allData
    const updateLikes = (data) => data.map(item => {
      if (item.id === id || item._id === id) {
        return {
          ...item,
          likes: isCurrentlyLiked ? Math.max(0, item.likes - 1) : item.likes + 1
        };
      }
      return item;
    });
    
    setFilteredData(updateLikes);
    setAllData(prev => updateLikes(prev));
    
    // Send update to backend
    try {
      const item = filteredData.find(i => i.id === id || i._id === id);
      if (item) {
        const newLikes = isCurrentlyLiked ? Math.max(0, item.likes - 1) : item.likes + 1;
        await handleUpdate(id, newLikes, item.views);
      }
    } catch (error) {
      console.error('❌ [GALLERY] Failed to update like:', error);
    }
  };

  // Handle view functionality
  const handleView = async (id) => {
    console.log('👁️ [GALLERY] Recording view for item:', id);
    
    // Only count view if not already viewed
    if (viewedItems.has(id)) {
      console.log('👁️ [GALLERY] Item already viewed, opening image');
      setSelectedImage(filteredData.find(item => item.id === id || item._id === id));
      return;
    }
    
    const newViewedItems = new Set(viewedItems);
    newViewedItems.add(id);
    setViewedItems(newViewedItems);
    
    // Update localStorage
    localStorage.setItem('gallery-views', JSON.stringify([...newViewedItems]));
    
    // Update the item's view count in filteredData and allData
    const updateViews = (data) => data.map(item => {
      if (item.id === id || item._id === id) {
        return {
          ...item,
          views: item.views + 1
        };
      }
      return item;
    });
    
    setFilteredData(updateViews);
    setAllData(prev => updateViews(prev));
    
    // Open image modal
    setSelectedImage(filteredData.find(item => item.id === id || item._id === id));
    
    // Send update to backend
    try {
      const item = filteredData.find(i => i.id === id || i._id === id);
      if (item) {
        await handleUpdate(id, item.likes, item.views + 1);
      }
    } catch (error) {
      console.error('❌ [GALLERY] Failed to update view:', error);
    }
  };

  // Update backend with new like/view count
  const handleUpdate = async (id, likes, views) => {
    try {
      const response = await fetch(getApiUrl('/api/gallery/update'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, likes, views })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [GALLERY] Updated successfully:', data);
      } else {
        console.error('❌ [GALLERY] Update failed:', response.status);
      }
    } catch (err) {
      console.error('❌ [GALLERY] Update failed:', err);
    }
  };

  // Handle category filter change
  const handleFilterChange = (e) => {
    const category = e.target.value;
    console.log('🔍 [GALLERY] Filtering by category:', category);
    setSelectedCategory(category);
    
    if (category === 'All') {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(item => 
        item.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredData(filtered);
    }
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const sportOptions = ['All', 'Football', 'Basketball', 'Cricket', 'Badminton', 'Volleyball', 'Tennis'];

  return (
    <div className="gallery-container">
      {/* Hero Section - Result Page Style */}
      <div className="gallery-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
          <h1 className="hero-title">Sports Gallery</h1>
          <p className="hero-subtitle">Capturing the spirit, passion, and triumph of campus sports</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{allData.length}</span>
            <span className="stat-label">Total Photos</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{filteredData.length}</span>
            <span className="stat-label">Showing</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{new Set(allData.map(item => item.category)).size}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>

     
      

      </div>


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
          {error ? (
            <div className="error-container">
              <p>⚠️ Using offline data (Server connection failed)</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="no-data-container">
              <p>No images found for the selected category.</p>
            </div>
          ) : (
            filteredData.map((item) => {
              const itemId = item.id || item._id;
              const isLiked = likedItems.has(itemId);
              const isViewed = viewedItems.has(itemId);
              
              return (
                <div className="gallery-card" key={itemId}>
                  <img
                    src={item.image}
                    alt="Sport moment"
                    onClick={() => handleView(itemId)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="info">
                    <span onClick={() => handleLike(itemId)} style={{ cursor: 'pointer' }}>
                      <svg
                        className={`heart-icon ${isLiked ? 'liked' : 'unliked'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={isLiked ? 'red' : 'none'}
                        stroke={isLiked ? 'red' : 'gray'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      <span>{item.likes}</span>
                    </span>
                    <span className={isViewed ? 'viewed' : ''}>
                      👁️ <span>{item.views}</span>
                    </span>
                    <span className={`tag ${item.category?.toLowerCase()}`}>{item.category}</span>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeImageModal}>
              ×
            </button>
            <img src={selectedImage.image} alt="Sport moment" />
            <div className="modal-info">
              <h3>{selectedImage.category}</h3>
              <div className="modal-stats">
                <span>❤️ {selectedImage.likes}</span>
                <span>👁️ {selectedImage.views}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

