from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import get_settings
from app.database.connection import check_database_connection
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.routers import auth, downloads, extensions, documentation, admin

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SecurityHeadersMiddleware)

api = FastAPI()
api.include_router(auth.router)
api.include_router(extensions.router)
api.include_router(downloads.router)
api.include_router(documentation.router)
api.include_router(admin.router)


@api.get("/health")
def health_check() -> dict:
    db_ok = check_database_connection()
    return {
        "status": "ok" if db_ok else "degraded",
        "app": settings.app_name,
        "environment": settings.app_env,
        "database": "connected" if db_ok else "disconnected",
    }


app.mount(settings.api_v1_prefix, api)
