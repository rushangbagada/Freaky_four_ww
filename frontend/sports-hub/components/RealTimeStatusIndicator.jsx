import React from 'react';

/**
 * Reusable component for displaying real-time status indicators
 * @param {Object} props - Component props
 * @param {boolean} props.isPolling - Whether data is currently being fetched
 * @param {boolean} props.hasChanges - Whether data has recently changed
 * @param {Date} props.lastUpdated - Last update timestamp
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const RealTimeStatusIndicator = ({ 
  isPolling, 
  hasChanges, 
  lastUpdated, 
  className = "", 
  style = {} 
}) => {
  const defaultStyle = {
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '20px 0',
    ...style
  };

  return (
    <section className={`realtime-controls ${className}`} style={defaultStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: isPolling ? '#ffc107' : '#28a745',
            display: 'inline-block'
          }}></span>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {isPolling ? 'Checking for updates...' : 'Live monitoring active'}
          </span>
        </div>
        {hasChanges && (
          <div style={{ 
            padding: '4px 8px', 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            borderRadius: '4px', 
            fontSize: '12px',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            📊 Data updated!
          </div>
        )}
        {lastUpdated && (
          <span style={{ fontSize: '12px', color: '#888' }}>
            Last check: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
    </section>
  );
};

export default RealTimeStatusIndicator;
