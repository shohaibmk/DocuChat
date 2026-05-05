import logging
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from pydantic import BaseModel

from app.constants.uploads import (
    ALLOWED_EXTENSIONS,
    MAX_FILES,
    MAX_FILE_SIZE_BYTES,
    MIN_FILES,
    READ_CHUNK_BYTES,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["uploads"])


class FileError(BaseModel):
    index: int
    filename: str | None
    reason: str


class UploadedFile(BaseModel):
    filename: str
    content_type: str | None
    size: int


class UploadResponse(BaseModel):
    count: int
    files: list[UploadedFile]


def _extension(filename: str | None) -> str:
    if not filename:
        return ""
    return Path(filename).suffix.lower()


def _bad_request(detail: object) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


async def _read_and_size(file: UploadFile, index: int) -> int:
    size = 0
    try:
        while chunk := await file.read(READ_CHUNK_BYTES):
            size += len(chunk)
            if size > MAX_FILE_SIZE_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail={
                        "index": index,
                        "filename": file.filename,
                        "reason": (
                            f"File exceeds max size of {MAX_FILE_SIZE_BYTES} bytes."
                        ),
                    },
                )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed reading upload %r", file.filename)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "index": index,
                "filename": file.filename,
                "reason": "Failed to read uploaded file.",
            },
        ) from None
    finally:
        await file.close()
    return size


@router.post("/upload", response_model=UploadResponse)
async def upload_files(
    files: Annotated[list[UploadFile], File(...)],
) -> UploadResponse:
    """
    Upload multiple files with validation.
    
    Args:
        files: List of uploaded files
        
    Returns:
        UploadResponse with count and list of uploaded files
        
    Raises:
        HTTPException: If validation fails
    """
    if len(files) < MIN_FILES:
        raise _bad_request(f"At least {MIN_FILES} file is required.")
    if len(files) > MAX_FILES:
        raise _bad_request(f"At most {MAX_FILES} files are allowed.")

    errors: list[FileError] = []
    for i, f in enumerate(files):
        if not f.filename:
            errors.append(FileError(index=i, filename=None, reason="Missing filename."))
            continue
        ext = _extension(f.filename)
        if ext not in ALLOWED_EXTENSIONS:
            errors.append(
                FileError(
                    index=i,
                    filename=f.filename,
                    reason=(
                        f"Unsupported extension {ext!r}. "
                        f"Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
                    ),
                )
            )

    if errors:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=[e.model_dump() for e in errors],
        )

    accepted: list[UploadedFile] = []
    for i, f in enumerate(files):
        size = await _read_and_size(f, i)
        if size == 0:
            raise _bad_request(
                {"index": i, "filename": f.filename, "reason": "File is empty."}
            )
        accepted.append(
            UploadedFile(filename=f.filename or "", content_type=f.content_type, size=size)
        )

    return UploadResponse(count=len(accepted), files=accepted)
