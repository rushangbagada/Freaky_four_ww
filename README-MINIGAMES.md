# Freaky Four Mini-Games System

This document describes how the mini-games launching system works in the Freaky Four application.

## Overview

The application includes three mini-games:
- Tetris
- Memory Game
- Candy Crush

The backend starts these games as separate dev servers and provides URLs to the frontend, which opens them in new browser tabs.

## Configuration

### Game Configuration

Games are configured in a central location:
```
server/config/games.js
```

This file defines the mapping between game IDs, file paths, and ports:

```javascript
const gameConfigs = {
  'tetris': { 
    path: '...path to tetris game folder...',
    port: 4001 // Must match the port in the game's vite.config.js
  },
  'memory': { 
    path: '...path to memory game folder...',
    port: 4002 // Must match the port in the game's vite.config.js
  },
  'candy-crush': { 
    path: '...path to candy crush folder...',
    port: 4003 // Must match the port in the game's vite.config.js
  }
};
```

### Adding a New Game

To add a new game:

1. Add an entry to `server/config/games.js` with:
   - A unique game ID (e.g., 'snake-game')
   - The path to the game directory (where `npm start` or `npm run dev` works)
   - A unique port (not used by other games)

2. Add the game to the frontend UI in `frontend/sports-hub/components/minigames.jsx`:
   ```javascript
   {
     id: 'snake-game',  // Must match the ID in games.js
     title: 'Snake Game',
     icon: '🐍',
     description: 'Your game description',
     delay: '1.5s'
   }
   ```

## API Endpoints

The backend exposes these game-related endpoints:

- `GET /api/:gameId` - Launches the specified game and returns a URL
- `POST /api/:gameId` - Legacy endpoint, redirects to the GET endpoint

## Environment Variables

The application uses these environment variables:

- `PORT` - The port for the main backend server (default: 5000)
- `REACT_APP_API_BASE` - The base URL for API requests from frontend (default: http://localhost:5000)

## How It Works

1. When a user clicks "Play Now" on a game card, the frontend calls `/api/:gameId`
2. The backend checks if the game is already running:
   - If running, it returns the URL immediately
   - If not running, it starts a new dev server for the game
3. The backend waits until the game server is ready by polling its URL
4. Once ready, it returns the game URL to the frontend
5. The frontend opens the game URL in a new browser tab

## Common Issues and Troubleshooting

- **Game server doesn't start**: Check that the path in `games.js` is correct and contains a working npm project
- **Port conflicts**: Make sure each game uses a unique port that isn't used by other applications
- **Connection timeout**: The backend will timeout after 15 seconds if the game server doesn't respond

## Implementation Details

- The system uses Node's `child_process.exec` to start game servers with Windows cmd
- Game processes are started with detached windows so they continue running independently
- The system uses axios to poll the game URLs until they're ready
- The system checks if a game is already running before trying to start a new instance
- Detailed logging helps track the startup progress and diagnose issues
