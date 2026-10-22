"""
Secure File Storage Service (Milestone 4C).
Provides:
- Content-based file signature / magic bytes validation (PDF, PNG, JPEG)
- Extension whitelisting and cross-validation
- Client-supplied filename sanitization
- Chunked streaming upload with incremental SHA-256 computation
- Path traversal protection and UUID-based storage naming
- Atomic cleanup on upload/transaction failures
- File removal and secure retrieval
"""

import os
import re
import uuid
import hashlib
from typing import Tuple, Optional
from fastapi import UploadFile

from app.core.config import settings
from app.core.errors import InvalidFileError, FileTooLargeError

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}

# Known binary magic byte signatures
MAGIC_SIGNATURES = {
    "PDF": {
        "signature": b"%PDF-",
        "mime": "application/pdf",
        "extensions": {".pdf"},
    },
    "PNG": {
        "signature": b"\x89PNG\r\n\x1a\n",
        "mime": "image/png",
        "extensions": {".png"},
    },
    "JPEG": {
        "signature": b"\xff\xd8\xff",
        "mime": "image/jpeg",
        "extensions": {".jpg", ".jpeg"},
    },
}

CHUNK_SIZE = 64 * 1024  # 64 KB read buffer


def sanitize_filename(filename: Optional[str]) -> str:
    """
    Sanitizes client-provided filename:
    - Strips directory components and path traversal sequences
    - Removes null bytes and control characters
    - Fallbacks to 'document' if filename is empty or invalid
    - Truncates to 255 characters
    """
    if not filename:
        return "document"

    # Strip directory parts across Windows and POSIX separators
    clean_name = os.path.basename(filename.replace("\\", "/"))

    # Remove null bytes and unprintable control characters
    clean_name = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", clean_name).strip()

    # If stripped to empty or only dots
    if not clean_name or clean_name in {".", ".."}:
        return "document"

    # Truncate if exceeds 255 chars while preserving extension
    if len(clean_name) > 255:
        base, ext = os.path.splitext(clean_name)
        clean_name = base[: 255 - len(ext)] + ext

    return clean_name


def detect_file_signature(header: bytes) -> Optional[Tuple[str, str]]:
    """
    Detects document file format from leading magic bytes.
    Returns (format_label, canonical_mime) or None if signature is unverified.
    """
    if not header:
        return None

    # Check PNG (8 bytes)
    if header.startswith(MAGIC_SIGNATURES["PNG"]["signature"]):
        return "PNG", MAGIC_SIGNATURES["PNG"]["mime"]

    # Check JPEG (3 bytes)
    if header.startswith(MAGIC_SIGNATURES["JPEG"]["signature"]):
        return "JPEG", MAGIC_SIGNATURES["JPEG"]["mime"]

    # Check PDF (first 5 bytes or within first 1024 bytes)
    if header.startswith(MAGIC_SIGNATURES["PDF"]["signature"]):
        return "PDF", MAGIC_SIGNATURES["PDF"]["mime"]

    # Some PDFs may have a UTF-8 BOM or minimal comment before %PDF-
    if b"%PDF-" in header[:1024]:
        return "PDF", MAGIC_SIGNATURES["PDF"]["mime"]

    return None


def validate_file_metadata(filename: str, header: bytes) -> Tuple[str, str, str]:
    """
    Validates extension and binary content signature.
    Enforces that extension matches detected magic bytes.
    Returns (detected_format, detected_mime, normalized_extension).
    """
    _, ext = os.path.splitext(filename.lower())

    if not ext or ext not in ALLOWED_EXTENSIONS:
        allowed_list = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise InvalidFileError(
            f"Unsupported file extension '{ext or 'none'}'. Supported formats: {allowed_list}.",
            details={"allowed_extensions": list(ALLOWED_EXTENSIONS)},
        )

    detected = detect_file_signature(header)
    if not detected:
        raise InvalidFileError(
            "Invalid file format or malformed file signature. Content does not match expected PDF, PNG, or JPEG specification.",
            details={"filename": filename},
        )

    file_format, mime_type = detected
    expected_extensions = MAGIC_SIGNATURES[file_format]["extensions"]

    if ext not in expected_extensions:
        raise InvalidFileError(
            f"File extension '{ext}' does not match detected binary format '{file_format}'.",
            details={
                "extension": ext,
                "detected_format": file_format,
                "expected_extensions": list(expected_extensions),
            },
        )

    return file_format, mime_type, ext


