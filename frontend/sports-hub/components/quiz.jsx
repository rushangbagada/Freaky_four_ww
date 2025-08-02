
import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/AuthContext';
import { getApiUrl, API_ENDPOINTS } from '../src/config/api';
import './css/quiz.css';

const Quiz = ({ onPointsEarned }) => {
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(20);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(getApiUrl('/api/quiz/random-question'));
        if (response.ok) {
          const data = await response.json();
          setQuestion(data);
          setTimer(20);
          setAnswered(false);
        } else {
          setQuestion(null);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        setQuestion(null);
      }
    };

    const questionInterval = setInterval(fetchQuestion, 20000);
    fetchQuestion(); 

    return () => clearInterval(questionInterval);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleAnswer = async (answer) => {
    if (answered) return;
    setAnswered(true);

    try {
      const response = await fetch(getApiUrl('/api/quiz/answer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          questionId: question._id, 
          answer, 
          userEmail: user.email 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.correct ? 'Correct! You got 10 points.' : 'Wrong answer.');
        
        // If correct answer and points earned, trigger leaderboard refresh
        if (result.correct && result.points > 0 && onPointsEarned) {
          onPointsEarned();
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  // Don't show quiz if user is not authenticated
  if (!isAuthenticated() || !user) {
    return (
      <div className="quiz-container">
        <h3>Quiz Time!</h3>
        <p>Please log in to participate in the quiz.</p>
      </div>
    );
  }

  if (!question) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="quiz-container">
      <h3>Quiz Time!</h3>
      <p>Time left: {timer}s</p>
      <p>{question.question}</p>
      <div className="options">
        {question.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)} disabled={answered}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;

