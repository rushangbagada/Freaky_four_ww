import React from 'react';
import './TurfCard.css';
import { loadStripe } from '@stripe/stripe-js';

console.log("Loaded Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const TurfCard = ({ id, name, location, price, imageUrl, availability }) => {
  const handleBooking = async () => {
    try {
      console.log("Starting booking process for:", { name, location, price });
      
      // Check if Stripe publishable key is available
      if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
        console.error("Stripe publishable key is not configured");
        alert("Payment system is not configured. Please contact support.");
        return;
      }

      const stripe = await stripePromise;
      console.log("Stripe instance:", stripe);
      
      // Check if Stripe loaded successfully
      if (!stripe) {
        console.error("Failed to load Stripe");
        alert("Payment system failed to load. Please try again.");
        return;
      }

      // Build the request payload
      const body = { name, location, price };
      console.log("Sending booking request with payload:", body);

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("Booking API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Booking API error:", response.status, errorText);
        alert(`Booking failed: ${response.status} ${errorText}`);
        return;
      }

      const session = await response.json();
      console.log("Booking session response:", session);

      if (session.id) {
        console.log("Redirecting to Stripe checkout with session ID:", session.id);
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        
        // This will only run if redirectToCheckout fails
        if (result.error) {
          console.error("Stripe redirect error:", result.error);
          alert(`Payment redirect failed: ${result.error.message}`);
        }
      } else {
        console.error("No session ID received from server:", session);
        alert("Failed to initiate payment session - no session ID received");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      console.error("Error stack:", err.stack);
      alert(`Something went wrong during booking: ${err.message}`);
    }
  };

  return (
    <div className="turf-card">
      <div className="turf-image">
        <img 
          src={imageUrl || 'https://via.placeholder.com/300x200?text=Turf+Ground'} 
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Turf+Ground';
          }}
        />
      </div>
      <div className="turf-details">
        <h3>{name}</h3>
        <p className="location">📍 {location}</p>
        <p className="price">₹{price} per hour</p>
        <p className={`availability ${availability ? 'available' : 'not-available'}`}>
          {availability ? 'Available' : 'Not Available'}
        </p>
        <button
          className="book-button"
          onClick={handleBooking}
          disabled={!availability}
        >
          {availability ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default TurfCard;
