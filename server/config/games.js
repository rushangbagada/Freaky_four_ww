/**
 * Unified Game Configuration
 * 
 * This file contains the centralized configuration for all mini-games
 * in the Freaky Four platform. Each game has a canonical ID, path, and port.
 */
const path = require('path');

const gameConfigs = {
  'tetris': { 
    path: 'C:\\Users\\Rushang\\Desktop\\web_wonders\\tetris-react-js\\tetris-react-js\\tetris-game',
    port: 4001 // Updated to match Vite configuration
  },
  'memory': { 
    path: 'C:\\Users\\Rushang\\Desktop\\web_wonders\\memory_game\\memory_game\\memory-game',
    port: 4002 // Updated to match Vite configuration
  },
  'candy-crush': { 
    path: 'C:\\Users\\Rushang\\Desktop\\web_wonders\\candy-crush\\candy-crush\\candy-crush',
    port: 4003 // Updated to match Vite configuration
  }
};

module.exports = gameConfigs;
