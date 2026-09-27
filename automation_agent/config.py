import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent
INBOX_DIR = BASE_DIR / "inputs" / "inbox"
TEMPLATES_DIR = BASE_DIR / "inputs" / "templates"
LOGS_DIR = BASE_DIR / "logs"

# Ensure runtime directories exist
INBOX_DIR.mkdir(parents=True, exist_ok=True)
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Primary backend endpoint configurations
# Fallbacks: Local development server (port 8000) or permanent Ngrok URL
API_BASE_URL = os.getenv("ERP_API_BASE_URL", "http://127.0.0.1:8000/api")
HEALTH_URL = os.getenv("ERP_HEALTH_URL", "http://127.0.0.1:8000/health")
PERMANENT_REMOTE_URL = "https://blurred-submerge-underuse.ngrok-free.dev/api"

# Request settings
REQUEST_TIMEOUT_SECONDS = 15.0
MAX_RETRIES = 3
RETRY_BACKOFF_FACTOR = 0.5
