import { useCallback, useEffect, useState } from 'react';
import { EmptyCell, SHAPES, GameStats } from '../types';
import { useInterval } from './useInterval';
import {
  useTetrisBoard,
  hasCollisions,
  BOARD_HEIGHT,
  getEmptyBoard,
  getRandomBlock,
} from './useTetrisBoard';

const MAX_HIGH_SCORES = 10;

// Sound effects using Web Audio API
const createBeep = (frequency, duration) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Ignore audio errors
  }
};

const playSound = (type, soundEnabled = true) => {
  if (!soundEnabled) return;
  
  switch (type) {
    case 'move':
      createBeep(200, 0.1);
      break;
    case 'rotate':
      createBeep(300, 0.1);
      break;
    case 'drop':
      createBeep(150, 0.2);
      break;
    case 'clear':
      createBeep(400, 0.3);
      break;
    case 'tetris':
      createBeep(600, 0.5);
      break;
    case 'gameover':
      createBeep(100, 1);
      break;
    case 'levelup':
      createBeep(500, 0.4);
      break;
  }
};

export function saveHighScore(score) {
  const existingScores = JSON.parse(localStorage.getItem('highScores') || '[]');
  existingScores.push(score);
  const updatedScores = existingScores
    .sort((a, b) => b - a)
    .slice(0, MAX_HIGH_SCORES);
  localStorage.setItem('highScores', JSON.stringify(updatedScores));
}

export function getHighScores() {
  try {
    const scores = JSON.parse(localStorage.getItem('highScores') || '[]');
    return Array.isArray(scores) ? scores.sort((a, b) => b - a).slice(0, MAX_HIGH_SCORES) : [];
  } catch {
    return [];
  }
}

const TickSpeed = {
  Normal: 800,
  Sliding: 100,
  Fast: 50,
};

// Calculate speed based on level
const getSpeedForLevel = (level) => {
  const baseSpeed = 800;
  const speedIncrease = Math.min(level * 50, 700);
  return Math.max(baseSpeed - speedIncrease, 100);
};

// Find ghost piece position
const findGhostPosition = (board, shape, row, column) => {
  let ghostRow = row;
  while (!hasCollisions(board, shape, ghostRow + 1, column)) {
    ghostRow++;
  }
  return ghostRow;
};

