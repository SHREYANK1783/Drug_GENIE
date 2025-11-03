@echo off
echo Installing Google Generative AI package...
cd /d "%~dp0"
call npm install @google/generative-ai
echo.
echo Installation complete!
echo.
echo Press any key to verify installation...
pause > nul
call npm list @google/generative-ai
echo.
pause
