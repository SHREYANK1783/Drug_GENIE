# 🚨 QUICK FIX: ERR_NAME_NOT_RESOLVED

## The Problem
Your frontend at `https://drug-genie.vercel.app` is trying to call `https://drug-genie.vercel.app/api/auth/login`, but **your backend is NOT deployed**.

## The Solution (3 Steps)

### Step 1: Deploy Your Backend (Choose One)

#### ✅ EASIEST: Deploy to Render (Free)

1. Go to **[render.com](https://render.com)** → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `Drug_GENIE`
4. Settings:
   ```
   Name: drug-genie-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
5. **Environment Variables** (click "Advanced"):
   ```
   MONGODB_URI=mongodb+srv://drug_genie:drug_genie123@cluster0.pxqz2r0.mongodb.net/drugGenieDB
   JWT_SECRET=your-secret-here
   GEMINI_API_KEY=your-key-here
   PORT=5000
   NODE_ENV=production
   ```
6. Click **"Create Web Service"**
7. **COPY YOUR BACKEND URL** (e.g., `https://drug-genie-backend.onrender.com`)

---

### Step 2: Update Vercel Frontend

1. Go to **[vercel.com](https://vercel.com)** → Your `drug-genie` project
2. Go to **Settings** → **Environment Variables**
3. Add this variable:
   ```
   Name: VITE_API_URL
   Value: https://drug-genie-backend.onrender.com
   ```
   (Use YOUR backend URL from Step 1)
4. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

### Step 3: Test

1. Wait 2-3 minutes for deployment
2. Visit `https://drug-genie.vercel.app`
3. Try to login
4. ✅ Should work now!

---

## Alternative: Deploy Backend to Vercel

If you prefer to keep everything on Vercel:

1. Go to Vercel dashboard → **"Add New"** → **"Project"**
2. Import your repo **AGAIN** (as a separate project)
3. Settings:
   ```
   Project Name: drug-genie-api
   Root Directory: backend
   Framework: Other
   ```
4. Add the same environment variables
5. Deploy
6. Copy the URL and use it in Step 2 above

---

## Why This Happened

- Your **frontend** is deployed to Vercel ✅
- Your **backend** is NOT deployed ❌
- Frontend needs a separate backend URL to work

## Files Already Updated

✅ `backend/src/index.ts` - CORS updated to allow your frontend domain  
✅ `my-app/.env.example` - Added production URL examples  
✅ `backend/package.json` - Has proper start script

You're ready to deploy! 🚀
