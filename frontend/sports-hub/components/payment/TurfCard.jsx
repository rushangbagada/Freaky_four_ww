import React from 'react';
import './TurfCard.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51RlXxaEF9zgTF9mRW3INOvLqxwJCxX5jRQEc5GSv3IYnpS7Ewg9OhMAjR6SwOpQ0V76OrM1nQ20k2kiublFyVE1A00ihn2qr7i");

const TurfCard = ({ id, name, location, price, imageUrl, availability }) => {
  const handleBooking = async () => {
    try {
      const stripe = await stripePromise;

      // Build the request payload
      const body = { name, location, price };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const session = await response.json();

      if (session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        alert("Failed to initiate payment session");
        console.error("Stripe session error:", session);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      alert("Something went wrong during booking.");
    }
  };

  return (
    <div className="turf-card">
      <div className="turf-image">
        <img src={imageUrl || 'https://via.placeholder.com/300x200?text=Turf+Ground'} alt={name} />
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
