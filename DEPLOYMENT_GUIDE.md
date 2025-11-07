# Drug GENIE Deployment Guide

## 🚨 Current Issue
Your frontend is deployed to Vercel at `drug-genie.vercel.app`, but it's trying to reach a backend API that doesn't exist. You need to deploy your backend separately.

## ✅ Solution: Deploy Backend & Frontend Separately

### Step 1: Deploy Backend (Choose One Option)

#### Option A: Deploy to Render (Recommended - Free Tier)

1. **Go to [Render.com](https://render.com)** and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `drug-genie-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   MONGODB_URI=mongodb+srv://drug_genie:drug_genie123@cluster0.pxqz2r0.mongodb.net/drugGenieDB
   JWT_SECRET=your-jwt-secret-here
   GEMINI_API_KEY=your-gemini-api-key-here
   PORT=5000
   NODE_ENV=production
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://drug-genie-backend.onrender.com`)

#### Option B: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)** and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - Add environment variables (same as above)
5. Copy your backend URL

#### Option C: Deploy to Vercel (Separate Project)

1. **Go to [Vercel.com](https://vercel.com)** dashboard
2. Click **"Add New"** → **"Project"**
3. Import your repository **again** (as a new project)
4. Configure:
   - **Project Name**: `drug-genie-api`
   - **Root Directory**: `backend`
   - **Framework Preset**: `Other`
   - Add environment variables (same as above)
5. Deploy and copy your backend URL

---

### Step 2: Update Frontend Environment Variables

1. **In Vercel Dashboard** for your frontend project (`drug-genie`):
   - Go to **Settings** → **Environment Variables**
   - Add a new variable:
     ```
     VITE_API_URL=https://your-backend-url-here.onrender.com
     ```
     (Replace with your actual backend URL from Step 1)

2. **Redeploy your frontend**:
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

---

### Step 3: Update Local .env File

Update your local `my-app/.env` file to switch between local and production:

```env
# For local development (backend running on localhost):
VITE_API_URL=http://localhost:5000

# For production testing (uncomment when testing with deployed backend):
# VITE_API_URL=https://drug-genie-backend.onrender.com
```

---

## 🔧 Backend Preparation (Before Deploying)

Make sure your backend has a proper start script. Check `backend/package.json`:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc"
  }
}
```

If your backend uses TypeScript, you may need to build it first. Add this to your Render/Railway build command:
```
npm install && npm run build
```

---

## 🧪 Testing After Deployment

1. **Test Backend API Directly**:
   ```bash
   curl https://your-backend-url.onrender.com/api/auth/login
   ```
   Should return a JSON response (even if it's an error, it proves the API is reachable)

2. **Test Frontend**:
   - Visit `https://drug-genie.vercel.app`
   - Try to login
   - Check browser console for errors

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files to GitHub
- [ ] Use environment variables in Vercel/Render for secrets
- [ ] Update CORS settings in backend to allow your frontend domain:
  ```javascript
  app.use(cors({
    origin: ['https://drug-genie.vercel.app', 'http://localhost:5173'],
    credentials: true
  }));
  ```

---

## 🐛 Troubleshooting

### Error: `ERR_NAME_NOT_RESOLVED`
- Backend URL is wrong or backend isn't deployed
- Check Vercel environment variables

### Error: `CORS Error`
- Update backend CORS settings to allow your frontend domain

### Error: `500 Internal Server Error`
- Check backend logs in Render/Railway dashboard
- Verify environment variables are set correctly

### Error: `MongoDB Connection Failed`
- Check `MONGODB_URI` in backend environment variables
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

## 📝 Quick Reference

**Frontend URL**: `https://drug-genie.vercel.app`  
**Backend URL**: `https://drug-genie-backend.onrender.com` (replace with yours)

**Environment Variables Needed**:
- Frontend: `VITE_API_URL`
- Backend: `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `PORT`, `NODE_ENV`

---

## 🎯 Next Steps

1. ✅ Deploy backend to Render/Railway/Vercel
2. ✅ Copy backend URL
3. ✅ Add `VITE_API_URL` to Vercel frontend environment variables
4. ✅ Redeploy frontend
5. ✅ Test login functionality

Your app should now work in production! 🚀
