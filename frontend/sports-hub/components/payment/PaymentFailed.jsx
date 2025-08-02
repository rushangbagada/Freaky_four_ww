import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentResult.css';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-result failed">
      <div className="result-container">
        <div className="result-icon failed-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h1>Payment Failed</h1>
        <p>We couldn't process your payment.</p>
        <div className="error-details">
          <h3>Possible Reasons</h3>
          <ul>
            <li>Insufficient funds in your account</li>
            <li>Card expired or invalid</li>
            <li>Bank declined the transaction</li>
            <li>Network connectivity issues</li>
          </ul>
        </div>
        <div className="action-buttons">
          <button className="retry-button" onClick={() => navigate('/')}>
            Try Again
          </button>
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
