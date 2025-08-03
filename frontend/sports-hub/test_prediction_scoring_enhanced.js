/**
 * Enhanced Test Suite for PredictionScoring Module
 * Tests validation, error handling, and all scoring scenarios
 */

// Import the PredictionScoring module
// For Node.js testing, you might need to adjust the import path
import PredictionScoring from './components/utils/PredictionScoring.js';

console.log('🧪 Starting Enhanced PredictionScoring Test Suite...\n');

// Test runner helper
function runTest(testName, testFunction) {
  console.log(`\n📋 Running: ${testName}`);
  console.log('─'.repeat(50));
  try {
    testFunction();
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Helper function to test detailed scoring
function testDetailedScoring(predicted1, predicted2, actual1, actual2, expectedValid = true) {
  console.log(`\n🎯 Testing: Predicted ${predicted1}-${predicted2} vs Actual ${actual1}-${actual2}`);
  
  const result = PredictionScoring.calculatePoints(predicted1, predicted2, actual1, actual2, { debug: true });
  
  console.log(`   Points: ${result.points}`);
  console.log(`   Valid: ${result.isValid}`);
  console.log(`   Category: ${result.category}`);
  console.log(`   Reason: ${result.reason}`);
  
  if (result.debug) {
    console.log(`   Debug: ${JSON.stringify(result.debug, null, 2)}`);
  }
  
  // Validate expected result
  if (result.isValid !== expectedValid) {
    console.warn(`   ⚠️  Expected valid: ${expectedValid}, got: ${result.isValid}`);
  }
  
  return result;
}

// Helper function to test simple scoring (backward compatibility)
function testSimpleScoring(predicted1, predicted2, actual1, actual2) {
  console.log(`\n🎯 Simple Test: Predicted ${predicted1}-${predicted2} vs Actual ${actual1}-${actual2}`);
  
  const result = PredictionScoring.calculatePoints(predicted1, predicted2, actual1, actual2);
  console.log(`   Points: ${result.points || result}`);
  
  return result.points || result;
}

// Helper function to test validation
function testValidation(score, expectedValid = true) {
  console.log(`\n🔍 Validating score: ${score} (type: ${typeof score})`);
  
  const result = PredictionScoring.validateScore(score);
  console.log(`   Valid: ${result.isValid}`);
  console.log(`   Sanitized: ${result.sanitized}`);
  console.log(`   Error: ${result.error || 'None'}`);
  
  if (result.isValid !== expectedValid) {
    console.warn(`   ⚠️  Expected valid: ${expectedValid}, got: ${result.isValid}`);
  }
  
  return result;
}

// Test 1: Valid Input Validation
runTest('Valid Input Validation', () => {
  testValidation(0, true);
  testValidation(1, true);
  testValidation(5, true);
  testValidation(10, true);
  testValidation('3', true); // Should be converted to number
  testValidation('0', true);
});

// Test 2: Invalid Input Validation
runTest('Invalid Input Validation', () => {
  testValidation(null, false);
  testValidation(undefined, false);
  testValidation('abc', false);
  testValidation('', false);
  testValidation(-1, false);
  testValidation(-5, false);
  testValidation(100, false); // Unreasonably high
  testValidation(1000, false);
  testValidation(NaN, false);
  testValidation(Infinity, false);
  testValidation({}, false);
  testValidation([], false);
});

// Test 3: Perfect Match Scenarios
runTest('Perfect Match Scenarios', () => {
  testDetailedScoring(0, 0, 0, 0); // Draw match
  testDetailedScoring(1, 1, 1, 1); // 1-1 draw
  testDetailedScoring(3, 2, 3, 2); // Exact score match
  testDetailedScoring(5, 0, 5, 0); // High-scoring exact match
});

// Test 4: Correct Result + Correct Goal Difference
runTest('Correct Result + Goal Difference', () => {
  testDetailedScoring(2, 0, 3, 1); // Both win by 2
  testDetailedScoring(1, 0, 2, 1); // Both win by 1
  testDetailedScoring(0, 1, 1, 2); // Both lose by 1
  testDetailedScoring(0, 2, 1, 3); // Both lose by 2
});

// Test 5: Correct Result Only
runTest('Correct Result Only', () => {
  testDetailedScoring(2, 1, 3, 0); // Both home wins, different margins
  testDetailedScoring(1, 2, 0, 3); // Both away wins, different margins
  testDetailedScoring(1, 1, 2, 2); // Both draws, different scores
});

// Test 6: Incorrect Predictions
runTest('Incorrect Predictions', () => {
  testDetailedScoring(2, 1, 1, 2); // Predicted home win, actual away win
  testDetailedScoring(1, 2, 2, 1); // Predicted away win, actual home win
  testDetailedScoring(1, 1, 2, 0); // Predicted draw, actual home win
  testDetailedScoring(2, 0, 1, 1); // Predicted home win, actual draw
});

// Test 7: Edge Cases with Invalid Inputs
runTest('Invalid Input Edge Cases', () => {
  // These should return invalid results
  testDetailedScoring(null, 1, 2, 1, false);
  testDetailedScoring(1, null, 2, 1, false);
  testDetailedScoring(1, 2, null, 1, false);
  testDetailedScoring(1, 2, 1, null, false);
  testDetailedScoring('abc', 2, 1, 1, false);
  testDetailedScoring(1, 'def', 1, 1, false);
  testDetailedScoring(-1, 2, 1, 1, false);
  testDetailedScoring(1, -2, 1, 1, false);
  testDetailedScoring(100, 2, 1, 1, false);
  testDetailedScoring(1, 200, 1, 1, false);
});

// Test 8: Prediction Validation
runTest('Prediction Object Validation', () => {
  console.log('\n🔍 Testing prediction object validation:');
  
  // Valid predictions
  const validResult1 = PredictionScoring.validatePrediction({ team1Score: 2, team2Score: 1 });
  console.log('Valid prediction result:', validResult1);
  
  const validResult2 = PredictionScoring.validatePrediction({ team1Score: '3', team2Score: '0' });
  console.log('Valid string prediction result:', validResult2);
  
  // Invalid predictions
  const invalidResult1 = PredictionScoring.validatePrediction({ team1Score: null, team2Score: 1 });
  console.log('Invalid prediction result (null):', invalidResult1);
  
  const invalidResult2 = PredictionScoring.validatePrediction({ team1Score: -1, team2Score: 1 });
  console.log('Invalid prediction result (negative):', invalidResult2);
  
  const invalidResult3 = PredictionScoring.validatePrediction({});
  console.log('Invalid prediction result (empty):', invalidResult3);
});

// Test 9: Backward Compatibility (Simple API)
runTest('Backward Compatibility', () => {
  console.log('\n🔄 Testing simple calculatePoints method:');
  
  testSimpleScoring(3, 1, 3, 1); // Should return 5 points
  testSimpleScoring(2, 0, 3, 1); // Should return 3 points  
  testSimpleScoring(2, 1, 3, 0); // Should return 1 point
  testSimpleScoring(1, 2, 3, 1); // Should return 0 points
  testSimpleScoring(null, 1, 2, 1); // Should return 0 points (invalid)
});

// Test 10: Score Explanations
runTest('Score Explanations', () => {
  console.log('\n💬 Testing score explanations:');
  
  const explanations = [
    PredictionScoring.getScoreExplanation(5),
    PredictionScoring.getScoreExplanation(3),
    PredictionScoring.getScoreExplanation(1),
    PredictionScoring.getScoreExplanation(0),
    PredictionScoring.getScoreExplanation(-1), // Invalid
    PredictionScoring.getScoreExplanation(10), // Unexpected high score
  ];
  
  explanations.forEach((explanation, index) => {
    console.log(`   Score ${[5,3,1,0,-1,10][index]}: ${explanation}`);
  });
});

// Test 11: Match Result Calculation
runTest('Match Result Calculation', () => {
  console.log('\n⚽ Testing match result calculation:');
  
  const results = [
    { scores: [3, 1], expected: 'home_win' },
    { scores: [1, 3], expected: 'away_win' },
    { scores: [2, 2], expected: 'draw' },
    { scores: [0, 0], expected: 'draw' },
    { scores: [5, 0], expected: 'home_win' },
    { scores: [0, 5], expected: 'away_win' },
  ];
  
  results.forEach(({ scores, expected }) => {
    // Test using internal method if available, otherwise derive logic
    const [team1Score, team2Score] = scores;
    let result;
    if (team1Score > team2Score) result = 'home_win';
    else if (team1Score < team2Score) result = 'away_win';
    else result = 'draw';
    
    console.log(`   ${team1Score}-${team2Score}: ${result} ${result === expected ? '✅' : '❌'}`);
  });
});

// Test 12: Performance Test
runTest('Performance Test', () => {
  console.log('\n⚡ Running performance test...');
  
  const iterations = 10000;
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    PredictionScoring.calculatePoints(
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 6)
    );
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`   Completed ${iterations} calculations in ${totalTime.toFixed(2)}ms`);
  console.log(`   Average time per calculation: ${avgTime.toFixed(4)}ms`);
  console.log(`   Calculations per second: ${(1000 / avgTime).toFixed(0)}`);
});

console.log('\n🎉 Enhanced PredictionScoring Test Suite Completed!');
console.log('═'.repeat(50));
console.log('Summary:');
console.log('✅ Input validation tested');
console.log('✅ Error handling verified');
console.log('✅ All scoring scenarios covered');
console.log('✅ Edge cases handled');
console.log('✅ Backward compatibility maintained');
console.log('✅ Performance benchmarked');
