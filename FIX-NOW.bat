@echo off
title Drug GENIE - Emergency Fix
color 0C

echo.
echo ============================================================
echo              EMERGENCY FIX - STARTING SERVERS
echo ============================================================
echo.
echo This will:
echo   1. Kill any stuck processes
echo   2. Start fresh backend server
echo   3. Start fresh frontend server
echo   4. Open browser to the app
echo.
echo ============================================================
echo.

REM Kill any existing processes on ports 5000 and 5173
echo [Step 1/4] Killing any stuck processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo   Killing process on port 5000...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo   Killing process on port 5173...
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo   Done!
echo.

REM Start Backend
echo [Step 2/4] Starting Backend Server...
cd /d "%~dp0backend"
start "BACKEND - Port 5000" cmd /k "title BACKEND SERVER (Port 5000) && color 0B && echo. && echo ============================================ && echo    BACKEND SERVER - Port 5000 && echo ============================================ && echo. && npm run dev"
cd /d "%~dp0"
timeout /t 3 /nobreak >nul
echo   Backend starting...
echo.

REM Start Frontend
echo [Step 3/4] Starting Frontend Server...
cd /d "%~dp0my-app"
start "FRONTEND - Port 5173" cmd /k "title FRONTEND SERVER (Port 5173) && color 0E && echo. && echo ============================================ && echo    FRONTEND SERVER - Port 5173 && echo ============================================ && echo. && npm run dev"
cd /d "%~dp0"
echo   Frontend starting...
echo.

echo [Step 4/4] Waiting for servers to fully start...
echo.
echo   Please wait 15 seconds...
timeout /t 5 /nobreak >nul
echo   10 seconds remaining...
timeout /t 5 /nobreak >nul
echo   5 seconds remaining...
timeout /t 5 /nobreak >nul
echo.

echo ============================================================
echo                  SERVERS ARE READY!
echo ============================================================
echo.
echo Two windows are now open:
echo   - BACKEND SERVER  (Blue window)   - Port 5000
echo   - FRONTEND SERVER (Yellow window) - Port 5173
echo.
echo Opening browser now...
echo.

start http://localhost:5173

echo ============================================================
echo.
echo Browser opened to: http://localhost:5173
echo.
echo IMPORTANT:
echo   - Keep the 2 server windows open
echo   - Wait for login page to load
echo   - Create account or login
echo.
echo If you still see errors:
echo   1. Check the 2 server windows for error messages
echo   2. Make sure you see "Server running" in backend window
echo   3. Make sure you see "VITE ready" in frontend window
echo.
echo ============================================================
pause
