const axios = require('axios');
const API_URL = 'http://localhost:5000';
const TEST_USER = { email: 'test@example.com', password: 'test123' };

async function seedHealthData() {
  try {
    console.log('🌱 Seeding Health Data...\n');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, TEST_USER);
    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    // Create reminders
    const reminders = [
      { medicineName: 'Aspirin', dosage: '100mg', frequency: 'Once daily', times: ['09:00'], 
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    ];

    let reminderIds = [];
    for (const reminder of reminders) {
      try {
        const response = await axios.post(`${API_URL}/api/reminders`, reminder, {
          headers: { Authorization: `Bearer ${token}` }
        });
        reminderIds.push(response.data.id);
      } catch (err) {}
    }

    // Create logs for past 14 days
    for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(9, 0, 0, 0);
      const shouldTake = Math.random() > 0.1;
      
      const log = {
        reminderId: reminderIds[0] || 'temp-id',
        medicineName: 'Aspirin',
        scheduledTime: date.toISOString(),
        status: shouldTake ? 'taken' : 'missed',
        takenTime: shouldTake ? new Date(date.getTime() + 15 * 60000).toISOString() : undefined
      };

      try {
        await axios.post(`${API_URL}/api/health-score/log`, log, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {}
    }

    const healthScoreResponse = await axios.get(`${API_URL}/api/health-score`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Health Score:', healthScoreResponse.data.overallScore + '%');
    console.log('✅ Seeding complete!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seedHealthData();
