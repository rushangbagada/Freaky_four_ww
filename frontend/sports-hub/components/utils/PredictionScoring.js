/**
 * Enhanced Prediction Scoring System - Foolproof Version
 * 
 * This utility handles the scoring logic for match predictions with comprehensive
 * validation, error handling, and edge case management.
 * 
 * Scoring Rules:
 * - Exact score match: 5 points
 * - Correct result + correct goal difference: 3 points  
 * - Correct result only: 1 point
 * - Incorrect prediction: 0 points
 * 
 * Features:
 * - Input validation and sanitization
 * - Edge case handling (negative scores, null values, etc.)
 * - Detailed logging for debugging
 * - Type coercion safety
 * - Comprehensive error handling
 */

export class PredictionScoring {
  
  // Constants for scoring
  static POINTS = {
    EXACT_MATCH: 5,
    RESULT_AND_DIFFERENCE: 3,
    RESULT_ONLY: 1,
    INCORRECT: 0
  };
  
  static MATCH_RESULTS = {
    TEAM1_WIN: 'team1_win',
    TEAM2_WIN: 'team2_win',
    DRAW: 'draw'
  };
  
  /**
   * Enhanced score validation and sanitization
   * @param {any} score - Score to validate
   * @returns {Object} Validation result with sanitized score
   */
  static validateScore(score) {
    // Handle null, undefined, empty string
    if (score === null || score === undefined || score === '') {
      return { isValid: false, sanitized: 0, error: 'Score cannot be empty' };
    }
    
    // Handle string numbers
    let numericScore;
    if (typeof score === 'string') {
      // Remove whitespace and handle decimal points
      const cleanScore = score.trim().replace(/\.\d+$/, ''); // Remove decimals
      numericScore = parseInt(cleanScore, 10);
    } else {
      numericScore = parseInt(score, 10);
    }
    
    // Check if conversion was successful
    if (isNaN(numericScore)) {
      return { isValid: false, sanitized: 0, error: `Invalid score format: ${score}` };
    }
    
    // Check for negative scores
    if (numericScore < 0) {
      return { isValid: false, sanitized: 0, error: `Score cannot be negative: ${numericScore}` };
    }
    
    // Check for unreasonably high scores (failsafe)
    if (numericScore > 99) {
      return { isValid: false, sanitized: 0, error: `Score too high: ${numericScore}` };
    }
    
    return { isValid: true, sanitized: numericScore, error: null };
  }
  
  /**
   * Determine match result from score difference
   * @param {number} scoreDifference - Difference between team scores
   * @returns {string} Match result constant
   */
  static getMatchResult(scoreDifference) {
    if (scoreDifference > 0) return this.MATCH_RESULTS.TEAM1_WIN;
    if (scoreDifference < 0) return this.MATCH_RESULTS.TEAM2_WIN;
    return this.MATCH_RESULTS.DRAW;
  }
  
