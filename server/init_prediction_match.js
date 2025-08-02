/**
 * Professional Event Schedules Initialization Script
 * 
 * This script populates the database with professional business conferences,
 * seminars, and industry events for the analytics platform.
 * 
 * @description Initializes event/conference collection with upcoming business events
 * @author Web Wonders Team
 * @version 1.0.0
 */

// Database and server dependencies
const mongoose = require('mongoose');
const Prediction_Match = require('./models/prediction_match');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Initialize database connection and start server
main()
.then(() => app.listen(port, () => console.log(`✅ Event schedules initialization server listening on port ${port}`)))
.catch(err => console.log('❌ Failed to start server:', err));

/**
 * Establishes connection to MongoDB database
 * @description Connects to the local MongoDB instance for event/conference data
 */
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
  console.log('🔗 Connected to MongoDB for event schedules initialization');
}

/**
 * Professional Business Events and Conferences Data
 * 
 * Contains upcoming professional events, conferences, and industry gatherings
 * across various business sectors and technology domains.
 * 
 * @type {Array<Object>} Array of event/conference objects
 * @property {number} id - Unique identifier for the event
 * @property {string} event - Name of the professional event/conference
 * @property {string} organizer - Organization hosting the event
 * @property {Date} date - Scheduled date of the event
 * @property {string} time - Start time of the event
 * @property {string} venue - Location where event will be held
 * @property {string} category - Industry/domain category
 * @property {string} status - Current status of the event
 */
const all_prediction_match = [
    {
        id: 1,
        event: "Annual Tech Conference",
        organizer: "Tech Innovations Inc.",
        date: new Date("2025-09-15"),        // September 2025
        time: "10:00 AM",
        venue: "Grand Convention Center",
        category: "Technology",              // Technology sector event
        status: "upcoming"
    },
    {
        id: 2,
        event: "Global Business Summit",
        organizer: "World Enterprises",
        date: new Date("2025-10-20"),        // October 2025
        time: "09:00 AM",
        venue: "International Expo Hall",
        category: "Business",                // General business event
        status: "upcoming"
    },
    {
        id: 3,
        event: "Healthcare Analytics Forum",
        organizer: "HealthTech Group",
        date: new Date("2025-11-05"),        // November 2025
        time: "11:00 AM",
        venue: "City Conference Plaza",
        category: "Healthcare",              // Healthcare technology focus
        status: "upcoming"
    },
    {
        id: 4,
        event: "Renewable Energy Conference",
        organizer: "EcoFuture Network",
        date: new Date("2025-12-01"),        // December 2025
        time: "01:00 PM",
        venue: "GreenTech Center",
        category: "Environment",             // Environmental sustainability
        status: "upcoming"
    },
    {
        id: 5,
        event: "Artificial Intelligence Symposium",
        organizer: "AI Minds",
        date: new Date("2026-01-12"),        // January 2026
        time: "02:00 PM",
        venue: "Digital Hub",
        category: "AI",                      // Artificial Intelligence focus
        status: "upcoming"
    },
    {
        id: 6,
        event: "Blockchain Expo",
        organizer: "CryptoWorld",
        date: new Date("2026-02-25"),        // February 2026
        time: "03:00 PM",
        venue: "Tech Expo Arena",
        category: "Blockchain",              // Cryptocurrency and blockchain
        status: "upcoming"
    }
];

// Insert professional events into database
console.log('📅 Inserting professional events and conferences into database...');
Prediction_Match.insertMany(all_prediction_match)
.then(data => {
    console.log(`✅ Successfully inserted ${data.length} professional events`);
    console.log('🎯 Event schedules initialization completed');
    
    // Log event summary by category
    const categories = [...new Set(all_prediction_match.map(event => event.category))];
    console.log(`📊 Event categories: ${categories.join(', ')}`);
    
    // Log date range
    const dates = all_prediction_match.map(event => event.date).sort();
    const earliestDate = dates[0].toDateString();
    const latestDate = dates[dates.length - 1].toDateString();
    console.log(`📆 Event schedule spans: ${earliestDate} to ${latestDate}`);
})
.catch(err => {
    console.error('❌ Error inserting professional events:', err);
});
