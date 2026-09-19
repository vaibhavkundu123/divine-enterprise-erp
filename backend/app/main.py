import time
from datetime import datetime
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from backend.app.db.init_db import init_db
from backend.app.db.session import BASE_DIR
from backend.app.api import (
    procurement,
    sales,
    stock,
    rto,
    customer_returns,
    exchanges,
    ads,
    bank,
    analytics,
    audit,
    status,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables and seed ingestion are initialized on startup
    init_db()
    yield

app = FastAPI(
    title="Divine Enterprise ERP",
    description="24/7 Enterprise Sales, Inventory, Logistics & Financial Intelligence Suite for Divine Enterprise",
    version="2.4.0",
    lifespan=lifespan,
)

# Middleware: Request Timing Header
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Middleware: CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount 11 API Routers
app.include_router(procurement.router)
app.include_router(sales.router)
app.include_router(stock.router)
app.include_router(rto.router)
app.include_router(customer_returns.router)
app.include_router(exchanges.router)
app.include_router(ads.router)
app.include_router(bank.router)
app.include_router(analytics.router)
app.include_router(audit.router)
app.include_router(status.router)


# Health Check Probe
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "enterprise-operations-platform",
        "timestamp": datetime.now().isoformat(),
        "version": "2.4.0",
    }

# Mount static frontend build if available
frontend_dist = BASE_DIR / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Serve static file if exists, otherwise fallback to index.html for client-side routing
        potential_file = frontend_dist / full_path
        if full_path and potential_file.exists() and potential_file.is_file():
            return FileResponse(potential_file)
        return FileResponse(
            frontend_dist / "index.html",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        )