  /**
   * Calculate points for a single prediction with comprehensive validation
   * @param {any} predictedTeam1Score - User's predicted score for team 1
   * @param {any} predictedTeam2Score - User's predicted score for team 2
   * @param {any} actualTeam1Score - Actual final score for team 1
   * @param {any} actualTeam2Score - Actual final score for team 2
   * @param {Object} options - Additional options
   * @returns {Object} Detailed calculation result
   */
  static calculatePoints(predictedTeam1Score, predictedTeam2Score, actualTeam1Score, actualTeam2Score, options = {}) {
    const { debug = false, throwOnError = false } = options;
    
    try {
      // Validate and sanitize all inputs
      const pred1Validation = this.validateScore(predictedTeam1Score);
      const pred2Validation = this.validateScore(predictedTeam2Score);
      const act1Validation = this.validateScore(actualTeam1Score);
      const act2Validation = this.validateScore(actualTeam2Score);
      
      // Collect all validation errors
      const errors = [];
      if (!pred1Validation.isValid) errors.push(`Predicted Team 1: ${pred1Validation.error}`);
      if (!pred2Validation.isValid) errors.push(`Predicted Team 2: ${pred2Validation.error}`);
      if (!act1Validation.isValid) errors.push(`Actual Team 1: ${act1Validation.error}`);
      if (!act2Validation.isValid) errors.push(`Actual Team 2: ${act2Validation.error}`);
      
      // If any validation failed, return detailed error info
      if (errors.length > 0) {
        const errorResult = {
          points: this.POINTS.INCORRECT,
          isValid: false,
          errors,
          reason: 'Input validation failed',
          debug: debug ? {
            inputs: { predictedTeam1Score, predictedTeam2Score, actualTeam1Score, actualTeam2Score },
            validations: { pred1Validation, pred2Validation, act1Validation, act2Validation }
          } : undefined
        };
        
        if (throwOnError) {
          throw new Error(`Prediction scoring failed: ${errors.join(', ')}`);
        }
        
        return errorResult;
      }
      
      // Extract sanitized scores
      const pred1 = pred1Validation.sanitized;
      const pred2 = pred2Validation.sanitized;
      const act1 = act1Validation.sanitized;
      const act2 = act2Validation.sanitized;
      
      // Calculate differences and results
      const predDiff = pred1 - pred2;
      const actDiff = act1 - act2;
      const predResult = this.getMatchResult(predDiff);
      const actResult = this.getMatchResult(actDiff);
      
      // Determine points based on accuracy
      let points, reason, category;
      
      if (pred1 === act1 && pred2 === act2) {
        points = this.POINTS.EXACT_MATCH;
        reason = 'Perfect exact score match';
        category = 'exact_match';
      } else if (predResult === actResult && predDiff === actDiff) {
        points = this.POINTS.RESULT_AND_DIFFERENCE;
        reason = 'Correct result and goal difference';
        category = 'result_and_difference';
      } else if (predResult === actResult) {
        points = this.POINTS.RESULT_ONLY;
        reason = 'Correct match result only';
        category = 'result_only';
      } else {
        points = this.POINTS.INCORRECT;
        reason = 'Incorrect prediction';
        category = 'incorrect';
      }
      
      // Return comprehensive result
      return {
        points,
        isValid: true,
        reason,
        category,
        details: {
          predicted: { team1: pred1, team2: pred2, result: predResult, difference: predDiff },
          actual: { team1: act1, team2: act2, result: actResult, difference: actDiff },
          matches: {
            exactScore: pred1 === act1 && pred2 === act2,
            result: predResult === actResult,
            difference: predDiff === actDiff
          }
        },
        debug: debug ? {
          inputs: { predictedTeam1Score, predictedTeam2Score, actualTeam1Score, actualTeam2Score },
          sanitized: { pred1, pred2, act1, act2 },
          calculations: { predDiff, actDiff, predResult, actResult }
        } : undefined
      };
      
    } catch (error) {
      const errorResult = {
        points: this.POINTS.INCORRECT,
        isValid: false,
        errors: [error.message],
        reason: 'Calculation error',
        debug: debug ? { error: error.stack } : undefined
      };
      
      if (throwOnError) {
        throw error;
      }
      
      return errorResult;
    }
  }
  
  /**
   * Simple points calculation (backward compatibility)
   * @param {any} predictedTeam1Score - User's predicted score for team 1
   * @param {any} predictedTeam2Score - User's predicted score for team 2
   * @param {any} actualTeam1Score - Actual final score for team 1
   * @param {any} actualTeam2Score - Actual final score for team 2
   * @returns {number} Points earned (0, 1, 3, or 5)
   */
  static calculateSimplePoints(predictedTeam1Score, predictedTeam2Score, actualTeam1Score, actualTeam2Score) {
    const result = this.calculatePoints(predictedTeam1Score, predictedTeam2Score, actualTeam1Score, actualTeam2Score);
    return result.points;
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
