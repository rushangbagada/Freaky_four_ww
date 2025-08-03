/**
 * Prediction Evaluation Service
 * 
 * This service handles the evaluation of predictions when matches are completed
 * and updates the backend leaderboard with calculated points.
 */

import { apiRequest, API_ENDPOINTS } from '../src/config/api';
import PredictionScoring from '../utils/PredictionScoring';

export class PredictionEvaluationService {
  
  /**
   * Evaluate all predictions for a completed match and update user points
   * @param {Object} match - The completed match object
   * @param {string} authToken - Authentication token
   * @returns {Promise} Evaluation results
   */
  static async evaluateMatchPredictions(match, authToken) {
    try {
      console.log('🎯 Starting prediction evaluation for match:', match._id);
      
      // Step 1: Get all predictions for this match
      const predictions = await this.getMatchPredictions(match._id, authToken);
      console.log('📊 Found predictions to evaluate:', predictions.length);
      
      if (predictions.length === 0) {
        console.log('ℹ️ No predictions to evaluate for this match');
        return { success: true, evaluatedCount: 0 };
      }
      
      // Step 2: Calculate points for each prediction
      const evaluatedPredictions = predictions.map(prediction => {
        const points = PredictionScoring.calculatePoints(
          prediction.predictedTeam1Score,
          prediction.predictedTeam2Score,
          match.team1_score,
          match.team2_score
        );
        
        return {
          ...prediction,
          points,
          evaluated: true,
          evaluatedAt: new Date().toISOString()
        };
      });
      
      console.log('📈 Calculated points for predictions:', evaluatedPredictions.map(p => ({
        userId: p.userId,
        prediction: `${p.predictedTeam1Score}-${p.predictedTeam2Score}`,
        actual: `${match.team1_score}-${match.team2_score}`,
        points: p.points
      })));
      
      // Step 3: Update each prediction with calculated points
      const updatePromises = evaluatedPredictions.map(prediction => 
        this.updatePredictionPoints(prediction, authToken)
      );
      
      const updateResults = await Promise.allSettled(updatePromises);
      const successfulUpdates = updateResults.filter(result => result.status === 'fulfilled');
      
      console.log(`✅ Successfully updated ${successfulUpdates.length}/${updateResults.length} predictions`);
      
      // Step 4: Update user leaderboard points
      const userPointsMap = new Map();
      evaluatedPredictions.forEach(prediction => {
        const userId = prediction.userId;
        if (userPointsMap.has(userId)) {
          userPointsMap.set(userId, userPointsMap.get(userId) + prediction.points);
        } else {
          userPointsMap.set(userId, prediction.points);
        }
      });
      
      // Update each user's total points
      const leaderboardUpdatePromises = Array.from(userPointsMap.entries()).map(([userId, points]) =>
        this.updateUserLeaderboardPoints(userId, points, authToken)
      );
      
      const leaderboardResults = await Promise.allSettled(leaderboardUpdatePromises);
      const successfulLeaderboardUpdates = leaderboardResults.filter(result => result.status === 'fulfilled');
      
      console.log(`🏆 Successfully updated leaderboard for ${successfulLeaderboardUpdates.length} users`);
      
      return {
        success: true,
        evaluatedCount: successfulUpdates.length,
        leaderboardUpdates: successfulLeaderboardUpdates.length,
        totalPointsAwarded: Array.from(userPointsMap.values()).reduce((sum, points) => sum + points, 0)
      };
      
    } catch (error) {
      console.error('❌ Error evaluating match predictions:', error);
      throw error;
    }
  }
  
