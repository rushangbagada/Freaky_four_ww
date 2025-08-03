// Test the prediction scoring logic
function calculatePoints(pred1, pred2, act1, act2) {
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

function testCase(pred1, pred2, act1, act2, expected, description) {
    const result = calculatePoints(pred1, pred2, act1, act2);
    const status = result === expected ? '✅' : '❌';
    console.log(`${status} ${description}`);
    console.log(`   Predicted: ${pred1}-${pred2} | Actual: ${act1}-${act2}`);
    console.log(`   Expected: ${expected} | Got: ${result}`);
    if (result !== expected) {
        console.log(`   🚨 FAILED!`);
    }
    console.log('');
    return result === expected;
}

console.log('🧪 TESTING PREDICTION SCORING SYSTEM');
console.log('=====================================\n');

let allPassed = true;

// Test cases
allPassed &= testCase(2, 1, 2, 1, 5, 'Exact Score Match');
allPassed &= testCase(3, 1, 2, 0, 3, 'Correct Result + Goal Difference');
allPassed &= testCase(2, 1, 1, 0, 1, 'Correct Result Only');
allPassed &= testCase(1, 2, 3, 0, 0, 'Wrong Prediction');
allPassed &= testCase(1, 1, 2, 2, 3, 'Draw with Same Goal Difference');
allPassed &= testCase(0, 0, 1, 1, 1, 'Draw Result Only');
allPassed &= testCase(3, 2, 2, 1, 1, 'Same Winner, Different Scores');
allPassed &= testCase(1, 0, 0, 1, 0, 'Opposite Result');

console.log('=====================================');
if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Prediction scoring system logic is correct.');
} else {
    console.log('❌ SOME TESTS FAILED! Check the prediction scoring logic.');
}
console.log('=====================================');
