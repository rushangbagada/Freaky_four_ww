import React, { useState, useEffect } from 'react';
import useDatabaseChangeDetection from '../../hooks/useDatabaseChangeDetection';
import './css/turf-management.css';

export default function TurfManagement() {
    const [turfs, setTurfs] = useState([]);
    const [newTurf, setNewTurf] = useState({ name: '', location: '', price: '' });
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch turfs from database
    const fetchTurfs = async () => {
        try {
            console.log('🔄 [Admin] Fetching turfs data...');
            const response = await fetch('http://localhost:5000/api/turfs');
            if (!response.ok) {
                throw new Error('Failed to fetch turfs');
            }
            const data = await response.json();
            // Map database fields to our component structure
            const mappedTurfs = data.map(turf => ({
                ...turf,
                status: turf.availability ? 'Available' : 'Booked',
                lastUpdated: new Date()
            }));
            console.log('✅ [Admin] Turfs data fetched successfully:', mappedTurfs.length, 'turfs');
            setTurfs(mappedTurfs);
            setLastUpdate(new Date());
            setError(null);
            if (loading) setLoading(false);
        } catch (err) {
            console.error('❌ [Admin] Error fetching turfs:', err);
            setError(err.message);
            if (loading) setLoading(false);
        }
    };
    
    // Use the live data update hook for real-time updates
    useDatabaseChangeDetection(fetchTurfs, []);
    
    // Initial setup
    useEffect(() => {
        setLoading(true);
    }, []);
    
    const handleAddTurf = async (e) => {
        e.preventDefault();
        if (newTurf.name && newTurf.location) {
            try {
                const response = await fetch('http://localhost:5000/api/admin/turfs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newTurf.name,
                        location: newTurf.location,
                        price: newTurf.price ? parseInt(newTurf.price) : 500
                    })
                });
                
                if (response.ok) {
                    const savedTurf = await response.json();
                    // Add the new turf to state with status mapping
                    const mappedTurf = {
                        ...savedTurf,
                        status: savedTurf.availability ? 'Available' : 'Booked',
                        lastUpdated: new Date()
                    };
                    setTurfs([...turfs, mappedTurf]);
                    setNewTurf({ name: '', location: '', price: '' });
                    setLastUpdate(new Date());
                } else {
                    throw new Error('Failed to create turf');
                }
            } catch (err) {
                console.error('Error adding turf:', err);
                setError('Failed to add turf: ' + err.message);
            }
        }
    };
    
    const handleDeleteTurf = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/turfs/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                setTurfs(turfs.filter(turf => turf.id !== id));
                setLastUpdate(new Date());
            } else {
                throw new Error('Failed to delete turf');
            }
        } catch (err) {
            console.error('Error deleting turf:', err);
            setError('Failed to delete turf: ' + err.message);
        }
    };
    
    const handleApproveBooking = (id) => {
        setBookings(bookings.map(booking => 
            booking.id === id ? { ...booking, status: 'Approved' } : booking
        ));
    };
    
    const handleCancelBooking = (id) => {
        setBookings(bookings.filter(booking => booking.id !== id));
    };

    return (
        <div className="turf-management">
            <div className="header-section">
                <h2>Turf Management</h2>
                <p>Manage turfs and bookings here.</p>
                
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                        <button 
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                fetchTurfs();
                            }} 
                            className="retry-btn"
                            style={{
                                marginLeft: '1rem',
                                padding: '0.25rem 0.5rem',
                                background: 'var(--accent-blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
            
            {loading ? (
                <div className="loading-section">
                    <div className="spinner"></div>
                    <p>Loading turfs...</p>
                </div>
            ) : (
                <>
                <h3>Turf Listings ({turfs.length} turfs)</h3>
                <ul className="turf-list">
                {turfs.map(turf => (
                    <li key={turf.id} className="turf-item">
                        <div className="turf-info">
                            <div className="turf-details">
                                <span className="turf-name">{turf.name}</span>
                                <span className="turf-location">📍 {turf.location}</span>
                                <span className="turf-price">💰 ₹{turf.price}</span>
                            </div>
                            <span className={`status-badge ${turf.status.toLowerCase()}`}>
                                {turf.status}
                            </span>
                        </div>
                        <div className="turf-actions">
                            <button className="edit-btn">Edit</button>
                            <button 
                                className="delete-btn"
                                onClick={() => handleDeleteTurf(turf.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
                </ul>

                <h3>Add New Turf</h3>
                <form className="add-turf-form" onSubmit={handleAddTurf}>
                    <label>
                        Name:
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Turf Name" 
                            value={newTurf.name}
                            onChange={(e) => setNewTurf({...newTurf, name: e.target.value})}
                            required 
                        />
                    </label>
                    <label>
                        Location:
                        <input 
                            type="text" 
                            name="location" 
                            placeholder="Location" 
                            value={newTurf.location}
                            onChange={(e) => setNewTurf({...newTurf, location: e.target.value})}
                            required 
                        />
                    </label>
                    <label>
                        Price (₹):
                        <input 
                            type="number" 
                            name="price" 
                            placeholder="500" 
                            value={newTurf.price}
                            onChange={(e) => setNewTurf({...newTurf, price: e.target.value})}
                            min="100"
                        />
                    </label>
                    <button type="submit">Add Turf</button>
                </form>
                </>
            )}
        </div>
    );
}
