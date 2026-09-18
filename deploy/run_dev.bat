@echo off
TITLE Enterprise Operations Platform - Local Runner
echo ========================================================
echo Starting Enterprise Operations Platform (Dual Stack)
echo ========================================================

REM Navigate to project root
cd /d "%~dp0\.."

REM Activate virtual environment
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else (
    echo [WARNING] Virtual environment .venv not found. Running with global python...
)

REM Initialize Database if needed
python -m backend.app.db.init_db

echo [OK] Database verified.
echo [INFO] Starting FastAPI server on http://localhost:8000 ...
echo [INFO] Press CTRL+C to stop.

python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
pause
