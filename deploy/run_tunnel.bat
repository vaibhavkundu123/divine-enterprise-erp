@echo off
TITLE Cloudflare Remote Access Tunnel
echo ========================================================
echo Starting Cloudflare 24/7 Mobile Remote Access Tunnel
echo ========================================================
echo [INFO] Forwarding traffic from the internet to http://127.0.0.1:8000 ...
echo [INFO] Please ensure the backend server is running in another window!
echo.

cd /d "%~dp0\.."

deploy\bin\cloudflared.exe tunnel --url http://127.0.0.1:8000

pause
