import Board from './components/Board';
import UpcomingBlocks from './components/UpcomingBlocks';
import HighScores from './components/HighScores';
import GameStats from './components/GameStats';
import GameControls from './components/GameControls';
import { useTetris } from './hooks/useTetris';

function App() {
  const { 
    board, 
    startGame, 
    isPlaying, 
    isPaused,
    score, 
    level,
    linesCleared,
    upcomingBlocks,
    togglePause,
    toggleSound,
    soundEnabled,
    showLineEffect
  } = useTetris();

  return (
    <div className="app">
      <h1>Welcome to Tetris</h1>
      <Board currentBoard={board} isPlaying={isPlaying} isPaused={isPaused} showLineEffect={showLineEffect} />
      <div className="controls">
        <GameStats 
          score={score} 
          level={level} 
          linesCleared={linesCleared}
        />
        {isPlaying ? (
          <>
            <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
            <GameControls 
              togglePause={togglePause}
              toggleSound={toggleSound}
              soundEnabled={soundEnabled}
              isPaused={isPaused}
            />
          </>
        ) : (
          <>
            <button onClick={startGame}>New Game</button>
            <HighScores />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
