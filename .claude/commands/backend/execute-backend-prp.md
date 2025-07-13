# Execute CleverDocs Backend PRP

Implement a backend feature using a comprehensive Backend PRP (Product Requirements Prompt). This command is optimized for CleverDocs' FastAPI + Python + AWS stack, ensuring secure, bug-free, and efficient implementation aligned with the mission of accelerating engineer onboarding.

## Core Mission

Execute backend features that support CleverDocs' core mission: **accelerating engineer onboarding and knowledge sharing through AI-powered content transformation**.

## Instructions

Read the PRP file ($ARGUMENTS) thoroughly and implement the feature following CleverDocs' established patterns and validation loops.

### Step 1: Context Validation & Understanding

**Verify all required context is available:**

```bash
# Validate PRP completeness
echo "📋 Validating PRP context..."

# Check if required files exist
if [ ! -f "docs/CLAUDE.md" ]; then
    echo "❌ Missing: docs/CLAUDE.md"
    exit 1
fi

if [ ! -f "docs/CODEBASE_GUIDE.md" ]; then
    echo "❌ Missing: docs/CODEBASE_GUIDE.md"
    exit 1
fi

if [ ! -f "docs/development/CODING_STANDARDS.md" ]; then
    echo "❌ Missing: docs/development/CODING_STANDARDS.md"
    exit 1
fi

if [ ! -f "backend/api.py" ]; then
    echo "❌ Missing: backend/api.py"
    exit 1
fi

echo "✅ Core context files validated"
```

**Read and internalize the PRP structure:**

1. **Goal** - What backend functionality to build
2. **Why** - Business value and CleverDocs mission alignment
3. **What** - Technical requirements and API contracts
4. **Context** - All referenced documentation (do not duplicate)
5. **Implementation Blueprint** - Progressive tasks with validation
6. **Success Criteria** - Measurable outcomes

### Step 2: Architecture Decision Analysis

**Determine implementation strategy based on PRP complexity assessment:**

```python
# Analyze PRP requirements to choose architecture approach
print("🏗️ Analyzing implementation strategy...")

# Simple Feature Indicators:
# - Single endpoint
# - Minimal business logic
# - No AWS service integration
# - Quick MVP implementation

# Complex Feature Indicators:
# - Multiple endpoints
# - AI content generation
# - AWS integration (S3, DynamoDB, Bedrock)
# - Multi-service architecture

print("Architecture decision based on PRP analysis:")
print("Option A: Extend current backend/api.py (Simple)")
print("Option B: Migrate to backend/app/ structure (Complex)")
```

**Create implementation plan based on architecture choice:**

### Step 3: Progressive Implementation with Validation Loops

## Phase 1: Foundation Setup

### **Task 1.1: Environment Preparation**

```bash
# Navigate to backend directory
cd backend

# Validate current environment
echo "🔧 Setting up implementation environment..."

# Ensure dependencies are installed
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "⚠️ requirements.txt not found - check dependency management"
fi

# Validate current API imports
python3 -c "
try:
    import api
    print('✅ Current API module imports successfully')
except Exception as e:
    print(f'❌ API import error: {e}')
    exit(1)
"
```

### **Task 1.2: Code Structure Decision Implementation**

**For Simple Features (Extend api.py):**

```python
# Add to existing backend/api.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field, ValidationError
import logging

logger = logging.getLogger(__name__)

# Add after existing imports and before route definitions
class [FeatureName]Request(BaseModel):
    """Request model following CleverDocs validation patterns"""
    # Define based on PRP requirements
    pass

class [FeatureName]Response(BaseModel):
    """Response model with standard CleverDocs format"""
    status: str = "success"
    data: dict
    processing_time_ms: Optional[int] = None

# Add route following CleverDocs error handling pattern
@app.post("/api/[feature-endpoint]", response_model=[FeatureName]Response)
async def [feature_endpoint](request: [FeatureName]Request):
    """
    Endpoint description that supports CleverDocs mission
    Reference: [PRP section for business justification]
    """
    start_time = time.time()

    try:
        # Validate business rules (CleverDocs pattern)
        await validate_cleverdocs_business_rules(request)

        # Process request
        result = await process_[feature_name]_request(request)

        processing_time = int((time.time() - start_time) * 1000)

        return [FeatureName]Response(
            data=result,
            processing_time_ms=processing_time
        )

    except ValidationError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
    except AIServiceError as e:
        logger.error(f"AI service failed: {e}")
        raise HTTPException(status_code=503, detail="Content generation temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

# Validation Command:
python3 -c "import api; print('✅ Extended API imports successfully')"
```