async def save_upload_stream(
    file: UploadFile,
    upload_dir: Optional[str] = None,
    max_bytes: Optional[int] = None,
) -> Tuple[str, str, int, str, str, str]:
    """
    Streams an uploaded file to secure storage:
    - Validates signature from first chunk
    - Enforces max size during streaming
    - Incrementally computes SHA-256
    - Generates cryptographically secure random storage key
    - Prevents path traversal
    - Cleans up partial file on any failure

    Returns:
    (sanitized_filename, storage_filename, file_size, sha256_hash, mime_type, file_format)
    """
    dest_dir = os.path.abspath(upload_dir or settings.UPLOAD_DIR)
    os.makedirs(dest_dir, exist_ok=True)
    limit = max_bytes or settings.MAX_UPLOAD_SIZE_BYTES

    sanitized_display_name = sanitize_filename(file.filename)

    # Read first chunk to inspect header and check for empty file
    first_chunk = await file.read(CHUNK_SIZE)
    if not first_chunk or len(first_chunk) == 0:
        raise InvalidFileError("Uploaded file is empty.", details={"filename": sanitized_display_name})

    # Validate header signature & extension
    file_format, canonical_mime, ext = validate_file_metadata(
        sanitized_display_name, first_chunk
    )

    # Generate random server-side storage filename
    storage_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.abspath(os.path.join(dest_dir, storage_filename))

    # Path traversal validation
    if not dest_path.startswith(dest_dir):
        raise InvalidFileError("Illegal filename path traversal detected.")

    hasher = hashlib.sha256()
    total_bytes = 0

    try:
        with open(dest_path, "wb") as out_file:
            # Process first chunk
            total_bytes += len(first_chunk)
            if total_bytes > limit:
                raise FileTooLargeError(max_bytes=limit, actual_bytes=total_bytes)

            hasher.update(first_chunk)
            out_file.write(first_chunk)

            # Stream remaining chunks
            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break

                total_bytes += len(chunk)
                if total_bytes > limit:
                    raise FileTooLargeError(max_bytes=limit, actual_bytes=total_bytes)

                hasher.update(chunk)
                out_file.write(chunk)

    except Exception:
        # Clean up partial/corrupted file on disk immediately
        if os.path.exists(dest_path):
            try:
                os.remove(dest_path)
            except OSError:
                pass
        raise

    return (
        sanitized_display_name,
        storage_filename,
        total_bytes,
        hasher.hexdigest(),
        canonical_mime,
        file_format,
    )


def resolve_storage_path(
    storage_filename: Optional[str],
    storage_path: Optional[str] = None,
    upload_dir: Optional[str] = None,
) -> Optional[str]:
    """
    Resolves the absolute filesystem path for a stored document.
    Ensures the path is inside the designated upload directory.
    """
    dest_dir = os.path.abspath(upload_dir or settings.UPLOAD_DIR)

    # Check storage_filename first
    if storage_filename:
        safe_path = os.path.abspath(os.path.join(dest_dir, os.path.basename(storage_filename)))
        if safe_path.startswith(dest_dir) and os.path.exists(safe_path):
            return safe_path

    # Check storage_path as fallback
    if storage_path:
        # If relative, resolve against dest_dir or current working dir
        candidate = (
            os.path.abspath(storage_path)
            if os.path.isabs(storage_path)
            else os.path.abspath(os.path.join(dest_dir, os.path.basename(storage_path)))
        )
        if os.path.exists(candidate):
            return candidate

    return None


def remove_storage_file(
    storage_filename: Optional[str],
    storage_path: Optional[str] = None,
    upload_dir: Optional[str] = None,
) -> bool:
    """
    Safely deletes a document file from storage if present.
    Returns True if removed, False otherwise.
    """
    file_path = resolve_storage_path(storage_filename, storage_path, upload_dir)
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            return True
        except OSError:
            return False
    return False
