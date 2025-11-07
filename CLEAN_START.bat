@echo off
echo ========================================
echo   COMPLETE CLEAN RESTART
echo ========================================
echo.

echo Step 1: Killing all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing Vite cache...
if exist "my-app\node_modules\.vite" (
    rd /s /q "my-app\node_modules\.vite"
    echo Vite cache cleared!
)

echo Step 3: Clearing browser storage cache...
echo Please clear your browser cache manually:
echo - Press Ctrl+Shift+Delete
echo - OR Hard refresh with Ctrl+Shift+R
echo.
pause

echo Step 4: Starting Backend...
start "Drug GENIE Backend" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak >nul

echo Step 5: Starting Frontend...
start "Drug GENIE Frontend" cmd /k "cd my-app && npm run dev"

echo.
echo ========================================
echo   SERVERS STARTING!
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo IMPORTANT: Clear browser cache and hard refresh!
echo Press Ctrl+Shift+R in your browser
echo.
pause
