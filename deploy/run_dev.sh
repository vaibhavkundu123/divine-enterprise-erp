#!/usr/bin/env bash
set -e

# Change to script parent directory (project root)
cd "$(dirname "$0")/.."

echo "========================================================"
echo "Starting Enterprise Operations Platform"
echo "========================================================"

if [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "[WARNING] .venv directory not found. Using current python environment..."
fi

# Ensure database is seeded
python3 -m backend.app.db.init_db

echo "[INFO] Starting ASGI server on http://localhost:8000 ..."
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
