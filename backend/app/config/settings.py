from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ExtensionHub API"
    app_env: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    host: str = "0.0.0.0"
    port: int = 8000

    database_url: str = "mysql+pymysql://extensionhub:extensionhub@localhost:3306/extensionhub"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    upload_dir: str = "uploads/extensions"
    max_upload_size_mb: int = 50
    allowed_extensions: str = ".zip,.vsix,.crx"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def upload_path(self) -> Path:
        path = BACKEND_ROOT / self.upload_dir
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def allowed_extension_set(self) -> set[str]:
        return {ext.strip().lower() for ext in self.allowed_extensions.split(",") if ext.strip()}


@lru_cache
def get_settings() -> Settings:
    return Settings()
