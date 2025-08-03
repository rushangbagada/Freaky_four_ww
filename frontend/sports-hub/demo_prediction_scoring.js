/**
 * Simple Demo of PredictionScoring Module Usage
 * Shows correct usage patterns for different scenarios
 */

import PredictionScoring from './components/utils/PredictionScoring.js';

console.log('🎯 PredictionScoring Demo - Correct Usage Patterns\n');
console.log('═'.repeat(60));

// Demo 1: Basic Usage - Detailed Results
console.log('\n📋 1. DETAILED SCORING (Returns full object with debug info)');
console.log('─'.repeat(50));

function demoDetailedScoring(pred1, pred2, act1, act2, description) {
  console.log(`\n${description}`);
  console.log(`Predicted: ${pred1}-${pred2} | Actual: ${act1}-${act2}`);
  
  const result = PredictionScoring.calculatePoints(pred1, pred2, act1, act2, { debug: true });
  
  console.log(`Points: ${result.points} | Valid: ${result.isValid}`);
  console.log(`Category: ${result.category} | Reason: ${result.reason}`);
  
  if (!result.isValid && result.errors) {
    console.log(`Errors: ${result.errors.join(', ')}`);
  }
}

demoDetailedScoring(3, 1, 3, 1, '🎯 Perfect Match (5 points)');
demoDetailedScoring(2, 0, 3, 1, '🎯 Correct Result + Goal Difference (3 points)');
demoDetailedScoring(2, 1, 3, 0, '🎯 Correct Result Only (1 point)');
demoDetailedScoring(1, 2, 3, 1, '🎯 Wrong Prediction (0 points)');
demoDetailedScoring(null, 1, 2, 1, '🎯 Invalid Input (0 points, invalid)');

// Demo 2: Simple Usage - Just Points
console.log('\n\n📋 2. SIMPLE SCORING (For backward compatibility)');
console.log('─'.repeat(50));

function demoSimpleScoring(pred1, pred2, act1, act2, description) {
  console.log(`\n${description}`);
  console.log(`Predicted: ${pred1}-${pred2} | Actual: ${act1}-${act2}`);
  
  // Method 1: Use calculateSimplePoints (if available)
  try {
    const points = PredictionScoring.calculateSimplePoints(pred1, pred2, act1, act2);
    console.log(`Points (Simple): ${points}`);
  } catch (error) {
    // Method 2: Extract points from detailed result
    const result = PredictionScoring.calculatePoints(pred1, pred2, act1, act2);
    console.log(`Points (From Detail): ${result.points}`);
  }
}

demoSimpleScoring(3, 1, 3, 1, '🎯 Perfect Match');
demoSimpleScoring(2, 0, 3, 1, '🎯 Good Score');
demoSimpleScoring(2, 1, 3, 0, '🎯 Partial Score');
demoSimpleScoring(1, 2, 3, 1, '🎯 No Score');

// Demo 3: Input Validation
console.log('\n\n📋 3. INPUT VALIDATION');
console.log('─'.repeat(50));

function demoValidation(score, description) {
  console.log(`\n${description}: ${score}`);
  const result = PredictionScoring.validateScore(score);
  console.log(`Valid: ${result.isValid} | Sanitized: ${result.sanitized} | Error: ${result.error || 'None'}`);
}

demoValidation(5, '✅ Valid Number');
demoValidation('3', '✅ Valid String Number');
demoValidation(null, '❌ Null Value');
demoValidation('abc', '❌ Invalid String');
demoValidation(-1, '❌ Negative Number');
demoValidation(100, '❌ Too High');

// Demo 4: Prediction Object Validation
console.log('\n\n📋 4. PREDICTION OBJECT VALIDATION');
console.log('─'.repeat(50));

function demoPredictionValidation(prediction, description) {
  console.log(`\n${description}`);
  console.log(`Prediction:`, prediction);
  const result = PredictionScoring.validatePrediction(prediction);
  console.log(`Valid: ${result.isValid} | Error: ${result.error || 'None'}`);
}

demoPredictionValidation({ team1Score: 2, team2Score: 1 }, '✅ Valid Prediction');
demoPredictionValidation({ team1Score: '3', team2Score: '0' }, '✅ Valid String Prediction');
demoPredictionValidation({ team1Score: null, team2Score: 1 }, '❌ Null Score');
demoPredictionValidation({}, '❌ Empty Object');

// Demo 5: Score Explanations
console.log('\n\n📋 5. SCORE EXPLANATIONS');
console.log('─'.repeat(50));

[5, 3, 1, 0].forEach(points => {
  const explanation = PredictionScoring.getScoreExplanation(points);
  console.log(`${points} points: ${explanation}`);
});

// Demo 6: Real-world Usage Example
console.log('\n\n📋 6. REAL-WORLD USAGE EXAMPLE');
console.log('─'.repeat(50));

console.log('\n🏆 Processing a user\'s prediction:');

// Simulate user input from a form
const userPrediction = {
  team1Score: '2',  // String from form input
  team2Score: '1'   // String from form input
};

const actualResult = {
  team1Score: 3,
  team2Score: 0
};

console.log('User Prediction:', userPrediction);
console.log('Actual Result:', actualResult);

// Step 1: Validate the prediction
const validation = PredictionScoring.validatePrediction(userPrediction);
if (!validation.isValid) {
  console.log('❌ Invalid prediction:', validation.error);
} else {
  console.log('✅ Prediction is valid');
  
  // Step 2: Calculate points
  const result = PredictionScoring.calculatePoints(
    userPrediction.team1Score,
    userPrediction.team2Score,
    actualResult.team1Score,
    actualResult.team2Score
  );
  
  console.log(`📊 Result: ${result.points} points (${result.reason})`);
  console.log(`📈 Category: ${result.category}`);
  
  // Step 3: Get user-friendly explanation
  const explanation = PredictionScoring.getScoreExplanation(result.points);
  console.log(`💬 Explanation: ${explanation}`);
}

console.log('\n' + '═'.repeat(60));
console.log('🎉 PredictionScoring Demo Completed!');
console.log('\nKey Takeaways:');
console.log('✅ Always validate inputs before processing');
console.log('✅ Use detailed results for debugging and transparency');
console.log('✅ Extract just points for simple use cases');
console.log('✅ Handle invalid inputs gracefully');
console.log('✅ Provide user-friendly explanations');
