import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentResult.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-result success">
      <div className="result-container">
        <div className="result-icon success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1>Payment Successful!</h1>
        <p>Your turf booking has been confirmed.</p>
        <p className="confirmation-message">A confirmation email has been sent to your registered email address.</p>
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p><strong>Booking ID:</strong> {Math.floor(Math.random() * 1000000)}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
