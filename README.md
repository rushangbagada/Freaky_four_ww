# 🍭 Candy Crush Game

A beautiful and interactive Candy Crush game built with React and Vite.

## Features

- **Drag & Drop Gameplay**: Swap adjacent candies to form matches
- **Match Detection**: Automatically detects rows and columns of 3 or 4 matching candies
- **Scoring System**: Earn points for every match (3 points for 3-matches, 4 points for 4-matches)
- **Responsive Design**: Works on both desktop and mobile devices
- **Beautiful UI**: Modern glassmorphism design with animations
- **Auto-falling Candies**: Candies automatically fall down and new ones spawn from the top

## Technologies Used

- React 19 with Hooks (useState, useEffect, useCallback)
- Vite for fast development and building
- Modern CSS with animations and responsive design
- ESLint for code quality

## Improvements Made

✅ **Fixed JavaScript Issues:**
- Converted `scoreboard.js` to `ScoreBoard.jsx` for proper JSX handling
- Fixed import path issues
- Wrapped functions in `useCallback` to optimize performance
- Resolved all ESLint warnings

✅ **Enhanced UI/UX:**
- Added beautiful gradient background
- Implemented glassmorphism design with backdrop blur
- Added hover effects and smooth animations
- Created responsive design for mobile devices
- Added animated game title with gradient text
- Improved scoreboard styling

✅ **Performance Optimizations:**
- Used `useCallback` for function memoization
- Optimized React re-renders
- Clean dependency management in useEffect

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Game Instructions

1. Drag and drop candies to swap adjacent positions
2. Create horizontal or vertical lines of 3 or more matching candies
3. Watch your score increase as you make matches
4. Candies will automatically fall down and new ones will spawn
5. Try to get the highest score possible!

## Project Structure

```
src/
├── components/
│   └── ScoreBoard.jsx     # Score display component
├── images/               # Candy images and blank tile
├── App.jsx              # Main game component
├── App.css              # Additional styles
├── index.css            # Main styling
└── main.jsx             # App entry point
```
