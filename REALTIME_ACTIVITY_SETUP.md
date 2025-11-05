# Real-Time Activity Tracking Setup

## Overview
Implemented a comprehensive real-time activity tracking system that monitors all feature usage across Drug GENIE.

## What Was Created

### Backend

#### 1. Activity Log Model (`activityLogModel.ts`)
Tracks all user activities with:
- User information (ID, name)
- Activity type (ai_consultation, drug_interaction, medicine_search, etc.)
- Action description
- Details and metadata
- Timestamp

**Activity Types:**
- `ai_consultation` - AI health consultations
- `drug_interaction` - Drug interaction checks
- `medicine_search` - Medicine library searches
- `medication_log` - Medication intake logging
- `blood_request` - Blood donation requests
- `symptom_check` - Symptom checker usage
- `health_score` - Health score checks
- `reminder` - Reminder creation
- `profile_update` - Profile updates
- `login` / `register` - Authentication events

#### 2. Activity Controller (`activityController.ts`)
**Functions:**
- `logActivity()` - Helper to log any activity
- `getUserActivities()` - Get user's own activities
- `getRecentActivities()` - Get recent activities for dashboard
- `getActivityStats()` - Get activity statistics
- `getGlobalActivityFeed()` - Get all users' activities

#### 3. Activity Routes (`activityRoutes.ts`)
**Endpoints:**
- `GET /api/activities/my-activities` - User's activities
- `GET /api/activities/recent` - Recent activities
- `GET /api/activities/stats` - Activity statistics
- `GET /api/activities/feed` - Global activity feed

### Frontend

#### 1. Activity API Service (`activityApi.ts`)
TypeScript service for:
- Fetching recent activities
- Getting user activities
- Retrieving activity stats
- Accessing global feed

#### 2. Activity Helpers (`activityHelpers.ts`)
Utility functions for:
- `getActivityIcon()` - Maps activity types to icons
- `getActivityColor()` - Maps activity types to colors
- `formatActivityTime()` - Formats timestamps (e.g., "2 minutes ago")
- `getActivityName()` - Gets friendly activity names

#### 3. Updated Dashboard
- **Real-time updates** every 30 seconds
- **Live activity feed** showing recent actions
- **Color-coded activities** by type
- **Relative timestamps** (e.g., "5 minutes ago")
- **Loading states** and empty states

## Features

### Real-Time Updates
- Activities refresh automatically every 30 seconds
- No page reload needed
- Smooth animations for new activities

### Activity Logging
Activities are automatically logged when users:
- ✅ Complete AI consultations
- ✅ Check drug interactions
- ✅ Search medicines
- ✅ Log medications
- ✅ Create blood requests
- ✅ Check symptoms
- ✅ View health score
- ✅ Set reminders
- ✅ Update profile
- ✅ Login/Register

### Visual Design
- **Icon-based** - Each activity type has a unique icon
- **Color-coded** - Different colors for different activity types
- **Timestamps** - Relative time display (e.g., "2 hours ago")
- **Details** - Shows activity-specific information
- **Smooth animations** - Framer Motion animations

## Installation

### Install Required Package
```bash
cd my-app
npm install date-fns
```

### Backend is Ready
All backend code is already in place and integrated.

## Usage

### Logging Activities (Backend)
```typescript
import { logActivity } from '../controllers/activityController';

// In any controller
await logActivity(
  userId,
  userName,
  'ai_consultation',
  'AI consultation completed',
  'Asked about headache symptoms',
  { questionLength: 50 }
);
```

### Displaying Activities (Frontend)
The Dashboard automatically displays activities. To use elsewhere:

```typescript
import { getRecentActivities } from '../services/activityApi';
import { getToken } from '../services/api';

const token = getToken();
const activities = await getRecentActivities(token, 10);
```

## Activity Color Scheme

| Activity Type | Color | Icon |
|--------------|-------|------|
| AI Consultation | Purple | Bot |
| Drug Interaction | Green | Shield |
| Medicine Search | Indigo | BookOpen |
| Medication Log | Orange | Clock |
| Blood Request | Red | Droplets |
| Symptom Check | Cyan | Activity |
| Health Score | Pink | Heart |
| Reminder | Yellow | Clock |
| Profile Update | Blue | User |
| Login | Gray | LogIn |
| Register | Teal | User |

## API Examples

### Get Recent Activities
```bash
GET /api/activities/recent?limit=10
Headers: Authorization: Bearer <token>
```

### Get User's Activities
```bash
GET /api/activities/my-activities?limit=20
Headers: Authorization: Bearer <token>
```

### Get Activity Stats
```bash
GET /api/activities/stats?days=7
Headers: Authorization: Bearer <token>
```

## Next Steps

### To Add Activity Logging to More Features:

1. **Import the helper:**
   ```typescript
   import { logActivity } from '../controllers/activityController';
   ```

2. **Log the activity:**
   ```typescript
   await logActivity(
     userId,
     userName,
     'feature_name',
     'Action description',
     'Optional details',
     { optional: 'metadata' }
   );
   ```

3. **Add to activity helpers** (if new type):
   - Add icon mapping in `getActivityIcon()`
   - Add color mapping in `getActivityColor()`
   - Add name mapping in `getActivityName()`

## Troubleshooting

### Activities not showing
1. Check if backend server is running
2. Verify MongoDB connection
3. Check browser console for errors
4. Ensure user is logged in

### Activities not updating
1. Check the 30-second interval is running
2. Verify API endpoint is accessible
3. Check network tab for API calls

### Missing date-fns error
```bash
cd my-app
npm install date-fns
```

## Performance

- **Indexed queries** for fast lookups
- **Automatic cleanup** (optional - can add TTL index)
- **Efficient pagination** with limit parameter
- **Cached on frontend** between refreshes

## Future Enhancements

1. **WebSocket support** for instant updates
2. **Activity filtering** by type
3. **Activity search** functionality
4. **Export activities** to CSV
5. **Activity analytics** dashboard
6. **Push notifications** for important activities
7. **Activity grouping** by date
8. **Infinite scroll** for activity feed

---

**Status:** ✅ Fully Implemented
**Version:** 1.0.0
**Last Updated:** November 2025
