---
name: "CleverDocs Backend PRP: Note Upload & Blog Generation"
description: |
  Backend implementation for note-to-blog transformation feature enabling rapid conversion
  of markdown notes into multi-level expertise blog content. Core feature supporting
  CleverDocs' mission of accelerating engineer onboarding through AI-powered content.
generated_from: docs/backend/INITIAL_BACKEND_upload_notes.md
created: 2025-07-14
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

**Feature Name**: Note Upload & Multi-Level Blog Generation

**Business Value**: Implements CleverDocs' core feature "5.1 Note → Blog Generation" - enabling engineers to transform cluttered notes into well-documented, multi-level technical blogs (beginner/intermediate/expert), directly supporting the mission of accelerating engineer onboarding and knowledge sharing.

**API Contract**: 
- `POST /api/upload/markdown` - Accept markdown content and generate 3-expertise-level blog versions
- Request: JSON with filename, content, and metadata
- Response: Blog ID, processing metrics, and navigation data for frontend

## Why This Feature

- **User Impact**: Eliminates the barrier between having technical knowledge and sharing it effectively - engineers can upload quick notes and instantly get publication-ready, multi-level content that serves users at different expertise levels
- **Technical Value**: Integrates seamlessly with existing blog service and content structure, leveraging current Pydantic models and FastAPI patterns while preparing for future AWS Bedrock AI integration
- **Mission Alignment**: Direct implementation of core capability "Rapid Note → Blog Generation" that accelerates knowledge sharing and enables on-demand beginner/intermediate/expert content variants

## What to Build

**API Endpoints**: 
- `POST /api/upload/markdown` - Upload and process markdown files

**Data Models**: 
- `MarkdownUploadRequest` - Request validation with file size limits and content validation
- `UploadResponse` - Standardized response with blog ID and processing metrics  
- Extended `Blog` model integration for generated content

**Business Logic**: 
- Markdown syntax validation service
- Mock multi-level content generation (with AWS Bedrock TODO markers)
- Integration with existing blog service for storage
- File processing and content extraction utilities

**Integration Points**: 
- Existing `BlogService` for data persistence
- Current `shared/data/blogs.json` storage mechanism
- Frontend navigation through blog ID response

### Success Criteria

- [x] **API Contract**: All endpoints respond with correct HTTP status codes and formats
- [x] **Input Validation**: All inputs validated with Pydantic models (zero unvalidated data)
- [x] **Error Handling**: Comprehensive error handling with user-friendly messages
- [x] **Documentation**: OpenAPI documentation auto-generated and accurate
- [x] **Performance**: Response times < 200ms for simple operations, < 2s for complex AI operations
- [x] **Security**: No credential exposure, proper input validation, HTTPS-ready
- [x] **Testing**: Unit tests (3 per feature: expected, edge case, failure) and integration tests pass with >90% coverage
- [x] **CleverDocs Alignment**: Feature demonstrably supports core mission and user workflows

## Testing Requirements

### **Every Feature MUST Have Tests**

1. **Unit Tests** (backend/tests/unit/):
   - **UploadService Tests**: Happy path (valid markdown), edge case (empty content), failure case (invalid markdown)
   - **MarkdownValidator Tests**: Valid markdown, malformed markdown, edge cases (empty, very large files)
   - **ContentGenerator Tests**: Mock generation quality, expertise level differentiation, error handling
   - Mock all external dependencies (file system, blog service)

2. **Integration Tests** (backend/tests/integration/):
   - **Full API Flow**: POST request → validation → generation → storage → response
   - **Error Response Testing**: Invalid files, oversized content, malformed requests
   - **Blog Service Integration**: Verify blogs are correctly added to shared/data/blogs.json

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
  note: Note → Blog Generation is feature #1 in key features

- file: docs/CLAUDE.md
  why: Global AI agent rules and CleverDocs-specific behavioral requirements
  focus: Backend structure pattern (api.py vs app/ structure decision)

- file: docs/CODEBASE_GUIDE.md
  section: "🌐 backend/ - FastAPI Server"
  why: Current backend state (✅ api.py vs 🔄 planned app/ structure)
  decision: Extend current api.py for MVP speed

- file: docs/development/CODING_STANDARDS.md
  section: "🐍 Backend Standards (FastAPI + Python)"
  why: Backend patterns, error handling, naming conventions
  focus: Multi-level content pattern and error handling templates

- file: docs/development/TESTING_BACKEND.md
  why: Backend testing patterns, pytest configuration, 3-test pattern for services

- file: docs/PRDs/CleverDocsPRD.md
  section: "5.1 Note → Blog Generation"
  why: Detailed business requirements for this specific feature
