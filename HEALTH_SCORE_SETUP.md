# Health Score Setup Guide

## Issue: "No health data available yet"

The health score displays "No health data available yet" because there are no medication logs in the database. Here's how to fix it:

## Quick Fix

### Option 1: Use Sample Data (Recommended for Testing)

1. **Update test credentials** in `backend/seed-health-data.js`:
   ```javascript
   const TEST_USER = {
     email: 'your-email@example.com',  // Your actual user email
     password: 'your-password'          // Your actual password
   };
   ```

2. **Run the seed script**:
   ```bash
   cd backend
   node seed-health-data.js
   ```

3. **Refresh your dashboard** - You should now see your health score!

### Option 2: Manual Data Entry

1. **Create medication reminders**:
   - Go to the Reminders page
   - Add your medications with schedules

2. **Log medication intake**:
   - Use the API endpoint: `POST /api/health-score/log`
   - Or wait for the reminder logging feature in the UI

## Understanding Your Score

Your health score will show **0%** initially because:
- ✅ No medication logs exist yet
- ✅ This is expected for new users
- ✅ The system provides helpful onboarding messages

Once you have data:
- **0-59%**: Needs attention (Red)
- **60-79%**: Good progress (Yellow)
- **80-100%**: Excellent (Green)

## API Endpoints

### Get Health Score
```bash
GET /api/health-score
Headers: Authorization: Bearer <token>
```

### Log Medication
```bash
POST /api/health-score/log
Headers: Authorization: Bearer <token>
Body: {
  "reminderId": "reminder-id",
  "medicineName": "Aspirin",
  "scheduledTime": "2025-11-03T09:00:00Z",
  "status": "taken",
  "takenTime": "2025-11-03T09:05:00Z"
}
```

### Get Medication Logs
```bash
GET /api/health-score/logs?days=30
Headers: Authorization: Bearer <token>
```

## Troubleshooting

### Score shows 0% even with data
- Check if reminders are active
- Verify medication logs exist in database
- Check browser console for API errors

### "No health data available yet" persists
- Ensure backend server is running
- Check MongoDB connection
- Verify authentication token is valid
- Run: `node backend/test-health-score.js`

### API returns 401 Unauthorized
- Login again to get fresh token
- Check if session expired
- Verify token in sessionStorage

## Next Steps

1. ✅ Backend API is ready
2. ✅ Frontend displays score correctly
3. 🔄 Add UI for logging medications (coming soon)
4. 🔄 Add reminder notifications (coming soon)
5. 🔄 Add historical trends (coming soon)

## Support

If issues persist:
1. Check backend logs
2. Check browser console
3. Verify MongoDB is running
4. Test API with Postman/curl
