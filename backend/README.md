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
│       └── 584ce8990b1a_add_sessions_table.py
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
│   │           ├── documents.py  # User-isolated document repository & metadata
│   │           └── assessments.py# Verification assessment queries & staging
│   ├── core/
│   │   ├── __init__.py
│   │   ├── auth.py               # Session verification, cookie management & CSRF dependencies
│   │   ├── config.py             # Pydantic-settings environment configuration
│   │   ├── database.py           # SQLAlchemy 2.x engine, SQLite WAL & foreign keys
│   │   ├── errors.py             # Centralized JSON exception handlers
│   │   └── security.py           # Argon2id hashing, session/CSRF tokens & password policy
│   ├── models/
│   │   ├── __init__.py           # Model exports for Alembic discovery
│   │   ├── base.py               # DeclarativeBase and TimestampMixin
│   │   ├── user.py               # Users table
│   │   ├── session.py            # Active server-managed user sessions
│   │   ├── document.py           # Documents table
│   │   ├── assessment.py         # Assessments table (with is_demo isolation)
│   │   └── audit.py              # Immutable AuditLog table
│   └── schemas/
│       ├── __init__.py           # Pydantic validation schemas
│       ├── health.py             # Health check response DTO
│       ├── auth.py               # AuthRegister, AuthLogin, UserProfile DTOs
│       ├── user.py               # UserCreate, UserRead, UserUpdate DTOs
│       ├── document.py           # DocumentCreate, DocumentRead DTOs
│       ├── assessment.py         # AssessmentCreate, AssessmentRead DTOs
│       └── audit.py              # AuditLogRead DTO
├── tests/
│   ├── __init__.py
│   ├── conftest.py               # Isolated temporary test database & TestClient
│   ├── test_auth.py              # Comprehensive authentication, session & CSRF tests
│   ├── test_health.py            # Startup and health probe tests
│   ├── test_database.py          # Session handling and SQLite foreign key enforcement
│   ├── test_models.py            # Model constraints, defaults & cascade deletion
│   ├── test_security.py          # Argon2 hashing, verification & credential safety
│   ├── test_api_endpoints.py     # Users, Documents, Assessments API tests
│   ├── test_config.py            # Configuration & CORS parsing tests
│   └── test_errors.py            # Standardized 404 & 422 error response tests
├── uploads/                      # Storage directory for ingested document binaries (.gitkeep)
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
| `UPLOAD_DIR` | `"./uploads"` | Relative filesystem directory for documents |
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

### Diagnostics & Core Services
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root operational status and service metadata |
| `GET` | `/api/health` | Health probe (database connectivity, version, environment) |
| `GET` | `/api/v1/health` | Versioned health probe |
| `GET` | `/api/v1/documents` | Protected: List documents belonging to authenticated user |
| `POST` | `/api/v1/documents` | Protected: Register document metadata for authenticated user |
| `GET` | `/api/v1/documents/{id}` | Protected: Retrieve document metadata (user-isolated) |
| `GET` | `/api/v1/assessments` | Protected: List assessments (empty array by default) |
| `POST` | `/api/v1/assessments` | Protected: Register document assessment record |
| `GET` | `/api/v1/assessments/{id}`| Protected: Retrieve assessment details and recommendation |

---

## Authentication & Security Architecture

1. **Server-Managed Sessions**:
   - Sessions are persisted in the `sessions` database table with cryptographically secure 256-bit random tokens (`secrets.token_urlsafe(32)`).
   - Invalidation on logout updates `is_revoked = True` in the database immediately, rejecting subsequent requests with the same cookie.
   - Session lifetime is configurable (24 hours standard, 7 days with "Remember Me").

2. **HTTP-Only Cookies**:
   - Session identifier is transmitted solely via the `docshield_session` cookie flagged with `HttpOnly`, preventing JavaScript access and XSS theft.
   - `SameSite="Lax"` prevents cross-site request exploitation while allowing seamless top-level navigation.
   - `Secure` flag configurable via `COOKIE_SECURE` (`false` for localhost development, `true` for production HTTPS).

3. **Double-Submit CSRF Defense**:
   - The backend sets a readable `docshield_csrf` cookie on session creation or via `GET /api/v1/auth/csrf`.
   - The frontend API client automatically reads this cookie and injects it into the `X-CSRF-Token` header for state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`).
   - The server verifies that the header matches the cookie token before executing state-changing endpoints.

4. **Credential Protection**:
   - Passwords hashed using **Argon2id** via `passlib[argon2]`.
   - Email addresses normalized to lowercase and stripped of whitespace before storage and authentication lookup.
   - Login credential failures return a generic `"Invalid email or password"` (HTTP 401) to protect against account enumeration.
   - Strict password complexity: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol.

5. **Resource Isolation**:
   - Protected endpoints require an active session (`get_current_user` dependency).
   - Document and assessment queries are strictly scoped to the authenticated `current_user.id`.

---

## Testing & Quality

All tests run against an **isolated temporary SQLite database** (`test_docshield.db`) that is automatically provisioned and dropped during test execution, ensuring zero risk to development data.

```bash
# Run complete test suite with verbose output
python -m pytest -v
```

**Test Coverage Summary (37 Tests Passed):**
- Authentication & registration lifecycle: valid registration, duplicate accounts (409 Conflict), weak password rejection (422 Unprocessable Entity).
- Login security: successful login, invalid email (401), invalid password (401), generic error responses.
- Session management: session creation, session lookup (`/me`), session invalidation on logout.
- CSRF protection: rejection of state-changing requests without CSRF token (403 Forbidden), rejection with mismatched token (403 Forbidden).
- User resource isolation: unauthenticated access rejection (401 Unauthorized), multi-user document isolation (User A cannot view User B's documents).
- SQLite Foreign Key enforcement (`PRAGMA foreign_keys=ON`) and cascade deletions.
- Health diagnostics and CORS configuration validation.
