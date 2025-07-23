const express = require('express');
const router = express.Router();
const { spawn, exec } = require('child_process');
const fs = require('fs');
const http = require('http');

// Function to open URL in browser using OS-specific command
function openBrowser(url) {
  const platform = process.platform;
  let command;

  // Use appropriate command based on the operating system
  if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  // Execute the command to open the browser
  exec(command, (error) => {
    if (error) {
      console.error(`Failed to open browser: ${error.message}`);
    }
  });
}

// Import config from our centralized file
const gameConfigs = require('../config/games.js');

// Convert to the format needed for this implementation
const gameConfig = {
  'tetris': {
    path: gameConfigs['tetris'].path,
    startCmd: 'npm',
    startArgs: ['run', 'dev'],
    port: gameConfigs['tetris'].port
  },
  'memory': {
    path: gameConfigs['memory'].path,
    startCmd: 'npm',
    startArgs: ['run', 'dev'],
    port: gameConfigs['memory'].port
  },
  'candy-crush': {
    path: gameConfigs['candy-crush'].path,
    startCmd: 'npm',
    startArgs: ['run', 'dev'],
    port: gameConfigs['candy-crush'].port
  }
};

const runningGames = {};

/**
 * Utility: wait for the dev server to be ready
 */
function waitForServer(port, timeout = 30000) { // Increased timeout to 30 seconds
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const req = http.get({ hostname: 'localhost', port, timeout: 1000 }, res => {
        resolve();
      });

      req.on('error', () => {
        if (Date.now() - startTime > timeout) return reject(new Error('Timeout'));
        setTimeout(check, 1000);
      });
    };

    check();
  });
}

// Add GET endpoint for frontend compatibility
router.get('/:gameId', async (req, res) => {
  // Just redirect to the POST handler
  return router.handle({
    method: 'POST',
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers
  }, res);
});

router.post('/:gameId', async (req, res) => {
  const gameId = req.params.gameId;
  const config = gameConfig[gameId];

  if (!config) {
    return res.status(404).json({ success: false, message: 'Invalid game ID' });
  }

  if (!fs.existsSync(config.path)) {
    return res.status(500).json({ success: false, message: `Game directory not found: ${config.path}` });
  }

  const gameURL = `http://localhost:${config.port}`;

  if (!runningGames[gameId]) {
    const child = spawn(config.startCmd, config.startArgs, {
      cwd: config.path,
      shell: true,
      detached: true,
      stdio: 'ignore'
    });

    child.unref();
    runningGames[gameId] = true;

    console.log(`🟢 Starting ${gameId} server at ${config.path}...`);

    try {
      await waitForServer(config.port);
      console.log(`✅ ${gameId} server is ready at ${gameURL}`);
      console.log(`🔎 Opening browser for ${gameURL}...`);
      openBrowser(gameURL); // only after it's ready
      return res.json({ success: true, url: gameURL });
    } catch (err) {
      console.error(`❌ ${gameId} did not start in time.`);
      return res.status(504).json({ success: false, message: 'Game server did not respond in time.' });
    }
  } else {
    console.log(`⚠️ ${gameId} already running at ${gameURL}`);
    console.log(`🔎 Opening browser for existing ${gameId} server...`);
    openBrowser(gameURL);
    return res.json({ success: true, url: gameURL });
  }
});

module.exports = router;
