---
name: "CleverDocs Backend PRP Template v1"
description: |
  Backend-focused PRP template for FastAPI + Python + AWS features in CleverDocs.
  Optimized for tier-specific development with comprehensive validation loops.
---

# CleverDocs Backend Feature Implementation PRP

## Core Principles (Reference: `docs/CLAUDE.md`)

1. **Backend-Only Focus**: Single tier implementation - no frontend or infrastructure mixing
2. **Context is King**: All necessary documentation and patterns included
3. **Validation Loops**: Executable commands to verify implementation quality
4. **Progressive Success**: Start simple, validate, enhance
5. **API-First**: Define OpenAPI contracts before implementation

---

## Goal

**Feature Name**: [What backend functionality needs to be built]

**Business Value**: [How this supports CleverDocs mission - reference `README.md` and `docs/PRDs/CleverDocsPRD.md`]

**API Contract**: [RESTful endpoints, request/response formats, authentication requirements]

## Why This Feature

- **User Impact**: [How this accelerates engineer onboarding and knowledge sharing]
- **Technical Value**: [Integration with existing CleverDocs backend systems]
- **CleverDocs Mission**: [Reference core features: note→blog transformation, multi-level content, AI integration]

## What to Build

**Endpoints**: [Specific REST API endpoints to implement]
**Data Models**: [Pydantic models for request/response validation]
**Business Logic**: [Core services and processing]
**Integration**: [AWS services, external APIs, database operations]

### Success Criteria

- [ ] API endpoints respond with correct HTTP status codes and formats
- [ ] All inputs validated with Pydantic models (no unvalidated data)
- [ ] Comprehensive error handling with user-friendly messages
- [ ] OpenAPI documentation auto-generated and accurate
- [ ] Performance meets requirements (< 200ms for simple queries)
- [ ] Security validated (no credential exposure, proper input validation)
- [ ] Tests pass (unit tests + integration tests)
- [ ] Aligns with CleverDocs content generation and onboarding goals

## All Needed Context

### **MUST READ First** (Context Files)

```yaml
# Project Context & Rules
- file: docs/CLAUDE.md
  why: Global AI agent rules and CleverDocs-specific requirements

- file: docs/CODEBASE_GUIDE.md
  why: Current backend state (✅ api.py exists, 🔄 app/ structure planned)

- file: docs/development/CODING_STANDARDS.md
  why: Backend patterns, naming conventions, implementation templates

- file: README.md
  why: CleverDocs purpose, key features, business context

- file: docs/PRDs/CleverDocsPRD.md
  why: Detailed business requirements and user goals

- file: backend/README.md
  why: Current backend structure and planned organization
```

### **FastAPI + Python Documentation**

```yaml
# External Documentation (official sources)
- url: https://fastapi.tiangolo.com/async/
  section: Async patterns and dependency injection
  why: FastAPI best practices for async I/O operations

- url: https://docs.pydantic.dev/latest/
  section: Models and validation
  why: Request/response validation patterns

- url: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html
  section: AWS SDK Python integration
  why: S3, DynamoDB, Bedrock client patterns (if AWS integration needed)
```

### Current Backend State (✅ What Actually Exists)

```python
# backend/api.py - Current implementation ✅
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# Commented out routes (planned):
# - GET /blogs
# - GET /blogs/{blog_id}
# - POST /blogs
# - PUT /blogs/{blog_id}
# - DELETE /blogs/{blog_id}
```

### Target Backend Structure (🔄 Migration Plan)

```bash
# Planned structure from docs/CODEBASE_GUIDE.md
backend/
├── app/                        # 🔄 PLANNED - FastAPI app package
│   ├── api/                    # 🔄 PLANNED - Route handlers
│   │   └── [feature_name].py   # 🔄 TO BE CREATED
│   ├── services/               # 🔄 PLANNED - Business logic
│   │   └── [feature_name]_service.py  # 🔄 TO BE CREATED
│   ├── models/                 # 🔄 PLANNED - Pydantic models
│   │   └── [feature_name].py   # 🔄 TO BE CREATED
│   ├── clients/                # 🔄 PLANNED - AWS service clients
│   │   └── [aws_service].py    # 🔄 TO BE CREATED (if needed)
│   ├── core/                   # 🔄 PLANNED - Config, security, dependencies
│   │   ├── config.py           # 🔄 TO BE CREATED
│   │   └── dependencies.py     # 🔄 TO BE CREATED
│   └── main.py                 # 🔄 TO BE CREATED - New FastAPI entry point
├── tests/                      # 🔄 PLANNED - Test suite
│   ├── api/                    # 🔄 TO BE CREATED
│   └── services/               # 🔄 TO BE CREATED
├── api.py                      # ✅ EXISTS - Current basic FastAPI app
├── .gitignore                  # ✅ EXISTS
└── README.md                   # ✅ EXISTS
```

