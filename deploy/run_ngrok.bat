@echo off
TITLE Permanent Fixed URL Tunnel (Ngrok)
echo ========================================================
echo Starting Permanent Ngrok Tunnel for Divine Retail
echo Fixed URL: https://blurred-submerge-underuse.ngrok-free.dev
echo ========================================================
echo.

cd /d "%~dp0\.."

deploy\bin\ngrok.exe http 8000 --url=blurred-submerge-underuse.ngrok-free.dev

pause
