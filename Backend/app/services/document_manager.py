from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from functools import lru_cache
from typing import Any

import boto3
from botocore.client import Config
from sqlalchemy.ext.asyncio import AsyncSession
from app.constants.uploads import ALLOWED_CONTENT_TYPES
from app.core.logging import get_logger
from app.core.config import settings
from app.models.document import Document

logger = get_logger(__name__)


@lru_cache(maxsize=1)
def _s3_client():
    kwargs: dict[str, Any] = {
        "region_name": settings.AWS_REGION,
        "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
        "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
        "config": Config(signature_version="s3v4"),
    }
    if settings.S3_ENDPOINT_URL:
        kwargs["endpoint_url"] = settings.S3_ENDPOINT_URL
    return boto3.client("s3", **kwargs)


class DocumentManager:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_presigned_url(
        self,
        session_id: uuid.UUID,
        filename: str,
        content_type: str,
    ) -> dict[str, Any]:
        if not settings.S3_BUCKET_NAME:
            raise RuntimeError("S3_BUCKET_NAME is not configured")

        if content_type not in ALLOWED_CONTENT_TYPES:
            raise ValueError(
                f"Unsupported content type {content_type!r}. "
                f"Allowed: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}."
            )

        key = f"{settings.S3_UPLOAD_DOCUMENTS_PREFIX}{uuid.uuid4().hex}-{filename}"

        conditions: list[Any] = [
            ["content-length-range", 1, settings.S3_MAX_UPLOAD_BYTES],
            {"Content-Type": content_type},
        ]
        fields: dict[str, str] = {"Content-Type": content_type}

        presigned = _s3_client().generate_presigned_post(
            Bucket=settings.S3_BUCKET_NAME,
            Key=key,
            Fields=fields,
            Conditions=conditions,
            ExpiresIn=settings.S3_PRESIGN_EXPIRES,
        )
        # Use region-specific endpoint to avoid TemporaryRedirect
        presigned["url"] = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/"

        expires_at = datetime.now(timezone.utc) + timedelta(
            seconds=settings.DOCUMENT_EXPIRY
        )
        from app.models.document import DocumentStatus

        document = Document(
            session_id=session_id,
            key=key,
            content_type=content_type,
            bucket_name=settings.S3_BUCKET_NAME,
            region=settings.AWS_REGION,
            file_name=filename,
            expires_at=expires_at,
            status=DocumentStatus.UPLOAD_URL_CREATED,
        )
        self.db.add(document)
        await self.db.commit()
        await self.db.refresh(document)

        logger.debug("Issued presigned POST for key=%s document_id=%s", key, document.id)
        return presigned
