# Drug GENIE - Deployment Guide

## 🚨 Critical Issues Found

### 1. **Missing Environment Files**
- ❌ `backend/.env` - NOT FOUND (Required for deployment)
- ❌ `my-app/.env` - NOT FOUND (Optional but recommended)

### 2. **Environment Variables Required**

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
PORT=5000
GEMINI_API_KEY=your-google-gemini-api-key
```

#### Frontend (.env) - Optional
```env
VITE_API_URL=https://your-backend-url.com
VITE_GA_MEASUREMENT_ID=your-google-analytics-id
```

---

## 📋 Pre-Deployment Checklist

### Backend Deployment

#### ✅ Completed
- [x] TypeScript configuration set up
- [x] Build script configured (`npm run build`)
- [x] All routes properly configured
- [x] CORS enabled
- [x] Error handling middleware in place

#### ⚠️ Required Actions
- [ ] Create `.env` file with all required variables
- [ ] Set up MongoDB Atlas database
- [ ] Generate secure JWT_SECRET (min 32 characters)
- [ ] Get Google Gemini API key
- [ ] Test backend build: `npm run build`
- [ ] Verify `dist/` folder is created after build

#### 📦 Deployment Platforms (Choose One)
1. **Render** (Recommended)
   - Free tier available
   - Auto-deploy from GitHub
   - Easy environment variable setup

2. **Railway**
   - Simple deployment
   - Good free tier

3. **Heroku**
   - Popular choice
   - Easy to use

4. **AWS/DigitalOcean**
   - More control
   - Requires more setup

### Frontend Deployment

#### ✅ Completed
- [x] Vite build configuration
- [x] React Router setup
- [x] API integration with environment variables
- [x] Responsive design
- [x] Error boundaries

#### ⚠️ Required Actions
- [ ] Create `.env` file with backend URL
- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Test frontend build: `npm run build`
- [ ] Verify `dist/` folder is created
- [ ] Test production build locally: `npm run preview`

#### 📦 Deployment Platforms (Choose One)
1. **Vercel** (Recommended for React)
   - Free tier
   - Auto-deploy from GitHub
   - Excellent performance
   - Easy environment variable setup

2. **Netlify**
   - Free tier
   - Simple deployment
   - Good for static sites

3. **GitHub Pages**
   - Free
   - Requires additional routing setup

---

## 🔧 Step-by-Step Deployment Instructions

### Step 1: Set Up MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Replace `<username>`, `<password>`, and `<database>` in connection string

### Step 2: Get API Keys

1. **Google Gemini API**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API key
   - Copy for backend `.env`

2. **Google Analytics** (Optional)
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create property
   - Get Measurement ID

### Step 3: Configure Backend

1. Create `backend/.env`:
```bash
cd backend
copy .env.example .env
# Edit .env with your actual values
```

2. Test backend locally:
```bash
npm install
npm run dev
# Should start on http://localhost:5000
```

3. Test backend build:
```bash
npm run build
npm start
```

### Step 4: Deploy Backend

#### Using Render:
1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   - **Name**: drug-genie-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables from your `.env`
7. Click "Create Web Service"
8. Copy the deployed URL (e.g., `https://drug-genie-backend.onrender.com`)

### Step 5: Configure Frontend

1. Create `my-app/.env`:
```bash
cd my-app
copy .env.example .env
```

2. Edit `.env`:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

3. Test frontend locally:
```bash
npm install
npm run dev
```

4. Test production build:
```bash
npm run build
npm run preview
```

### Step 6: Deploy Frontend

#### Using Vercel:
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: my-app
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
6. Add environment variable:
   - `VITE_API_URL`: Your backend URL
7. Click "Deploy"

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong (min 32 characters, random)
- [ ] MongoDB connection string uses strong password
- [ ] API keys are stored in environment variables (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] CORS is configured properly for production domain
- [ ] Rate limiting implemented (if needed)

---

## 🧪 Testing After Deployment

### Backend Tests
1. Visit backend URL - should show API info
2. Test `/api/auth/register` - create test user
3. Test `/api/auth/login` - login with test user
4. Test `/api/medicines/search` - search for medicine

### Frontend Tests
1. Visit frontend URL
2. Test user registration
3. Test user login
4. Test medicine search
5. Test drug interaction checker
6. Test reminder creation
7. Test blood bank features
8. Test AI assistant

---

## 📊 Current Project Status

### ✅ Working Features
- User authentication (register/login)
- Medicine library and search
- Drug interaction checker
- Reminder system
- Blood bank/donation system
- AI assistant (Gemini integration)
- Dashboard with statistics
- Profile management
- Dark mode support
- Responsive design

### 🔧 Configuration Needed
1. Environment variables setup
2. Database connection
3. API keys configuration
4. Production URLs configuration

---

## 🆘 Troubleshooting

### Backend Issues
- **"Cannot connect to MongoDB"**: Check MONGODB_URI in .env
- **"JWT error"**: Verify JWT_SECRET is set
- **"Port already in use"**: Change PORT in .env
- **"Gemini API error"**: Check GEMINI_API_KEY

### Frontend Issues
- **"Network Error"**: Check VITE_API_URL points to correct backend
- **"CORS Error"**: Backend CORS needs to allow frontend domain
- **"Build fails"**: Run `npm install` to ensure all dependencies installed

### Deployment Issues
- **Build fails on platform**: Check Node.js version compatibility
- **Environment variables not working**: Ensure they're set in platform dashboard
- **Routes not working**: Configure platform for SPA routing

---

## 📝 Post-Deployment

1. **Monitor Performance**
   - Check backend logs
   - Monitor API response times
   - Track error rates

2. **Set Up Monitoring** (Optional)
   - Google Analytics for frontend
   - Sentry for error tracking
   - Uptime monitoring

3. **Regular Maintenance**
   - Update dependencies regularly
   - Monitor security advisories
   - Backup database regularly

---

## 🎉 Deployment Complete!

Once deployed, your Drug GENIE app will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Share the frontend URL with users to access the application!
