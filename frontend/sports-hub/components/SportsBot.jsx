import React, { useState, useEffect } from 'react';
import { chatWithSportsBot, analyzeSportsVideo } from '../src/services/sportsBot';
import { useAuth } from '../src/AuthContext'; // Import useAuth

const SportsBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [username, setUsername] = useState('');
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
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleVideoAnalysis = async () => {
  //   if (!videoUrl.trim()) return;

  //   setLoading(true);
  //   try {
  //     const response = await analyzeSportsVideo(videoUrl, username);
  //     setMessages([...messages, `Video Analysis: ${response}`]);
  //     setVideoUrl('');
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="sports-bot-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🏆 Sports Bot - AI Sports Coach</h2>
      
      {/* Username Input - only show if user is not logged in */}
      {!user && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter your name (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', marginRight: '10px', width: '200px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      {/* Chat Messages Display */}
      <div style={{ 
        border: '2px solid #4CAF50', 
        height: '400px', 
        overflowY: 'scroll', 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        {messages.length === 0 && (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '150px' }}>
            <p>👋 Welcome to Sports Bot{user ? `, ${user.name}` : ''}!</p>
            <p>Ask me about sports training, techniques, strategies, or analyze your game videos!</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            backgroundColor: index % 2 === 0 ? '#e3f2fd' : '#f1f8e9',
            borderRadius: '8px',
            borderLeft: `4px solid ${index % 2 === 0 ? '#2196F3' : '#4CAF50'}`
          }}>
            <strong style={{ color: index % 2 === 0 ? '#1976D2' : '#388E3C' }}>
              {index % 2 === 0 ? '🏃‍♂️ You: ' : '🤖 Sports Bot: '}
            </strong>
            <div style={{ marginTop: '5px' }}>{msg}</div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Ask about sports training, techniques, strategies..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          style={{ 
            padding: '12px', 
            width: '400px', 
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
        />
        <button 
          onClick={handleChatMessage} 
          disabled={loading}
          style={{ 
            padding: '12px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? '⏳ Sending...' : '📤 Send'}
        </button>
      </div>

      {/* Video Analysis Section */}
      {/* <div style={{ 
        backgroundColor: '#fff3e0', 
        padding: '20px', 
        borderRadius: '10px',
        border: '2px solid #ff9800'
      }}>
        <h3 style={{ color: '#f57c00', marginBottom: '15px' }}>🎥 Analyze Sports Video</h3>
        <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
          Upload a sports video URL to get professional analysis of technique, performance, and coaching tips!
        </p>
        <input
          type="text"
          placeholder="Enter sports video URL (e.g., training video, game footage)..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ 
            padding: '12px', 
            width: '400px', 
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
        <button 
          onClick={handleVideoAnalysis} 
          disabled={loading}
          style={{ 
            padding: '12px 20px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? '⏳ Analyzing...' : '🔍 Analyze Video'}
        </button>
      </div> */}

      {/* Sports Tips */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px',
        fontSize: '13px',
        color: '#2e7d32'
      }}>
        <strong>💡 Pro Tips:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Ask about specific sports techniques (e.g., "How to improve my basketball shooting form?")</li>
          <li>Get workout recommendations for your sport</li>
          <li>Analyze game strategies and tactics</li>
          <li>Upload training videos for personalized coaching feedback</li>
        </ul>
      </div>
    </div>
  );
};

export default SportsBot;
