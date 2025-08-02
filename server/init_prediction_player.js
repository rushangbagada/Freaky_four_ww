/**
 * Business Analytics Prediction Users Initialization Script
 * 
 * This script populates the database with professional business analysts
 * and their prediction performance data for the analytics platform.
 * 
 * @description Initializes prediction user collection with realistic business analysts
 * @author Web Wonders Team
 * @version 1.0.0
 */

// Database and server dependencies
const mongoose = require('mongoose');
const Prediction_user = require('./models/prediction_user');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Initialize database connection and start server
main()
.then(() => app.listen(port, () => console.log(`✅ Prediction users initialization server listening on port ${port}`)))
.catch(err => console.log('❌ Failed to start server:', err));

/**
 * Establishes connection to MongoDB database
 * @description Connects to the cloud MongoDB instance for prediction users
 */
async function main() {
  await mongoose.connect('mongodb+srv://rushang:rushi198@rushang.vtkbz.mongodb.net');
  console.log('🔗 Connected to MongoDB Cloud for prediction users initialization');
}

/**
 * Professional Business Analysts Data
 * 
 * Contains realistic business analyst profiles with their prediction performance
 * metrics, achievements, and current forecasts across various business domains.
 * 
 * @type {Array<Object>} Array of prediction user objects
 * @property {number} id - Unique identifier for the analyst
 * @property {string} name - Full name of the business analyst
 * @property {string} email - Professional email address
 * @property {number} total_point - Accumulated points from successful predictions
 * @property {string} prediction - Current business forecast/prediction
 * @property {number} accuracy - Prediction accuracy rate (0-1 scale)
 * @property {number} wins - Total number of successful predictions
 * @property {number} streak - Current consecutive successful predictions
 * @property {Array<string>} badges - Achievement badges earned
 */
const all_prediction_user = [
    {
        id: 1,
        name: "Sarah Chen",
        email: "sarah.chen@techcorp.com",
        total_point: 950,                    // High-performing analyst
        prediction: "Q4 revenue will exceed $2.5M target by 15%",
        accuracy: 0.92,                      // 92% accuracy rate
        wins: 23,
        streak: 8,                           // Current winning streak
        badges: ["📈", "🎯", "💎"]          // Growth Expert, Precision, Diamond Status
    },
    {
        id: 2,
        name: "Michael Rodriguez",
        email: "m.rodriguez@analytics.pro",
        total_point: 875,
        prediction: "Market volatility will decrease by 20% next quarter",
        accuracy: 0.88,                      // 88% accuracy rate
        wins: 19,
        streak: 5,
        badges: ["📊", "🔍", "⭐"]          // Data Analysis, Research, Star Performer
    },
    {
        id: 3,
        name: "Emma Thompson",
        email: "emma.t@businessinsights.com",
        total_point: 820,
        prediction: "Customer retention rate will improve to 85%",
        accuracy: 0.85,                      // 85% accuracy rate
        wins: 17,
        streak: 3,
        badges: ["🎯", "💼", "🚀"]          // Target Expert, Business Focus, Growth
    },
    {
        id: 4,
        name: "David Park",
        email: "david.park@strategicdata.io",
        total_point: 765,
        prediction: "Technology sector will outperform by 12%",
        accuracy: 0.81,                      // 81% accuracy rate
        wins: 15,
        streak: 2,
        badges: ["💻", "📈", "🎖️"]          // Tech Expert, Growth Tracker, Achievement
    },
    {
        id: 5,
        name: "Jennifer Walsh",
        email: "j.walsh@marketpredictions.net",
        total_point: 690,
        prediction: "E-commerce growth rate will stabilize at 18%",
        accuracy: 0.78,                      // 78% accuracy rate
        wins: 12,
        streak: 1,
        badges: ["🛒", "📊", "🏅"]          // E-commerce Specialist, Analytics, Medal
    }
];

// Insert business analysts into database
console.log('👥 Inserting professional business analysts into database...');
Prediction_user.insertMany(all_prediction_user)
.then((res) => {
    console.log(`✅ Successfully inserted ${res.length} business analysts`);
    console.log('📊 Prediction users initialization completed');
    
    // Log summary statistics
    const avgAccuracy = all_prediction_user.reduce((sum, user) => sum + user.accuracy, 0) / all_prediction_user.length;
    const totalPoints = all_prediction_user.reduce((sum, user) => sum + user.total_point, 0);
    console.log(`📈 Average analyst accuracy: ${(avgAccuracy * 100).toFixed(1)}%`);
    console.log(`🎯 Total points across all analysts: ${totalPoints}`);
})
.catch((err) => {
    console.error('❌ Error inserting business analysts:', err);
});
