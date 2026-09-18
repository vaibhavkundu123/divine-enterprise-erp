@echo off
TITLE Launch ERP Platform + Permanent Fixed URL
echo ========================================================
echo Starting Backend Server and Permanent Fixed URL Tunnel
echo Fixed URL: https://blurred-submerge-underuse.ngrok-free.dev
echo ========================================================
echo.
echo [1/2] Launching Backend Server on port 8000...
start "Enterprise ERP Backend (Port 8000)" cmd /k "%~dp0run_dev.bat"

echo [2/2] Waiting 3 seconds for server to initialize...
timeout /t 3 /nobreak > nul

echo [3/3] Launching Permanent Fixed Ngrok Tunnel...
start "Fixed Ngrok Tunnel" cmd /k "%~dp0run_ngrok.bat"

echo.
echo ========================================================
echo SUCCESS: Both processes are running!
echo Your permanent link is:
echo https://blurred-submerge-underuse.ngrok-free.dev
echo ========================================================
