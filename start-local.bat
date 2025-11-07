@echo off
echo ========================================
echo   Starting Drug GENIE Local Development
echo ========================================
echo.

REM Kill any existing processes on ports 5000 and 5173
echo Checking for existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend Server (Port 5000)...
start "Drug GENIE Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server (Port 5173)...
echo IMPORTANT: Frontend will use http://localhost:5000 for API
start "Drug GENIE Frontend" cmd /k "cd my-app && set VITE_API_URL=http://localhost:5000 && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
