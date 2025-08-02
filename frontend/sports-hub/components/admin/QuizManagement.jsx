import React, { useState, useEffect } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../../src/config/api';
import './css/quiz-management.css';

export default function QuizManagement({ user }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    category: 'general',
    difficulty: 'medium'
  });

  const [editQuestion, setEditQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    category: 'general',
    difficulty: 'medium'
  });

  const isAdmin = user?.role === 'admin';
  
  // Categories for questions
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'sports', label: 'Sports' },
    { value: 'football', label: 'Football' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'history', label: 'History' },
    { value: 'science', label: 'Science' }
  ];
  
  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/quiz'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(Array.isArray(data) ? data : []);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(getApiUrl('/api/admin/quiz'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newQuestion)
      });

      if (response.ok) {
        setShowAddQuestion(false);
        setNewQuestion({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          category: 'general',
          difficulty: 'medium'
        });
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleUpdateQuestion = async (questionId, updatedData) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/quiz/${questionId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingQuestion(null);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(getApiUrl(`/api/admin/quiz/${questionId}`), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          fetchQuestions();
          alert('Question deleted successfully!');
        } else {
          alert('Failed to delete question');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question');
      }
    }
  };

  const startEdit = (question) => {
    setEditingQuestion(question._id);
    setEditQuestion({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateQuestion(editingQuestion, editQuestion);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.options.some(option => option.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  return (
    <div className="quiz-management">
      <div className="management-header">
        <h2>Quiz Management</h2>
        <div className="management-actions">
          <button 
            className="add-button"
            onClick={() => setShowAddQuestion(true)}
          >
            Add Question
          </button>
        </div>
      </div>

      {/* Add Question Form */}
      {showAddQuestion && (
        <form className="add-question-form" onSubmit={handleAddQuestion}>
          <input
            type="text"
            placeholder="Enter question"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            required
          />
          {newQuestion.options.map((option, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={option}
              onChange={(e) => {
                const options = [...newQuestion.options];
                options[idx] = e.target.value;
                setNewQuestion({ ...newQuestion, options });
              }}
              required
            />
          ))}
          <input
            type="text"
            placeholder="Correct answer"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {/* Questions List */}
      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="no-questions">
            No questions found. Add some questions to get started!
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q._id} className="question-card">
              <div className="question-card-header">
                <h3 className="question-text">{q.question}</h3>
                <div className="question-meta">
                  <span className="category-badge">{q.category}</span>
                  <span className={`difficulty-badge ${q.difficulty}`}>{q.difficulty}</span>
                </div>
              </div>
              
              <ul className="options-list">
                {q.options.map((option, idx) => (
                  <li key={idx} className={q.correctAnswer === option ? 'correct-answer' : ''}>
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-text">{option}</span>
                    {q.correctAnswer === option && (
                      <span className="correct-indicator">✓ Correct</span>
                    )}
                  </li>
                ))}
              </ul>
              
              <div className="question-actions">
                <button 
                  className={`edit-btn ${editingQuestion === q._id ? 'editing' : ''}`}
                  onClick={() => {
                    if (editingQuestion === q._id) {
                      setEditingQuestion(null);
                    } else {
                      startEdit(q);
                    }
                  }}
                >
                  {editingQuestion === q._id ? 'Cancel' : 'Edit'}
                </button>
                <button className="delete-btn" onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
              </div>
              
              {editingQuestion === q._id && (
                <div className="inline-edit-form">
                  <h4>Edit Question</h4>
                  <form onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <label>Question:</label>
                      <input
                        type="text"
                        value={editQuestion.question}
                        onChange={(e) => setEditQuestion({ ...editQuestion, question: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Options:</label>
                      <div className="options-grid">
                        {editQuestion.options.map((option, idx) => (
                          <input
                            key={idx}
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={option}
                            onChange={(e) => {
                              const options = [...editQuestion.options];
                              options[idx] = e.target.value;
                              setEditQuestion({ ...editQuestion, options });
                            }}
                            required
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Correct Answer:</label>
                        <input
                          type="text"
                          value={editQuestion.correctAnswer}
                          onChange={(e) => setEditQuestion({ ...editQuestion, correctAnswer: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Category:</label>
                        <select
                          value={editQuestion.category}
                          onChange={(e) => setEditQuestion({ ...editQuestion, category: e.target.value })}
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Difficulty:</label>
                        <select
                          value={editQuestion.difficulty}
                          onChange={(e) => setEditQuestion({ ...editQuestion, difficulty: e.target.value })}
                        >
                          {difficulties.map(diff => (
                            <option key={diff.value} value={diff.value}>{diff.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="update-btn">Update Question</button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                          setEditingQuestion(null);
                          setEditQuestion({
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: '',
                            category: 'general',
                            difficulty: 'medium'
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


