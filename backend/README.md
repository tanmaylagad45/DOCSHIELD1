# DocShield Backend — Foundation & Database Layer

FastAPI REST API, SQLAlchemy 2.x ORM, Alembic migrations, and SQLite datastore for the DocShield document intelligence platform.

---

## Architecture & Directory Structure

```text
backend/
├── alembic.ini                   # Alembic database migration configuration
├── alembic/
│   ├── env.py                    # Migration execution environment & metadata binding
│   ├── script.py.mako            # Migration revision template
│   └── versions/                 # Auto-generated revision scripts
│       ├── 26d15204d5a0_initial_schema_users_documents_.py
│       ├── 584ce8990b1a_add_sessions_table.py
│       └── 4c5b7aa7ce87_add_storage_filename_and_file_format_to_.py
├── app/
│   ├── __init__.py               # Package root (configures pure Python mode)
│   ├── main.py                   # FastAPI application factory, CORS & lifecycle
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py         # v1 route aggregator
│   │       └── endpoints/
│   │           ├── health.py     # Diagnostics & DB connectivity check (/api/health)
│   │           ├── auth.py       # Session login, register, logout, me, and CSRF token
│   │           ├── users.py      # User management & profile lookup
│   │           ├── documents.py  # Secure upload, listing, download & deletion
│   │           └── assessments.py# Verification assessment queries & staging
│   ├── core/
│   │   ├── __init__.py
│   │   ├── auth.py               # Session verification, cookie management & CSRF dependencies
│   │   ├── config.py             # Pydantic-settings environment configuration
│   │   ├── database.py           # SQLAlchemy 2.x engine, SQLite WAL & foreign keys
│   │   ├── errors.py             # Centralized JSON exception handlers & domain errors
│   │   ├── security.py           # Argon2id hashing, session/CSRF tokens & password policy
│   │   └── storage.py            # Magic bytes validation, streaming uploads & file cleanup
│   ├── models/
│   │   ├── __init__.py           # Model exports for Alembic discovery
│   │   ├── base.py               # DeclarativeBase and TimestampMixin
│   │   ├── user.py               # Users table
│   │   ├── session.py            # Active server-managed user sessions
│   │   ├── document.py           # Documents table (with storage metadata & format)
│   │   ├── assessment.py         # Assessments table (with is_demo isolation)
│   │   └── audit.py              # Immutable AuditLog table
│   └── schemas/
│       ├── __init__.py           # Pydantic validation schemas
│       ├── health.py             # Health check response DTO
│       ├── auth.py               # AuthRegister, AuthLogin, UserProfile DTOs
│       ├── user.py               # UserCreate, UserRead, UserUpdate DTOs
│       ├── document.py           # DocumentCreate, DocumentRead, DocumentDeleteResponse DTOs
│       ├── assessment.py         # AssessmentCreate, AssessmentRead DTOs
│       └── audit.py              # AuditLogRead DTO
├── tests/
│   ├── __init__.py
│   ├── conftest.py               # Isolated temporary test database & TestClient
│   ├── test_auth.py              # Comprehensive authentication, session & CSRF tests
│   ├── test_documents.py         # Upload, magic bytes, streaming, download, and delete tests
│   ├── test_health.py            # Startup and health probe tests
│   ├── test_database.py          # Session handling and SQLite foreign key enforcement
│   ├── test_models.py            # Model constraints, defaults & cascade deletion
│   ├── test_security.py          # Argon2 hashing, verification & credential safety
│   ├── test_api_endpoints.py     # Users, Documents, Assessments API tests
│   ├── test_config.py            # Configuration & CORS parsing tests
│   └── test_errors.py            # Standardized 404 & 422 error response tests
├── uploads/                      # Isolated private document binary store (.gitkeep)
├── requirements.txt              # Production and development dependencies
├── .env.example                  # Environment template with placeholders
└── .env                          # Local development environment (git-ignored)
```

---

## Quickstart & Setup

### 1. Prerequisites
- Python `3.10+` (verified on Python `3.14.4`)
- Virtual environment tool (`venv`)

### 2. Virtual Environment Setup

```bash
# From repository root or backend/ directory
cd backend
python -m venv .venv

# Activate on Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Activate on Linux/macOS:
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Key environment settings:
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PROJECT_NAME` | `"DocShield Document Intelligence API"` | Service identity title |
| `API_V1_STR` | `"/api/v1"` | URL prefix for versioned endpoints |
| `ENVIRONMENT` | `"development"` | `development`, `testing`, or `production` |
| `DATABASE_URL` | `"sqlite:///./docshield.db"` | Relational database connection string |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Authorized frontend origins (credentials enabled) |
| `UPLOAD_DIR` | `"./uploads"` | Relative filesystem directory for private document storage |
| `MAX_UPLOAD_SIZE_BYTES` | `10485760` | Maximum upload size in bytes (10 MB) |
| `SECRET_KEY` | *(Placeholder string)* | Cryptographic signing key |
| `SESSION_COOKIE_NAME` | `"docshield_session"` | Name of the HTTP-only session cookie |
| `CSRF_COOKIE_NAME` | `"docshield_csrf"` | Name of the double-submit CSRF cookie |
| `COOKIE_SECURE` | `false` | Set `true` in production (requires HTTPS) |
| `COOKIE_SAMESITE` | `"lax"` | Cookie SameSite policy (`lax`, `strict`, `none`) |
| `SESSION_EXPIRE_HOURS` | `24` | Session lifetime for standard logins |
| `SESSION_REMEMBER_ME_DAYS` | `7` | Session lifetime when "Remember Me" is selected |