### Critical Implementation Notes

```python
# IMPORTANT: Current vs Planned Structure Decision
#
# Option 1: Extend current api.py (for simple features)
# - Add routes directly to existing api.py
# - Keep single-file approach for MVP
#
# Option 2: Migrate to app/ structure (for complex features)
# - Create backend/app/ package structure
# - Move existing routes to new structure
# - Set up proper FastAPI application factory

# CleverDocs-Specific Patterns (from docs/development/CODING_STANDARDS.md)
EXPERTISE_LEVELS = ["beginner", "intermediate", "expert"]

# Error handling pattern for CleverDocs
try:
    result = await service.process_content(data)
    return {"status": "success", "data": result}
except ValidationError as e:
    raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
except AIServiceError as e:
    logger.error(f"AI service failed: {e}")
    raise HTTPException(status_code=503, detail="Content generation temporarily unavailable")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise HTTPException(status_code=500, detail="Internal server error")
```

## Implementation Blueprint

### **Phase 1: API Contract Definition**

**Rationale**: API-first development ensures frontend integration clarity

#### Task 1.1: Define OpenAPI Specification

```yaml
# Create or update OpenAPI spec for new endpoints
# Location: backend/openapi/[feature_name].yaml (or inline in FastAPI)

paths:
  /api/[feature_name]:
    post:
      summary: [Brief description]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/[FeatureName]Request"
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/[FeatureName]Response"
        400:
          description: Validation error
        500:
          description: Server error
```

#### Task 1.2: Create Pydantic Models

```python
# File: backend/app/models/[feature_name].py (or add to api.py for simple features)
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class [FeatureName]Request(BaseModel):
    """Request model for [feature description]"""
    title: str = Field(..., min_length=3, max_length=200, description="Feature title")
    content: str = Field(..., min_length=10, description="Feature content")
    # Add CleverDocs-specific fields
    expertise_level: str = Field(..., regex="^(beginner|intermediate|expert)$")

    @validator('title')
    def validate_title(cls, v):
        # Custom validation logic
        return v.strip()

class [FeatureName]Response(BaseModel):
    """Response model for [feature description]"""
    id: str
    title: str
    content: str
    expertise_level: str
    created_at: datetime
    # Add CleverDocs-specific response fields

# Validation Command
cd backend && python -c "from app.models.[feature_name] import *; print('✅ Models valid')"
```

### **Phase 2: Business Logic Implementation**

**Rationale**: Core logic before API routes ensures separation of concerns

#### Task 2.1: Create Service Layer

```python
# File: backend/app/services/[feature_name]_service.py
from typing import List, Optional
from app.models.[feature_name] import [FeatureName]Request, [FeatureName]Response
# Import AWS clients if needed (reference docs/development/CODING_STANDARDS.md)

class [FeatureName]Service:
    """Business logic for [feature description]"""

    def __init__(self, db_client=None, ai_client=None):
        self.db = db_client  # DynamoDB, PostgreSQL, etc.
        self.ai = ai_client  # AWS Bedrock for CleverDocs AI features

    async def create_[feature_name](self, request: [FeatureName]Request, user_id: str) -> [FeatureName]Response:
        """
        Create new [feature] with validation and processing

        Args:
            request: Validated request data
            user_id: Current user identifier

        Returns:
            [FeatureName]Response: Created feature data

        Raises:
            ValueError: Invalid input data
            AIServiceError: AI processing failure (for CleverDocs AI features)
        """
        try:
            # Implement business logic
            # - Validate business rules
            # - Process data
            # - Store in database
            # - Generate AI content if needed (CleverDocs specific)

            return [FeatureName]Response(...)

        except Exception as e:
            logger.error(f"Service error in create_[feature_name]: {e}")
            raise ValueError(f"Failed to create [feature]: {str(e)}")

# Validation Command
cd backend && python -c "from app.services.[feature_name]_service import [FeatureName]Service; print('✅ Service valid')"
```

#### Task 2.2: Add AWS Integration (if needed)

```python
# File: backend/app/clients/[aws_service].py (if AWS integration required)
import boto3
from botocore.exceptions import ClientError
from tenacity import retry, stop_after_attempt, wait_exponential
import logging

logger = logging.getLogger(__name__)

class [AWSService]Client:
    """AWS [service] client for CleverDocs backend"""

    def __init__(self, region_name: str = "us-west-2"):
        self.client = boto3.client('[service_name]', region_name=region_name)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def [operation_name](self, params: dict) -> dict:
        """[Operation description]"""
        try:
            response = self.client.[operation](params)
            logger.info(f"AWS [service] operation successful")
            return response
        except ClientError as e:
            logger.error(f"AWS [service] error: {e}")
            raise

# Validation Command
cd backend && python -c "from app.clients.[aws_service] import [AWSService]Client; print('✅ AWS client valid')"
```

