# 🏠 Local Development Setup

## Quick Start

### Option 1: Use the Startup Script (Easiest)
Just double-click: **`start-local.bat`**

This will:
- Kill any existing processes on ports 5000 and 5173
- Start backend server on port 5000
- Start frontend server on port 5173
- Open both in separate terminal windows

---

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd my-app
npm run dev
```

---

## ✅ Verify It's Working

1. **Backend**: Open http://localhost:5000
   - Should see: `{"message":"Drug GENIE API Server","status":"Running"}`

2. **Frontend**: Open http://localhost:5173
   - Should see the login page

3. **Test Login**:
   - Create an account first (signup page)
   - Then login with your credentials

---

## 🐛 Troubleshooting

### Error: "Port 5000 is already in use"
```bash
# Kill the process using port 5000
netstat -ano | findstr :5000
taskkill /F /PID <PID_NUMBER>
```

### Error: "Port 5173 is already in use"
```bash
# Kill the process using port 5173
netstat -ano | findstr :5173
taskkill /F /PID <PID_NUMBER>
```

### Error: "Cannot connect to database"
- Check your `backend/.env` file has correct `MONGODB_URI`
- Ensure MongoDB Atlas allows connections from your IP
- Test connection: https://cloud.mongodb.com

### Error: "Invalid credentials" when logging in
- Make sure you created an account first (signup page)
- Check backend terminal for error messages
- Verify backend is running on port 5000

### Frontend shows blank page
- Check browser console (F12) for errors
- Verify `my-app/.env` has: `VITE_API_URL=http://localhost:5000`
- Make sure backend is running

---

## 📁 Environment Files

### `backend/.env` (Already configured ✅)
```env
MONGODB_URI=mongodb+srv://drug_genie:drug_genie123@cluster0.pxqz2r0.mongodb.net/drugGenieDB
JWT_SECRET=your-secret-here
PORT=5000
GEMINI_API_KEY=your-key-here
```

### `my-app/.env` (Already configured ✅)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔄 Restart Servers

If you need to restart:
1. Close both terminal windows
2. Run `start-local.bat` again

Or manually:
- Press `Ctrl+C` in each terminal
- Run `npm run dev` again

---

## 🎯 Everything Working?

You should be able to:
- ✅ Access frontend at http://localhost:5173
- ✅ See backend API at http://localhost:5000
- ✅ Create an account
- ✅ Login successfully
- ✅ Use all features (reminders, blood bank, AI assistant, etc.)

If something doesn't work, check the terminal outputs for error messages!
