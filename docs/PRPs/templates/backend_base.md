---
name: "CleverDocs Backend PRP Template v2"
description: |
  Backend-focused PRP template for FastAPI + Python + AWS features in CleverDocs.
  Optimized for comprehensive context engineering with validation loops and research phases.
  Eliminates redundancy by referencing centralized documentation.
---

# CleverDocs Backend Feature Implementation PRP

## Core Principles

1. **Backend-Only Focus**: Single tier implementation - no frontend or infrastructure mixing
2. **Context is King**: All necessary documentation and patterns referenced, not duplicated
3. **Validation Loops**: Executable commands to verify implementation quality at each phase
4. **Progressive Success**: Start simple, validate, enhance with confidence
5. **CleverDocs Mission**: Every feature must accelerate engineer onboarding and knowledge sharing

---

## Goal

**Feature Name**: [Specific backend functionality to be built]

**Business Value**: [How this supports CleverDocs' mission of accelerating engineer onboarding through AI-powered content transformation - reference core features from README.md]

**API Contract**: [RESTful endpoints, request/response formats, authentication requirements]

## Why This Feature

- **User Impact**: [How this specifically accelerates engineer onboarding and knowledge sharing]
- **Technical Value**: [Integration with existing CleverDocs systems and architecture]
- **Mission Alignment**: [Reference specific core capabilities: note→blog transformation, multi-level content, AI integration, community features]

## What to Build

**API Endpoints**: [Specific REST endpoints with HTTP methods]
**Data Models**: [Pydantic models for validation and serialization]
**Business Logic**: [Core services and processing logic]
**Integration Points**: [AWS services, external APIs, database operations if needed]

### Success Criteria

- [ ] **API Contract**: All endpoints respond with correct HTTP status codes and formats
- [ ] **Input Validation**: All inputs validated with Pydantic models (zero unvalidated data)
- [ ] **Error Handling**: Comprehensive error handling with user-friendly messages
- [ ] **Documentation**: OpenAPI documentation auto-generated and accurate
- [ ] **Performance**: Response times < 200ms for simple operations, < 2s for complex AI operations
- [ ] **Security**: No credential exposure, proper input validation, HTTPS-ready
- [ ] **Testing**: Unit tests (3 per feature: expected, edge case, failure) and integration tests pass with >90% coverage
- [ ] **CleverDocs Alignment**: Feature demonstrably supports core mission and user workflows

## Testing Requirements

### **Every Feature MUST Have Tests**

1. **Unit Tests** (backend/tests/unit/):
   - One test for expected/happy path behavior
   - One test for edge cases (empty input, boundary values)
   - One test for failure cases (invalid input, service errors)
   - Mock all external dependencies

2. **Integration Tests** (backend/tests/integration/):
   - Test full API request/response cycle
   - Test with test database/services when applicable
   - Verify error responses and status codes

3. **Test Maintenance**:
   - After updating any logic, check and update affected tests
   - Tests must pass before marking feature complete
   - Maintain >90% code coverage for new code

## Essential Context References

### **Project Foundation (Read First)**

```yaml
# Core Project Understanding - MUST READ in order
- file: README.md
  why: CleverDocs purpose, key features, business context

- file: docs/CLAUDE.md
  why: Global AI agent rules and CleverDocs-specific behavioral requirements

- file: docs/CODEBASE_GUIDE.md
  section: "🌐 backend/ - FastAPI Server"
  why: Current backend state (✅ api.py vs 🔄 planned app/ structure)

- file: docs/development/CODING_STANDARDS.md
  section: "🐍 Backend Standards (FastAPI + Python)"
  why: Backend patterns, error handling, naming conventions

- file: docs/development/TESTING.md
  why: Comprehensive testing guidelines, 3-test pattern, coverage requirements

- file: docs/PRDs/CleverDocsPRD.md
  why: Detailed business requirements and user goals
```

### **Current Implementation State**

```yaml
# What Actually Exists vs What's Planned
- file: backend/api.py
  why: Current minimal FastAPI implementation - understand existing patterns

- file: backend/README.md
  why: Backend-specific setup and structure documentation
# Note: See docs/CODEBASE_GUIDE.md for full backend structure (current ✅ vs planned 🔄)
```

### **External Documentation & Patterns**

```yaml
# Official FastAPI & Python Documentation
- url: https://fastapi.tiangolo.com/async/
  section: Async patterns and dependency injection
  why: Async/await best practices for I/O operations

- url: https://docs.pydantic.dev/latest/concepts/models/
  section: Model validation and serialization
  why: Request/response validation patterns

- url: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html
  section: AWS SDK Python integration
  why: S3, DynamoDB, Bedrock client patterns (if AWS integration needed)

# CleverDocs-Specific AI Patterns (if AI integration needed)
- url: https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html
  section: Content generation with Bedrock
  why: Multi-level content generation (beginner/intermediate/expert)
```

## Implementation Architecture Decision

### **Structural Strategy** (Choose based on feature complexity)

**Option A: Extend Current Structure** (Simple features)

```python
# Extend backend/api.py directly
# Use for: Single endpoint, minimal business logic, MVP speed
# Pattern: Add routes to existing FastAPI app

@app.post("/api/new-feature")
async def new_feature_endpoint(request: FeatureRequest) -> FeatureResponse:
    # Implementation here
```

**Option B: Migrate to Full Structure** (Complex features)

```bash
# Implement planned backend/app/ structure
# Use for: Multiple endpoints, AWS integration, complex business logic
# See: docs/CODEBASE_GUIDE.md "Target Backend Structure (🔄 Migration Plan)"
```

**Document your choice with rationale.**

## CleverDocs-Specific Implementation Patterns

### **Testing Pattern Template**

```python
# Required testing pattern for every new feature
# File: backend/tests/unit/services/test_[feature_name]_service.py

import pytest
from unittest.mock import Mock, patch
from backend.app.services.[feature_name]_service import FeatureService

class TestFeatureService:
    """Test suite for [FeatureName]Service."""
    
    @pytest.fixture
    def service(self):
        """Create service instance with mocked dependencies."""
        return FeatureService()
    
    # Test 1: Expected use case
    async def test_process_valid_request_returns_success(self, service):
        # Arrange
        valid_data = {...}  # Valid input data
        expected_result = {...}  # Expected output
        
        # Act
        result = await service.process_request(valid_data)
        
        # Assert
        assert result == expected_result
    
    # Test 2: Edge case
    async def test_process_empty_input_returns_default(self, service):
        # Test boundary conditions, empty inputs, maximum values, etc.
        pass
    
    # Test 3: Failure case
    async def test_process_invalid_input_raises_error(self, service):
        # Test error handling, invalid inputs, service failures
        with pytest.raises(ValueError):
            await service.process_request(invalid_data)
```

### **Error Handling Template**

```python
# Required error handling pattern for CleverDocs
from fastapi import HTTPException
from pydantic import ValidationError
import logging

logger = logging.getLogger(__name__)

try:
    result = await service.process_request(validated_data)
    return {"status": "success", "data": result}
except ValidationError as e:
    logger.warning(f"Validation error: {e}")
    raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
except AIServiceError as e:
    logger.error(f"AI service failed: {e}")
    raise HTTPException(status_code=503, detail="Content generation temporarily unavailable")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise HTTPException(status_code=500, detail="Internal server error")
```

### **Multi-Level Content Pattern** (if AI feature)

```python
# CleverDocs expertise level pattern
EXPERTISE_LEVELS = ["beginner", "intermediate", "expert"]

class ContentRequest(BaseModel):
    content: str
    expertise_level: Literal["beginner", "intermediate", "expert"] = "intermediate"

async def generate_content_by_level(request: ContentRequest) -> ContentResponse:
    # Implementation using shared/prompts/ templates
```

## Progressive Implementation Blueprint

### **Phase 1: Data Models & Validation**

```bash
# Task 1.1: Create Pydantic models
CREATE backend/app/models/[feature_name].py:
- Define request/response models
- Add comprehensive validation rules
- Include docstrings for OpenAPI documentation

# Validation Command:
python -c "from backend.app.models.[feature_name] import *; print('Models import successfully')"
```

### **Phase 2: API Endpoint Implementation**

```bash
# Task 2.1: Implement API routes
MODIFY/CREATE backend/api.py OR backend/app/api/[feature_name].py:
- Implement async endpoint functions
- Use dependency injection for services
- Add comprehensive error handling

# Validation Command:
cd backend && python -m uvicorn api:app --reload &
sleep 2
curl -X GET http://localhost:8000/docs  # Check OpenAPI docs generated
curl -X POST http://localhost:8000/api/[endpoint] -H "Content-Type: application/json" -d '{"test": "data"}'
kill %1
```

### **Phase 3: Business Logic Services**

```bash
# Task 3.1: Implement service layer
CREATE backend/app/services/[feature_name]_service.py:
- Implement core business logic
- Handle AWS service integration (if needed)
- Add logging and monitoring

# Validation Command:
python -c "from backend.app.services.[feature_name]_service import *; print('Service imports successfully')"
```

### **Phase 4: Comprehensive Testing**

```bash
# Task 4.1: Create unit tests for services
CREATE backend/tests/unit/services/test_[feature_name]_service.py:
- Test expected use cases (happy path)
- Test edge cases (boundary conditions, empty inputs)
- Test failure cases (invalid inputs, service errors)
- Mock external dependencies (AWS services, APIs)

# Task 4.2: Create integration tests for API endpoints
CREATE backend/tests/integration/api/test_[feature_name].py:
- Test full request/response cycle
- Test authentication and authorization
- Test error handling and status codes
- Test with real test database (if applicable)

# Task 4.3: Update existing tests affected by new feature
UPDATE backend/tests/**/*.py:
- Review and update any existing tests that may be affected
- Ensure all tests still pass after feature implementation

# Validation Commands:
cd backend
# Run unit tests
python -m pytest tests/unit/services/test_[feature_name]_service.py -v
# Run integration tests
python -m pytest tests/integration/api/test_[feature_name].py -v
# Run all tests with coverage
python -m pytest tests/ --cov=app --cov-report=term-missing --cov-fail-under=90
# Run only the new feature tests
python -m pytest tests/ -k "[feature_name]" -v
```

### **Phase 5: Test-Driven Refinement**

```bash
# Task 5.1: Ensure test quality
# Check test coverage for new code
python -m pytest tests/ --cov=app/services/[feature_name]_service --cov=app/api/[feature_name] --cov-report=term-missing

# Run mutation testing to verify test effectiveness
python -m mutmut run --paths-to-mutate=backend/app/services/[feature_name]_service.py

# Task 5.2: Performance testing
CREATE backend/tests/performance/test_[feature_name]_performance.py:
- Benchmark response times
- Test under load conditions
- Verify performance requirements met

python -m pytest tests/performance/test_[feature_name]_performance.py --benchmark-only
```

### **Phase 6: Performance & Security Validation**

```bash
# Performance validation
python -m pytest tests/performance/ -v --benchmark-only

# Security validation
python -m bandit -r backend/app/
python -m safety check

# Type checking (if using mypy)
python -m mypy backend/app/ --ignore-missing-imports
```

## Integration Readiness Checklist

### **Frontend Integration**

- [ ] OpenAPI spec available at `/docs` endpoint for API client generation
- [ ] Error response formats standardized for frontend error handling
- [ ] CORS configured for frontend development
- [ ] Response schemas optimized for frontend consumption

### **Infrastructure Integration**

- [ ] Environment variables documented for configuration
- [ ] AWS service requirements documented (DynamoDB tables, S3 buckets, etc.)
- [ ] Database schema requirements specified
- [ ] Deployment configuration ready

### **Monitoring & Observability**

- [ ] Structured logging implemented
- [ ] Health check endpoint available
- [ ] Error tracking configured
- [ ] Performance metrics captured

## Quality Assurance Validation

### **Functional Validation**

```bash
# End-to-end API testing
python scripts/test_api_endpoints.py --feature=[feature_name]

# Load testing (for production readiness)
locust -f tests/load/test_[feature_name]_load.py --host=http://localhost:8000
```

### **Code Quality Validation**

```bash
# Code formatting
python -m black backend/ --check
python -m isort backend/ --check-only

# Linting
python -m flake8 backend/
python -m pylint backend/app/

# Test code quality
python -m flake8 backend/tests/
python -m black backend/tests/ --check
```

### **Security Validation**

```bash
# Dependency vulnerability check
python -m safety check

# Static security analysis
python -m bandit -r backend/app/

# Secrets detection
git secrets --scan backend/
```

## Success Confirmation Protocol

Before marking this backend feature as complete, verify:

- [ ] **Mission Alignment**: Feature demonstrably supports CleverDocs' core goal of accelerating engineer onboarding
- [ ] **Performance**: All response times meet requirements (< 200ms simple, < 2s complex)
- [ ] **Security**: No security vulnerabilities detected, all inputs validated
- [ ] **Quality**: Code coverage >90%, all linting passes, all tests follow 3-test pattern
- [ ] **Integration**: API contracts defined and tested for frontend consumption
- [ ] **Documentation**: OpenAPI docs accurate and comprehensive
- [ ] **Error Handling**: All error scenarios handled gracefully with user-friendly messages
- [ ] **Monitoring**: Structured logging and health checks implemented

## Implementation Confidence Score

Rate this PRP on implementation success probability (1-10):

- **Context Completeness** (8-10): All necessary docs referenced, no missing context
- **Technical Clarity** (8-10): Implementation steps specific and actionable
- **Validation Thoroughness** (8-10): Comprehensive testing and quality checks
- **CleverDocs Alignment** (8-10): Feature clearly supports core mission
- **Error Prevention** (8-10): Common pitfalls identified and addressed

**Target: 8-10 overall** for high confidence in bug-free, efficient implementation.

---

**Note**: This template eliminates redundancy by referencing centralized documentation instead of duplicating information. All file structure, naming conventions, and architectural details are maintained in their authoritative locations (`docs/CODEBASE_GUIDE.md`, `docs/CLAUDE.md`, etc.)
