const Quiz = require('../models/quiz');
const Prediction_user = require('../models/prediction_user');

const getRandomQuestion = async (req, res) => {
  try {
    const count = await Quiz.countDocuments();
    const random = Math.floor(Math.random() * count);
    const question = await Quiz.findOne().skip(random);
    
    if (!question) {
      return res.status(404).json({ message: 'No questions available' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching random question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer, userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }
    
    // Find the question
    const question = await Quiz.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if the answer is correct
    const isCorrect = question.correctAnswer === answer;
    const points = isCorrect ? 10 : 0;

    // Update prediction user's total points
    if (points > 0) {
      const updatedUser = await Prediction_user.findOneAndUpdate(
        { email: userEmail },
        { $inc: { total_point: points } },
        { new: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'Prediction user not found' });
      }
      
      console.log(`Added ${points} points to user ${userEmail}. New total: ${updatedUser.total_point}`);
    }

    res.json({ 
      correct: isCorrect, 
      points,
      correctAnswer: question.correctAnswer 
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRandomQuestion,
  submitAnswer
};
