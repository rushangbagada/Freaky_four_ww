/**
 * Professional Business Testimonials Initialization Script
 * 
 * This script populates the database with professional business testimonials
 * and client reviews for the business analytics platform.
 * 
 * @description Initializes the review collection with realistic business testimonials
 * @author Web Wonders Team
 * @version 1.0.0
 */

// Database and server dependencies
const mongoose = require('mongoose');
const Review = require('./models/review');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Initialize database connection and start server
main()
.then(() => app.listen(port, () => console.log(`✅ Review initialization server listening on port ${port}`)))
.catch(err => console.log('❌ Failed to start server:', err));

/**
 * Establishes connection to MongoDB database
 * @description Connects to the business analytics database
 */
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
  console.log('🔗 Connected to MongoDB for review initialization');
}

/**
 * Professional Business Testimonials Data
 * 
 * Contains realistic client reviews from various business professionals
 * across different industries and company sizes.
 * 
 * @type {Array<Object>} Array of review objects
 * @property {string} name - Client's full name
 * @property {string} image - Professional headshot URL from Pexels
 * @property {string} position - Job title and company name
 * @property {string} review - Detailed testimonial highlighting business value
 */
const all_review = [
    {
        name: "Sarah Johnson",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
        position: "CEO, TechCorp Solutions",
        review: "Outstanding service and professionalism. Their team delivered exceptional results that exceeded our expectations and helped transform our business operations."
    },
    {
        name: "Michael Chen",
        image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
        position: "Director of Operations, Global Enterprises",
        review: "Working with this team has been a game-changer for our company. Their expertise and dedication to quality are unmatched in the industry."
    },
    {
        name: "Emily Rodriguez",
        image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
        position: "Marketing Manager, Innovation Labs",
        review: "Incredible attention to detail and customer service. They understood our vision perfectly and delivered results that drove significant growth for our business."
    },
    {
        name: "David Thompson",
        image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
        position: "Founder, StartUp Dynamics",
        review: "Professional, reliable, and innovative. This partnership has been instrumental in scaling our operations and achieving our business objectives efficiently."
    }
];

// Insert testimonials into database
console.log('📝 Inserting professional testimonials into database...');
Review.insertMany(all_review)
.then((res) => {
    console.log(`✅ Successfully inserted ${res.length} professional testimonials`);
    console.log('🎯 Review initialization completed');
})
.catch((err) => {
    console.error('❌ Error inserting testimonials:', err);
});
