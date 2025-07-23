/**
 * Test script for checking game launching functionality
 * 
 * This script makes requests to the game API endpoints to test if games are launched correctly.
 */
const axios = require('axios');

// Base URL for API requests
const API_BASE = 'http://localhost:5000';

// Game IDs to test
const GAME_IDS = ['tetris', 'memory', 'candy-crush'];

// Function to test launching a game
async function testGameLaunch(gameId) {
  console.log(`\n🎮 Testing game: ${gameId}`);
  
  try {
    console.log(`🔄 Making request to ${API_BASE}/api/${gameId}`);
    const response = await axios.post(`${API_BASE}/api/${gameId}`);
    
    if (response.data.success) {
      console.log(`✅ Success! Game URL: ${response.data.url}`);
    } else {
      console.log(`❌ Request failed: ${response.data.message}`);
    }
  } catch (error) {
    console.error(`❌ Error launching game: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data)}`);
    }
  }
}

// Main function to test all games
async function testAllGames() {
  console.log('🧪 MINI-GAME LAUNCH TEST');
  console.log('=======================');
  
  for (const gameId of GAME_IDS) {
    await testGameLaunch(gameId);
  }
  
  console.log('\n✨ Test completed');
}

// Run the tests
testAllGames();