### **Phase 3: API Route Implementation**

**Rationale**: Routes built on validated business logic and models

#### Task 3.1: Create FastAPI Routes

```python
# Option A: Add to existing api.py (for simple features)
# Option B: Create backend/app/api/[feature_name].py (for complex features)

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.models.[feature_name] import [FeatureName]Request, [FeatureName]Response
from app.services.[feature_name]_service import [FeatureName]Service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/[feature_name]", tags=["[feature_name]"])

@router.post("/", response_model=[FeatureName]Response, status_code=201)
async def create_[feature_name](
    request: [FeatureName]Request,
    background_tasks: BackgroundTasks,
    # Add authentication dependency when ready
    # current_user: str = Depends(get_current_user),
    service: [FeatureName]Service = Depends(get_[feature_name]_service)
):
    """
    Create new [feature]

    - **request**: [Feature] data with validation
    - **Returns**: Created [feature] with generated ID

    Supports CleverDocs core features:
    - Multi-level expertise content generation
    - AI-powered content transformation
    """
    try:
        # For now, use placeholder user_id (replace with auth when ready)
        user_id = "user_123"  # TODO: Replace with actual authentication

        result = await service.create_[feature_name](request, user_id)

        # Add background tasks if needed (AI processing, notifications, etc.)
        # background_tasks.add_task(process_[feature_name]_async, result.id)

        return result

    except ValueError as e:
        logger.warning(f"Validation error in create_[feature_name]: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in create_[feature_name]: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Dependency injection function
async def get_[feature_name]_service() -> [FeatureName]Service:
    """Dependency injection for [FeatureName]Service"""
    # Initialize with required clients
    return [FeatureName]Service()

# Add router to main app (in api.py or app/main.py)
# app.include_router(router)
```

#### Task 3.2: Update Main Application

```python
# Update backend/api.py (current approach) or create backend/app/main.py (new structure)

# Current api.py approach:
from fastapi import FastAPI
# Import your new router
# from .api.[feature_name] import router as [feature_name]_router

app = FastAPI(
    title="CleverDocs API",
    description="AI-powered platform for transforming notes into polished tech blogs",
    version="1.0.0"
)

# Include your router
# app.include_router([feature_name]_router)

@app.get("/")
def read_root():
    return {"message": "CleverDocs API - Accelerating engineer onboarding through AI-powered knowledge sharing"}
```

### **Phase 4: Testing Implementation**

**Rationale**: Comprehensive testing ensures reliability and prevents regressions

#### Task 4.1: Unit Tests

```python
# File: backend/tests/services/test_[feature_name]_service.py
import pytest
from unittest.mock import Mock, AsyncMock
from app.services.[feature_name]_service import [FeatureName]Service
from app.models.[feature_name] import [FeatureName]Request

class Test[FeatureName]Service:
    """Unit tests for [FeatureName]Service"""

    @pytest.fixture
    def service(self):
        """Create service instance with mocked dependencies"""
        mock_db = Mock()
        mock_ai = Mock()
        return [FeatureName]Service(db_client=mock_db, ai_client=mock_ai)

    @pytest.fixture
    def valid_request(self):
        """Valid request data for testing"""
        return [FeatureName]Request(
            title="Test Feature",
            content="Test content for CleverDocs feature",
            expertise_level="intermediate"
        )

    @pytest.mark.asyncio
    async def test_create_[feature_name]_success(self, service, valid_request):
        """Test successful [feature] creation"""
        user_id = "test_user_123"

        result = await service.create_[feature_name](valid_request, user_id)

        assert result.title == valid_request.title
        assert result.expertise_level == valid_request.expertise_level
        assert result.id is not None

    @pytest.mark.asyncio
    async def test_create_[feature_name]_invalid_data(self, service):
        """Test [feature] creation with invalid data"""
        invalid_request = [FeatureName]Request(
            title="",  # Invalid: too short
            content="Test content",
            expertise_level="invalid_level"  # Invalid: not in allowed values
        )

        with pytest.raises(ValueError):
            await service.create_[feature_name](invalid_request, "user_123")

# Validation Command
cd backend && python -m pytest tests/services/test_[feature_name]_service.py -v
```

#### Task 4.2: API Integration Tests

