@echo off
echo ========================================
echo Drug GENIE - Server Status Check
echo ========================================
echo.

echo Checking if Backend (port 5000) is running...
netstat -ano | findstr :5000
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend server is running on port 5000
) else (
    echo [ERROR] Backend server is NOT running on port 5000
)
echo.

echo Checking if Frontend (port 5173) is running...
netstat -ano | findstr :5173
if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend server is running on port 5173
) else (
    echo [ERROR] Frontend server is NOT running on port 5173
)
echo.

echo ========================================
echo Testing Backend API Connection...
echo ========================================
curl -s http://localhost:5000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend API is responding
    echo.
    echo API Response:
    curl -s http://localhost:5000
) else (
    echo [ERROR] Backend API is not responding
    echo.
    echo SOLUTION: Run START-BOTH-SERVERS.bat to start the servers
)
echo.
echo.
pause
