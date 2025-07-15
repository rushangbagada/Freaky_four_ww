import Cell from './Cell';

function Board({ currentBoard, isPlaying, isPaused, showLineEffect }) {
  const boardClasses = [
    'board',
    !isPlaying && 'game-over',
    isPaused && 'paused',
    showLineEffect && 'line-clearing'
  ].filter(Boolean).join(' ');

  return (
    <div className={boardClasses} role="grid">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-message">PAUSED</div>
          <div className="pause-sub">Press P or ESC to resume</div>
        </div>
      )}
    </div>
  );
}

export default Board;
