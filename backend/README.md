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
│       └── 26d15204d5a0_initial_schema_users_documents_.py
├── app/
│   ├── __init__.py               # Package root (configures pure Python mode)
│   ├── main.py                   # FastAPI application factory & lifecycle management
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py         # v1 route aggregator
│   │       └── endpoints/
│   │           ├── health.py     # Diagnostics & DB connectivity check (/api/health)
│   │           ├── users.py      # User management & Argon2 registration
│   │           ├── documents.py  # Document metadata registration & repository listing
│   │           └── assessments.py# Verification assessment queries & staging
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py             # Pydantic-settings environment configuration
│   │   ├── database.py           # SQLAlchemy 2.x engine, SQLite WAL & foreign keys
│   │   ├── errors.py             # Centralized JSON exception handlers
│   │   └── security.py           # Argon2 password hashing & email normalization
│   ├── models/
│   │   ├── __init__.py           # Model exports for Alembic discovery
│   │   ├── base.py               # DeclarativeBase and TimestampMixin
│   │   ├── user.py               # Users table
│   │   ├── document.py           # Documents table
│   │   ├── assessment.py         # Assessments table (with is_demo isolation)
│   │   └── audit.py              # Immutable AuditLog table
│   └── schemas/
│       ├── __init__.py           # Pydantic validation schemas
│       ├── health.py             # Health check response DTO
│       ├── user.py               # UserCreate, UserRead, UserUpdate DTOs
│       ├── document.py           # DocumentCreate, DocumentRead DTOs
│       ├── assessment.py         # AssessmentCreate, AssessmentRead DTOs
│       └── audit.py              # AuditLogRead DTO
├── tests/
│   ├── __init__.py
│   ├── conftest.py               # Isolated temporary test database & TestClient
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
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Authorized frontend origin origins |
| `UPLOAD_DIR` | `"./uploads"` | Relative filesystem directory for documents |
| `SECRET_KEY` | *(Placeholder string)* | Cryptographic signing key |

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

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root operational status and service metadata |
| `GET` | `/api/health` | Health probe (database connectivity, version, environment) |
| `GET` | `/api/v1/health` | Versioned health probe |
| `POST` | `/api/v1/users` | Registers user with Argon2 password hash (409 on duplicate) |
| `GET` | `/api/v1/users` | Lists registered users (password hashes excluded) |
| `GET` | `/api/v1/users/{user_id}` | Retrieves user account metadata |
| `GET` | `/api/v1/documents` | Lists documents (empty array by default) |
| `POST` | `/api/v1/documents` | Registers document metadata (file stored on disk) |
| `GET` | `/api/v1/documents/{id}` | Retrieves document metadata (404 on invalid ID) |
| `GET` | `/api/v1/assessments` | Lists assessments (empty array by default) |
| `POST` | `/api/v1/assessments` | Registers document assessment record |
| `GET` | `/api/v1/assessments/{id}`| Retrieves assessment details and recommendation |

---

## Testing & Quality

All tests run against an **isolated temporary SQLite database** (`test_docshield.db`) that is automatically provisioned and dropped during test execution, ensuring zero risk to development data.

```bash
# Run complete test suite with verbose output
python -m pytest -v
```

**Test Coverage Summary:**
- Health diagnostics & server root status
- SQLite Foreign Key enforcement (`PRAGMA foreign_keys=ON`)
- Transaction rollback and commit integrity
- Model uniqueness constraints and cascade deletions
- Argon2 password hashing and verification
- Pydantic schema credential filtering (hashes never leaked)
- Standardized 404 and 422 JSON error payloads
- Clean zero-baseline defaults (`[]` for empty documents and assessments)
