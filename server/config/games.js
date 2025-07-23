/**
 * Unified Game Configuration
 * 
 * This file contains the centralized configuration for all mini-games
 * in the Freaky Four platform. Each game has a canonical ID, path, and port.
 */
const path = require('path');

const gameConfigs = {
  'tetris': { 
    path: process.env.VITE_APP_TETRIS_PATH,
    port: 4001 // Updated to match Vite configuration
  },
  'memory': { 
    path: process.env.VITE_APP_MEMORY_GAME_PATH,
    port: 4002 // Updated to match Vite configuration
  },
  'candy-crush': { 
    path: process.env.VITE_APP_CANDY_CRUSH_PATH,
    port: 4003 // Updated to match Vite configuration
  }
};

module.exports = gameConfigs;
