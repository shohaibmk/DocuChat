# DocuChat Backend

FastAPI backend for DocuChat.

## Prerequisites

- **Python** `>=3.12`
- **uv** `>=0.11` — fast Python package & project manager
  - Install: `curl -LsSf https://astral.sh/uv/install.sh | sh`
  - Verify: `uv --version`
- **Git** (to clone the repo)

## Project Structure

```
Backend/
├── app/
│   ├── main.py              # FastAPI entrypoint, middleware, router mounting
│   ├── api/
│   │   ├── deps.py          # Shared dependencies (DB session, auth, etc.)
│   │   └── routes/          # Route modules (one file per resource)
│   │       └── health.py
│   ├── core/
│   │   └── config.py        # Settings loaded from environment / .env
│   ├── db/
│   │   ├── base.py          # SQLAlchemy DeclarativeBase
│   │   └── session.py       # Async engine + session factory
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic request/response schemas
│   └── services/            # Business logic
├── tests/
│   └── conftest.py
├── .env.example             # Reference env vars (copy to .env)
├── pyproject.toml           # Dependencies + tool config
└── README.md
```

## Setup

From the `Backend/` directory:

```bash
# 1. Sync dependencies (creates .venv automatically)
uv sync

# 2. Copy environment template and edit values
cp .env.example .env
```

Then open `.env` and update at minimum:
- `SECRET_KEY` — generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- `DATABASE_URL` — defaults to local SQLite; change for Postgres etc.
- `CORS_ORIGINS` — frontend origin(s)

## Run the development server

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Once running:
- API root: <http://localhost:8000>
- Swagger docs: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>
- Health check: <http://localhost:8000/api/v1/health>

## Testing

```bash
uv run pytest
```

## Linting & Formatting

```bash
uv run ruff check .          # Lint
uv run ruff check . --fix    # Lint + autofix
uv run ruff format .         # Format
```

## Managing Dependencies

```bash
uv add <package>             # Add runtime dependency
uv add --dev <package>       # Add dev dependency
uv remove <package>          # Remove
uv lock --upgrade            # Refresh lockfile
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PROJECT_NAME` | `DocuChat` | App display name |
| `DEBUG` | `false` | Enable SQLAlchemy echo + debug behavior |
| `API_V1_PREFIX` | `/api/v1` | Base path for v1 routes |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed frontend origins (JSON array) |
| `DATABASE_URL` | `sqlite+aiosqlite:///./docuchat.db` | Async SQLAlchemy URL |
| `SECRET_KEY` | _change me_ | JWT/session signing secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token lifetime |

## Troubleshooting

- **`ModuleNotFoundError: app`** — run commands from the `Backend/` directory, not the repo root.
- **`uv: command not found`** — ensure `~/.local/bin` is on your `PATH` after installing uv.
- **Port 8000 already in use** — pass `--port 8001` (or any free port) to uvicorn.