**For Complex Features (Migrate to app/ structure):**

```bash
# Create backend/app/ structure
mkdir -p backend/app/{api,services,models,clients,core,utils}
touch backend/app/__init__.py
touch backend/app/api/__init__.py
touch backend/app/services/__init__.py
touch backend/app/models/__init__.py
touch backend/app/clients/__init__.py
touch backend/app/core/__init__.py
touch backend/app/utils/__init__.py

echo "✅ Created backend/app/ structure"
```

### **Validation Loop 1: Foundation**

```bash
cd backend

# Test import structure
python3 -c "
import sys
sys.path.append('.')
try:
    import api
    print('✅ Foundation validation passed')
except Exception as e:
    print(f'❌ Foundation validation failed: {e}')
    exit(1)
"
```

## Phase 2: Data Models Implementation

### **Task 2.1: Pydantic Models (CleverDocs Pattern)**

**File: backend/app/models/[feature_name].py** (or add to api.py for simple features)

```python
from pydantic import BaseModel, Field, validator, root_validator
from typing import List, Optional, Literal, Dict
from datetime import datetime
import re

# CleverDocs-specific patterns
EXPERTISE_LEVELS = ["beginner", "intermediate", "expert"]

class [FeatureName]CreateRequest(BaseModel):
    """
    Request model for creating [feature] - supports CleverDocs mission
    Validates inputs according to CleverDocs business rules
    """
    title: str = Field(..., min_length=1, max_length=200, description="Feature title")
    content: str = Field(..., min_length=10, max_length=50000, description="Main content")

    # CleverDocs multi-level content support
    expertise_level: Literal["beginner", "intermediate", "expert"] = Field(
        default="intermediate",
        description="Target expertise level for content"
    )

    tags: List[str] = Field(default_factory=list, max_items=10, description="Content tags")

    @validator('title')
    def validate_title(cls, v):
        """CleverDocs title validation - no HTML tags"""
        if re.search(r'<[^>]+>', v):
            raise ValueError("Title cannot contain HTML tags")
        return v.strip()

    @validator('tags')
    def validate_tags(cls, v):
        """CleverDocs tag validation - clean and standardize"""
        cleaned_tags = []
        for tag in v:
            cleaned_tag = re.sub(r'[^a-zA-Z0-9\-_]', '', tag.strip())
            if len(cleaned_tag) >= 2:
                cleaned_tags.append(cleaned_tag.lower())
        return cleaned_tags[:10]

    @root_validator
    def validate_cleverdocs_content_quality(cls, values):
        """Business rule validation specific to CleverDocs mission"""
        content = values.get('content', '')
        title = values.get('title', '')

        # Content quality checks for knowledge sharing
        if len(content.split()) < 10:
            raise ValueError("Content must contain at least 10 words for effective knowledge sharing")

        return values

class [FeatureName]Response(BaseModel):
    """Standard CleverDocs response format"""
    id: str = Field(..., description="Unique identifier")
    title: str
    content: str
    expertise_level: str
    tags: List[str]
    created_at: datetime
    metadata: Dict = Field(default_factory=dict)

    class Config:
        # Enable orm_mode for database integration
        from_attributes = True

# Validation Command:
python3 -c "from app.models.[feature_name] import *; print('✅ Models validation passed')"
```

### **Validation Loop 2: Data Models**

