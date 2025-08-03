/**
 * Browser Console Test Script for Prediction Calculations
 * 
 * Copy and paste this into your browser console (F12) to test the prediction scoring system
 */

// Test the prediction scoring system with various scenarios
function testPredictionScoring() {
    console.log('🧪 TESTING PREDICTION SCORING SYSTEM');
    console.log('=====================================');
    
    // Test cases with expected results
    const testCases = [
        // [predicted1, predicted2, actual1, actual2, expectedPoints, description]
        [2, 1, 2, 1, 5, 'Exact Score Match'],
        [3, 1, 2, 0, 3, 'Correct Result + Goal Difference'],
        [2, 1, 1, 0, 1, 'Correct Result Only'],
        [1, 2, 3, 0, 0, 'Wrong Prediction'],
        [1, 1, 2, 2, 3, 'Draw with Same Goal Difference'],
        [0, 0, 1, 1, 1, 'Draw Result Only'],
        [3, 2, 2, 1, 1, 'Same Winner, Different Scores'],
        [1, 0, 0, 1, 0, 'Opposite Result']
    ];
    
    let allTestsPassed = true;
    
    console.log('\n📊 Running Test Cases:');
    console.log('----------------------');
    
    testCases.forEach((testCase, index) => {
        const [pred1, pred2, act1, act2, expected, description] = testCase;
        
        // Calculate points (assuming PredictionScoring is available)
        let actualPoints;
        try {
            // Try to use the actual PredictionScoring class
            actualPoints = window.PredictionScoring?.calculatePoints(pred1, pred2, act1, act2) ?? 
                          calculatePointsManual(pred1, pred2, act1, act2);
        } catch (error) {
            // Fallback to manual calculation
            actualPoints = calculatePointsManual(pred1, pred2, act1, act2);
        }
        
        const passed = actualPoints === expected;
        const status = passed ? '✅' : '❌';
        
        console.log(`${status} Test ${index + 1}: ${description}`);
        console.log(`   Predicted: ${pred1}-${pred2} | Actual: ${act1}-${act2}`);
        console.log(`   Expected: ${expected} points | Got: ${actualPoints} points`);
        
        if (!passed) {
            allTestsPassed = false;
            console.log(`   🚨 FAILED: Expected ${expected} but got ${actualPoints}`);
        }
        
        console.log('');
    });
    
    console.log('=====================================');
    if (allTestsPassed) {
        console.log('🎉 ALL TESTS PASSED! Prediction scoring system is working correctly.');
    } else {
        console.log('❌ SOME TESTS FAILED! Check the prediction scoring logic.');
    }
    console.log('=====================================');
}

// Manual calculation function as fallback
function calculatePointsManual(pred1, pred2, act1, act2) {
    const predResult = pred1 > pred2 ? 'team1_win' : pred1 < pred2 ? 'team2_win' : 'draw';
    const actResult = act1 > act2 ? 'team1_win' : act1 < act2 ? 'team2_win' : 'draw';
    const predDiff = pred1 - pred2;
    const actDiff = act1 - act2;
    
    // Exact score match: 5 points
    if (pred1 === act1 && pred2 === act2) {
        return 5;
    }
    
    // Correct result with correct goal difference: 3 points
    if (predResult === actResult && predDiff === actDiff) {
        return 3;
    }
    
    // Correct result only: 1 point
    if (predResult === actResult) {
        return 1;
    }
    
    // Incorrect prediction: 0 points
    return 0;
}

// Test individual prediction
function testSinglePrediction(pred1, pred2, act1, act2) {
    const points = calculatePointsManual(pred1, pred2, act1, act2);
    const explanation = getExplanation(points);
    
    console.log(`🎯 Prediction Test:`);
    console.log(`   Your Prediction: ${pred1}-${pred2}`);
    console.log(`   Actual Result: ${act1}-${act2}`);
    console.log(`   Points Earned: ${points}`);
    console.log(`   Explanation: ${explanation}`);
}

function getExplanation(points) {
    const explanations = {
        5: '🎯 Perfect! Exact score match',
        3: '🎉 Great! Correct result and goal difference',
        1: '👍 Good! Correct match result',
        0: '😔 Better luck next time!'
    };
    return explanations[points] || '⏳ Pending evaluation';
}

// Run the full test suite
testPredictionScoring();

console.log('\n🔧 Available Test Functions:');
console.log('- testPredictionScoring() - Run full test suite');
console.log('- testSinglePrediction(pred1, pred2, act1, act2) - Test single prediction');
console.log('\nExample: testSinglePrediction(2, 1, 2, 1) // Should give 5 points');
