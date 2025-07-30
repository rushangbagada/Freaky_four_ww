import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithSportsBot } from '../src/services/sportsBot';
import { useAuth } from '../src/AuthContext'; // Import useAuth
import './css/floatingChatbot.css';

console.log('FloatingChatbot component loaded');

const FloatingChatbot = () => {
  console.log('FloatingChatbot render');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    if (user && user.name) {
      setUsername(user.name);
    }
  }, [user]);

  const handleChatMessage = async () => {
    if (!inputMessage.trim()) return;

    setLoading(true);
    try {
      const userMessages = [...messages, inputMessage];
      const response = await chatWithSportsBot(userMessages, username);
      setMessages([...userMessages, response]);
      setInputMessage('');
    } catch (error) {
      console.error('Error:', error);
      // Show a more user-friendly error message
      setMessages([...messages, inputMessage, 'Sorry, I encountered an error. Please try again later.']);
      setInputMessage('');
    } finally {
      setLoading(false);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const openFullChatbot = () => {
    navigate('/chatbot');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className={`floating-chat-button ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChatbot}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
          zIndex: '1000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="chat-icon">
          🤖
        </div>
        <div className="chat-tooltip">
          Ask Sports Bot
        </div>
      </div>

      {/* Floating Chatbot Window */}
      <div className={`floating-chatbot ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-content">
            <div className="bot-avatar">🏆</div>
            <div className="header-text">
              <h3>Sports Bot</h3>
              <p>AI Sports Coach</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="expand-btn" onClick={openFullChatbot} title="Open Full Chatbot">
              🔍
            </button>
            <button className="close-btn" onClick={closeChatbot}>
              ×
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="chatbot-messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-avatar">👋</div>
              <p><strong>Welcome to Sports Bot{user ? `, ${user.name}` : ''}!</strong></p>
              <p>Ask me about sports training, techniques, strategies, or game analysis!</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${index % 2 === 0 ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-avatar">
                {index % 2 === 0 ? '🏃‍♂️' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="chatbot-input">
          {!user && (
            <div className="username-input">
              <input
                type="text"
                placeholder="Enter your name (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="username-field"
              />
            </div>
          )}
          <div className="input-container">
            <input
              type="text"
              placeholder="Ask about sports training, techniques..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
              className="message-input"
              disabled={loading}
            />
            <button 
              onClick={handleChatMessage} 
              disabled={loading || !inputMessage.trim()}
              className="send-button"
            >
              {loading ? '⏳' : '📤'}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            onClick={() => setInputMessage("How can I improve my basketball shooting?")}
          >
            🏀 Basketball Tips
          </button>
          <button 
            className="quick-action-btn"
            onClick={() => setInputMessage("Give me a workout plan for soccer")}
          >
            ⚽ Soccer Training
          </button>
          <button 
            className="quick-action-btn"
            onClick={() => setInputMessage("What are some good stretching exercises?")}
          >
            🧘‍♂️ Stretching
          </button>
        </div>
      </div>

      {/* Overlay when chatbot is open */}
      {isOpen && <div className="chatbot-overlay" onClick={closeChatbot}></div>}
    </>
  );
};

export default FloatingChatbot;