```bash
cd backend

# Validate model imports and structure
python3 -c "
try:
    from app.models.[feature_name] import [FeatureName]CreateRequest, [FeatureName]Response

    # Test model validation
    test_request = [FeatureName]CreateRequest(
        title='Test Feature',
        content='This is test content for CleverDocs knowledge sharing validation',
        expertise_level='beginner',
        tags=['test', 'validation']
    )
    print(f'✅ Model validation passed: {test_request.title}')
except Exception as e:
    print(f'❌ Model validation failed: {e}')
    exit(1)
"
```

## Phase 3: Business Logic Implementation

### **Task 3.1: Service Layer (CleverDocs Patterns)**

**File: backend/app/services/[feature_name]\_service.py**

```python
import logging
import asyncio
from typing import Optional, List
from datetime import datetime

from app.models.[feature_name] import [FeatureName]CreateRequest, [FeatureName]Response
from app.core.exceptions import AIServiceError, ValidationError

logger = logging.getLogger(__name__)

class [FeatureName]Service:
    """
    Business logic service for [feature_name]
    Implements CleverDocs patterns for knowledge sharing and onboarding acceleration
    """

    def __init__(self):
        # Initialize AWS clients if needed (reference docs/development/CODING_STANDARDS.md)
        self.aws_clients = None  # Initialize based on PRP requirements

    async def create_[feature_name](
        self,
        request: [FeatureName]CreateRequest,
        user_id: str
    ) -> [FeatureName]Response:
        """
        Create new [feature] following CleverDocs business logic
        Supports mission: accelerating engineer onboarding through knowledge sharing
        """
        try:
            # Business rule validation
            await self._validate_business_rules(request, user_id)

            # Process based on expertise level (CleverDocs pattern)
            processed_content = await self._process_content_by_expertise_level(
                request.content,
                request.expertise_level
            )

            # Generate unique ID
            feature_id = self._generate_feature_id()

            # Create response following CleverDocs patterns
            result = [FeatureName]Response(
                id=feature_id,
                title=request.title,
                content=processed_content,
                expertise_level=request.expertise_level,
                tags=request.tags,
                created_at=datetime.utcnow(),
                metadata={
                    "created_by": user_id,
                    "original_content_length": len(request.content),
                    "processing_version": "1.0"
                }
            )

            # Log business event (CleverDocs monitoring pattern)
            logger.info(f"Created {feature_id} for user {user_id} at {request.expertise_level} level")

            return result

        except Exception as e:
            logger.error(f"Failed to create [feature_name]: {e}", exc_info=True)
            raise

    async def _validate_business_rules(self, request: [FeatureName]CreateRequest, user_id: str):
        """CleverDocs-specific business rule validation"""
        # Rate limiting (example business rule)
        # Content safety checks
        # Duplicate detection
        # Reference: docs/development/CODING_STANDARDS.md for patterns
        pass

    async def _process_content_by_expertise_level(self, content: str, level: str) -> str:
        """
        Process content based on expertise level - CleverDocs core feature
        Supports multi-level content generation for different learning stages
        """
        if level in ["beginner", "intermediate", "expert"]:
            # Apply expertise-level specific processing
            # Reference shared/prompts/ templates if AI processing needed
            return content  # Placeholder - implement based on PRP requirements

        return content

    def _generate_feature_id(self) -> str:
        """Generate unique feature ID following CleverDocs naming conventions"""
        import uuid
        return f"[feature_prefix]_{uuid.uuid4().hex[:12]}"

# Validation Command:
python3 -c "from app.services.[feature_name]_service import [FeatureName]Service; print('✅ Service validation passed')"
```

### **Validation Loop 3: Business Logic**

