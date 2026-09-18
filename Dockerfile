# ==========================================
# Multi-Stage Production Dockerfile
# Stage 1: Frontend Static Bundle Builder
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /build

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Python Production Runtime
# ==========================================
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    ENVIRONMENT=production

WORKDIR /app

# Install system dependencies if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend application source
COPY backend/ /app/backend/

# Copy built frontend static assets from Stage 1
COPY --from=frontend-builder /build/dist /app/frontend/dist

# Copy seed spreadsheets if present
COPY Logistic.xlsx /app/Logistic.xlsx
COPY Sales_Inventory.xlsx /app/Sales_Inventory.xlsx

# Create persistent data directory and set up non-root user
RUN mkdir -p /app/data && \
    useradd -u 1000 -m appuser && \
    chown -R appuser:appuser /app

USER appuser

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

# Run production Uvicorn ASGI server
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]


