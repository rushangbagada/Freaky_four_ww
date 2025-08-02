const mongoose = require('mongoose');
const Quiz = require('./models/quiz');
require('dotenv').config();

const sampleQuestions = [
  {
    question: "How many players are on a basketball team on the court at one time?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    category: "basketball",
    difficulty: "easy"
  },
  {
    question: "What is the maximum score possible in ten-pin bowling?",
    options: ["200", "250", "300", "350"],
    correctAnswer: "300",
    category: "bowling",
    difficulty: "medium"
  },
  {
    question: "In which sport would you perform a slam dunk?",
    options: ["Volleyball", "Basketball", "Tennis", "Badminton"],
    correctAnswer: "Basketball",
    category: "basketball",
    difficulty: "easy"
  },
  {
    question: "How many players are on a football (soccer) team on the field at one time?",
    options: ["9", "10", "11", "12"],
    correctAnswer: "11",
    category: "football",
    difficulty: "easy"
  },
  {
    question: "What is the length of a standard Olympic swimming pool?",
    options: ["25 meters", "50 meters", "75 meters", "100 meters"],
    correctAnswer: "50 meters",
    category: "swimming",
    difficulty: "medium"
  },
  {
    question: "In tennis, what does 'love' mean?",
    options: ["A perfect shot", "Zero points", "A tie", "Match point"],
    correctAnswer: "Zero points",
    category: "tennis",
    difficulty: "medium"
  },
  {
    question: "How many holes are there in a full round of golf?",
    options: ["16", "18", "20", "22"],
    correctAnswer: "18",
    category: "golf",
    difficulty: "easy"
  },
  {
    question: "What is the highest possible hand in poker?",
    options: ["Four of a kind", "Full house", "Royal flush", "Straight flush"],
    correctAnswer: "Royal flush",
    category: "general",
    difficulty: "medium"
  },
  {
    question: "In which sport do you use a shuttlecock?",
    options: ["Tennis", "Squash", "Badminton", "Table tennis"],
    correctAnswer: "Badminton",
    category: "badminton",
    difficulty: "easy"
  },
  {
    question: "How many points is a touchdown worth in American football?",
    options: ["3", "6", "7", "8"],
    correctAnswer: "6",
    category: "american_football",
    difficulty: "medium"
  }
];

async function initQuizQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Quiz.deleteMany({});
    console.log('Cleared existing quiz questions');

    // Insert sample questions
    await Quiz.insertMany(sampleQuestions);
    console.log(`Added ${sampleQuestions.length} quiz questions`);

    console.log('Quiz questions initialized successfully!');
  } catch (error) {
    console.error('Error initializing quiz questions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

initQuizQuestions();
