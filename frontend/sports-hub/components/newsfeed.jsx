
import React, { useState, useEffect } from 'react';
import FunFacts from './funfacts.jsx';
import './css/newsfeed.css';
import useDatabaseChangeDetection from '../hooks/useDatabaseChangeDetection';

const NewsFeed = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsItems, setNewsItems] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNewsItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Use the custom hook for real-time updates
  const { isPolling, hasChanges, lastUpdated } = useDatabaseChangeDetection(
    fetchNews,
    []
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="newsfeed-container">
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📰 Latest News
        </button>
        <button 
          className={`tab-button ${activeTab === 'facts' ? 'active' : ''}`}
          onClick={() => setActiveTab('facts')}
        >
          ⚡ Fun Facts
        </button>
      </div>

      {activeTab === 'news' && (
        <div className="news-section">
          <div className="section-header">
            <h2>🏆 Campus Sports News</h2>
            <p>Stay updated with the latest happenings in campus sports</p>
          </div>
          
          
          <div className="news-grid">
            {newsItems.map((item,index) => (
              <article key={index} className="news-card">
                <div className="news-card-header">
                  <div className="news-image-container">
                    {item.image && item.image.startsWith('http') ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="news-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : (
                      <span className="news-emoji">{item.image || '📰'}</span>
                    )}
                    <span className="news-emoji-fallback" style={{display: 'none'}}>📰</span>
                  </div>
                  <div className="news-meta">
                    <span className="news-category">{item.category}</span>
                    <span className="news-date">{formatDate(item.date)}</span>
                  </div>
                </div>
                
                <div className="news-content">
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-summary">{item.description}</p>
                </div>
                
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'facts' && <FunFacts />}
    </div>
  );
};

export default NewsFeed;
