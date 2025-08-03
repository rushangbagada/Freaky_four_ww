const LiveMatchPrediction = require('../models/live_match_prediction');
const Live_Match = require('../models/live_match');

async function evaluateMatchPredictions(req, res) {
    try {
        const { matchId } = req.body;

        // Find the match by ID
        const match = await Live_Match.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // Find unprocessed predictions for this match
        const predictions = await LiveMatchPrediction.find({ matchId: matchId, isProcessed: false });

        for (let prediction of predictions) {
            let points = 0;

            // Simple points calculation (can be refined)
            if (prediction.predictedTeam1Score === match.team1_score && 
                prediction.predictedTeam2Score === match.team2_score) {
                points = 3; // Exact match
            } else if (prediction.predictedTeam1Score === match.team1_score ||
                       prediction.predictedTeam2Score === match.team2_score) {
                points = 1; // Correct score for one team
            }

            // Update prediction with points and mark as processed
            prediction.points = points;
            prediction.isProcessed = true;
            await prediction.save();
        }

        res.json({ message: "Predictions evaluated", processed: predictions.length });
    } catch (error) {
        console.error("Error evaluating predictions:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { evaluateMatchPredictions };
