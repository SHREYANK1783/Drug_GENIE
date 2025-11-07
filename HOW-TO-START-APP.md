# 🚀 How to Start Drug GENIE App

## ⚠️ IMPORTANT: Why "Failed to Fetch" Error Happens

The "failed to fetch" error occurs because:
1. **Backend server is NOT running** on port 5000
2. **Frontend server is NOT running** on port 5173
3. Frontend cannot connect to backend API

**Solution:** You MUST start both servers before using the app!

---

## ✅ EASIEST METHOD - Use QUICK-START.bat

### Step 1: Double-click `QUICK-START.bat`
- Located in your project root folder
- This will automatically:
  - Kill any existing servers
  - Start backend on port 5000
  - Start frontend on port 5173
  - Open browser to the app

### Step 2: Wait 10-15 seconds
- Watch the two new windows that opened
- Backend window (Blue) will show: `🚀 Server running on port 5000`
- Frontend window (Yellow) will show: `VITE ready in XXX ms`

### Step 3: Use the app
- Browser will open to `http://localhost:5173`
- You'll see the login page
- Create account or login

### ⚠️ CRITICAL: Keep Server Windows Open
- **DO NOT CLOSE** the backend and frontend windows
- If you close them, the app will stop working
- You'll get "failed to fetch" error again

---

## 🔧 MANUAL METHOD (Alternative)

If the batch file doesn't work, start servers manually:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
**Expected output:**
```
🚀 Server running on port 5000
MongoDB Connected: cluster0.pxqz2r0.mongodb.net
```

### Terminal 2 - Frontend
```bash
cd my-app
npm run dev
```
**Expected output:**
```
VITE v7.1.5  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🔍 How Frontend & Backend Connect

### Backend Configuration ✅
- **Port:** 5000 (configured in `backend/.env`)
- **CORS:** Enabled for all origins
- **API Endpoints:** All start with `/api/`
  - `/api/auth/login` - Login
  - `/api/auth/register` - Register
  - `/api/reminders` - Reminders
  - `/api/blood-requests` - Blood bank
  - `/api/ai/chat` - AI Assistant
  - etc.

### Frontend Configuration ✅
- **Port:** 5173 (Vite default)
- **API Proxy:** Configured in `my-app/vite.config.ts`
  ```typescript
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
  ```
- **Environment:** `VITE_API_URL=http://localhost:5000` in `my-app/.env`

### How It Works
1. Frontend runs on `http://localhost:5173`
2. When you login, frontend calls `/api/auth/login`
3. Vite proxy forwards this to `http://localhost:5000/api/auth/login`
4. Backend processes the request and returns response
5. Frontend receives response and logs you in

**If backend is NOT running → "failed to fetch" error!**

---

## 🐛 Troubleshooting

### Problem: "Failed to fetch" error when logging in

**Cause:** Backend server is not running

**Solution:**
1. Check if backend is running: `netstat -ano | findstr :5000`
2. If nothing shows, backend is NOT running
3. Start backend: Double-click `QUICK-START.bat`

---

### Problem: Port 5000 already in use

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>
```

---

### Problem: Port 5173 already in use

**Solution:**
```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>
```

---

### Problem: MongoDB connection fails

**Check:**
1. Internet connection is working
2. `MONGODB_URI` in `backend/.env` is correct
3. MongoDB Atlas cluster is active

---

### Problem: "Invalid credentials" error

**This is DIFFERENT from "failed to fetch"!**

**Causes:**
1. Wrong email or password
2. Account doesn't exist yet
3. Password doesn't meet requirements

**Solution:**
1. Create a new account first (no default users exist)
2. Use the email and password you just created
3. Password must have:
   - At least 6 characters
   - At least 1 uppercase letter
   - At least 1 special character

---

## 📊 Check Server Status

Run `CHECK-SERVERS.bat` to verify:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Backend API responding

---

## 🎯 Quick Reference

| Task | Command/File |
|------|--------------|
| Start both servers | `QUICK-START.bat` |
| Check server status | `CHECK-SERVERS.bat` |
| Start backend only | `START-BACKEND.bat` |
| Start frontend only | `START-FRONTEND.bat` |
| Access app | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |

---

## ✅ Verification Checklist

Before trying to login, verify:

- [ ] Backend window is open and shows "Server running on port 5000"
- [ ] Frontend window is open and shows "VITE ready"
- [ ] Browser is at `http://localhost:5173`
- [ ] Login page loads correctly
- [ ] No errors in browser console (F12)

If all checked, you can now login or create an account!

---

## 💡 Remember

**The app needs TWO servers running:**
1. **Backend** (port 5000) - Handles data, authentication, database
2. **Frontend** (port 5173) - Shows the UI, handles user interactions

**Both must be running for the app to work!**

If you close the server windows or restart your computer, you need to start them again using `QUICK-START.bat`.
