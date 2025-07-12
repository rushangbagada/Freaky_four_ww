import React from 'react';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" style={{ color: '#667eea', textDecoration: 'underline' }}>Go Home</a>
    </div>
  );
} 