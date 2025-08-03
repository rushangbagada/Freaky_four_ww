import { PredictionScoring } from './components/utils/PredictionScoring';

function simulatePrediction(predicted1, predicted2, actual1, actual2) {
  const result = PredictionScoring.calculatePoints(predicted1, predicted2, actual1, actual2);
  if (!result.isValid) {
    console.warn(`Invalid prediction: ${result.reason}`);
  } else {
    const explanation = PredictionScoring.getScoreExplanation(result.points);
    console.log(`Prediction: ${predicted1}-${predicted2} | Actual: ${actual1}-${actual2} | Points: ${result.points} | Validation: ${result.isValid} | ${explanation}`);
  }
}

// Enhanced Test Scenarios

// Valid predictions
simulatePrediction(2, 2, 2, 2); // Exact match
simulatePrediction(3, 1, 3, 0); // Correct result, correct goal difference
simulatePrediction(1, 0, 2, 0); // Correct result only

// Invalid predictions
simulatePrediction(null, null, 3, 1); // Null values
simulatePrediction('two', 'one', 1, 0); // String inputs
simulatePrediction(-1, 0, 0, 0); // Negative values
simulatePrediction(1000, 1000, 1, 1); // Unreasonably high scores

/**
 * Test Utility for Prediction Scoring
 */
import { PredictionScoring } from './components/utils/PredictionScoring';

// Helper function to simulate predictions
function simulatePrediction(predicted1, predicted2, actual1, actual2) {
  const points = PredictionScoring.calculatePoints(predicted1, predicted2, actual1, actual2);
  const explanation = PredictionScoring.getScoreExplanation(points);
  console.log(`Prediction: ${predicted1}-${predicted2} | Actual: ${actual1}-${actual2} | Points: ${points} | ${explanation}`);
}

// Test Scenarios

// Exact Match
simulatePrediction(3, 1, 3, 1);

// Correct result with correct goal difference
simulatePrediction(2, 0, 1, 0);

// Correct result only
simulatePrediction(2, 1, 1, 0);

// Incorrect prediction
simulatePrediction(1, 2, 3, 1);
