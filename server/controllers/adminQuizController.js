const Quiz = require('../models/quiz');

// Create a new quiz question
const createQuizQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, category, difficulty } = req.body;

    const newQuestion = new Quiz({
      question,
      options,
      correctAnswer,
      category,
      difficulty
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Quiz question created successfully', newQuestion });
  } catch (error) {
    console.error('Error creating quiz question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing quiz question
const updateQuizQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer, category, difficulty } = req.body;

    const updatedQuestion = await Quiz.findByIdAndUpdate(id, {
      question,
      options,
      correctAnswer,
      category,
      difficulty
    }, { new: true });

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Quiz question not found' });
    }

    res.json({ message: 'Quiz question updated successfully', updatedQuestion });
  } catch (error) {
    console.error('Error updating quiz question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a quiz question
const deleteQuizQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuestion = await Quiz.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Quiz question not found' });
    }

    res.json({ message: 'Quiz question deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all quiz questions
const getAllQuizQuestions = async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single quiz question by ID
const getQuizQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Quiz.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Quiz question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching quiz question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  getAllQuizQuestions,
  getQuizQuestion
};

