# CleverDocs Backend

> **FastAPI + Python 3.11+ + AWS SDK + Pydantic**  
> Backend API for CleverDocs' AI-powered onboarding and knowledge sharing platform

## Quick Start

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Start development server
python -m uvicorn api:app --reload

# API documentation
open http://localhost:8000/docs
```

## Current Architecture

**Status**: ✅ **Basic Implementation** | 🔄 **Migration to Full Structure Planned**

### Current Structure (✅ What Exists)
```
backend/
├── api.py              # ✅ Current FastAPI application
├── .gitignore          # ✅ Python-specific ignores  
├── README.md           # ✅ This file
└── requirements.txt    # 🔄 To be created
```

### Planned Structure (🔄 Migration Path)
See `docs/CODEBASE_GUIDE.md` → "🌐 backend/ - FastAPI Server" for full planned architecture with `app/` package structure.

## Development Guidelines

**For comprehensive backend development patterns, see:**
- **Architecture**: `docs/CODEBASE_GUIDE.md` → Backend section
- **Coding Standards**: `docs/development/CODING_STANDARDS.md` → Backend Standards  
- **AI Agent Rules**: `docs/CLAUDE.md` → Backend Technology Stack
- **Business Requirements**: `docs/PRDs/CleverDocsPRD.md`

## Core Backend Principles

1. **Async First**: Use `async/await` for all I/O operations
2. **Validation Required**: All inputs validated with Pydantic models
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Performance**: Target < 200ms for simple operations, < 2s for AI operations
5. **Security**: No credential exposure, proper input validation

## Common Commands

```bash
# Development
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000

# Testing (when implemented)
python -m pytest tests/ -v
python -m pytest tests/ --cov=app --cov-report=term-missing

# Code Quality (when configured)
python -m black backend/app/ --check
python -m flake8 backend/app/
python -m mypy backend/app/ --ignore-missing-imports

# Security Scanning (when configured)
python -m bandit -r backend/app/
python -m safety check
```

## API Documentation

- **Interactive Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Environment Configuration

```bash
# Required environment variables (create .env file)
# See docs/development/CODING_STANDARDS.md for full configuration patterns

# Example .env structure:
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key  
# AWS_REGION=us-east-1
# DATABASE_URL=your_database_url
# LOG_LEVEL=INFO
```

## Feature Development Workflow

```bash
# 1. Create backend feature request
vim docs/backend/INITIAL_BACKEND.md

# 2. Generate comprehensive PRP
/generate-backend-prp docs/backend/INITIAL_BACKEND.md

# 3. Implement feature  
/execute-backend-prp docs/PRPs/generated/backend/feature-name.md

# 4. Validate implementation
python -c "import api; print('Backend imports successfully')"
```

## Integration Points

**Frontend Integration**:
- API contracts auto-documented via OpenAPI
- CORS configured for development
- Error responses standardized for frontend handling

**Infrastructure Integration**:
- AWS SDK clients for S3, DynamoDB, Bedrock
- Environment-based configuration
- Health checks and monitoring endpoints

**CleverDocs Mission Alignment**:
Every backend feature must support accelerating engineer onboarding through:
- Note → blog transformation APIs
- Multi-level content generation (beginner/intermediate/expert)
- Community knowledge sharing features
- AI-powered content processing

---

**For detailed implementation patterns, testing guidelines, and architectural decisions, see the comprehensive documentation in `docs/`.**