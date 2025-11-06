/**
 * Test script for Health Score API
 * Run with: node test-health-score.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Test user credentials (use your actual test user)
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123'
};

async function testHealthScore() {
  try {
    console.log('🧪 Testing Health Score API...\n');

    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, TEST_USER);
    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    // Step 2: Get Health Score
    console.log('2️⃣ Fetching health score...');
    const healthScoreResponse = await axios.get(`${API_URL}/api/health-score`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Health Score Data:');
    console.log(JSON.stringify(healthScoreResponse.data, null, 2));
    console.log('\n');

    // Step 3: Check if user has reminders
    console.log('3️⃣ Checking reminders...');
    const remindersResponse = await axios.get(`${API_URL}/api/reminders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Active Reminders: ${remindersResponse.data.length}\n`);

    // Step 4: Seed sample medication logs if none exist
    if (healthScoreResponse.data.totalMedications === 0) {
      console.log('4️⃣ No medication logs found. Would you like to seed sample data?');
      console.log('   Run: node seed-health-data.js\n');
    }

    console.log('✅ All tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testHealthScore();
