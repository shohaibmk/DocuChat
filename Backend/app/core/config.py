import os
from typing import Annotated
from urllib.parse import quote_plus

from dotenv import load_dotenv
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from app.core.logging import configure_logging, get_logger

# Load environment variables from .env
load_dotenv()

# Configure logging before Settings() runs so validator messages are formatted
configure_logging()
logger = get_logger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    PROJECT_NAME: str = "DocuChat"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() in {"1", "true", "yes"}
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", 8000))

    CORS_ORIGINS: Annotated[list[str], NoDecode] = []
    CORS_ORIGIN_REGEX: str = r"http://(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):\d+"

    DATABASE_URL: str = ""
    DB_USER: str | None = None
    DB_PASSWORD: str | None = None
    DB_HOST: str | None = None
    DB_PORT: int | None = None
    DB_NAME: str | None = None

    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-env")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24))

    DOCUMENT_EXPIRY: int = int(os.getenv("DOCUMENT_EXPIRY", 60 * 30))  # 40 minutes
    CHAT_EXPIRY: int = int(os.getenv("CHAT_EXPIRY", 60 * 60 * 24))  # 24 hours

    AWS_ACCESS_KEY_ID: str | None = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str | None = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-south-1")
    S3_BUCKET_NAME: str | None = os.getenv("S3_BUCKET_NAME")
    S3_ENDPOINT_URL: str | None = os.getenv("S3_ENDPOINT_URL") or None
    S3_UPLOAD_DOCUMENTS_PREFIX: str = os.getenv("S3_UPLOAD_DOCUMENTS_PREFIX", "uploads/")
    S3_PRESIGN_EXPIRES: int = int(os.getenv("S3_PRESIGN_EXPIRES", 600))
    S3_MAX_UPLOAD_BYTES: int = int(os.getenv("S3_MAX_UPLOAD_BYTES", 150 * 1024 * 1024))

    @field_validator("LOG_LEVEL", mode="before")
    @classmethod
    def _validate_log_level(cls, v):
        if v and v.upper() == "DEBUG":
            logger.warning(f"LOG_LEVEL is set to {v}")
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _split_cors_origins(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        return v

    @model_validator(mode="after")
    def _assemble_database_url(self):
        if all([self.DB_USER, self.DB_PASSWORD, self.DB_HOST, self.DB_PORT, self.DB_NAME]):
            self.DATABASE_URL = (
                f"postgresql+asyncpg://{quote_plus(self.DB_USER)}:{quote_plus(self.DB_PASSWORD)}"
                f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?ssl=require"
            )
            logger.debug(f"DATABASE_URL: {self.DATABASE_URL}")
        else:
            logger.error("Database credentials are not set")
        return self

    @model_validator(mode="after")
    def _validate_s3_config(self):
        if not self.S3_BUCKET_NAME:
            logger.error("S3_BUCKET_NAME is not set")
        if not self.AWS_ACCESS_KEY_ID:
            logger.error("AWS_ACCESS_KEY_ID is not set")
        if not self.AWS_SECRET_ACCESS_KEY:
            logger.error("AWS_SECRET_ACCESS_KEY is not set")
        if not self.AWS_REGION:
            logger.error("AWS_REGION is not set")
        return self

settings = Settings()