```

### **Current Implementation State**

```yaml
# What Actually Exists vs What's Planned
- file: backend/api.py
  why: Current FastAPI app structure - extend this for MVP
  status: ✅ EXISTS - Basic blog endpoints already implemented

- file: backend/models/blog.py
  why: Existing Blog model with expertise-level content support
  status: ✅ EXISTS - Already supports dict content structure

- file: backend/services/blog_service.py
  why: Current blog management logic to extend
  status: ✅ EXISTS - Has methods for loading/filtering blogs

- file: backend/requirements.txt
  why: Current dependencies - already includes file processing tools
  status: ✅ EXISTS - Includes python-magic, chardet for file handling

- file: shared/data/blogs.json
  why: Current data storage mechanism
  status: ✅ EXISTS - Target for new blog storage
```

### **External Documentation & Patterns**

```yaml
# FastAPI and Python Patterns
- url: https://fastapi.tiangolo.com/tutorial/request-files/
  section: File uploads and form data handling
  why: Pattern for accepting file uploads via API

- url: https://docs.pydantic.dev/latest/concepts/validators/
  section: Custom validators for complex validation
  why: Markdown syntax validation patterns

- url: https://fastapi.tiangolo.com/tutorial/handling-errors/
  section: HTTP exception handling
  why: User-friendly error response patterns

# CleverDocs-Specific Patterns
- file: docs/planning/note-to-blog-architecture.md
  section: Content generation patterns and mock implementation
  why: Detailed architecture analysis for this feature
```

## Implementation Architecture Decision

### **Simple Extension** (Recommended for MVP)

**Rationale**: This feature adds one endpoint with moderate complexity. Extending current `backend/api.py` maintains development speed while preparing for future modularization.

```python
# Extend current api.py structure
backend/
├── api.py                      # ✅ EXISTS - Add upload endpoint here
├── models/
│   ├── blog.py                 # ✅ EXISTS - Already has Blog model
│   └── upload.py               # 🔄 NEW - Upload request/response models
├── services/
│   ├── blog_service.py         # ✅ EXISTS - Extend with add_blog method
│   ├── upload_service.py       # 🔄 NEW - Main upload processing logic
│   ├── markdown_validator.py   # 🔄 NEW - Markdown syntax validation
│   └── content_generator.py    # 🔄 NEW - Mock multi-level content generation
└── tests/
    ├── unit/services/          # 🔄 NEW - Unit tests for new services
    └── integration/api/        # 🔄 NEW - Integration tests for upload endpoint
```

**Component Sizes**: Each service ~100-200 lines, well within 500 line limit.

**Migration Path**: Structure prepares for future `backend/app/` migration without breaking changes.

## CleverDocs-Specific Implementation Patterns

### **Upload Endpoint Pattern**

```python
# File: backend/api.py (extend existing file)
from models.upload import MarkdownUploadRequest, UploadResponse
from services.upload_service import upload_service

