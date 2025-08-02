/**
 * Professional Business Statistics Initialization Script
 * 
 * This script populates the database with key business performance indicators
 * and statistics for the professional analytics platform dashboard.
 * 
 * @description Initializes business KPIs and performance metrics
 * @author Web Wonders Team
 * @version 1.0.0
 */

// Database and server dependencies
const mongoose = require('mongoose');
const Stats = require('./models/web_stats');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Initialize database connection and start server
main()
.then(() => app.listen(port, () => console.log(`✅ Business stats initialization server listening on port ${port}`)))
.catch(err => console.log('❌ Failed to start server:', err));

/**
 * Establishes connection to MongoDB database
 * @description Connects to the business analytics database
 */
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
  console.log('🔗 Connected to MongoDB for business statistics initialization');
}

/**
 * Professional Business Performance Statistics
 * 
 * Key performance indicators (KPIs) and business metrics displayed
 * on the analytics dashboard to showcase platform success and growth.
 * 
 * @type {Array<Object>} Array of business statistic objects
 * @property {string} image - Emoji icon representing the metric
 * @property {string} value - Numerical value or achievement count
 * @property {string} label - Description of the business metric
 */
const all_stats = [
  {
    image: "💼",           // Business briefcase
    value: "500+",
    label: "Clients Served"    // Total number of business clients
  },
  {
    image: "🌍",           // Global reach
    value: "25",
    label: "Countries Reached" // International market presence
  },
  {
    image: "📈",           // Trending up chart
    value: "98%",
    label: "Client Satisfaction" // Customer satisfaction rate
  },
  {
    image: "⭐",             // Star achievement
    value: "150+",
    label: "Projects Completed" // Successfully delivered projects
  }
];

// Insert business statistics into database
console.log('📈 Inserting professional business statistics into database...');
Stats.insertMany(all_stats)
.then((res) => {
  console.log(`✅ Successfully inserted ${res.length} business statistics`);
  console.log('🎯 Business statistics initialization completed');
  
  // Log summary of statistics
  console.log('📊 Business Performance Overview:');
  all_stats.forEach(stat => {
    console.log(`   ${stat.image} ${stat.label}: ${stat.value}`);
  });
})
.catch((err) => {
  console.error('❌ Error inserting business statistics:', err);
});


