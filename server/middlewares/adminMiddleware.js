const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.',
        error: 'MISSING_TOKEN'
      });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if active
    const user = await User.findById(decoded.userId).select('-password -otp -otpExpires -resetToken -resetExpires');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token. User not found.',
        error: 'USER_NOT_FOUND'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.',
        error: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired.',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(500).json({ 
      message: 'Authentication server error.',
      error: 'AUTH_SERVER_ERROR'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.',
        error: 'NO_USER_CONTEXT'
      });
    }
    
    const adminRoles = ['admin', 'super_admin'];
    
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.',
        error: 'INSUFFICIENT_PRIVILEGES',
        userRole: req.user.role,
        requiredRoles: adminRoles
      });
    }
    
    // Log admin access for audit trail
    console.log(`Admin access: ${req.user.email} (${req.user.role}) - ${req.method} ${req.path}`);
    
    next();
    
  } catch (error) {
    console.error('Authorization error:', error.message);
    return res.status(500).json({ 
      message: 'Authorization server error.',
      error: 'AUTH_SERVER_ERROR'
    });
  }
};

// Middleware to check if user is a club leader with access to specific resources
const requireClubLeader = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Authentication required.',
          error: 'NO_USER_CONTEXT'
        });
      }
      
      // Super admin and admin can access everything
      if (['admin', 'super_admin'].includes(req.user.role)) {
        console.log(`Admin override: ${req.user.email} (${req.user.role}) - ${req.method} ${req.path}`);
        return next();
      }
      
      // Check if user is a club leader
      if (req.user.role !== 'club_leader') {
        return res.status(403).json({ 
          message: 'Access denied. Club leader privileges required.',
          error: 'INSUFFICIENT_PRIVILEGES',
          userRole: req.user.role,
          requiredRole: 'club_leader'
        });
      }
      
      // Check if club leader has access to this resource
      if (!req.user.club) {
        return res.status(403).json({ 
          message: 'Access denied. No club assigned.',
          error: 'NO_CLUB_ASSIGNED'
        });
      }
      
      // Log club leader access
      console.log(`Club leader access: ${req.user.email} (${req.user.club}) - ${req.method} ${req.path}`);
      
      next();
      
    } catch (error) {
      console.error('Club leader authorization error:', error.message);
      return res.status(500).json({ 
        message: 'Authorization server error.',
        error: 'AUTH_SERVER_ERROR'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireClubLeader
};