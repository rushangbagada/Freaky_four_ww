// API Configuration
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://freaky-four.onrender.com';

// Always log API configuration for debugging
// console.log('🔧 API Configuration:', {
//   VITE_APP_API_URL: import.meta.env.VITE_APP_API_URL,
//   API_BASE_URL,
//   environment: import.meta.env.MODE,
//   allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
// });

if (import.meta.env.MODE === 'development') {
  console.log('🔧 API Configuration:', {
    VITE_APP_API_URL: import.meta.env.VITE_APP_API_URL,
    API_BASE_URL,
    environment: import.meta.env.MODE
  });
}

// Utility function to get the full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const fullUrl = `${API_BASE_URL}/${cleanEndpoint}`;
  
  // Only log in development
  if (import.meta.env.MODE === 'development') {
    console.log(`🌐 API Call: ${endpoint} -> ${fullUrl}`);
  }
  
  return fullUrl;
};

// Enhanced fetch function with error handling and debugging
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Only log in development
  if (import.meta.env.MODE === 'development') {
    console.log(`🚀 Making API request to: ${url}`, config);
  }

  try {
    const response = await fetch(url, config);
    
    // Only log in development
    if (import.meta.env.MODE === 'development') {
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
    }

    if (!response.ok) {
      const errorText = await response.text();
      
      // Only log detailed errors in development
      if (import.meta.env.MODE === 'development') {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        console.error(`❌ Error response:`, errorText);
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}${import.meta.env.MODE === 'development' ? '\n' + errorText : ''}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Only log success in development
      if (import.meta.env.MODE === 'development') {
        console.log(`✅ API Success:`, data);
      }
      
      return data;
    } else {
      const text = await response.text();
      
      // Only warn in development
      if (import.meta.env.MODE === 'development') {
        console.warn(`⚠️ Non-JSON response:`, { contentType, text });
      }
      
      return text;
    }
  } catch (error) {
    // Always log errors, but less verbosely in production
    if (import.meta.env.MODE === 'development') {
      console.error(`💥 API Request failed:`, error);
    } else {
      console.error('API Request failed:', error.message);
    }
    throw error;
  }
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
  REVIEWS: '/api/review',
  QUIZ: '/api/quiz',
  QUIZ_RANDOM_QUESTION: '/api/quiz/random-question',
  QUIZ_ANSWER: '/api/quiz/answer',
  FACTS: '/api/facts',
  
  // Game/Prediction endpoints
  PREDICTION_MATCHES: '/api/prediction_match',
  LIVE_MATCHES: '/api/game/live-matches',
  LEADERBOARD: '/api/leader',
  USER_BY_EMAIL: '/api/user',
  USER_LIVE_PREDICTIONS: '/api/user',
  SUBMIT_LIVE_PREDICTION: '/api/user/live-match-prediction',
  EVALUATE_MATCH_PREDICTIONS: '/api/predictions/evaluate-match',
  
  // Admin endpoints
  ADMIN_LIVE_MATCHES: '/api/admin/live-matches',
  ADMIN_MATCHES: '/api/admin/matches',
  ADMIN_CLUBS: '/api/admin/clubs',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_TURFS: '/api/admin/turfs',
  ADMIN_NEWS: '/api/admin/news',
  ADMIN_GALLERY: '/api/admin/gallery',
  ADMIN_ANALYTICS: '/api/admin/analytics',
};

export default API_BASE_URL;
