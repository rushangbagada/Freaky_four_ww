import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithSportsBot } from '../src/services/sportsBot';
import { useAuth } from '../src/AuthContext';
import './css/floatingChatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Welcome to Sports AI! I\'m your personal sports assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && user.name) {
      setUsername(user.name);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatWithSportsBot(
        messages.map(m => m.text).concat(inputMessage),
        username || user?.name || 'User'
      );
      
      const botMessage = {
        type: 'bot',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'bot',
        text: '🚫 Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: '🏀',
      text: 'Basketball Tips',
      query: 'Give me some basketball shooting tips'
    },
    {
      icon: '⚽',
      text: 'Soccer Training',
      query: 'What\'s a good soccer training routine?'
    },
    {
      icon: '🏃‍♂️',
      text: 'Running Guide',
      query: 'How can I improve my running stamina?'
    },
    {
      icon: '💪',
      text: 'Strength Training',
      query: 'Show me strength training exercises'
    }
  ];

  const handleQuickAction = (query) => {
    setInputMessage(query);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const openFullChat = () => {
    navigate('/chatbot');
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className={`chat-fab ${isOpen ? 'chat-fab--hidden' : ''}`}
        onClick={toggleChat}
        title="Chat with Sports AI"
      >
        <div className="chat-fab__icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <div className="chat-fab__pulse"></div>
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'chat-window--open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header__info">
            <div className="chat-header__avatar">
              <div className="avatar-icon">🤖</div>
              <div className="status-indicator"></div>
            </div>
            <div className="chat-header__details">
              <h3 className="chat-header__title">Sports AI</h3>
              <p className="chat-header__status">Online • Ready to help</p>
            </div>
          </div>
          <div className="chat-header__actions">
            <button 
              className="chat-header__btn" 
              onClick={openFullChat}
              title="Expand chat"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>
            <button 
              className="chat-header__btn" 
              onClick={closeChat}
              title="Close chat"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          <div className="chat-messages__container">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`chat-message chat-message--${message.type}`}
              >
                <div className="chat-message__avatar">
                  {message.type === 'user' ? (
                    <div className="user-avatar">
                      {user?.name?.[0]?.toUpperCase() || '👤'}
                    </div>
                  ) : (
                    <div className="bot-avatar">🤖</div>
                  )}
                </div>
                <div className="chat-message__content">
                  <div className="chat-message__bubble">
                    <p className="chat-message__text">{message.text}</p>
                  </div>
                  <div className="chat-message__time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="chat-message chat-message--bot">
                <div className="chat-message__avatar">
                  <div className="bot-avatar">🤖</div>
                </div>
                <div className="chat-message__content">
                  <div className="chat-message__bubble">
                    <div className="typing-animation">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="quick-actions">
            <div className="quick-actions__header">
              <span>Quick actions:</span>
            </div>
            <div className="quick-actions__grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action"
                  onClick={() => handleQuickAction(action.query)}
                >
                  <span className="quick-action__icon">{action.icon}</span>
                  <span className="quick-action__text">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="chat-input">
          {!user && (
            <div className="chat-input__name">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="name-input"
              />
            </div>
          )}
          <div className="chat-input__main">
            <div className="input-container">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="message-input"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="send-button"
                title="Send message"
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="chat-backdrop" onClick={closeChat}></div>}
    </>
  );
};

export default FloatingChatbot;
