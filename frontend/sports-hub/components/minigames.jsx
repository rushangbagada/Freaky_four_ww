import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/minigames.css';

const GameLandingPage = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'tetris-game',
      title: 'Tetris Game',
      icon: '🧩',
      description: 'Stack blocks and clear lines in this classic puzzle game!',
      url: 'D:/react+express/tetris-react-js', // ✅ safer path
      delay: '0s'
    },
    {
      id: 'memory-game',
      title: 'Memory Game',
      icon: '🧠',
      description: 'Test your memory skills by matching pairs of cards!',
      url: 'D:/react+express/memory_game/memory-game', // ✅
      delay: '0.5s'
    },
    {
      id: 'candy-crush',
      title: 'Candy Crush',
      icon: '🍭',
      description: 'Match colorful candies and score big in this sweet puzzle adventure!',
      url: 'D:/react+express/candy-crush/candy-crush', // ✅
      delay: '1s'
    }
  ];

  const socialLinks = [
    { name: '🐙 GitHub', url: '#' },
    { name: '💼 LinkedIn', url: '#' },
    { name: '🌐 Website', url: '#' }
  ];

  const floatingElements = [
    { emoji: '🎯', delay: '0s', top: '20%', left: '10%' },
    { emoji: '🎲', delay: '2s', top: '60%', left: '80%' },
    { emoji: '🏆', delay: '4s', top: '80%', left: '15%' },
    { emoji: '⭐', delay: '1s', top: '30%', left: '70%' },
    { emoji: '🎪', delay: '3s', top: '10%', left: '60%' }
  ];

  const handleRunProject = async (gameId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/${gameId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Server error: ${response.status} - ${error.message}`);
    }

    const data = await response.json();
    console.log(`Opening game at ${data.url}`);
    window.open(data.url, '_blank'); // opens in new tab
  } catch (err) {
    console.error('Error launching game:', err);
    alert(`Error: ${err.message}`);
  }
};


  return (
    <div className="game-landing-container">
      <div className="container">
        <header className="hero-section">
          <h1 className="title">🎮 Freaky Four Games 🎮</h1>
          <p className="subtitle">Choose your adventure and dive into exciting games!</p>
        </header>

        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className={`game-card ${game.id}`}>
              <div 
                className="game-icon"
                style={{ animationDelay: game.delay }}
              >
                {game.icon}
              </div>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <button 
                className="play-btn"
                onClick={() => handleRunProject(game.id)}
              >
                <span>Play Now</span>
                <div className="btn-glow"></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="floating-elements">
        {floatingElements.map((element, index) => (
          <div 
            key={index}
            className="floating-element"
            style={{
              '--delay': element.delay,
              top: element.top,
              left: element.left
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLandingPage;
