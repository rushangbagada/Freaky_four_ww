import React, { useState, useEffect } from 'react';
import TurfCard from './payment/TurfCard';
import './css/turf.css';

const Turf = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

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

  useEffect(() => {
    // Simulate API call to fetch turf data
    const fetchTurfs = async () => {
      try {
        // In a real app, this would be an API call
        const mockTurfs = [
          {
            id: 1,
            name: 'Green Valley Sports Complex',
            location: 'North Campus',
            price: 500,
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
            availability: true
          },
          {
            id: 2,
            name: 'Champions Football Ground',
            location: 'South Campus',
            price: 600,
            imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
            availability: true
          },
          {
            id: 3,
            name: 'Elite Cricket Academy',
            location: 'East Campus',
            price: 700,
            imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
            availability: false
          },
          {
            id: 4,
            name: 'University Sports Center',
            location: 'West Campus',
            price: 450,
            imageUrl: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
            availability: true
          },
          {
            id: 5,
            name: 'Olympic Training Ground',
            location: 'Central Campus',
            price: 800,
            imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
            availability: true
          },
          {
            id: 6,
            name: 'Riverside Sports Hub',
            location: 'North Campus',
            price: 550,
            imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
            availability: true
          }
        ];

        // Remove artificial delay for faster loading
        setTurfs(mockTurfs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching turfs:', error);
        setLoading(false);
      }
    };

    fetchTurfs();
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

  return (
    <div className="turf-page">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Turf Booking</h1>
          <p>Find and book the best sports facilities with ease</p>
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
            <option value="">All Locations</option>
            <option value="North Campus">North Campus</option>
            <option value="South Campus">South Campus</option>
            <option value="East Campus">East Campus</option>
            <option value="West Campus">West Campus</option>
            <option value="Central Campus">Central Campus</option>
          </select>
        </div>

        <div className="filter-box">
          <select value={priceRange} onChange={(e)=>setPriceRange(e.target.value)}>
            <option value="">All Prices</option>
            <option value="low">Below ₹500</option>
            <option value="medium">₹500 - ₹700</option>
            <option value="high">Above ₹700</option>
          </select>
        </div>

        <div className="filter-box">
          <select value={availabilityFilter} onChange={(e)=>setAvailabilityFilter(e.target.value)}>
            <option value="">All</option>
            <option value="available">Available Only</option>
          </select>
        </div>
      </section>

      <div className="turf-grid">
        {filteredTurfs.map(turf => (
          <TurfCard
            key={turf.id}
            id={turf.id}
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
