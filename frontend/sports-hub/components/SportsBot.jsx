import React, { useState, useEffect } from 'react';
import { chatWithSportsBot } from '../src/services/sportsBot';
import { useAuth } from '../src/AuthContext';

const SportsBot = () => {
  // Styles
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--bg-dark)',
    display: 'flex',
    flexDirection: 'row',
    fontFamily: "'Poppins', 'Inter', sans-serif",
    paddingTop: '100px'
  };

  const sidebarStyle = {
    width: '280px',
    backgroundColor: 'var(--card-dark)',
    borderRight: '1px solid var(--card-accent)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    overflowY: 'auto'
  };

  const chatAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 100px)'
  };

  const headerStyle = {
    background: 'var(--gradient-text)',
    color: 'transparent',
    textAlign: 'center',
    padding: '25px',
    position: 'relative',
    WebkitBackgroundClip: 'text'
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: 'var(--bg-medium)',
    borderBottom: '1px solid var(--card-accent)'
  };

  const messageStyle = (isUser) => ({
    display: 'flex',
    flexDirection: isUser ? 'row-reverse' : 'row',
    marginBottom: '15px',
    alignItems: 'flex-start'
  });

  const messageBubbleStyle = (isUser) => ({
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
    backgroundColor: isUser ? 'var(--accent-blue-deep)' : 'var(--card-accent)',
    color: 'var(--text-primary)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word'
  });

  const inputContainerStyle = {
    display: 'flex',
    padding: '20px',
    backgroundColor: 'var(--card-dark)',
    borderTop: '1px solid var(--card-accent)',
    gap: '12px'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '25px',
    border: '2px solid var(--card-accent)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  };

  const buttonStyle = {
    background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-blue-deep))',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    minWidth: '80px'
  };

  const welcomeStyle = {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    padding: '40px 20px',
    fontSize: '16px'
  };

  const sidebarButtonStyle = {
    background: 'var(--card-accent)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 16px',
    margin: '8px 0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const sidebarTitleStyle = {
    color: 'var(--text-primary)',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center'
  };


  // State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const { user } = useAuth();

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
      
      // Save to chat history if it's a new conversation
      if (messages.length === 0) {
        const newChatId = Date.now();
        const newChat = {
          id: newChatId,
          title: inputMessage.substring(0, 30) + (inputMessage.length > 30 ? '...' : ''),
          messages: [...userMessages, response],
          timestamp: new Date().toLocaleString()
        };
        setChatHistory([newChat, ...chatHistory]);
        setCurrentChatId(newChatId);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const loadChatHistory = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

  const clearAllHistory = () => {
    setChatHistory([]);
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatMessage();
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={sidebarTitleStyle}>
          🏆 Sports Bot
        </div>
        
        <button 
          onClick={startNewChat}
          style={{
            ...sidebarButtonStyle,
            background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-blue-deep))',
            marginBottom: '20px'
          }}
        >
          <span>➕</span> New Chat
        </button>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '10px' }}>Chat History</h4>
          {chatHistory.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontStyle: 'italic' }}>No chat history yet</p>
          ) : (
            chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => loadChatHistory(chat)}
                style={{
                  ...sidebarButtonStyle,
                  backgroundColor: currentChatId === chat.id ? 'var(--accent-blue-deep)' : 'var(--card-accent)',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '10px 12px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{chat.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{chat.timestamp}</div>
              </button>
            ))
          )}
        </div>

        {chatHistory.length > 0 && (
          <button 
            onClick={clearAllHistory}
            style={{
              ...sidebarButtonStyle,
              background: 'var(--accent-live)',
              marginTop: 'auto'
            }}
          >
            <span>🗑️</span> Clear History
          </button>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--card-accent)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center' }}>
            {user ? `Welcome, ${user.name}!` : 'AI Sports Coach'}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={chatAreaStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>
            🏆 Sports Bot
          </h1>
          <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
            Your Personal AI Sports Coach & Training Assistant
          </p>
        </div>

        {/* Messages Container */}
        <div style={messagesContainerStyle}>
          {messages.length === 0 ? (
            <div style={welcomeStyle}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
              <h3 style={{ color: '#495057', marginBottom: '15px' }}>
                Welcome to Sports Bot{user ? `, ${user.name}` : ''}! 👋
              </h3>
              <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                I'm your AI sports coach ready to help you with:
              </p>
              <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                <p>🏃‍♂️ Training techniques and tips</p>
                <p>⚽ Sport-specific strategies</p>
                <p>💪 Workout recommendations</p>
                <p>🎯 Performance improvement advice</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={messageStyle(index % 2 === 0)}>
                <div style={messageBubbleStyle(index % 2 === 0)}>
                  <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '4px', 
                    opacity: 0.8,
                    fontWeight: 'bold'
                  }}>
                    {index % 2 === 0 ? '🏃‍♂️ You' : '🤖 Sports Bot'}
                  </div>
                  <div style={{ lineHeight: '1.4' }}>{msg}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Container */}
        <div style={inputContainerStyle}>
          <input
            type="text"
            placeholder="Ask me about sports training, techniques, strategies..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            style={inputStyle}
            disabled={loading}
          />
          <button 
            onClick={handleChatMessage} 
            disabled={loading || !inputMessage.trim()}
            style={{
              ...buttonStyle,
              opacity: loading || !inputMessage.trim() ? 0.6 : 1,
              cursor: loading || !inputMessage.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳' : '📤'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default SportsBot;

