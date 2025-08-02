const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/random-question', quizController.getRandomQuestion);
router.post('/answer', quizController.submitAnswer);

module.exports = router;
