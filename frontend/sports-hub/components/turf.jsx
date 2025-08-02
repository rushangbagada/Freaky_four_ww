import React, { useState, useEffect } from 'react';
import TurfCard from './payment/TurfCard';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';
import { getApiUrl, API_ENDPOINTS } from '../src/config/api';
import './css/turf.css';

const Turf = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [error, setError] = useState(null);
  
  const totalTurfs = turfs.length;
  const availableTurfs = turfs.filter(turf => turf.availability).length;
  const locations = new Set(turfs.map(turf => turf.location)).size;

  // Filter turfs based on search criteria
  const filteredTurfs = turfs.filter(turf => {
    const matchesSearch = turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turf.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === '' || turf.location === selectedLocation;
    
    const matchesPrice = priceRange === '' || 
                        (priceRange === 'low' && turf.price < 500) ||
                        (priceRange === 'medium' && turf.price >= 500 && turf.price <= 700) ||
                        (priceRange === 'high' && turf.price > 700);
    
    const matchesAvailability = availabilityFilter === '' || 
                               (availabilityFilter === 'available' && turf.availability);
    
    return matchesSearch && matchesLocation && matchesPrice && matchesAvailability;
  });

  // Fetch turf data from backend API
  const fetchTurfs = async () => {
    try {
      console.log('🔄 Fetching turfs data...');
      const response = await fetch(getApiUrl('/api/turfs'));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ Turfs data fetched successfully:', data.length, 'turfs');
      setTurfs(data);
      setError(null);
      if (loading) setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching turfs:', err);
      setError(err.message);
      if (loading) setLoading(false);
    }
  };

  // Use the live data update hook for real-time updates
  useDatabaseChangeDetection(fetchTurfs, []);

  useEffect(() => {
    // Initial load will be handled by the hook
    setLoading(true);
  }, []);

  if (loading) {
    return (
      <div className="turf-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading turfs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="turf-page">
        <div className="error-section">
          <h2>⚠️ Error Loading Turfs</h2>
          <p>{error}</p>
          <button onClick={() => {
            setError(null);
            setLoading(true);
            fetchTurfs();
          }} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="turf-page">
      
{/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M10 17l5-5-5-5v10z"/>
            </svg>
          </div>
          <h1 className="hero-title">Turf Booking</h1>
          <p className="hero-subtitle">Find and book the best sports facilities with ease</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{totalTurfs}</span>
            <span className="stat-label">Total Turfs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{availableTurfs}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{locations}</span>
            <span className="stat-label">Locations</span>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="search-filter">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <select value={selectedLocation} onChange={(e)=>setSelectedLocation(e.target.value)}>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="">All Locations</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="North Campus">North Campus</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="South Campus">South Campus</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="East Campus">East Campus</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="West Campus">West Campus</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="Central Campus">Central Campus</option>
          </select>
        </div>

        <div className="filter-box">
          <select value={priceRange} onChange={(e)=>setPriceRange(e.target.value)}>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="">All Prices</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="low">Below ₹500</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="medium">₹500 - ₹700</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="high">Above ₹700</option>
          </select>
        </div>

        <div className="filter-box">
          <select value={availabilityFilter} onChange={(e)=>setAvailabilityFilter(e.target.value)}>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="">All</option>
            <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} value="available">Available Only</option>
          </select>
        </div>
      </section>

      {/* Results Summary */}
      <div className="results-summary">
        <h2>Available Turfs ({filteredTurfs.length})</h2>
      </div>

      <div className="turf-grid">
        {filteredTurfs.map(turf => (
          <TurfCard
            key={turf.id || turf._id}
            id={turf.id || turf._id}
            name={turf.name}
            location={turf.location}
            price={turf.price}
            imageUrl={turf.imageUrl}
            availability={turf.availability}
          />
        ))}
      </div>

      {filteredTurfs.length === 0 && (
        <div className="no-turfs">
          <h3>No turfs available</h3>
          <p>Please check back later or try different filters</p>
        </div>
      )}
    </div>
  );
};

export default Turf;
