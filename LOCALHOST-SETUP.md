# Drug GENIE - Localhost Setup Guide

## Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- MongoDB Atlas account (free) - [Sign up here](https://www.mongodb.com/cloud/atlas)

## Quick Start (Easiest Method)

### Step 1: Run Setup Script
**Double-click `SETUP-AND-START.bat`** - This will:
- Install all dependencies automatically
- Check your configuration
- Start both servers
- Open the app in your browser

That's it! The app will be running at http://localhost:5173

---

## Manual Setup (If Script Doesn't Work)

### Step 1: Configure Backend Environment
1. Go to `backend` folder
2. Copy `.env.example` to `.env`
3. Edit `.env` and add your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/drugGenieDB
JWT_SECRET=your-secret-key-here
PORT=5000
GEMINI_API_KEY=your-gemini-api-key (optional)
```

### Step 2: Configure Frontend Environment
1. Go to `my-app` folder
2. Create a `.env` file with:
```
VITE_API_URL=http://localhost:5000
```

### Step 3: Install Dependencies

**Backend:**
```cmd
cd backend
npm install
```

**Frontend:**
```cmd
cd my-app
npm install
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```cmd
cd backend
npm run dev
```
✅ Should show: "🚀 Server running on port 5000" and "MongoDB Connected"

**Terminal 2 - Frontend:**
```cmd
cd my-app
npm run dev
```
✅ Should show: "Local: http://localhost:5173"

### Step 5: Access the App
Open your browser to: **http://localhost:5173**

---

## First Time Login

### Create Your Account
1. Click **"Create Account"** or **"Sign Up"**
2. Fill in your details:
   - Name
   - Email
   - Password
   - Age
   - Blood Group
   - Gender
3. Click **"Create Account"**

### Login
1. Use the email and password you just created
2. Click **"Sign In"**

---

## Troubleshooting

### "Invalid credentials" error
- **Cause:** You haven't created an account yet
- **Solution:** Click "Create Account" first, then login

### "Network Error" or blank page
- **Cause:** Backend server isn't running
- **Solution:** 
  1. Check backend terminal shows "Server running on port 5000"
  2. Check backend terminal shows "MongoDB Connected"
  3. If not, restart backend server

### Frontend won't load
- **Cause:** Frontend server isn't running
- **Solution:** Check frontend terminal shows "Local: http://localhost:5173"

### MongoDB connection error
- **Cause:** Wrong MongoDB URI in backend/.env
- **Solution:** 
  1. Check your MongoDB Atlas connection string
  2. Make sure your IP is whitelisted in MongoDB Atlas
  3. Verify username and password are correct

### Port already in use
- **Cause:** Another process is using port 5000 or 5173
- **Solution:** 
  ```cmd
  # Kill process on port 5000
  netstat -ano | findstr :5000
  taskkill /PID <process_id> /F
  
  # Kill process on port 5173
  netstat -ano | findstr :5173
  taskkill /PID <process_id> /F
  ```

---

## Project Structure

```
Drug_GENIE/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   └── index.ts      # Server entry point
│   ├── .env             # Backend config (create this)
│   └── package.json
│
├── my-app/              # React frontend
│   ├── src/
│   │   ├── pages/       # App screens
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API calls
│   │   └── App.tsx      # Main app component
│   ├── .env            # Frontend config (create this)
│   └── package.json
│
└── SETUP-AND-START.bat  # Quick setup script
```

---

## Features

✅ **User Authentication** - Secure login/signup with JWT
✅ **Medicine Reminders** - Never miss a dose
✅ **Blood Bank** - Request and donate blood
✅ **Drug Checker** - Check drug interactions
✅ **Medicine Library** - Search 14,690+ medicines
✅ **AI Health Assistant** - Powered by Google Gemini
✅ **Notifications** - Real-time updates
✅ **Profile Management** - Update your health info

---

## Need Help?

1. Make sure both servers are running (backend + frontend)
2. Check both terminals for error messages
3. Verify your .env files are configured correctly
4. Try the SETUP-AND-START.bat script for automatic setup

**Remember:** Always create an account BEFORE trying to login!
