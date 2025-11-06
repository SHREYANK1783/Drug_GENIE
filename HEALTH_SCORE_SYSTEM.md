# Health Score Calculation System

## Overview
The Health Score system provides users with an accurate, data-driven assessment of their medication management and overall health habits. The score is calculated based on real user data and provides actionable insights.

## Calculation Logic

### Overall Score (0-100%)
The health score uses a **weighted formula** combining multiple factors:

```
Overall Score = (Adherence × 70%) + (Timeliness × 20%) + (Streak × 10%)
```

**Note:** Reminder feature is currently disabled, so reminder consistency is not included in the calculation.

### 1. Medication Adherence (70% weight) ⭐ Most Important
**What it measures:** How consistently you take your prescribed medications

**Formula:**
```
Adherence = (Medications Taken / (Taken + Missed)) × 100
```

**Scoring:**
- 90-100%: Excellent (Green)
- 75-89%: Good (Yellow)
- 50-74%: Needs Attention (Orange)
- Below 50%: Critical (Red)

**Why it matters:** This is the most important factor because consistent medication intake directly impacts health outcomes.

---

### 2. Timeliness (20% weight)
**What it measures:** How close to the scheduled time you take your medications

**Scoring per dose:**
- Within 30 minutes: 100 points
- Within 1 hour: 75 points
- Within 2 hours: 50 points
- Over 2 hours: 25 points

**Final score:** Average of all doses taken

**Why it matters:** Taking medications at consistent times improves their effectiveness and helps build a routine.

---

### 3. Streak Bonus (10% weight)
**What it measures:** Consecutive days without missing medications

**Formula:**
```
Streak Score = min(Current Streak × 10, 100)
```

**Examples:**
- 1 day streak = 10 points
- 5 day streak = 50 points
- 10+ day streak = 100 points

**Streak Requirements:**
- A day counts as successful if ≥80% of scheduled medications are taken
- Streak breaks if adherence drops below 80% on any day

**Why it matters:** Encourages consistency and builds healthy habits through gamification.

---

## Data Sources

### Backend Models
1. **MedicationLog** - Tracks each medication intake
   - `scheduledTime`: When medication should be taken
   - `takenTime`: When medication was actually taken
   - `status`: 'taken', 'missed', or 'skipped'

2. **Reminder** - Active medication reminders
   - `isActive`: Whether reminder is currently active
   - `endDate`: When reminder expires

### API Endpoints
- `GET /api/health-score` - Get current health score
- `POST /api/health-score/log` - Log medication intake
- `GET /api/health-score/logs` - Get medication history

---

## Insights & Recommendations

### Automated Insights
The system generates contextual insights based on your data:

**Adherence-based:**
- ≥90%: "Excellent medication adherence! Keep up the great work."
- 75-89%: "Good medication adherence, but there's room for improvement."
- 50-74%: "Your medication adherence needs attention."
- <50%: "Low medication adherence detected. This may affect your health."

**Streak-based:**
- ≥7 days: "Amazing! You're on a [X]-day streak."
- 3-6 days: "You're building a good habit with a [X]-day streak."

**Timeliness-based:**
- ≥80%: "You're taking medications on time consistently."
- <60%: "Try to take medications closer to scheduled times."

### Smart Recommendations
The system provides actionable recommendations:

1. **Low adherence (<80%):** "Set more reminders to improve medication adherence"
2. **No reminders:** "Create medication reminders to stay on track"
3. **Few reminders (<2):** "Consider adding reminders for all your medications"
4. **Poor timeliness (<70%):** "Enable notification sounds for timely medication intake"
5. **More missed than taken:** "Consult your healthcare provider about your medication routine"
6. **No streak:** "Focus on taking medications daily to build a healthy streak"

---

## UI Display

### Dashboard
- Large score display with color coding
- Detailed breakdown of all components
- Current streak badge (if active)
- Top insight and recommendation
- Progress bars for each metric

### Sidebar
- Compact score display
- Overall percentage with color
- Single insight message
- Quick visual progress bar

### Color Coding
- **Green (80-100%):** Excellent health management
- **Yellow (60-79%):** Good progress, room for improvement
- **Red (<60%):** Needs immediate attention

---

## Future Enhancements

### Planned Features
1. **Historical Trends:** Track score changes over time
2. **Goals & Milestones:** Set personal health goals
3. **Notifications:** Alert when score drops significantly
4. **Detailed Analytics:** Weekly/monthly reports
5. **Medication Interactions:** Factor in drug interaction checks
6. **Health Checkups:** Include doctor visit tracking
7. **Symptom Tracking:** Correlate symptoms with adherence

### Advanced Scoring
- **Time-based weighting:** Recent data weighted more heavily
- **Medication importance:** Critical medications weighted higher
- **Personalization:** Adjust weights based on user's health conditions
- **Social features:** Compare with anonymized averages

---

## Technical Implementation

### Backend Stack
- **Node.js + Express** for API
- **MongoDB** for data storage
- **TypeScript** for type safety

### Frontend Stack
- **React** with TypeScript
- **Axios** for API calls
- **Framer Motion** for animations
- **TailwindCSS** for styling

### Performance
- **Caching:** Health score cached for faster loads
- **Parallel Processing:** Multiple calculations run simultaneously
- **Indexed Queries:** Database optimized for fast lookups
- **Error Handling:** Graceful degradation if data unavailable

---

## Usage Guide

### For Users
1. **Set up reminders** for all your medications
2. **Log medication intake** when you take them
3. **Check your score** regularly on the dashboard
4. **Follow recommendations** to improve your score
5. **Build streaks** by taking medications consistently

### For Developers
1. **Backend:** Health score controller handles all calculations
2. **Frontend:** `healthScoreApi.ts` provides API methods
3. **Components:** Dashboard and Sidebar display the score
4. **Models:** MedicationLog tracks all medication events

---

## Privacy & Security
- All health data is encrypted
- Scores are personal and not shared
- Data is stored securely in MongoDB
- API requires authentication
- No third-party data sharing

---

## Support
For questions or issues with the health score system:
- Check the API documentation
- Review the calculation logic above
- Contact the development team
- Report bugs via GitHub issues

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Drug GENIE Development Team