export function useTetris() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [upcomingBlocks, setUpcomingBlocks] = useState([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clearedLines, setClearedLines] = useState([]);
  const [showLineEffect, setShowLineEffect] = useState(false);

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  // Toggle pause
  const togglePause = useCallback(() => {
    if (!isPlaying) return;
    setIsPaused(prev => !prev);
    playSound('move', soundEnabled);
  }, [isPlaying, soundEnabled]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const startGame = useCallback(() => {
    const startingBlocks = [
      getRandomBlock(),
      getRandomBlock(),
      getRandomBlock(),
    ];
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setUpcomingBlocks(startingBlocks);
    setIsCommitting(false);
    setIsPlaying(true);
    setIsPaused(false);
    setClearedLines([]);
    setShowLineEffect(false);
    setTickSpeed(getSpeedForLevel(1));
    dispatchBoardState({ type: 'start' });
  }, [dispatchBoardState]);

  const commitPosition = useCallback(() => {
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommitting(false);
      setTickSpeed(getSpeedForLevel(level));
      return;
    }

    const newBoard = structuredClone(board);
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );

    // Find completed lines
    const completedLines = [];
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
        completedLines.push(row);
      }
    }

    const numCleared = completedLines.length;
    
    if (numCleared > 0) {
      // Show line clear effect
      setClearedLines(completedLines);
      setShowLineEffect(true);
      
      // Play sound effect
      if (numCleared === 4) {
        playSound('tetris', soundEnabled);
      } else {
        playSound('clear', soundEnabled);
      }
      
      // Remove completed lines after a short delay
      setTimeout(() => {
        completedLines.forEach((row) => {
          newBoard.splice(row, 1);
        });
        
        const newLinesCleared = linesCleared + numCleared;
        const newLevel = Math.min(
          Math.floor(newLinesCleared / GameStats.LINES_PER_LEVEL) + 1,
          GameStats.MAX_LEVEL
        );
        
        if (newLevel > level) {
          playSound('levelup', soundEnabled);
        }
        
        setLinesCleared(newLinesCleared);
        setLevel(newLevel);
        setShowLineEffect(false);
        setClearedLines([]);
        
        // Calculate score based on level
        const baseScore = GameStats.BASE_SCORE[
          numCleared === 1 ? 'SINGLE' :
          numCleared === 2 ? 'DOUBLE' :
          numCleared === 3 ? 'TRIPLE' : 'TETRIS'
        ];
        setScore(prev => prev + baseScore * newLevel);
        
        // Update tick speed for new level
        setTickSpeed(getSpeedForLevel(newLevel));
      }, 500);
    }

    const newUpcomingBlocks = structuredClone(upcomingBlocks);
    const newBlock = newUpcomingBlocks.pop();
    newUpcomingBlocks.unshift(getRandomBlock());

    if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      saveHighScore(score);
      setIsPlaying(false);
      setTickSpeed(null);
      playSound('gameover', soundEnabled);
    } else {
      setTickSpeed(getSpeedForLevel(level));
    }
    
    setUpcomingBlocks(newUpcomingBlocks);
    dispatchBoardState({
      type: 'commit',
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommitting(false);
  }, [
    board,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    upcomingBlocks,
    score,
    level,
    linesCleared,
    soundEnabled,
  ]);

  const gameTick = useCallback(() => {
    if (isPaused) return;
    
    if (isCommitting) {
      commitPosition();
    } else if (
      hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: 'drop' });
    }
  }, [
    board,
    commitPosition,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isCommitting,
    isPaused,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, tickSpeed);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({
        type: 'move',
        isPressingLeft,
        isPressingRight,
      });
      moveIntervalID = setInterval(() => {
        dispatchBoardState({
          type: 'move',
          isPressingLeft,
          isPressingRight,
        });
      }, 150);
    };

    const handleKeyDown = (event) => {
      if (event.repeat) {
        return;
      }

      if (event.key === 'Escape' || event.key === 'p' || event.key === 'P') {
        togglePause();
        return;
      }

      if (isPaused) return;

      if (event.key === 'ArrowDown') {
        setTickSpeed(TickSpeed.Fast);
        playSound('move', soundEnabled);
      }

      if (event.key === 'ArrowUp' || event.key === ' ') {
        dispatchBoardState({
          type: 'move',
          isRotating: true,
        });
        playSound('rotate', soundEnabled);
      }

      if (event.key === 'ArrowLeft') {
        isPressingLeft = true;
        updateMovementInterval();
        playSound('move', soundEnabled);
      }

      if (event.key === 'ArrowRight') {
        isPressingRight = true;
        updateMovementInterval();
        playSound('move', soundEnabled);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowDown') {
        setTickSpeed(getSpeedForLevel(level));
      }

      if (event.key === 'ArrowLeft') {
        isPressingLeft = false;
        updateMovementInterval();
      }

      if (event.key === 'ArrowRight') {
        isPressingRight = false;
        updateMovementInterval();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveIntervalID);
      setTickSpeed(getSpeedForLevel(level));
    };
  }, [dispatchBoardState, isPlaying, isPaused, level, soundEnabled, togglePause]);

  // Create the rendered board with ghost piece
  const renderedBoard = structuredClone(board);
  if (isPlaying && !isPaused) {
    // Add ghost piece
    const ghostRow = findGhostPosition(board, droppingShape, droppingRow, droppingColumn);
    if (ghostRow > droppingRow) {
      addShapeToBoard(
        renderedBoard,
        EmptyCell.Ghost,
        droppingShape,
        ghostRow,
        droppingColumn
      );
    }
    
    // Add current piece
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );
  }

  // Add line clear effect
  if (showLineEffect) {
    clearedLines.forEach(row => {
      for (let col = 0; col < renderedBoard[row].length; col++) {
        renderedBoard[row][col] = 'clearing';
      }
    });
  }

  return {
    board: renderedBoard,
    startGame,
    isPlaying,
    isPaused,
    score,
    level,
    linesCleared,
    upcomingBlocks,
    highScores: getHighScores(),
    togglePause,
    toggleSound,
    soundEnabled,
    showLineEffect,
  };
}

function addShapeToBoard(
  board,
  droppingBlock,
  droppingShape,
  droppingRow,
  droppingColumn
) {
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row, rowIndex) => {
      row.forEach((isSet, colIndex) => {
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] =
            droppingBlock;
        }
      });
    });
}