  /**
   * Get all predictions for a specific match
   * @param {string} matchId - Match ID
   * @param {string} authToken - Authentication token
   * @returns {Promise<Array>} Array of predictions
   */
  static async getMatchPredictions(matchId, authToken) {
    try {
      const endpoint = `/api/predictions/match/${matchId}`;
      const response = await apiRequest(endpoint, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      return Array.isArray(response) ? response : (response?.predictions || []);
    } catch (error) {
      console.warn('⚠️ Could not fetch match predictions:', error.message);
      return [];
    }
  }
  
  /**
   * Update a prediction with calculated points
   * @param {Object} prediction - Prediction object with points
   * @param {string} authToken - Authentication token
   * @returns {Promise} Update result
   */
  static async updatePredictionPoints(prediction, authToken) {
    try {
      const endpoint = `/api/predictions/${prediction._id}/evaluate`;
      return await apiRequest(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          points: prediction.points,
          evaluated: true,
          evaluatedAt: prediction.evaluatedAt
        })
      });
    } catch (error) {
      console.error(`❌ Failed to update prediction ${prediction._id}:`, error);
      throw error;
    }
  }
  
  /**
   * Update user's total points in leaderboard
   * @param {string} userId - User ID
   * @param {number} pointsToAdd - Points to add to user's total
   * @param {string} authToken - Authentication token
   * @returns {Promise} Update result
   */
  static async updateUserLeaderboardPoints(userId, pointsToAdd, authToken) {
    try {
      const endpoint = `/api/leaderboard/user/${userId}/add-points`;
      return await apiRequest(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          points: pointsToAdd,
          reason: 'Match prediction evaluation'
        })
      });
    } catch (error) {
      // If the add-points endpoint doesn't exist, try updating directly
      try {
        const userEndpoint = `/api/user/${userId}/points`;
        return await apiRequest(userEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            pointsToAdd,
            source: 'prediction_evaluation'
          })
        });
      } catch (fallbackError) {
        console.error(`❌ Failed to update leaderboard for user ${userId}:`, fallbackError);
        throw fallbackError;
      }
    }
  }
  
  /**
   * Trigger automatic evaluation when a match status changes to completed
   * @param {Object} match - Match object
   * @param {string} authToken - Authentication token
   * @returns {Promise} Evaluation result
   */
  static async triggerAutomaticEvaluation(match, authToken) {
    console.log('🔄 Auto-evaluation triggered for match:', match.team1, 'vs', match.team2);
    
    // Only evaluate if match is actually completed
    if (match.status !== 'completed' && match.status !== 'finished') {
      console.log('⚠️ Match is not completed, skipping evaluation');
      return { success: false, reason: 'Match not completed' };
    }
    
    // Check if final scores are available
    if (match.team1_score === undefined || match.team2_score === undefined) {
      console.log('⚠️ Final scores not available, skipping evaluation');
      return { success: false, reason: 'Final scores not available' };
    }
    
    try {
      return await this.evaluateMatchPredictions(match, authToken);
    } catch (error) {
      console.error('❌ Auto-evaluation failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Get evaluation summary for a match
   * @param {string} matchId - Match ID
   * @param {string} authToken - Authentication token
   * @returns {Promise<Object>} Evaluation summary
   */
  static async getEvaluationSummary(matchId, authToken) {
    try {
      const predictions = await this.getMatchPredictions(matchId, authToken);
      const evaluatedPredictions = predictions.filter(p => p.evaluated);
      
      const summary = {
        totalPredictions: predictions.length,
        evaluatedPredictions: evaluatedPredictions.length,
        pendingEvaluation: predictions.length - evaluatedPredictions.length,
        perfectScores: evaluatedPredictions.filter(p => p.points === 5).length,
        goodScores: evaluatedPredictions.filter(p => p.points === 3).length,
        correctResults: evaluatedPredictions.filter(p => p.points === 1).length,
        incorrectPredictions: evaluatedPredictions.filter(p => p.points === 0).length,
        totalPointsAwarded: evaluatedPredictions.reduce((sum, p) => sum + (p.points || 0), 0)
      };
      
      return summary;
    } catch (error) {
      console.error('❌ Error getting evaluation summary:', error);
      return null;
    }
  }
}

export default PredictionEvaluationService;
