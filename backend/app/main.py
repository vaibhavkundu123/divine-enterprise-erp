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
    catalog,
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

# Middleware: Request Timing & Static Asset Cache Headers
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    # Enable strong client-side caching for media and static assets to eliminate reload delay
    if request.url.path.startswith(("/Pic", "/Pic_thumbs", "/assets")):
        response.headers["Cache-Control"] = "public, max-age=604800, immutable"
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
app.include_router(catalog.router)


# Health Check Probe
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "enterprise-operations-platform",
        "timestamp": datetime.now().isoformat(),
        "version": "2.4.0",
    }

# Mount Pic and Pic_thumbs directory for product images and fast thumbnails
pic_dir = BASE_DIR / "Pic"
if pic_dir.exists():
    app.mount("/Pic", StaticFiles(directory=str(pic_dir)), name="pic")

thumbs_dir = BASE_DIR / "Pic_thumbs"
thumbs_dir.mkdir(parents=True, exist_ok=True)
app.mount("/Pic_thumbs", StaticFiles(directory=str(thumbs_dir)), name="pic_thumbs")

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
