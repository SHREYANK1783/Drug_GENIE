# 🚀 Drug GENIE - Development Guide

## ⚡ Quick Start (Every Day)

### One-Click Start
```bash
Double-click: CLEAN_START.bat
```

That's it! Both servers will start automatically.

---

## 📁 Project Structure

```
Drug_GENIE/
├── backend/              # Node.js + Express API
│   ├── src/
│   ├── .env             # Backend config (MongoDB, JWT, etc.)
│   └── package.json
│
├── my-app/              # React + Vite Frontend
│   ├── src/
│   ├── .env.development # Auto-used in dev (localhost)
│   ├── .env.production  # Auto-used in prod (Vercel)
│   └── package.json
│
└── CLEAN_START.bat      # One-click startup
```

---

## 🔧 Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
PORT=5000
GEMINI_API_KEY=your-key
```

### Frontend (.env.development) - AUTO-LOADED IN DEV
```env
VITE_API_URL=http://localhost:5000
```

### Frontend (.env.production) - AUTO-LOADED IN PROD
```env
VITE_API_URL=  # Set in Vercel dashboard
```

**You NEVER need to change these!** They auto-switch based on mode.

---

## 🎯 How It Works

### Development Mode (`npm run dev`)
1. ✅ Loads `.env.development` automatically
2. ✅ Service worker is DISABLED (no caching issues)
3. ✅ API calls use Vite proxy → localhost:5000
4. ✅ Hot reload works perfectly

### Production Mode (`npm run build`)
1. ✅ Loads `.env.production` automatically
2. ✅ Service worker is ENABLED (for offline support)
3. ✅ API calls use full backend URL
4. ✅ Optimized build

---

## 🛠️ Manual Start (Alternative)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd my-app
npm run dev
```

---

## ✅ Verification Checklist

After starting servers, check:

### Backend (http://localhost:5000)
```json
{
  "message": "Drug GENIE API Server",
  "status": "Running"
}
```

### Frontend (http://localhost:5173)
- Login page loads
- No console errors
- Network tab shows `/api/auth/login` (NOT vercel.app)

---

## 🐛 Troubleshooting

### Issue: Service Worker Caching Old Code

**Solution:**
```bash
1. Open: http://localhost:5173/unregister-sw.html
2. Wait for "ALL CLEARED!"
3. Close tab
4. Hard refresh (Ctrl+Shift+R)
```

### Issue: Port Already in Use

**Solution:**
```bash
# Kill processes
taskkill /F /IM node.exe

# Or use CLEAN_START.bat (does this automatically)
```

### Issue: API Calls Going to Wrong URL

**Solution:**
```bash
1. Check: my-app/.env.development exists
2. Contains: VITE_API_URL=http://localhost:5000
3. Restart frontend server
4. Hard refresh browser
```

### Issue: MongoDB Connection Failed

**Solution:**
```bash
1. Check backend/.env has correct MONGODB_URI
2. Check MongoDB Atlas allows your IP
3. Test connection at cloud.mongodb.com
```

---

## 📦 Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd my-app
npm install
```

---

## 🚀 Deployment (When Ready)

### 1. Deploy Backend
```bash
# Use Render, Railway, or Vercel
# Set environment variables in dashboard
```

### 2. Deploy Frontend
```bash
# In Vercel dashboard:
# Add environment variable:
VITE_API_URL=https://your-backend-url.com

# Redeploy
```

---

## 🔒 Security Notes

### Files to NEVER Commit:
- ❌ `backend/.env` (has real secrets)
- ❌ `my-app/.env` (local overrides)
- ❌ `my-app/.env.local` (local overrides)

### Files to COMMIT:
- ✅ `my-app/.env.development` (safe, localhost only)
- ✅ `my-app/.env.production` (safe, no secrets)
- ✅ `backend/.env.example` (template only)

---

## 📚 Useful Commands

### Backend
```bash
npm run dev      # Start development server
npm run build    # Compile TypeScript
npm start        # Run compiled code
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🎉 Features

- ✅ User authentication (JWT)
- ✅ Medicine reminders
- ✅ Blood donation requests
- ✅ AI health assistant (Google Gemini)
- ✅ Drug interaction checker
- ✅ Medicine library (14,690+ medicines)
- ✅ Notifications system
- ✅ PWA support (offline mode)

---

## 🆘 Need Help?

### Check These Files:
1. `PERMANENT_SOLUTION.md` - Comprehensive fix guide
2. `ULTIMATE_FIX.md` - Service worker issues
3. `LOCAL_SETUP.md` - Local development setup
4. `DEPLOYMENT_GUIDE.md` - Production deployment

### Common Issues Solved:
- ✅ Service worker caching
- ✅ Environment variables
- ✅ CORS errors
- ✅ API URL issues
- ✅ Port conflicts

---

## 💡 Pro Tips

1. **Always use CLEAN_START.bat** - Prevents 99% of issues
2. **Clear cache regularly** - Ctrl+Shift+R
3. **Check Network tab** - Verify API calls
4. **Use Incognito mode** - Test without cache
5. **Keep servers running** - Don't close terminals

---

## ✨ You're All Set!

Your development environment is now:
- ✅ Bulletproof
- ✅ Automatic
- ✅ No configuration needed
- ✅ No more headaches

**Just run `CLEAN_START.bat` and start coding!** 🎯