```python
# File: backend/tests/api/test_[feature_name]_api.py
import pytest
from fastapi.testclient import TestClient
from backend.api import app  # or from backend.app.main import app

client = TestClient(app)

class Test[FeatureName]API:
    """Integration tests for [feature_name] API endpoints"""

    def test_create_[feature_name]_success(self):
        """Test successful API call to create [feature]"""
        request_data = {
            "title": "Test Feature via API",
            "content": "Test content for CleverDocs API integration",
            "expertise_level": "beginner"
        }

        response = client.post("/api/[feature_name]/", json=request_data)

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == request_data["title"]
        assert data["id"] is not None

    def test_create_[feature_name]_validation_error(self):
        """Test API validation error handling"""
        invalid_data = {
            "title": "",  # Invalid: empty title
            "content": "Test content",
            "expertise_level": "invalid"  # Invalid level
        }

        response = client.post("/api/[feature_name]/", json=invalid_data)

        assert response.status_code == 422  # Pydantic validation error

    def test_create_[feature_name]_missing_field(self):
        """Test API with missing required fields"""
        incomplete_data = {
            "title": "Test Feature"
            # Missing content and expertise_level
        }

        response = client.post("/api/[feature_name]/", json=incomplete_data)

        assert response.status_code == 422

# Validation Command
cd backend && python -m pytest tests/api/test_[feature_name]_api.py -v
```

## Final Validation Loop

### **Level 1: Code Quality & Syntax**

```bash
# Run in backend/ directory - ALL must pass before proceeding

# Python syntax and import validation
python -c "from app.models.[feature_name] import *; print('✅ Models import successfully')"
python -c "from app.services.[feature_name]_service import *; print('✅ Service imports successfully')"

# Type checking (if using mypy)
# mypy app/models/[feature_name].py
# mypy app/services/[feature_name]_service.py

# Code formatting (if using black)
# black app/models/[feature_name].py app/services/[feature_name]_service.py
```

### **Level 2: Unit & Integration Tests**

```bash
# All tests must pass - fix any failures before proceeding

# Unit tests
python -m pytest tests/services/test_[feature_name]_service.py -v

# API integration tests
python -m pytest tests/api/test_[feature_name]_api.py -v

# Coverage check (optional but recommended)
python -m pytest tests/ --cov=app --cov-report=term-missing
```

### **Level 3: API Functionality**

```bash
# Start the development server
python -m uvicorn api:app --reload  # Current structure
# OR python -m uvicorn app.main:app --reload  # New structure

# Manual API testing (replace with actual endpoint)
curl -X POST http://localhost:8000/api/[feature_name] \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Feature",
    "content": "Test content for manual validation",
    "expertise_level": "intermediate"
  }'

# Expected: HTTP 201 with valid JSON response
# Expected: Proper error handling for invalid requests
```

### **Level 4: CleverDocs Mission Alignment**

```bash
# Verify the feature supports core CleverDocs goals:

✅ Accelerates engineer onboarding (how does this feature help?)
✅ Supports knowledge sharing (enables content creation/discovery?)
✅ AI-powered content transformation (integrates with content generation?)
✅ Multi-level expertise support (beginner/intermediate/expert variants?)
✅ Secure and performant (< 200ms response time, proper validation?)
```

## Success Confirmation Checklist

Before marking this backend feature as complete:

- [ ] **Business Alignment**: Feature supports CleverDocs mission from `README.md` and PRD
- [ ] **API Contract**: OpenAPI documentation auto-generated and accurate
- [ ] **Data Validation**: All inputs validated with Pydantic models
- [ ] **Error Handling**: Comprehensive error handling with user-friendly messages
- [ ] **Testing**: Unit tests and integration tests pass
- [ ] **Performance**: API responses < 200ms for simple operations
- [ ] **Security**: No credential exposure, proper input validation
- [ ] **Code Quality**: Follows patterns from `docs/development/CODING_STANDARDS.md`
- [ ] **Documentation**: Code is well-documented with docstrings
- [ ] **Integration Ready**: API contracts defined for frontend consumption

## Cross-Tier Integration Notes

**For Frontend Integration** (future implementation):

- OpenAPI spec available at `/docs` endpoint for frontend API client generation
- Error response formats standardized for frontend error handling
- Authentication hooks prepared (placeholder for now)

**For Infrastructure Integration** (future implementation):

- Database requirements documented (DynamoDB tables, indexes needed)
- AWS service requirements documented (S3, Bedrock, Lambda if needed)
- Environment variables documented for configuration

**API Contract Sharing**:

- Consider adding response schemas to `shared/types/` for frontend TypeScript generation
- Document any new shared constants or enums needed across tiers

---

**This PRP ensures backend features are built with quality, security, and integration readiness while staying focused on CleverDocs' core mission of accelerating engineer onboarding through AI-powered knowledge sharing.**
