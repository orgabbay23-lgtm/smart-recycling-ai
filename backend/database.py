"""
SQLite persistence for scan history.
"""

import base64
import io
import os
import sqlite3
from datetime import datetime, timezone

from PIL import Image

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(_PROJECT_ROOT, "backend", "scan_history.db")

# Thumbnails are stored as compressed Base64 JPEG data URIs for the dashboard.
_THUMBNAIL_SIZE = (80, 80)
_THUMBNAIL_QUALITY = 70


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with _connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scan_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scan_type TEXT NOT NULL,
                predicted_label TEXT NOT NULL,
                confidence REAL NOT NULL,
                timestamp TEXT NOT NULL,
                thumbnail TEXT
            )
            """
        )
        # Migrate databases created before the thumbnail column existed.
        existing_columns = {row["name"] for row in conn.execute("PRAGMA table_info(scan_history)")}
        if "thumbnail" not in existing_columns:
            conn.execute("ALTER TABLE scan_history ADD COLUMN thumbnail TEXT")


def _make_thumbnail(image_bytes: bytes) -> str | None:
    """Resize image bytes into a small compressed Base64 JPEG data URI."""
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        # Never let a bad/unreadable image block the scan from being recorded.
        return None
    image.thumbnail(_THUMBNAIL_SIZE)
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=_THUMBNAIL_QUALITY)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{encoded}"


def record_scan(
    scan_type: str,
    predicted_label: str,
    confidence: float,
    image_bytes: bytes | None = None,
) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    thumbnail = _make_thumbnail(image_bytes) if image_bytes else None
    with _connect() as conn:
        conn.execute(
            "INSERT INTO scan_history (scan_type, predicted_label, confidence, timestamp, thumbnail) "
            "VALUES (?, ?, ?, ?, ?)",
            (scan_type, predicted_label, confidence, timestamp, thumbnail),
        )


def get_recent_scans(limit: int = 20) -> list[dict]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT id, scan_type, predicted_label, confidence, timestamp, thumbnail "
            "FROM scan_history ORDER BY timestamp DESC, id DESC LIMIT ?",
            (limit,),
        ).fetchall()
    return [dict(row) for row in rows]
