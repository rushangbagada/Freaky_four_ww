// const express = require('express');
// const router = express.Router();
// const { spawn } = require('child_process');
// const fs = require('fs');
// const open = require('open'); // ✅ Add this

// // ✅ Game configurations
// const gameConfig = {
//   'candy-crush': {
//     path: 'D:/react+express/candy-crush/candy-crush',
//     startCmd: 'npm',
//     startArgs: ['run', 'dev'],
//     port: 4003
//   },
//   'memory-game': {
//     path: 'D:/react+express/memory_game/memory-game',
//     startCmd: 'npm',
//     startArgs: ['run', 'dev'],
//     port: 4002
//   },
//   'tetris-game': {
//     path: 'D:/react+express/tetris-react-js',
//     startCmd: 'npm',
//     startArgs: ['run', 'dev'],
//     port: 4001
//   }
// };

// // 🧠 Track already-running games
// const runningGames = {};

// router.post('/:gameId', (req, res) => {
//   const gameId = req.params.gameId;
//   const config = gameConfig[gameId];

//   if (!config) {
//     return res.status(404).json({ success: false, message: 'Invalid game ID' });
//   }

//   if (!fs.existsSync(config.path)) {
//     return res.status(500).json({ success: false, message: `Game directory not found: ${config.path}` });
//   }

//   if (!runningGames[gameId]) {
//     const child = spawn(config.startCmd, config.startArgs, {
//       cwd: config.path,
//       shell: true,
//       detached: true,
//       stdio: 'ignore' // or 'inherit' for debugging
//     });

//     child.unref();
//     runningGames[gameId] = true;
//     console.log(`✅ Started game server for: ${gameId}`);

//     // ✅ Open game URL in browser after delay
//     setTimeout(() => {
//       open(`http://localhost:${config.port}`);
//     }, 3000); // Adjust delay if needed
//   } else {
//     console.log(`⚠️ Game ${gameId} is already running`);
//   }

//   res.json({
//     success: true,
//     url: `http://localhost:${config.port}`
//   });
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs');
const open = require('open');
const http = require('http');

const gameConfig = {
  'candy-crush': {
    path: 'D:/react+express/candy-crush/candy-crush',
    startCmd: 'npm',
    startArgs: ['run', 'dev'],
    port: 4003
  },
  'memory-game': {
    path: 'D:/react+express/memory_game/memory-game',
    startCmd: 'npm',
    startArgs: ['run', 'dev'],
    port: 4002
  },
  'tetris-game': {
    path: 'D:/react+express/tetris-react-js/tetris-game',
    startCmd: 'npm',
    startArgs: ['run', 'dev'],
    port: 4001
  }
};

const runningGames = {};

/**
 * Utility: wait for the dev server to be ready
 */
function waitForServer(port, timeout = 15000) {
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

    console.log(`🟢 Starting ${gameId} server...`);

    try {
      await waitForServer(config.port);
      console.log(`✅ ${gameId} server is ready at ${gameURL}`);
      open(gameURL); // only after it's ready
      return res.json({ success: true, url: gameURL });
    } catch (err) {
      console.error(`❌ ${gameId} did not start in time.`);
      return res.status(504).json({ success: false, message: 'Game server did not respond in time.' });
    }
  } else {
    console.log(`⚠️ ${gameId} already running`);
    open(gameURL);
    return res.json({ success: true, url: gameURL });
  }
});

module.exports = router;