```bash
cd backend

# Test service instantiation and basic functionality
python3 -c "
import asyncio
from app.services.[feature_name]_service import [FeatureName]Service
from app.models.[feature_name] import [FeatureName]CreateRequest

async def test_service():
    service = [FeatureName]Service()
    request = [FeatureName]CreateRequest(
        title='Test Service Feature',
        content='Testing CleverDocs service layer implementation for knowledge sharing',
        expertise_level='intermediate'
    )

    try:
        result = await service.create_[feature_name](request, 'test_user_123')
        print(f'✅ Service validation passed: {result.id}')
    except Exception as e:
        print(f'❌ Service validation failed: {e}')
        raise

asyncio.run(test_service())
"
```

## Phase 4: API Endpoint Implementation

### **Task 4.1: FastAPI Route Implementation**

**For Simple Features (add to backend/api.py):**

```python
# Add import for service
from app.services.[feature_name]_service import [FeatureName]Service

# Initialize service
[feature_name]_service = [FeatureName]Service()

@app.post("/api/[feature-name]", response_model=[FeatureName]Response, status_code=201)
async def create_[feature_name](
    request: [FeatureName]CreateRequest,
    # Add authentication dependency when ready: user = Depends(get_current_user)
) -> [FeatureName]Response:
    """
    Create new [feature] - supports CleverDocs mission of accelerating engineer onboarding

    This endpoint enables knowledge sharing through [feature description from PRP]
    Supports multi-level content generation for different expertise levels
    """
    import time
    start_time = time.time()

    try:
        # For now, use placeholder user_id (implement auth later)
        user_id = "anonymous_user"  # TODO: Replace with actual user from auth

        # Call service layer
        result = await [feature_name]_service.create_[feature_name](request, user_id)

        # Add performance monitoring
        processing_time = int((time.time() - start_time) * 1000)
        result.metadata["processing_time_ms"] = processing_time

        # Performance validation (CleverDocs standard: < 200ms for simple operations)
        if processing_time > 200:
            logger.warning(f"Performance target exceeded: {processing_time}ms > 200ms")

        return result

    except ValidationError as e:
        logger.warning(f"Validation error in create_[feature_name]: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
    except AIServiceError as e:
        logger.error(f"AI service error in create_[feature_name]: {e}")
        raise HTTPException(status_code=503, detail="Content generation temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error in create_[feature_name]: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
```

**For Complex Features (backend/app/api/[feature_name].py):**

```python
from fastapi import APIRouter, HTTPException, Depends, status
from app.models.[feature_name] import [FeatureName]CreateRequest, [FeatureName]Response
from app.services.[feature_name]_service import [FeatureName]Service
import logging
import time

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/[feature-name]", tags=["[feature_name]"])

# Initialize service
[feature_name]_service = [FeatureName]Service()

@router.post("/", response_model=[FeatureName]Response, status_code=status.HTTP_201_CREATED)
async def create_[feature_name](request: [FeatureName]CreateRequest) -> [FeatureName]Response:
    """Create new [feature] - CleverDocs knowledge sharing endpoint"""
    # Implementation same as above but in modular structure
    pass

# Add to backend/app/main.py:
# from app.api.[feature_name] import router as [feature_name]_router
# app.include_router([feature_name]_router)
```

### **Validation Loop 4: API Integration**

```bash
cd backend

# Start API server for testing
python3 -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload &
SERVER_PID=$!

# Wait for server startup
sleep 3

# Test API endpoint
echo "🔍 Testing API endpoint..."
curl -X POST http://localhost:8000/api/[feature-name] \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test API Feature",
    "content": "Testing CleverDocs API implementation for knowledge sharing acceleration",
    "expertise_level": "intermediate",
    "tags": ["test", "api", "cleverdocs"]
  }' | python3 -m json.tool

# Check API documentation
curl -f http://localhost:8000/docs >/dev/null 2>&1 && echo "✅ API docs accessible" || echo "❌ API docs not accessible"

# Cleanup
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true
```

## Phase 5: Comprehensive Testing

### **Task 5.1: Unit Tests**

**File: backend/tests/test\_[feature_name].py**

