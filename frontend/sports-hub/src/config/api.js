// API Configuration
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://freaky-four.onrender.com';

// Utility function to get the full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  ME: '/api/auth/me',
  VERIFY_OTP: '/api/auth/verify-otp',
  RESET_PASSWORD: '/api/auth/reset-password',
  
  // Home page endpoints
  RECENT_MATCHES: '/api/recent_matches',
  UPCOMING_MATCHES: '/api/upcoming_matches',
  CLUBS: '/api/clubs',
  
  // Other endpoints
  NEWS: '/api/news',
  GALLERY: '/api/gallery',
  EVENTS: '/api/events',
  CALENDAR: '/api/calendar',
  REVIEWS: '/api/reviews',
  QUIZ: '/api/quiz',
  FACTS: '/api/facts',
};

export default API_BASE_URL;
