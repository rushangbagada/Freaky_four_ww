/**
 * This is a helper script to restart the server
 * Run this with: node restart-server.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Attempting to restart the server...');

// Kill any existing node processes (this might be system-specific)
try {
  // This is a gentle notification to restart
  console.log('Please restart your server manually to apply changes');
  console.log('You can do this by:');
  console.log('1. Stopping your current server process (Ctrl+C)');
  console.log('2. Running: node server.js');
  
  // Optional automatic restart (commented out for safety)
  /*
  const serverProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
  
  serverProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Server process exited with code ${code}`);
    }
  });
  */
} catch (error) {
  console.error('Error restarting server:', error);
}
