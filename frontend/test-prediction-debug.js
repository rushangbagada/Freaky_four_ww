async function testPredictionEndpoint() {
  console.log('🧪 Testing prediction endpoint directly...');
  
  const testData = {
    userId: '6868bd2405488200315811b8',
    matchId: '68761201a44cdadaa5363543',
    team1Score: 12,
    team2Score: 11
  };

  console.log('📤 Request data:', testData);

  try {
    // First, test if user exists
    console.log('\n1️⃣ Testing if user exists in database...');
    const userCheckResponse = await fetch(`http://localhost:5000/api/health`);
    if (userCheckResponse.ok) {
      console.log('✅ Server is responding');
    } else {
      console.log('❌ Server not responding');
      return;
    }

    // Test the prediction endpoint
    console.log('\n2️⃣ Testing prediction endpoint...');
    const response = await fetch('http://localhost:5000/api/user/live-match-prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);

    const responseText = await response.text();
    console.log('📊 Raw response:', responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ SUCCESS! Prediction submitted:', data);
    } else {
      console.log('❌ ERROR! Response:', responseText);
      
      // Try to parse as JSON
      try {
        const errorData = JSON.parse(responseText);
        console.log('❌ Parsed error:', errorData);
      } catch (e) {
        console.log('❌ Could not parse error as JSON');
      }
    }

    // Test if the user can be found directly
    console.log('\n3️⃣ Testing user lookup in separate request...');
    const userTestResponse = await fetch('http://localhost:5000/api/user/live-match-prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: '687534e9fa76351b042929f4', // Try with a user ID we know exists
        matchId: '68761201a44cdadaa5363543',
        team1Score: 1,
        team2Score: 2
      })
    });

    const userTestText = await userTestResponse.text();
    console.log('🧪 Test with known user ID result:', userTestResponse.status, userTestText);

  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

// Run the test
testPredictionEndpoint();
