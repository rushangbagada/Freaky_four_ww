/**
 * Database Configuration - MongoDB Connection
 * 
 * Handles MongoDB database connection for the Professional Business Analytics Platform.
 * Provides centralized database connectivity with error handling and environment configuration.
 * 
 * @description MongoDB connection module with Mongoose ODM
 * @author Web Wonders Team
 * @version 1.0.0
 */

// Dependencies
const mongoose = require('mongoose');  // MongoDB ODM for Node.js
const dotenv = require('dotenv');      // Environment variable loader

// Load environment variables from .env file
dotenv.config();

// Database connection string from environment variables
const MONGODB_URI = process.env.MONGO_URI;

/**
 * Establishes connection to MongoDB database
 * 
 * Connects to MongoDB using Mongoose with automatic retry and error handling.
 * Exits the process if connection fails to ensure application doesn't run without database.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} Exits process if connection fails
 * 
 * @example
 * // Import and use in server.js
 * const connectDB = require('./config/db');
 * connectDB().then(() => {
 *   // Server startup logic
 * });
 */
const connectDB = async () => {
  try {
    // Validate environment variable
    if (!MONGODB_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // Connect to MongoDB with Mongoose
    await mongoose.connect(MONGODB_URI, {
      // Connection options for better reliability
      serverSelectionTimeoutMS: 5000,    // Timeout for server selection
      socketTimeoutMS: 45000,             // Socket timeout
      bufferCommands: false,              // Disable command buffering
      maxIdleTimeMS: 30000,              // Close connections after 30 seconds of inactivity
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log(`🗄️  Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Please check:');
    console.error('   - MongoDB server is running');
    console.error('   - MONGO_URI environment variable is correct');
    console.error('   - Network connectivity to database');
    
    // Exit process with failure code
    process.exit(1);
  }
};

// Export the connection function
module.exports = connectDB;
