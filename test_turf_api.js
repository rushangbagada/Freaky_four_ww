const fetch = require('node-fetch');

const testTurfAPI = async () => {
  try {
    console.log('🧪 Testing turf API endpoint...');
    const response = await fetch('http://localhost:5000/api/turfs');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response received:');
    console.log(`📊 Found ${data.length} turfs:`);
    
    data.forEach((turf, index) => {
      console.log(`${index + 1}. ${turf.name} - ${turf.location} - ₹${turf.price} (${turf.availability ? 'Available' : 'Not Available'})`);
    });
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('💡 Make sure the server is running on port 5000');
  }
};

testTurfAPI();
