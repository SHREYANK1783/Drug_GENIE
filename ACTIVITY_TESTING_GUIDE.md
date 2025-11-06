# Activity Tracking - Testing Guide

## ✅ What's Been Fixed

Activities are now properly logged when you use features! Here's what was added:

### Backend Activity Logging
- ✅ **Medicine Search** - Logs when you search or view medicine info
- ✅ **Drug Interaction Check** - Logs when you check drug interactions
- ✅ **AI Consultation** - Already implemented
- ✅ **POST /api/activities/log** - New endpoint for frontend logging

### Frontend Activity Logger
- ✅ **Helper function** `logUserActivity()` - Easy activity logging
- ✅ **Type-safe constants** - `ActivityTypes` for all activity types
- ✅ **Auto token handling** - Automatically gets and sends auth token
- ✅ **Error handling** - Won't break app if logging fails

## 🧪 How to Test

### 1. Start the Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd my-app
npm run dev
```

### 2. Login to the App
- Go to http://localhost:5173
- Login with your credentials
- Make sure you're authenticated

### 3. Test Each Feature

#### Test Drug Interaction Check
1. Go to **Drug Checker** page
2. Add 2+ medications (e.g., "Aspirin", "Ibuprofen")
3. Click "Check Interactions"
4. Go back to **Dashboard**
5. **You should see:** "Drug interaction check performed • Your Name"

#### Test Medicine Search
1. Go to **Medicine Library** page
2. Search for a medicine (e.g., "Aspirin")
3. Click on a medicine to view details
4. Go back to **Dashboard**
5. **You should see:** "Medicine search performed • Your Name"

#### Test AI Consultation
1. Go to **AI Assistant** page
2. Ask a health question
3. Wait for response
4. Go back to **Dashboard**
5. **You should see:** "AI consultation completed • Your Name"

### 4. Check Recent Activity Section

On the Dashboard, you should see:
```
🛡️ Drug interaction check performed • Your Name
   Checked: Aspirin + Ibuprofen
   just now

📚 Medicine search performed • Your Name
   Searched for: "Aspirin"
   2 minutes ago

🤖 AI consultation completed • Your Name
   Asked: "What are the side effects..."
   5 minutes ago
```

## 🔍 Troubleshooting

### Activities Not Showing?

**1. Check Browser Console**
```javascript
// Should see successful POST requests
POST /api/activities/log - 201 Created
```

**2. Check Backend Logs**
```bash
# Should see activity logs
Activity logged: drug_interaction for user...
```

**3. Check Authentication**
```javascript
// In browser console
sessionStorage.getItem('authToken')
// Should return a token
```

**4. Check MongoDB**
```bash
# Connect to MongoDB
use drugGenie
db.activitylogs.find().limit(5).sort({timestamp: -1})
# Should show recent activities
```

### Activities Not Updating in Real-Time?

**Check Auto-Refresh:**
- Dashboard refreshes activities every 30 seconds
- Manually refresh page to see immediate updates
- Check browser console for API calls

### "No recent activity" Message?

**Perform Some Actions:**
1. Use at least one feature (Drug Checker, Medicine Search, AI)
2. Wait 2-3 seconds for logging to complete
3. Refresh the Dashboard page
4. Activities should appear

## 📊 Activity Types Available

| Feature | Activity Type | Action Text |
|---------|--------------|-------------|
| Drug Checker | `drug_interaction` | "Drug interaction check performed" |
| Medicine Search | `medicine_search` | "Medicine search performed" |
| Medicine View | `medicine_search` | "Medicine information viewed" |
| AI Assistant | `ai_consultation` | "AI consultation completed" |
| Health Score | `health_score` | "Health score checked" |
| Blood Request | `blood_request` | "Blood donation request sent" |
| Medication Log | `medication_log` | "Medication logged" |
| Profile Update | `profile_update` | "Profile updated" |

## 🚀 Adding Activity Logging to New Features

### Method 1: Frontend Logging (Recommended)

```typescript
import { logUserActivity, ActivityTypes } from '../services/activityLogger';

// After your feature action completes
await logUserActivity(
  ActivityTypes.YOUR_FEATURE,
  'Action description',
  'Optional details',
  { optional: 'metadata' }
);
```

### Method 2: Backend Logging

```typescript
import { logActivity } from './activityController';

// In your controller
const user = (req as any).user;
await logActivity(
  user._id.toString(),
  user.name || 'User',
  'activity_type',
  'Action description',
  'Optional details',
  { optional: 'metadata' }
);
```

## ✅ Expected Results

After using features, you should see:

**Dashboard Recent Activity:**
- ✅ Real-time activity feed
- ✅ User names displayed
- ✅ Activity details shown
- ✅ Relative timestamps ("2 minutes ago")
- ✅ Color-coded icons
- ✅ Auto-refresh every 30 seconds

**Activity Data:**
- ✅ Stored in MongoDB `activitylogs` collection
- ✅ Indexed for fast queries
- ✅ Includes user info, timestamps, and metadata
- ✅ Accessible via API endpoints

## 🎯 Quick Test Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] User logged in
- [ ] Performed drug interaction check
- [ ] Searched for medicine
- [ ] Asked AI a question
- [ ] Checked Dashboard
- [ ] Activities visible in Recent Activity section
- [ ] Activities show correct user name
- [ ] Timestamps are relative ("X minutes ago")
- [ ] Icons are color-coded correctly

## 🐛 Common Issues

### Issue: "Cannot find name 'logUserActivity'"
**Solution:** Import the helper:
```typescript
import { logUserActivity, ActivityTypes } from '../services/activityLogger';
```

### Issue: "401 Unauthorized" when logging activity
**Solution:** User not logged in. Check:
```javascript
sessionStorage.getItem('authToken')
```

### Issue: Activities logged but not showing
**Solution:** 
1. Check if Dashboard is fetching activities
2. Look for API call: `GET /api/activities/recent`
3. Check browser console for errors
4. Manually refresh the page

### Issue: Duplicate activities
**Solution:** This is normal if you:
- Refresh the page multiple times
- Check interactions multiple times
- Each action creates a new activity log

## 📝 Notes

- Activities are logged **after** the action completes successfully
- Logging failures won't break the app (error handling in place)
- Activities auto-refresh every 30 seconds on Dashboard
- Maximum 10 most recent activities shown by default
- All activities stored permanently in MongoDB

---

**Status:** ✅ Fully Functional
**Last Updated:** November 2025

Need help? Check browser console and backend logs for detailed error messages.