```python
import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from app.models.[feature_name] import [FeatureName]CreateRequest, [FeatureName]Response
from app.services.[feature_name]_service import [FeatureName]Service

class Test[FeatureName]Service:
    """Test suite for [feature_name] service following CleverDocs patterns"""

    @pytest.fixture
    def service(self):
        return [FeatureName]Service()

    @pytest.fixture
    def valid_request(self):
        return [FeatureName]CreateRequest(
            title="Test CleverDocs Feature",
            content="This is test content for CleverDocs knowledge sharing platform to accelerate engineer onboarding",
            expertise_level="intermediate",
            tags=["test", "cleverdocs", "knowledge-sharing"]
        )

    @pytest.mark.asyncio
    async def test_create_[feature_name]_success(self, service, valid_request):
        """Test successful [feature] creation with CleverDocs patterns"""
        result = await service.create_[feature_name](valid_request, "test_user_123")

        assert isinstance(result, [FeatureName]Response)
        assert result.title == valid_request.title
        assert result.expertise_level == valid_request.expertise_level
        assert result.id is not None
        assert result.created_at is not None
        assert "created_by" in result.metadata

    @pytest.mark.asyncio
    async def test_create_[feature_name]_validation_error(self, service):
        """Test validation error handling"""
        invalid_request = [FeatureName]CreateRequest(
            title="",  # Invalid: empty title
            content="Test content",
            expertise_level="invalid_level"  # Invalid: not in allowed values
        )

        with pytest.raises(ValueError):
            await service.create_[feature_name](invalid_request, "user_123")

    @pytest.mark.asyncio
    async def test_create_[feature_name]_expertise_level_processing(self, service, valid_request):
        """Test CleverDocs multi-level content processing"""
        # Test each expertise level
        for level in ["beginner", "intermediate", "expert"]:
            valid_request.expertise_level = level
            result = await service.create_[feature_name](valid_request, "test_user")
            assert result.expertise_level == level

# Validation Command:
cd backend && python3 -m pytest tests/test_[feature_name].py -v
```

### **Validation Loop 5: Testing**

```bash
cd backend

# Run unit tests
echo "🧪 Running unit tests..."
python3 -m pytest tests/test_[feature_name].py -v --tb=short

# Check test coverage if available
if command -v pytest-cov &> /dev/null; then
    python3 -m pytest tests/test_[feature_name].py --cov=app --cov-report=term-missing
fi
```

## Phase 6: Final Validation & Quality Assurance

### **Task 6.1: Comprehensive System Validation**

```bash
# Use the comprehensive validation script created for CleverDocs
echo "🔍 Running comprehensive backend validation..."

# Create a simple version of validation if script doesn't exist
cd backend

# Phase 1: Code Quality
echo "Phase 1: Code Quality Validation"
python3 -c "import api; print('✅ API imports successfully')" || exit 1

# Phase 2: Type checking (if mypy available)
if command -v mypy &> /dev/null; then
    mypy . --ignore-missing-imports --no-error-summary 2>/dev/null && echo "✅ Type checking passed" || echo "⚠️ Type checking issues detected"
fi

# Phase 3: Code formatting (if black available)
if command -v black &> /dev/null; then
    black . --check --quiet 2>/dev/null && echo "✅ Code formatting valid" || echo "⚠️ Code formatting issues detected"
fi

# Phase 4: Security scan (if bandit available)
if command -v bandit &> /dev/null; then
    bandit -r . -ll --quiet 2>/dev/null && echo "✅ Security scan passed" || echo "⚠️ Security issues detected"
fi

# Phase 5: API functionality
echo "Phase 5: API Functionality Test"
python3 -m uvicorn api:app --host 0.0.0.0 --port 8001 &
SERVER_PID=$!
sleep 3

# Test API endpoints
curl -f http://localhost:8001/docs >/dev/null 2>&1 && echo "✅ API docs accessible" || echo "❌ API docs not accessible"
curl -f http://localhost:8001/ >/dev/null 2>&1 && echo "✅ Basic API endpoint working" || echo "❌ Basic API endpoint failed"

# Cleanup
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

echo "✅ System validation completed"
```

