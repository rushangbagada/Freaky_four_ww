/**
 * Authentication Middleware - JWT Token Verification
 * 
 * Provides middleware functions for protecting routes with JWT authentication.
 * Verifies tokens and extracts user information for protected endpoints.
 * 
 * @description JWT-based authentication middleware for route protection
 * @author Web Wonders Team
 * @version 1.0.0
 */

// Dependencies
const jwt = require("jsonwebtoken");  // JSON Web Token library

/**
 * JWT Authentication Middleware
 * 
 * Protects routes by verifying JWT tokens in the Authorization header.
 * Extracts user information from valid tokens and adds it to the request object.
 * 
 * @function protect
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Bearer token (format: "Bearer <token>")
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {void} Calls next() on success, sends error response on failure
 * 
 * @example
 * // Protect a route
 * const { protect } = require('./middlewares/authMiddleware');
 * router.get('/protected-route', protect, (req, res) => {
 *   // Access user ID via req.userId
 *   console.log('User ID:', req.userId);
 * });
 * 
 * @example
 * // Frontend usage
 * fetch('/api/protected-route', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 */
exports.protect = (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Expected format: "Bearer <jwt-token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: "Access denied. No authorization header provided.",
        error: "MISSING_AUTH_HEADER"
      });
    }
    
    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    
    if (!token) {
      return res.status(401).json({ 
        message: "Access denied. No token provided.",
        error: "MISSING_TOKEN"
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user information to request object
    req.userId = decoded.userId || decoded.id;  // Handle both userId and id fields
    req.userEmail = decoded.email;              // Add email for additional context
    req.userRole = decoded.role;                // Add role for authorization checks
    
    // Log successful authentication (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Authenticated user: ${req.userEmail} (${req.userRole})`);
    }
    
    // Continue to next middleware/route handler
    next();
    
  } catch (error) {
    // Handle specific JWT errors
    let errorMessage = "Invalid token";
    let errorCode = "INVALID_TOKEN";
    
    if (error.name === 'TokenExpiredError') {
      errorMessage = "Token has expired. Please login again.";
      errorCode = "TOKEN_EXPIRED";
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = "Invalid token format or signature.";
      errorCode = "MALFORMED_TOKEN";
    } else if (error.name === 'NotBeforeError') {
      errorMessage = "Token not active yet.";
      errorCode = "TOKEN_NOT_ACTIVE";
    }
    
    // Log authentication failure (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚫 Authentication failed: ${error.message}`);
    }
    
    return res.status(401).json({ 
      message: errorMessage,
      error: errorCode
    });
  }
};
