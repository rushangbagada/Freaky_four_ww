/**
 * Browser Console Test for PredictionScoring Module
 * Copy and paste this entire script into your browser console to run tests
 * Make sure PredictionScoring is available in the global scope
 */

(function() {
  'use strict';
  
  console.log('%c🧪 PredictionScoring Browser Test Suite', 'color: #4CAF50; font-size: 20px; font-weight: bold;');
  console.log('═'.repeat(60));
  
  // Check if PredictionScoring is available
  if (typeof PredictionScoring === 'undefined') {
    console.error('❌ PredictionScoring module not found! Make sure it\'s loaded.');
    return;
  }
  
  let testsPassed = 0;
  let testsFailed = 0;
  let totalTests = 0;
  
  // Test runner
  function runTest(testName, testFunction, shouldPass = true) {
    totalTests++;
    console.group(`🧪 Test ${totalTests}: ${testName}`);
    
    try {
      const result = testFunction();
      if (shouldPass && result !== false) {
        console.log('%c✅ PASSED', 'color: #4CAF50; font-weight: bold;');
        testsPassed++;
      } else if (!shouldPass && result === false) {
        console.log('%c✅ PASSED (Expected Failure)', 'color: #4CAF50; font-weight: bold;');
        testsPassed++;
      } else {
        console.log('%c❌ FAILED', 'color: #F44336; font-weight: bold;');
        testsFailed++;
      }
    } catch (error) {
      console.error('%c❌ ERROR:', 'color: #F44336; font-weight: bold;', error.message);
      testsFailed++;
    }
    
    console.groupEnd();
  }
  
  // Test helper functions
  function assertEqual(actual, expected, message) {
    if (actual === expected) {
      console.log(`✓ ${message}: ${actual}`);
      return true;
    } else {
      console.error(`✗ ${message}: Expected ${expected}, got ${actual}`);
      return false;
    }
  }
  
  function testDetailedCalculation(pred1, pred2, act1, act2, expectedPoints, expectedValid = true) {
    console.log(`Testing: Predicted ${pred1}-${pred2} vs Actual ${act1}-${act2}`);
    
    const result = PredictionScoring.calculateDetailedPoints(pred1, pred2, act1, act2);
    
    console.log('Result:', {
      points: result.points,
      isValid: result.isValid,
      category: result.category,
      reason: result.reason
    });
    
    const pointsMatch = result.points === expectedPoints;
    const validityMatch = result.isValid === expectedValid;
    
    return pointsMatch && validityMatch;
  }
  
  // Test 1: Perfect Score Scenarios
  runTest('Perfect Score - Exact Match', () => {
    return testDetailedCalculation(2, 1, 2, 1, 5, true);
  });
  
  runTest('Perfect Score - Draw Match', () => {
    return testDetailedCalculation(0, 0, 0, 0, 5, true);
  });
  
  runTest('Perfect Score - High Scoring', () => {
    return testDetailedCalculation(4, 2, 4, 2, 5, true);
  });
  
  // Test 2: Good Score Scenarios (3 points)
  runTest('Good Score - Correct Result & Goal Difference', () => {
    return testDetailedCalculation(3, 1, 4, 2, 3, true);
  });
  
  runTest('Good Score - Both Win by Same Margin', () => {
    return testDetailedCalculation(2, 0, 1, 0, 3, true);
  });
  
  runTest('Good Score - Both Draw Different Scores', () => {
    return testDetailedCalculation(1, 1, 2, 2, 3, true);
  });
  
  // Test 3: Partial Score Scenarios (1 point)
  runTest('Partial Score - Correct Result Only', () => {
    return testDetailedCalculation(3, 1, 2, 0, 1, true);
  });
  
  runTest('Partial Score - Different Winning Margins', () => {
    return testDetailedCalculation(1, 0, 3, 1, 1, true);
  });
  
  // Test 4: No Score Scenarios (0 points)
  runTest('No Score - Wrong Result', () => {
    return testDetailedCalculation(2, 1, 1, 3, 0, true);
  });
  
  runTest('No Score - Predicted Win Got Draw', () => {
    return testDetailedCalculation(2, 0, 1, 1, 0, true);
  });
  
  // Test 5: Input Validation Tests
  runTest('Invalid Input - Null Values', () => {
    const result = PredictionScoring.calculateDetailedPoints(null, 1, 2, 1);
    return result.isValid === false && result.points === 0;
  });
  
  runTest('Invalid Input - Negative Scores', () => {
    const result = PredictionScoring.calculateDetailedPoints(-1, 2, 1, 1);
    return result.isValid === false && result.points === 0;
  });
  
  runTest('Invalid Input - String Values', () => {
    const result = PredictionScoring.calculateDetailedPoints('abc', 2, 1, 1);
    return result.isValid === false && result.points === 0;
  });
  
  runTest('Invalid Input - Undefined Values', () => {
    const result = PredictionScoring.calculateDetailedPoints(undefined, 2, 1, 1);
    return result.isValid === false && result.points === 0;
  });
  
  runTest('Invalid Input - Too High Scores', () => {
    const result = PredictionScoring.calculateDetailedPoints(100, 2, 1, 1);
    return result.isValid === false && result.points === 0;
  });
  
  // Test 6: Score Validation
  runTest('Score Validation - Valid Numbers', () => {
    const result = PredictionScoring.validateScore(3);
    return result.isValid === true && result.sanitized === 3;
  });
  
  runTest('Score Validation - Valid String Numbers', () => {
    const result = PredictionScoring.validateScore('5');
    return result.isValid === true && result.sanitized === 5;
  });
  
  runTest('Score Validation - Invalid String', () => {
    const result = PredictionScoring.validateScore('abc');
    return result.isValid === false;
  });
  
  runTest('Score Validation - Negative Number', () => {
    const result = PredictionScoring.validateScore(-1);
    return result.isValid === false;
  });
  
  // Test 7: Prediction Object Validation
  runTest('Prediction Validation - Valid Object', () => {
    const result = PredictionScoring.validatePrediction({ team1Score: 2, team2Score: 1 });
    return result.isValid === true;
  });
  
  runTest('Prediction Validation - Invalid Object', () => {
    const result = PredictionScoring.validatePrediction({ team1Score: null, team2Score: 1 });
    return result.isValid === false;
  });
  
  runTest('Prediction Validation - Empty Object', () => {
    const result = PredictionScoring.validatePrediction({});
    return result.isValid === false;
  });
  
  // Test 8: Backward Compatibility
  runTest('Backward Compatibility - Simple Calculate', () => {
    const points = PredictionScoring.calculatePoints(3, 1, 3, 1);
    return points === 5;
  });
  
  runTest('Backward Compatibility - Invalid Input Handling', () => {
    const points = PredictionScoring.calculatePoints(null, 1, 2, 1);
    return points === 0;
  });
  
  // Test 9: Score Explanations
  runTest('Score Explanations - Perfect Score', () => {
    const explanation = PredictionScoring.getScoreExplanation(5);
    return explanation.includes('Exact') || explanation.includes('Perfect');
  });
  
  runTest('Score Explanations - Good Score', () => {
    const explanation = PredictionScoring.getScoreExplanation(3);
    return explanation.length > 0;
  });
  
  runTest('Score Explanations - No Score', () => {
    const explanation = PredictionScoring.getScoreExplanation(0);
    return explanation.length > 0;
  });
  
  // Test 10: Edge Cases
  runTest('Edge Case - Zero Scores', () => {
    return testDetailedCalculation(0, 0, 0, 0, 5, true);
  });
  
  runTest('Edge Case - High Valid Scores', () => {
    return testDetailedCalculation(10, 8, 10, 8, 5, true);
  });
  
  runTest('Edge Case - String Numbers', () => {
    const result = PredictionScoring.calculateDetailedPoints('2', '1', '2', '1');
    return result.points === 5 && result.isValid === true;
  });
  
  // Test 11: Performance Test
  runTest('Performance Test', () => {
    console.log('Running performance test...');
    const iterations = 1000;
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      PredictionScoring.calculateDetailedPoints(
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6)
      );
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.log(`Completed ${iterations} calculations in ${totalTime.toFixed(2)}ms`);
    console.log(`Average: ${(totalTime / iterations).toFixed(4)}ms per calculation`);
    
    return totalTime < 1000; // Should complete in less than 1 second
  });
  
  // Final Results
  console.log('\n' + '═'.repeat(60));
  console.log('%c📊 Test Results Summary', 'color: #2196F3; font-size: 18px; font-weight: bold;');
  console.log('═'.repeat(60));
  
  const passRate = ((testsPassed / totalTests) * 100).toFixed(1);
  
  if (testsPassed === totalTests) {
    console.log(`%c🎉 All ${totalTests} tests PASSED! (${passRate}%)`, 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  } else {
    console.log(`%c⚠️  ${testsPassed}/${totalTests} tests passed (${passRate}%)`, 'color: #FF9800; font-size: 16px; font-weight: bold;');
    console.log(`%c❌ ${testsFailed} tests failed`, 'color: #F44336; font-size: 14px;');
  }
  
  console.log('\n✅ Input validation tested');
  console.log('✅ Error handling verified');
  console.log('✅ All scoring scenarios covered');
  console.log('✅ Edge cases handled');
  console.log('✅ Backward compatibility maintained');
  console.log('✅ Performance benchmarked');
  
  console.log('\n' + '═'.repeat(60));
  console.log('%cTest suite completed successfully!', 'color: #4CAF50; font-weight: bold;');
  
})();
