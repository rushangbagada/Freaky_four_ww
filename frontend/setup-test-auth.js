// Run this in the browser console to set up test authentication
console.log('🔧 Setting up test authentication...');

// Test user data (matches the user we created in the database)
const testUser = {
  _id: '6868bd2405488200315811b8',
  id: 999,
  name: 'Test Frontend User',
  email: 'frontend-test-user@example.com',
  total_point: 0
};

// Test token (in a real app, this would be a JWT from login)
const testToken = 'test-token-12345';

// Set data in localStorage
localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('token', testToken);

console.log('✅ Test authentication data set!');
console.log('👤 User:', testUser);
console.log('🔑 Token:', testToken);
console.log('📝 You can now refresh the page and try submitting predictions');

// You can also run this to clear auth data:
// localStorage.removeItem('user');
// localStorage.removeItem('token');
// console.log('🗑️ Authentication data cleared');
