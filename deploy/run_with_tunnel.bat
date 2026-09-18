@echo off
TITLE Launch Enterprise Platform + Cloudflare Tunnel
echo ========================================================
echo Starting Backend Server and Cloudflare Remote Tunnel
echo ========================================================
echo.
echo [1/2] Launching Backend Server on port 8000...
start "Enterprise ERP Backend (Port 8000)" cmd /k "%~dp0run_dev.bat"

echo [2/2] Waiting 3 seconds for server to initialize...
timeout /t 3 /nobreak > nul

echo [3/3] Launching Cloudflare Public HTTPS Tunnel...
start "Cloudflare Mobile Tunnel" cmd /k "%~dp0run_tunnel.bat"

echo.
echo ========================================================
echo SUCCESS: Both processes are now running in separate windows!
echo Look at the 'Cloudflare Mobile Tunnel' window to see your public URL.
echo ========================================================
