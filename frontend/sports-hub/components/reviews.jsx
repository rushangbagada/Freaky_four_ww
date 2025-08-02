import React, { useState, useEffect } from 'react';
import './css/reviews.css';
import { getApiUrl, API_ENDPOINTS } from '../src/config/api';
import { useAuth } from '../src/AuthContext';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    review: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' // Default image
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.REVIEWS));
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        setError('Failed to fetch reviews');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(getApiUrl('/api/admin/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('Review submitted successfully!');
        setFormData({
          name: '',
          position: '',
          review: '',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
        });
        fetchReviews(); // Refresh the reviews list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reviews-container">
      {/* Hero Section - Result Page Style */}
      <div className="reviews-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
          <h1 className="hero-title">Community Reviews</h1>
          <p className="hero-subtitle">Discover what our sports community members are saying about their experiences</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{reviews.length}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{reviews.filter(review => review.position).length}</span>
            <span className="stat-label">Community Members</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{reviews.filter(review => review.review && review.review.length > 100).length}</span>
            <span className="stat-label">Detailed Reviews</span>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <div className="reviews-grid">
          {loading ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="review-header">
                  <img src={review.image} alt={review.name} className="review-avatar" />
                  <div className="review-author">
                    <h3>{review.name}</h3>
                    <p className="review-position">{review.position}</p>
                  </div>
                </div>
                <div className="review-content">
                  <p>"{review.review}"</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews">No reviews available yet. Be the first to share your experience!</div>
          )}
        </div>
      </section>

      {user && (
        <section className="submit-review-section">
          <h2>Share Your Experience</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="position">Your Position/Role</label>
              <input 
                type="text" 
                id="position" 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Basketball Player, Team Captain, etc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="review">Your Review</label>
              <textarea 
                id="review" 
                name="review" 
                value={formData.review} 
                onChange={handleChange} 
                required 
                rows="4"
                placeholder="Share your experience with our sports community..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </section>
      )}

      {!user && (
        <section className="login-prompt">
          <h3>Want to share your experience?</h3>
          <p>Please <a href="/login">login</a> to submit a review.</p>
        </section>
      )}
    </div>
  );
};

export default ReviewsPage;