### 5. Database Initialization & Migrations

Run Alembic migrations to apply the schema to the local SQLite database:

```bash
# Run migrations to head
python -m alembic upgrade head

# To generate a new migration revision after model updates:
python -m alembic revision --autogenerate -m "Describe migration"
```

### 6. Run Development Server

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## Interactive API Documentation

Once the server is running, interactive documentation is available at:
- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **OpenAPI JSON:** [http://127.0.0.1:8000/api/v1/openapi.json](http://127.0.0.1:8000/api/v1/openapi.json)

---

## Implemented API Endpoints

### Authentication & Sessions (`/api/v1/auth` & `/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new account, normalize email, hash with Argon2id, create session |
| `POST` | `/api/v1/auth/login` | Verify credentials, issue HTTP-only session and CSRF cookies |
| `POST` | `/api/v1/auth/logout` | Revoke session in database, clear auth and CSRF cookies |
| `GET` | `/api/v1/auth/me` | Fetch currently authenticated user profile (401 if unauthenticated) |
| `GET` | `/api/v1/auth/csrf` | Issue or retrieve active CSRF token |

### Document Management & Storage (`/api/v1/documents` & `/api/documents`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/documents/upload` | Protected: Multipart upload with magic bytes check, SHA-256 hash & private storage |
| `POST` | `/api/v1/documents` | Protected: Binary upload (multipart) or metadata registration (JSON) |
| `GET` | `/api/v1/documents` | Protected: List documents owned by user with pagination (`X-Total-Count`, etc.) |
| `GET` | `/api/v1/documents/{id}` | Protected: Retrieve document metadata (internal physical path excluded) |
| `GET` | `/api/v1/documents/{id}/download` | Protected: Stream binary with attachment disposition & `nosniff` header |
| `DELETE`| `/api/v1/documents/{id}` | Protected: Delete database record and safely purge storage file from disk |

### Diagnostics & Core Services
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root operational status and service metadata |
| `GET` | `/api/health` | Health probe (database connectivity, version, environment) |
| `GET` | `/api/v1/health` | Versioned health probe |
| `GET` | `/api/v1/assessments` | Protected: List assessments (empty array by default) |
| `POST` | `/api/v1/assessments` | Protected: Register document assessment record |
| `GET` | `/api/v1/assessments/{id}`| Protected: Retrieve assessment details and recommendation |

---

## Secure Storage Architecture & Integrity

1. **Content-Based Magic Bytes Validation**:
   - Client MIME types and extensions are not trusted blindly.
   - Uploaded binary headers are inspected for authentic magic bytes:
     - **PDF**: `%PDF-` (`0x25 0x50 0x44 0x46 0x2D`)
     - **PNG**: `\x89PNG\r\n\x1a\n` (`0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A`)
     - **JPEG**: `\xFF\xD8\xFF` (`0xFF 0xD8 0xFF`)
   - Rejects empty files (0 bytes), unsupported extensions, and extension-content mismatches.
   - Note: File signature validation confirms format integrity; it does not certify official government authenticity.

2. **Chunked Streaming & SHA-256 Computation**:
   - Files are read in 64 KB chunks rather than loading entire files into memory.
   - Cryptographic SHA-256 digest is incrementally computed during the stream.
   - Enforces a 10 MB maximum upload limit (`MAX_UPLOAD_SIZE_BYTES`); partial files are atomically purged if limit is exceeded.

3. **Path Traversal & Random Storage Keys**:
   - Client-provided filenames are sanitized for display only.
   - Files are stored using random UUIDv4 names (e.g., `4a2e1d7b....pdf`).
   - The storage directory is private and never mounted as public static content.

4. **Multi-User Isolation**:
   - All document operations (`GET`, `POST`, `DELETE`, download) enforce `Document.user_id == current_user.id`.
   - Access attempts to documents belonging to other users return a clean `404 Not Found` to prevent account enumeration.

5. **Local Storage Limitations**:
   - The current storage engine uses local disk storage (`backend/uploads`).
   - For multi-instance, clustered production deployments, an S3-compatible object store adapter (MinIO, AWS S3, or GCS) can be configured seamlessly behind the existing `storage.py` abstraction.

---

## Testing & Quality

All tests run against an **isolated temporary SQLite database** (`test_docshield.db`) and a clean isolated temporary storage directory:

```bash
# Run complete test suite with verbose output
python -m pytest -v
```

**Test Coverage Summary (51 Tests Passed):**
- **Document Storage & Uploads (14 tests)**: PDF, PNG, JPEG binary uploads, magic bytes verification, empty file rejection, 10MB limit enforcement, streaming SHA-256 calculation, partial file cleanup.
- **Access Control & User Isolation**: Unauthenticated access rejection (401), cross-user document isolation (User A cannot view, download, or delete User B's documents).
- **Download & Deletion**: Safe attachment headers (`Content-Disposition`, `nosniff`), database and storage disk synchronization upon deletion.
- **Authentication & Sessions (11 tests)**: Argon2id password hashing, generic 401 credential errors, HTTP-only session cookies, Double-Submit CSRF protection.
- **Database & Model Integrity**: Foreign key enforcement (`PRAGMA foreign_keys=ON`), unique constraints, cascade deletion.

