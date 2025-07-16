import React, { useState, useEffect } from 'react';
import TurfCard from './payment/TurfCard';
import './css/turf.css';

const Turf = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

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
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            availability: true
          },
          {
            id: 2,
            name: 'Champions Football Ground',
            location: 'South Campus',
            price: 600,
            imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            availability: true
          },
          {
            id: 3,
            name: 'Elite Cricket Academy',
            location: 'East Campus',
            price: 700,
            imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            availability: false
          },
          {
            id: 4,
            name: 'University Sports Center',
            location: 'West Campus',
            price: 450,
            imageUrl: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            availability: true
          },
          {
            id: 5,
            name: 'Olympic Training Ground',
            location: 'Central Campus',
            price: 800,
            imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            availability: true
          },
          {
            id: 6,
            name: 'Riverside Sports Hub',
            location: 'North Campus',
            price: 550,
            imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            availability: true
          }
        ];

        setTimeout(() => {
          setTurfs(mockTurfs);
          setLoading(false);
        }, 1000);
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
      <div className="turf-header">
        <h1>Book Your Turf</h1>
        <p>Choose from our premium sports facilities and book your slot</p>
      </div>
      
      {/* <div className="turf-filters">
        <div className="filter-group">
          <label>Location:</label>
          <select>
            <option value="">All Locations</option>
            <option value="north">North Campus</option>
            <option value="south">South Campus</option>
            <option value="east">East Campus</option>
            <option value="west">West Campus</option>
            <option value="central">Central Campus</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Price Range:</label>
          <select>
            <option value="">All Prices</option>
            <option value="low">Below ₹500</option>
            <option value="medium">₹500 - ₹700</option>
            <option value="high">Above ₹700</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Availability:</label>
          <select>
            <option value="">All</option>
            <option value="available">Available Only</option>
          </select>
        </div>
      </div> */}

      <div className="turf-grid">
        {turfs.map(turf => (
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

      {turfs.length === 0 && (
        <div className="no-turfs">
          <h3>No turfs available</h3>
          <p>Please check back later or try different filters</p>
        </div>
      )}
    </div>
  );
};

export default Turf;
