# Fix Login Issue - Step by Step

## Problem Found
Your `node_modules` folders are empty in both backend and frontend. This means dependencies aren't installed.

## Solution

### Option 1: Use the Setup Script (EASIEST)
1. **Double-click** `SETUP-AND-START.bat` in the Drug_GENIE folder
2. Wait for installation to complete
3. Servers will start automatically
4. Browser will open to http://localhost:5173

### Option 2: Manual Installation
If the script doesn't work, do this manually:

#### Step 1: Install Backend Dependencies
```cmd
cd d:\Desktop\DrugGenie\Drug_GENIE\backend
npm install
```
Wait for completion (may take 2-3 minutes)

#### Step 2: Install Frontend Dependencies
```cmd
cd d:\Desktop\DrugGenie\Drug_GENIE\my-app
npm install
```
Wait for completion (may take 2-3 minutes)

#### Step 3: Start Backend
```cmd
cd d:\Desktop\DrugGenie\Drug_GENIE\backend
npm run dev
```
You should see: "🚀 Server running on port 5000" and "MongoDB Connected"

#### Step 4: Start Frontend (in a NEW terminal)
```cmd
cd d:\Desktop\DrugGenie\Drug_GENIE\my-app
npm run dev
```
You should see: "Local: http://localhost:5173"

## After Servers Start

### If You Don't Have an Account Yet:
1. Go to http://localhost:5173
2. Click "Create Account" or "Sign Up"
3. Fill in your details
4. Then login with those credentials

### If You Already Have an Account:
1. Make sure you're using the correct email and password
2. Check that backend shows "MongoDB Connected" in the terminal
3. Try logging in

## Common Errors

### "Invalid credentials"
- You might not have created an account yet
- Or you're using wrong email/password
- Solution: Create a new account first

### "Network Error" or "Failed to fetch"
- Backend server isn't running
- Solution: Make sure backend terminal shows "Server running on port 5000"

### Blank page
- Frontend server isn't running
- Solution: Make sure frontend terminal shows "Local: http://localhost:5173"

## Still Not Working?

Check these:
1. ✅ Both terminal windows are open and showing no errors
2. ✅ Backend shows "MongoDB Connected"
3. ✅ Frontend shows "Local: http://localhost:5173"
4. ✅ You created an account before trying to login
5. ✅ Your .env files exist in both backend and my-app folders
