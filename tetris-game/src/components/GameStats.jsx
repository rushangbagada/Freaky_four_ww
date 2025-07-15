function GameStats({ score, level, linesCleared }) {
  return (
    <div className="game-stats">
      <div className="stat-item">
        <span className="stat-label">Score:</span>
        <span className="stat-value">{score.toLocaleString()}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Level:</span>
        <span className="stat-value">{level}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Lines:</span>
        <span className="stat-value">{linesCleared}</span>
      </div>
    </div>
  );
}

export default GameStats;
