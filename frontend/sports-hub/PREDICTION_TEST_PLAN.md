# Prediction Calculation Test Plan

## 🎯 Testing Objective
Verify that the prediction scoring system correctly calculates points and updates the leaderboard in real-time when matches finish.

## 🔄 Test Flow

### **Phase 1: Setup & Login**
1. **Navigate to**: `http://localhost:5173/`
2. **Login**: Use admin or regular user credentials
3. **Navigate to**: Game Page (Live Matches section)

### **Phase 2: Make Test Predictions**
1. **Find a live/ongoing match** in the Live Matches section
2. **Make a prediction** by entering scores for both teams
3. **Note your prediction** for later verification

### **Phase 3: Admin Match Management**
1. **Access Admin Panel** (if you have admin rights)
   - Navigate to `/admin` or use admin dashboard
   - Go to "Live Match Management"
2. **Finish the match** by:
   - Setting final scores
   - Changing status to "completed" or "finished"
   - Click "Finish Match" or equivalent button

### **Phase 4: Verification**
1. **Check prediction points** - Should appear immediately
2. **Check leaderboard** - Should update with new points
3. **Verify calculations** using the scoring rules below

## 📊 Scoring Rules Reference

| Scenario | Points | Example |
|----------|--------|---------|
| **Exact Score Match** | 5 points | Predicted: 2-1, Actual: 2-1 |
| **Correct Result + Goal Difference** | 3 points | Predicted: 3-1, Actual: 2-0 |
| **Correct Result Only** | 1 point | Predicted: 2-1, Actual: 1-0 |
| **Incorrect Prediction** | 0 points | Predicted: 1-2, Actual: 3-0 |

## 🧪 Test Cases to Try

### **Test Case 1: Exact Score (5 Points)**
- **Your Prediction**: 2-1
- **Admin Sets Final Score**: 2-1
- **Expected Points**: 5
- **Expected Message**: "🎯 Perfect! Exact score match"

### **Test Case 2: Correct Result + Difference (3 Points)**
- **Your Prediction**: 3-1 (Team1 wins by 2 goals)
- **Admin Sets Final Score**: 2-0 (Team1 wins by 2 goals)
- **Expected Points**: 3
- **Expected Message**: "🎉 Great! Correct result and goal difference"

### **Test Case 3: Correct Result Only (1 Point)**
- **Your Prediction**: 2-1 (Team1 wins)
- **Admin Sets Final Score**: 3-0 (Team1 wins)
- **Expected Points**: 1
- **Expected Message**: "👍 Good! Correct match result"

### **Test Case 4: Wrong Prediction (0 Points)**
- **Your Prediction**: 1-2 (Team2 wins)
- **Admin Sets Final Score**: 3-0 (Team1 wins)
- **Expected Points**: 0
- **Expected Message**: "😔 Better luck next time!"

## 🔍 What to Monitor

### **Frontend Console Logs**
Open browser DevTools (F12) and watch for:
```
🎯 Checking for finished matches to evaluate predictions...
🏁 Found newly finished matches: [Match Name]
📊 Triggering evaluation for match: Team1 vs Team2
✅ Successfully triggered evaluation for match [ID]
🔄 Refreshing data after prediction evaluation...
✅ Data refresh completed after prediction evaluation
```

### **UI Elements to Check**
1. **Live Match Card**: Points should appear after match finishes
2. **Leaderboard**: Your ranking should update with new points
3. **User Stats**: Total points should increase
4. **Prediction Display**: Should show your prediction and points earned

## 🛠️ Manual Testing Steps

### **Step 1: Create Test Match (Admin)**
```
1. Go to Admin Dashboard
2. Navigate to "Live Match Management"
3. Click "+ Add Live Match"
4. Fill in match details:
   - Team 1: Test Team A
   - Team 2: Test Team B
   - Status: live
   - Initial scores: 0-0
5. Save the match
```

### **Step 2: Make Prediction (User)**
```
1. Go to Game Page
2. Find your test match in Live Matches
3. Enter your prediction (e.g., 2-1)
4. Click "Submit Prediction"
5. Verify success message appears
```

### **Step 3: Finish Match (Admin)**
```
1. Return to Live Match Management
2. Find your test match
3. Update final scores (e.g., 2-1)
4. Change status to "completed"
5. Save changes
```

### **Step 4: Verify Results (User)**
```
1. Go back to Game Page
2. Check the finished match card
3. Verify points are displayed correctly
4. Check leaderboard for updated ranking
5. Verify user stats reflect new points
```

## 🔧 Debugging Tips

### **If Points Don't Appear:**
1. Check browser console for errors
2. Verify match status changed to "completed" or "finished"
3. Check that final scores are set correctly
4. Wait 2-3 seconds for automatic refresh
5. Manually refresh the page

### **If Calculation is Wrong:**
1. Double-check the scoring rules
2. Verify prediction and actual scores
3. Check console logs for calculation details
4. Test with the manual calculation:
   ```javascript
   // In browser console:
   // Replace values with your test case
   PredictionScoring.calculatePoints(2, 1, 2, 1); // Should return 5
   ```

### **Common Issues:**
- **Authentication**: Make sure you're logged in
- **Timing**: Allow 2-3 seconds for real-time updates
- **Browser Cache**: Hard refresh (Ctrl+F5) if needed
- **Network**: Check if API calls are successful in Network tab

## 📋 Expected Results Checklist

After completing a test:
- [ ] Prediction was submitted successfully
- [ ] Match status changed to "completed"
- [ ] Points calculated correctly according to rules
- [ ] Points displayed on match card
- [ ] Leaderboard updated with new points
- [ ] User stats show increased total points
- [ ] Console logs show successful evaluation process

## 🎯 Success Criteria

✅ **Test Passes If:**
- Points are calculated correctly according to the 5/3/1/0 system
- Leaderboard updates automatically without page refresh
- User sees immediate feedback when match finishes
- All console logs show successful evaluation process
- No JavaScript errors in console

❌ **Test Fails If:**
- Points are calculated incorrectly
- Leaderboard doesn't update
- User doesn't see points after match finishes
- JavaScript errors appear in console
- System requires manual page refresh to see results

---

## 🚀 Quick Test Command

If you want to test the scoring logic directly in the browser console:

```javascript
// Test exact match (5 points)
PredictionScoring.calculatePoints(2, 1, 2, 1);

// Test correct result + difference (3 points)  
PredictionScoring.calculatePoints(3, 1, 2, 0);

// Test correct result only (1 point)
PredictionScoring.calculatePoints(2, 1, 1, 0);

// Test wrong prediction (0 points)
PredictionScoring.calculatePoints(1, 2, 3, 0);
```

This test plan ensures comprehensive verification of the prediction calculation system!