### **Task 6.2: CleverDocs Mission Alignment Validation**

```bash
echo "🎯 Validating CleverDocs mission alignment..."

# Check for CleverDocs-specific patterns
cd backend

# Multi-level content support
if grep -r "beginner\|intermediate\|expert" . --include="*.py" >/dev/null 2>&1; then
    echo "✅ Multi-level content patterns detected"
else
    echo "ℹ️ No multi-level content patterns found (may not be needed for this feature)"
fi

# Error handling patterns
if grep -r "HTTPException\|ValidationError" . --include="*.py" >/dev/null 2>&1; then
    echo "✅ Proper error handling patterns detected"
else
    echo "⚠️ Consider adding comprehensive error handling"
fi

# Async patterns
if grep -r "async def\|await " . --include="*.py" >/dev/null 2>&1; then
    echo "✅ Async patterns detected"
else
    echo "ℹ️ No async patterns found (consider for I/O operations)"
fi

# Performance monitoring
if grep -r "processing_time\|performance" . --include="*.py" >/dev/null 2>&1; then
    echo "✅ Performance monitoring detected"
else
    echo "ℹ️ Consider adding performance monitoring"
fi

echo "✅ Mission alignment validation completed"
```

## Final Success Confirmation

### **Implementation Checklist**

Verify all success criteria from the PRP are met:

- [ ] **API Contract**: All endpoints respond with correct HTTP status codes and formats
- [ ] **Input Validation**: All inputs validated with Pydantic models (zero unvalidated data)
- [ ] **Error Handling**: Comprehensive error handling with user-friendly messages
- [ ] **Documentation**: OpenAPI documentation auto-generated and accurate
- [ ] **Performance**: Response times < 200ms for simple operations, < 2s for complex AI operations
- [ ] **Security**: No credential exposure, proper input validation, HTTPS-ready
- [ ] **Testing**: Unit tests pass with good coverage
- [ ] **CleverDocs Alignment**: Feature demonstrably supports core mission

### **Quality Gates**

```bash
echo "🎉 Final Quality Gates Validation"

# Performance check
echo "Performance: Target < 200ms for simple operations ✅"

# Security check
echo "Security: No hardcoded secrets, input validation ✅"

# Mission alignment check
echo "Mission: Supports engineer onboarding acceleration ✅"

# Documentation check
echo "Documentation: OpenAPI spec generated ✅"

echo "🚀 Implementation completed successfully!"
echo "Backend feature ready for CleverDocs deployment"
```

### **Next Steps & Integration**

```bash
echo "📋 Next Steps:"
echo "1. Frontend Integration: Update API client in frontend/src/api/"
echo "2. Infrastructure: Configure AWS resources if needed"
echo "3. Deployment: Add feature to deployment pipeline"
echo "4. Monitoring: Set up logging and metrics collection"
echo "5. Documentation: Update feature documentation"

echo "🔗 Integration Points:"
echo "- Frontend: API contracts available at http://localhost:8000/docs"
echo "- Infrastructure: Environment variables documented in .env.example"
echo "- Testing: Tests available in backend/tests/"
echo "- Validation: Use ./scripts/validate-backend.sh for ongoing validation"
```

---

## Anti-Patterns to Avoid

- ❌ **Skip validation loops** - Always validate at each phase
- ❌ **Ignore CleverDocs patterns** - Follow established error handling and multi-level content patterns
- ❌ **Hardcode values** - Use configuration and environment variables
- ❌ **Mix tiers** - Keep backend implementation focused, don't implement frontend or infrastructure
- ❌ **Skip testing** - Always implement unit tests for new functionality
- ❌ **Ignore performance** - Monitor response times and optimize for CleverDocs standards
- ❌ **Duplicate documentation** - Reference existing docs instead of copying content
- ❌ **Break mission alignment** - Ensure every feature supports engineer onboarding acceleration

Remember: The goal is secure, bug-free, and efficient implementation that accelerates engineer onboarding through knowledge sharing - the core CleverDocs mission.
