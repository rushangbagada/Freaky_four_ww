// Copy this into your browser console while on the prediction page
// This will show what the frontend is actually sending

console.log('🔍 Debugging frontend request...');

// Check localStorage data
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

console.log('💾 LocalStorage data:');
console.log('User:', storedUser);
console.log('Token:', storedToken);

if (storedUser) {
  const userData = JSON.parse(storedUser);
  console.log('👤 Parsed user data:', userData);
  console.log('🆔 User ID that would be sent:', userData._id || userData.id);
}

// Test the exact same request the frontend would make
const testData = {
  userId: storedUser ? (JSON.parse(storedUser)._id || JSON.parse(storedUser).id) : '6868bd2405488200315811b8',
  matchId: '68761201a44cdadaa5363543',
  team1Score: 12,
  team2Score: 11
};

console.log('📤 About to send request with data:', testData);

const headers = {
  "Content-Type": "application/json"
};

if (storedToken) {
  headers["Authorization"] = `Bearer ${storedToken}`;
}

console.log('📋 Headers:', headers);

fetch("/api/user/live-match-prediction", {
  method: "POST",
  headers,
  body: JSON.stringify(testData)
})
.then(res => {
  console.log('📊 Response status:', res.status);
  console.log('📊 Response ok:', res.ok);
  
  if (!res.ok) {
    return res.text().then(text => {
      console.error('❌ Server error response:', text);
      let errorMessage = 'Failed to submit prediction';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
        console.log('❌ Parsed error data:', errorData);
      } catch (e) {
        console.log('❌ Response is not JSON:', text);
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    });
  }
  return res.json();
})
.then(data => {
  console.log('✅ SUCCESS! Response:', data);
})
.catch(err => {
  console.error('❌ FRONTEND ERROR:', {
    error: err,
    message: err.message,
    stack: err.stack
  });
});
