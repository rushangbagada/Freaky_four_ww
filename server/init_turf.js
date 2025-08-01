const mongoose = require('mongoose');
const Turf = require('./models/turf');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const initTurfs = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing turfs
    await Turf.deleteMany({});
    console.log('🗑️ Cleared existing turf data');

    const turfs = [
      {
        id: 1,
        name: 'Green Valley Sports Complex',
        location: 'North Campus',
        price: 500,
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: true
      },
      {
        id: 2,
        name: 'Champions Football Ground',
        location: 'South Campus',
        price: 600,
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: true
      },
      {
        id: 3,
        name: 'Elite Cricket Academy',
        location: 'East Campus',
        price: 700,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: false
      },
      {
        id: 4,
        name: 'University Sports Center',
        location: 'West Campus',
        price: 450,
        imageUrl: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: true
      },
      {
        id: 5,
        name: 'Olympic Training Ground',
        location: 'Central Campus',
        price: 800,
        imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: true
      },
      {
        id: 6,
        name: 'Riverside Sports Hub',
        location: 'North Campus',
        price: 550,
        imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: true
      },
      {
        id: 7,
        name: 'Premier League Ground',
        location: 'South Campus',
        price: 750,
        imageUrl: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: true
      },
      {
        id: 8,
        name: 'Victory Sports Arena',
        location: 'East Campus',
        price: 650,
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75',
        availability: true
      }
    ];

    const result = await Turf.insertMany(turfs);
    console.log(`✅ Successfully initialized ${result.length} turfs`);
    
    // List all created turfs
    console.log('📋 Created turfs:');
    result.forEach(turf => {
      console.log(`   - ${turf.name} (${turf.location}) - ₹${turf.price}`);
    });
    
  } catch (error) {
    console.error('❌ Error initializing turfs:', error.message);
  } finally {
    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

initTurfs();

