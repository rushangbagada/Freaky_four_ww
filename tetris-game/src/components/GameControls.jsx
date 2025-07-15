function GameControls({ togglePause, toggleSound, soundEnabled, isPaused }) {
  return (
    <div className="game-controls">
      <div className="control-buttons">
        <button 
          onClick={togglePause}
          className={`control-btn ${isPaused ? 'resume' : 'pause'}`}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button 
          onClick={toggleSound}
          className={`control-btn ${soundEnabled ? 'sound-on' : 'sound-off'}`}
        >
          {soundEnabled ? '🔊 Sound' : '🔇 Muted'}
        </button>
      </div>
      
      <div className="mobile-controls">
        <div className="mobile-control-header">
          <h3>Mobile Controls</h3>
        </div>
        <div className="mobile-buttons">
          <button className="mobile-btn rotate-btn">↻</button>
          <div className="direction-controls">
            <button className="mobile-btn left-btn">←</button>
            <button className="mobile-btn down-btn">↓</button>
            <button className="mobile-btn right-btn">→</button>
          </div>
        </div>
      </div>
      
      <div className="instructions">
        <h4>Controls:</h4>
        <ul>
          <li>← → Move left/right</li>
          <li>↓ Soft drop</li>
          <li>↑ / Space: Rotate</li>
          <li>P / Esc: Pause</li>
        </ul>
      </div>
    </div>
  );
}

export default GameControls;
