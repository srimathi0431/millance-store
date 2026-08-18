from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Millance Store Admin API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://postgres:12345678@localhost:5432/millance_store"

    # JWT
    SECRET_KEY: str = "millance_store_secret_key_2026_very_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 13 * 24 * 60   # 13 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 28 * 24 * 60  # 28 days

    # Admin seed
    ADMIN_EMAIL: str = "admin@millance.store"
    ADMIN_PASSWORD: str = "12345678"

    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings(_env_file=".env")


settings = get_settings()
