# Tetris Game

A fully functional Tetris game built with React and Vite. This game includes all the classic Tetris features with modern web technologies.

## Features

- Classic Tetris gameplay with 7 different tetromino pieces
- Line clearing with visual effects
- Progressive difficulty levels
- Ghost piece preview
- Hold functionality for pieces
- High score tracking (localStorage)
- Sound effects (Web Audio API)
- Responsive controls
- Pause functionality
- Real-time score and level display

## Controls

- **Arrow Keys**: Move and rotate pieces
  - Left/Right: Move piece horizontally
  - Up/Space: Rotate piece
  - Down: Soft drop (faster falling)
- **P or Escape**: Pause/unpause game
- **Sound toggle**: Available in game interface

## Installation

1. Navigate to the tetris-game directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the displayed URL (usually `http://localhost:5173`)

## Build for Production

```bash
npm run build
```

## Game Mechanics

- **Scoring**: Points are awarded for clearing lines (more points for clearing multiple lines at once)
- **Levels**: Difficulty increases every 10 lines cleared
- **Speed**: Pieces fall faster as levels increase
- **Line Clearing**: Complete horizontal lines disappear and award points
- **Tetris**: Clearing 4 lines at once gives bonus points
- **Ghost Piece**: Shows where the current piece will land

## Technical Details

- Built with React 18+ using hooks
- Vite for fast development and building
- Custom game engine with collision detection
- Web Audio API for sound effects
- localStorage for high score persistence
- Responsive design for different screen sizes

## Components

- `App.jsx`: Main game component
- `Board.jsx`: Game board rendering
- `Cell.jsx`: Individual cell rendering
- `GameControls.jsx`: Game control buttons
- `GameStats.jsx`: Score and level display
- `HighScores.jsx`: High score display
- `UpcomingBlocks.jsx`: Next piece preview

## Hooks

- `useTetris.js`: Main game logic and state management
- `useTetrisBoard.js`: Board state and piece movement
- `useInterval.js`: Custom interval hook for game timing

## Author

Part of the Freaky Four team project - Created by Rudraksh
