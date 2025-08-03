/**
 * Prediction Scoring System
 * 
 * This utility handles the scoring logic for match predictions.
 * 
 * Scoring Rules:
 * - Exact score match: 5 points
 * - Correct result + correct goal difference: 3 points  
 * - Correct result only: 1 point
 * - Incorrect prediction: 0 points
 */

export class PredictionScoring {
  
  /**
   * Calculate points for a single prediction
   * @param {number} predictedTeam1Score - User's predicted score for team 1
   * @param {number} predictedTeam2Score - User's predicted score for team 2
   * @param {number} actualTeam1Score - Actual final score for team 1
   * @param {number} actualTeam2Score - Actual final score for team 2
   * @returns {number} Points earned (0, 1, 3, or 5)
   */
  static calculatePoints(predictedTeam1Score, predictedTeam2Score, actualTeam1Score, actualTeam2Score) {
    const pred1 = parseInt(predictedTeam1Score);
    const pred2 = parseInt(predictedTeam2Score);
    const act1 = parseInt(actualTeam1Score);
    const act2 = parseInt(actualTeam2Score);
    
    // Validate inputs
    if (isNaN(pred1) || isNaN(pred2) || isNaN(act1) || isNaN(act2)) {
      return 0;
    }
    
    // Exact score match: 5 points
    if (pred1 === act1 && pred2 === act2) {
      return 5;
    }
    
    // Calculate goal differences and match results
    const predDiff = pred1 - pred2;
    const actDiff = act1 - act2;
    const predResult = predDiff > 0 ? 'team1_win' : predDiff < 0 ? 'team2_win' : 'draw';
    const actResult = actDiff > 0 ? 'team1_win' : actDiff < 0 ? 'team2_win' : 'draw';
    
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
  
  /**
   * Evaluate all predictions for a completed match
   * @param {Object} match - Match object with final scores
   * @param {Array} predictions - Array of user predictions for this match
   * @returns {Array} Updated predictions with calculated points
   */
  static evaluateMatchPredictions(match, predictions) {
    const actualTeam1Score = match.team1_score;
    const actualTeam2Score = match.team2_score;
    
    return predictions.map(prediction => {
      const points = this.calculatePoints(
        prediction.predictedTeam1Score,
        prediction.predictedTeam2Score,
        actualTeam1Score,
        actualTeam2Score
      );
      
      return {
        ...prediction,
        points,
        evaluated: true,
        evaluatedAt: new Date()
      };
    });
  }
  
  /**
   * Get scoring explanation for display
   * @param {number} points - Points earned
   * @returns {string} Human-readable explanation
   */
  static getScoreExplanation(points) {
    switch (points) {
      case 5:
        return 'Perfect! Exact score match';
      case 3:
        return 'Great! Correct result and goal difference';
      case 1:
        return 'Good! Correct match result';
      case 0:
        return 'Better luck next time!';
      default:
        return 'Pending evaluation';
    }
  }
  
  /**
   * Validate prediction before submission
   * @param {Object} prediction - Prediction object to validate
   * @returns {Object} Validation result
   */
  static validatePrediction(prediction) {
    const { team1Score, team2Score } = prediction;
    
    if (team1Score === undefined || team1Score === null || team1Score === '') {
      return { isValid: false, error: 'Team 1 score is required' };
    }
    
    if (team2Score === undefined || team2Score === null || team2Score === '') {
      return { isValid: false, error: 'Team 2 score is required' };
    }
    
    const score1 = parseInt(team1Score);
    const score2 = parseInt(team2Score);
    
    if (isNaN(score1) || score1 < 0) {
      return { isValid: false, error: 'Team 1 score must be a valid non-negative number' };
    }
    
    if (isNaN(score2) || score2 < 0) {
      return { isValid: false, error: 'Team 2 score must be a valid non-negative number' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Calculate user's total points and statistics
   * @param {Array} userPredictions - All predictions made by a user
   * @returns {Object} User statistics
   */
  static calculateUserStats(userPredictions) {
    const evaluatedPredictions = userPredictions.filter(p => p.evaluated);
    const totalPredictions = userPredictions.length;
    const evaluatedCount = evaluatedPredictions.length;
    
    const totalPoints = evaluatedPredictions.reduce((sum, pred) => sum + (pred.points || 0), 0);
    
    const perfectScores = evaluatedPredictions.filter(p => p.points === 5).length;
    const goodScores = evaluatedPredictions.filter(p => p.points === 3).length;
    const correctResults = evaluatedPredictions.filter(p => p.points === 1).length;
    const missedPredictions = evaluatedPredictions.filter(p => p.points === 0).length;
    
    const averagePoints = evaluatedCount > 0 ? (totalPoints / evaluatedCount).toFixed(2) : 0;
    const accuracy = evaluatedCount > 0 ? ((evaluatedCount - missedPredictions) / evaluatedCount * 100).toFixed(1) : 0;
    
    return {
      totalPoints,
      totalPredictions,
      evaluatedPredictions: evaluatedCount,
      pendingEvaluation: totalPredictions - evaluatedCount,
      perfectScores,
      goodScores,
      correctResults,
      missedPredictions,
      averagePoints: parseFloat(averagePoints),
      accuracy: parseFloat(accuracy)
    };
  }
}

export default PredictionScoring;