@app.post("/api/upload/markdown", response_model=UploadResponse, status_code=201)
async def upload_markdown(request: MarkdownUploadRequest):
    """
    Upload markdown content and generate multi-level blog
    
    - Validates markdown syntax and file size (1MB limit)
    - Generates beginner/intermediate/expert versions (mock for MVP)
    - Saves to shared/data/blogs.json via existing blog service
    - Returns blog ID for frontend navigation
    """
    try:
        result = await upload_service.process_markdown_upload(request)
        return UploadResponse(
            status="success",
            message="Blog generated successfully",
            data=result
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Upload processing error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process upload")
```

### **Pydantic Models Pattern**

```python
# File: backend/models/upload.py
from pydantic import BaseModel, Field, validator
from typing import Dict

class UploadMetadata(BaseModel):
    source: str = Field(..., description="Source: file_upload, text_input, url")
    # TODO: Add user_id when authentication is implemented

class MarkdownUploadRequest(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=10, max_length=1048576)  # 1MB limit
    metadata: UploadMetadata
    
    @validator('filename')
    def validate_markdown_extension(cls, v):
        if not v.endswith('.md'):
            raise ValueError('Only .md files are allowed')
        return v
    
    @validator('content')
    def validate_content_size(cls, v):
        if len(v) > 1048576:  # 1MB
            raise ValueError('Content exceeds 1MB limit')
        return v

class UploadResponse(BaseModel):
    status: str
    message: str
    data: Dict[str, any]
```

### **Service Layer Pattern**

```python
# File: backend/services/upload_service.py
import uuid
from datetime import datetime
from typing import Dict

class UploadService:
    def __init__(self):
        self.markdown_validator = MarkdownValidator()
        self.content_generator = ContentGenerator()
        self.blog_service = BlogService()
    
    async def process_markdown_upload(self, request: MarkdownUploadRequest) -> Dict:
        start_time = datetime.now()
        
        # Step 1: Validate markdown
        is_valid, errors = self.markdown_validator.validate(request.content)
        if not is_valid:
            raise ValueError(f"Invalid markdown: {', '.join(errors)}")
        
        # Step 2: Extract metadata
        title = self._extract_title(request.content, request.filename)
        excerpt = self._generate_excerpt(request.content)
        
        # Step 3: Generate multi-level content (MOCK for MVP)
        # TODO: Replace with AWS Bedrock integration
        generated_content = await self.content_generator.generate_expertise_versions(
            original_content=request.content,
            title=title
        )
        
        # Step 4: Create and save blog
        blog = Blog(
            id=str(uuid.uuid4()),
            title=title,
            excerpt=excerpt,
            content=generated_content,
            author={"name": "Tech Writer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=TechWriter"},
            publishedAt=datetime.now().strftime("%Y-%m-%d"),
            readTime=self._calculate_read_time(request.content),
            tags=self._extract_tags(request.content),
            coverImage="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
            avgRating=0.0,
            totalRatings=0,
            docType="community"
        )
        
        # Step 5: Save via existing blog service
        self.blog_service.add_blog(blog)
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        return {
            "blog_id": blog.id,
            "title": blog.title,
            "processing_time_ms": int(processing_time),
            "expertise_levels": list(generated_content.keys())
        }

upload_service = UploadService()
```

### **Mock Content Generation Pattern**

```python
# File: backend/services/content_generator.py
from typing import Dict

class ContentGenerator:
    async def generate_expertise_versions(self, original_content: str, title: str) -> Dict[str, str]:
        """
        Generate mock multi-level content for MVP
        TODO: Replace with AWS Bedrock integration for production
        """
        
        # Mock beginner version - simplified
        beginner_content = f"""# {title} - Beginner's Guide

## Introduction for Beginners
This is a simplified version perfect for those just starting out.

### Key Concepts Explained Simply
{self._simplify_content(original_content)}

**Note: This is mock content. In production, AWS Bedrock will generate appropriate beginner-level content.**
"""
        
        # Mock intermediate version - original + context
        intermediate_content = f"""# {title} - Comprehensive Guide

## Overview
This guide provides a balanced view with practical examples.

### Detailed Explanation
{original_content}

**Note: This is mock content. In production, AWS Bedrock will generate enhanced intermediate-level content.**
"""
        
        # Mock expert version - advanced concepts
        expert_content = f"""# {title} - Expert Deep Dive

## Advanced Concepts
This expert-level guide explores advanced topics and edge cases.

### Technical Deep Dive
{original_content}

### Advanced Techniques and Optimizations
- Performance considerations
- Scalability patterns  
- Security implications
- Best practices for production

**Note: This is mock content. In production, AWS Bedrock will generate sophisticated expert-level content.**
"""
        
        return {
            "beginner": beginner_content,
            "intermediate": intermediate_content,
            "expert": expert_content
        }
```

### **Testing Pattern**

```python
# File: backend/tests/unit/services/test_upload_service.py
import pytest
from services.upload_service import UploadService
from models.upload import MarkdownUploadRequest, UploadMetadata

class TestUploadService:
    @pytest.fixture
    def upload_service(self):
        return UploadService()
    
    @pytest.fixture
    def valid_request(self):
        return MarkdownUploadRequest(
            filename="test.md",
            content="# Test Title\n\nThis is test content.",
            metadata=UploadMetadata(source="file_upload")
        )
    
    # Test 1: Expected case
    async def test_process_markdown_upload_success(self, upload_service, valid_request):
        result = await upload_service.process_markdown_upload(valid_request)
        
        assert "blog_id" in result
        assert result["title"] == "Test Title"
        assert "processing_time_ms" in result
        assert result["expertise_levels"] == ["beginner", "intermediate", "expert"]
    
    # Test 2: Edge case
    async def test_process_markdown_upload_minimal_content(self, upload_service):
        minimal_request = MarkdownUploadRequest(
            filename="minimal.md",
            content="# Short\n\nMinimal content.",
            metadata=UploadMetadata(source="file_upload")
        )
        
        result = await upload_service.process_markdown_upload(minimal_request)
        assert result["title"] == "Short"
    
    # Test 3: Failure case
    async def test_process_markdown_upload_invalid_content(self, upload_service):
        invalid_request = MarkdownUploadRequest(
            filename="invalid.md",
            content="```\nUnclosed code block",
            metadata=UploadMetadata(source="file_upload")
        )
        
        with pytest.raises(ValueError, match="Invalid markdown"):
            await upload_service.process_markdown_upload(invalid_request)
```

## Progressive Implementation Tasks

### **Phase 1: Data Models & Validation** ⭐

```bash
# Task 1.1: Create upload models
CREATE backend/models/upload.py:
- Define MarkdownUploadRequest with file size validation
- Define UploadResponse with standardized format
- Add comprehensive validation rules for markdown files

# Task 1.2: Create markdown validator service
CREATE backend/services/markdown_validator.py:
- Implement syntax validation (unclosed blocks, brackets)
- Add content structure checks
- Define clear error messages for common issues

# Validation Commands Phase 1:
cd backend
python3 -c "from models.upload import MarkdownUploadRequest; print('Models import successfully')"
python3 -c "from services.markdown_validator import MarkdownValidator; print('Validator imports successfully')"
```

### **Phase 2: Content Generation Service** ⭐

```bash
# Task 2.1: Create mock content generator
CREATE backend/services/content_generator.py:
- Implement mock multi-level content generation
- Add clear TODO markers for AWS Bedrock integration
- Ensure expertise level differentiation is visible

# Task 2.2: Create main upload service
CREATE backend/services/upload_service.py:
- Implement orchestration logic for upload processing
- Add title extraction and metadata generation
- Integrate with existing blog service

# Validation Commands Phase 2:
cd backend
python3 -c "from services.content_generator import ContentGenerator; print('Generator imports successfully')"
python3 -c "from services.upload_service import UploadService; print('Upload service imports successfully')"
```

### **Phase 3: API Integration** ⭐

```bash
# Task 3.1: Extend existing blog service
MODIFY backend/services/blog_service.py:
- Add add_blog method for new blog storage
- Ensure compatibility with existing blog structure
- Maintain cache invalidation logic

# Task 3.2: Add upload endpoint to API
MODIFY backend/api.py:
- Add POST /api/upload/markdown endpoint
- Import new models and services
- Implement error handling following existing patterns

# Validation Commands Phase 3:
cd backend
python3 -m uvicorn api:app --reload &
sleep 2
curl -X POST http://localhost:8000/api/upload/markdown -H "Content-Type: application/json" -d '{"filename":"test.md","content":"# Test\nContent","metadata":{"source":"file_upload"}}'
kill %1
```

### **Phase 4: Testing Implementation** ⭐

```bash
# Task 4.1: Unit tests for services
CREATE backend/tests/unit/services/test_upload_service.py
CREATE backend/tests/unit/services/test_markdown_validator.py
CREATE backend/tests/unit/services/test_content_generator.py

# Task 4.2: Integration tests for API
CREATE backend/tests/integration/api/test_upload_api.py

# Validation Commands Phase 4:
cd backend
python3 -m pytest tests/unit/services/test_upload_service.py -v
python3 -m pytest tests/integration/api/test_upload_api.py -v
python3 -m pytest tests/ --cov=services --cov=models --cov-report=term-missing
```

### **Phase 5: Documentation & Validation** ⭐

```bash
# Task 5.1: OpenAPI documentation
- Verify auto-generated docs at /docs endpoint
- Ensure request/response examples are clear
- Add detailed endpoint descriptions

# Task 5.2: Error handling validation
- Test all error scenarios (file too large, invalid markdown, etc.)
- Verify user-friendly error messages
- Ensure proper HTTP status codes

# Validation Commands Phase 5:
cd backend
python3 -m uvicorn api:app --reload &
sleep 2
curl http://localhost:8000/docs  # Verify OpenAPI docs
python3 -m pytest tests/ -v --cov=. --cov-report=term-missing
kill %1
```

### **Phase 6: CleverDocs Pattern Validation** ⭐

```bash
# Task 6.1: Verify multi-level content patterns
grep -r "beginner\|intermediate\|expert" backend/ --include="*.py"

# Task 6.2: Verify error handling patterns  
grep -r "HTTPException\|ValidationError" backend/ --include="*.py"

# Task 6.3: Verify async patterns
grep -r "async def\|await " backend/ --include="*.py"

# Task 6.4: Security validation
python3 -m bandit -r backend/ -ll
python3 -m safety check

# Task 6.5: Code quality validation
python3 -m black backend/ --check
python3 -m flake8 backend/
python3 -m mypy backend/ --ignore-missing-imports
```

### **Phase 7: Feature Integration Validation** ⭐

```bash
# Task 7.1: End-to-end workflow test
- Upload markdown via API
- Verify blog creation in shared/data/blogs.json
- Test blog retrieval via existing /blogs endpoint
- Verify expertise level content differentiation

# Task 7.2: Performance validation
python3 -m pytest backend/tests/performance/ --benchmark-only

# Task 7.3: Frontend integration preparation
- Document API contract for frontend team
- Verify response format matches frontend expectations
- Test error response formats
```

## API Requirements & Integration Points

### **Frontend Integration Contract**

```typescript
// Frontend API usage pattern
const uploadMarkdown = async (file: File) => {
  const content = await file.text();
  
  const response = await apiClient.post('/api/upload/markdown', {
    filename: file.name,
    content: content,
    metadata: { source: 'file_upload' }
  });
  
  if (response.data.status === 'success') {
    navigate(`/blog/${response.data.data.blog_id}`);
  }
};
```

### **Error Response Format**

```json
{
  "detail": "Content exceeds 1MB limit",
  "status_code": 400,
  "error_type": "validation_error"
}
```

### **Backend Dependencies Integration**

**No New Dependencies Required**: All necessary tools already in `requirements.txt`
- `python-magic` for file type detection
- `pydantic` for validation
- `fastapi` for API framework
- `uuid` (built-in) for blog ID generation

## Risk Mitigation

1. **File Size Protection**: 1MB limit enforced at Pydantic validation level
2. **Markdown Validation**: Syntax checking prevents malformed content storage
3. **Error Boundaries**: Comprehensive exception handling with user-friendly messages
4. **Performance Safety**: Mock generation ensures <2s response times
5. **Data Integrity**: Integration with existing blog service maintains data consistency

## Success Metrics

- **Upload Success Rate**: >95% for valid markdown files
- **Processing Time**: <2 seconds for mock generation (MVP)
- **API Response Time**: <200ms for validation, <2s for complete processing
- **Error Handling**: Clear error messages for 100% of validation failures
- **Integration Success**: Generated blogs accessible via existing `/blogs` endpoint

## Future Enhancements (Out of Scope)

- AWS Bedrock integration for real AI content generation
- PDF and URL processing support
- Real-time progress tracking via WebSocket
- User authentication and authorization
- Advanced content sanitization
- Batch processing capabilities

---

## **MANDATORY: Feature Documentation**

**🚨 CRITICAL REQUIREMENT**: Upon PRP completion, you MUST create a comprehensive feature implementation summary.

### **Documentation Process**

1. **Use Template**: Copy `docs/features/templates/backend-feature-summary.md`
2. **Create Summary**: Save as `docs/features/implemented/backend/YYYY-MM-DD-note-upload-blog-generation-backend.md`
3. **Complete All Sections**:
   - Implementation details with phase breakdown
   - All files created/modified with specific changes
   - API endpoints with request/response schemas
   - Testing performed (unit, integration, performance)
   - Database changes and migration scripts
   - Security considerations and error handling

### **Success Criteria**
- [ ] **Feature Summary Created**: Comprehensive documentation following template
- [ ] **All Phases Documented**: Each implementation phase with tasks and testing
- [ ] **API Documentation**: All endpoints with request/response examples
- [ ] **Files Catalogued**: Complete list of created/modified files with descriptions
- [ ] **Testing Recorded**: All unit, integration, and manual testing documented
- [ ] **Security Verified**: Input validation, error handling, and security measures documented
- [ ] **Performance Measured**: Response times, optimizations, and scalability considerations
- [ ] **Database Changes**: All schema changes, migrations, and indexing documented
- [ ] **Troubleshooting Added**: Common issues, debug information, and monitoring guidance

**The PRP is NOT considered complete until the feature documentation is created.**

---

## Implementation Confidence Score

Rate this PRP on implementation success probability (1-10):

- **Context Completeness** (9/10): All necessary docs referenced, minimal missing context
- **Technical Clarity** (9/10): Implementation steps specific and actionable with clear validation
- **Validation Thoroughness** (9/10): Comprehensive 7-phase validation with executable commands
- **CleverDocs Alignment** (10/10): Direct implementation of core mission feature with clear business value
- **Error Prevention** (8/10): Major pitfalls identified with comprehensive error handling patterns

**Overall Score: 9/10** - High confidence in bug-free, efficient implementation.

**Rationale**: This PRP builds on existing, working patterns while adding focused functionality. The MVP approach with mock AI generation eliminates complex dependencies while providing clear upgrade path to production AI integration. Progressive validation ensures quality at each step.

---

**Note**: This PRP eliminates redundancy by referencing centralized documentation instead of duplicating information. All architectural patterns, testing templates, and validation procedures are maintained in their authoritative locations.