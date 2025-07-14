# CleverDocs Coding Standards

> **Purpose**: Comprehensive coding standards for all tiers to ensure consistency, security, and alignment with CleverDocs' mission of accelerating engineer onboarding.

## 🌟 Universal Principles

1. **Mission Alignment**: Every feature must support accelerating engineer onboarding and knowledge sharing
2. **Security First**: Validate all inputs, sanitize all outputs, never expose credentials
3. **Performance Oriented**: Target fast response times and efficient resource usage
4. **Error Resilience**: Comprehensive error handling with user-friendly messages
5. **Documentation**: Code should be self-documenting with clear patterns

---

## 🐍 Backend Standards (FastAPI + Python)

### **Core Architecture Patterns**

**Error Handling Template** (Required for all endpoints):

```python
from fastapi import HTTPException, Depends
from pydantic import ValidationError
import logging

logger = logging.getLogger(__name__)

async def standard_endpoint(request: RequestModel) -> ResponseModel:
    """Standard error handling pattern for CleverDocs endpoints."""
    try:
        # Validate business rules
        await validate_business_rules(request)

        # Process request
        result = await service.process_request(request)

        return ResponseModel(status="success", data=result)

    except ValidationError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input: {e.errors()}"
        )
    except AIServiceError as e:
        logger.error(f"AI service failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="Content generation temporarily unavailable"
        )
    except AuthenticationError as e:
        logger.warning(f"Auth error: {e}")
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )
    except AuthorizationError as e:
        logger.warning(f"Authorization error: {e}")
        raise HTTPException(
            status_code=403,
            detail="Insufficient permissions"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
```

**Multi-Level Content Pattern** (CleverDocs AI Features):

```python
from typing import Literal
from pydantic import BaseModel, Field

# CleverDocs expertise levels
EXPERTISE_LEVELS = ["beginner", "intermediate", "expert"]

class ContentGenerationRequest(BaseModel):
    """Request model for CleverDocs content generation."""
    content: str = Field(..., min_length=10, max_length=50000)
    expertise_level: Literal["beginner", "intermediate", "expert"] = "intermediate"
    title: str = Field(..., min_length=1, max_length=200)
    tags: list[str] = Field(default_factory=list, max_items=10)

class ContentGenerationResponse(BaseModel):
    """Response model for generated content."""
    generated_content: dict[str, str]  # level -> content mapping
    metadata: dict = Field(default_factory=dict)
    processing_time_ms: int

async def generate_content_by_level(
    request: ContentGenerationRequest
) -> ContentGenerationResponse:
    """Generate content for all expertise levels."""
    start_time = time.time()

    results = {}
    for level in EXPERTISE_LEVELS:
        # Use shared/prompts/ templates
        prompt_template = load_prompt_template(f"blog-generation/{level}.txt")
        content = await ai_service.generate_content(
            prompt_template.format(
                content=request.content,
                title=request.title,
                level=level
            )
        )
        results[level] = content

    processing_time = int((time.time() - start_time) * 1000)

    return ContentGenerationResponse(
        generated_content=results,
        metadata={"original_length": len(request.content)},
        processing_time_ms=processing_time
    )
```

**AWS Service Client Pattern**:

```python
import boto3
from botocore.exceptions import ClientError, BotoCoreError
from typing import Optional
import os

class AWSClientManager:
    """Centralized AWS client management for CleverDocs."""

    def __init__(self):
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self._s3_client: Optional[boto3.client] = None
        self._dynamodb_client: Optional[boto3.client] = None
        self._bedrock_client: Optional[boto3.client] = None

    @property
    def s3(self) -> boto3.client:
        if self._s3_client is None:
            self._s3_client = boto3.client("s3", region_name=self.region)
        return self._s3_client

    @property
    def dynamodb(self) -> boto3.client:
        if self._dynamodb_client is None:
            self._dynamodb_client = boto3.client("dynamodb", region_name=self.region)
        return self._dynamodb_client

    @property
    def bedrock(self) -> boto3.client:
        if self._bedrock_client is None:
            self._bedrock_client = boto3.client("bedrock-runtime", region_name=self.region)
        return self._bedrock_client

# Usage in services
aws_clients = AWSClientManager()

async def upload_file_to_s3(file_content: bytes, key: str, bucket: str) -> str:
    """Upload file to S3 with error handling."""
    try:
        response = aws_clients.s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=file_content,
            ServerSideEncryption='AES256'
        )
        return f"s3://{bucket}/{key}"
    except ClientError as e:
        logger.error(f"S3 upload failed: {e}")
        raise AIServiceError("File upload failed")
```

### **File Organization & Modularity**

**Critical Rule**: Never put models, services, and API routes in one file.

**File Size Limit**: Maximum 500 lines per file - split into modules when approaching limit.

**Separation of Concerns**:

```python
# ❌ BAD - Everything in api.py
from fastapi import FastAPI
from pydantic import BaseModel

class BlogModel(BaseModel):  # Models mixed with routes
    title: str

class BlogService:  # Services mixed with routes
    def create_blog(self): pass

app = FastAPI()

@app.post("/blogs")  # Routes mixed with everything
async def create_blog(): pass

# ✅ GOOD - Proper separation
# models/blog.py
from pydantic import BaseModel

class BlogRequest(BaseModel):
    title: str
    content: str

# services/blog_service.py  
class BlogService:
    async def create_blog(self, data: BlogRequest):
        # Business logic only
        pass

# api/blogs.py
from fastapi import APIRouter
from models.blog import BlogRequest
from services.blog_service import BlogService

router = APIRouter()

@router.post("/blogs")
async def create_blog(request: BlogRequest):
    # Route handling only
    service = BlogService()
    return await service.create_blog(request)
```

**Directory Structure**:
```
backend/app/
├── models/          # Pydantic models only
│   ├── __init__.py
│   ├── blog.py      # BlogRequest, BlogResponse models
│   ├── user.py      # UserProfile, UserSettings models  
│   ├── document.py  # DocumentUpload, DocumentMetadata models
│   └── auth.py      # LoginRequest, TokenResponse models
├── services/        # Business logic only
│   ├── __init__.py
│   ├── blog_service.py        # Blog CRUD and business logic
│   ├── user_service.py        # User management logic
│   ├── auth_service.py        # Authentication & authorization logic
│   └── ai_transform_service.py # AI content transformation logic
├── api/            # Route handlers only
│   ├── __init__.py
│   ├── blogs.py     # /api/blogs endpoints
│   ├── users.py     # /api/users endpoints
│   ├── auth.py      # /api/auth endpoints
│   └── transform.py # /api/transform endpoints
└── utils/          # Shared utilities
    ├── __init__.py
    ├── helpers.py   # Common utility functions
    └── validators.py # Custom validation functions
```

### **Validation Patterns**

**Input Validation with Pydantic**:

```python
from pydantic import BaseModel, Field, validator, root_validator
from typing import List, Optional
import re

class BlogUploadRequest(BaseModel):
    """Comprehensive validation for blog upload requests."""
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=50, max_length=50000)
    tags: List[str] = Field(default_factory=list, max_items=10)
    expertise_level: Literal["beginner", "intermediate", "expert"] = "intermediate"
    is_public: bool = True

    @validator('title')
    def validate_title(cls, v):
        # No HTML tags in title
        if re.search(r'<[^>]+>', v):
            raise ValueError("Title cannot contain HTML tags")
        return v.strip()

    @validator('tags')
    def validate_tags(cls, v):
        # Clean and validate tags
        cleaned_tags = []
        for tag in v:
            cleaned_tag = re.sub(r'[^a-zA-Z0-9\-_]', '', tag.strip())
            if len(cleaned_tag) >= 2:
                cleaned_tags.append(cleaned_tag.lower())
        return cleaned_tags[:10]  # Max 10 tags

    @root_validator
    def validate_content_quality(cls, values):
        content = values.get('content', '')
        title = values.get('title', '')

        # Basic content quality checks
        if len(content.split()) < 10:
            raise ValueError("Content must contain at least 10 words")

        if title.lower() in content.lower()[:100]:
            # Good practice: title appears near beginning
            pass
        else:
            # Warning: could improve content structure
            logger.info("Title doesn't appear in content introduction")

        return values

# Business rule validation
async def validate_business_rules(request: BlogUploadRequest, user_id: str):
    """Validate CleverDocs-specific business rules."""

    # Rate limiting check
    recent_uploads = await get_user_uploads_last_hour(user_id)
    if len(recent_uploads) >= 5:
        raise ValidationError("Rate limit exceeded: max 5 uploads per hour")

    # Content safety check (placeholder for future implementation)
    if await content_contains_sensitive_info(request.content):
        raise ValidationError("Content contains potentially sensitive information")

    # Duplicate content check
    content_hash = hash_content(request.content)
    if await content_hash_exists(content_hash):
        raise ValidationError("Similar content already exists")
```

### **Performance Standards**

**Response Time Targets**:

```python
# Performance requirements for CleverDocs endpoints
PERFORMANCE_TARGETS = {
    "simple_crud": 200,      # < 200ms for basic CRUD operations
    "content_transform": 2000,  # < 2s for AI content transformation
    "file_upload": 5000,     # < 5s for file processing
    "bulk_operations": 10000  # < 10s for bulk operations
}

# Performance monitoring decorator
import time
from functools import wraps

def monitor_performance(operation_type: str):
    """Decorator to monitor endpoint performance."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                processing_time = int((time.time() - start_time) * 1000)

                # Log performance
                logger.info(f"{operation_type} completed in {processing_time}ms")

                # Alert if performance target exceeded
                target = PERFORMANCE_TARGETS.get(operation_type, 1000)
                if processing_time > target:
                    logger.warning(f"{operation_type} exceeded target: {processing_time}ms > {target}ms")

                return result
            except Exception as e:
                processing_time = int((time.time() - start_time) * 1000)
                logger.error(f"{operation_type} failed after {processing_time}ms: {e}")
                raise
        return wrapper
    return decorator

# Usage
@monitor_performance("content_transform")
async def transform_notes_to_blog(request: ContentGenerationRequest) -> ContentGenerationResponse:
    # Implementation here
    pass
```

### **Security Standards**

**Secure Configuration Pattern**:

```python
from pydantic import BaseSettings, Field
from typing import Optional

class Settings(BaseSettings):
    """Secure configuration management for CleverDocs backend."""

    # Database
    database_url: str = Field(..., env="DATABASE_URL")

    # AWS Configuration
    aws_access_key_id: Optional[str] = Field(None, env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = Field(None, env="AWS_SECRET_ACCESS_KEY")
    aws_region: str = Field("us-east-1", env="AWS_REGION")

    # S3 Configuration
    s3_upload_bucket: str = Field(..., env="S3_UPLOAD_BUCKET")
    s3_content_bucket: str = Field(..., env="S3_CONTENT_BUCKET")

    # AI Service Configuration
    bedrock_model_id: str = Field("anthropic.claude-3-sonnet-20240229-v1:0", env="BEDROCK_MODEL_ID")

    # Security
    secret_key: str = Field(..., env="SECRET_KEY")
    access_token_expire_minutes: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    # Logging
    log_level: str = Field("INFO", env="LOG_LEVEL")

    class Config:
        env_file = ".env"
        case_sensitive = False

# Usage
settings = Settings()

# Never log secrets
logger.info(f"Configured for region: {settings.aws_region}")
# Don't do this: logger.info(f"Secret: {settings.secret_key}")
```

### **Testing Standards**

**Test Structure Pattern**:

```python
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from backend.api import app

client = TestClient(app)

class TestBlogEndpoints:
    """Test suite for blog-related endpoints."""

    @pytest.fixture
    def sample_blog_request(self):
        return {
            "title": "Test Blog Post",
            "content": "This is a test blog post with sufficient content for validation.",
            "tags": ["test", "example"],
            "expertise_level": "intermediate"
        }

    @pytest.mark.asyncio
    async def test_create_blog_success(self, sample_blog_request):
        """Test successful blog creation."""
        with patch('backend.services.blog_service.create_blog') as mock_create:
            mock_create.return_value = {"id": "123", "status": "created"}

            response = client.post("/api/blogs", json=sample_blog_request)

            assert response.status_code == 201
            assert response.json()["status"] == "success"
            mock_create.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_blog_validation_error(self):
        """Test blog creation with invalid data."""
        invalid_request = {
            "title": "",  # Invalid: empty title
            "content": "Short"  # Invalid: too short
        }

        response = client.post("/api/blogs", json=invalid_request)

        assert response.status_code == 400
        assert "Invalid input" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_create_blog_performance(self, sample_blog_request):
        """Test blog creation performance."""
        import time

        start_time = time.time()
        response = client.post("/api/blogs", json=sample_blog_request)
        processing_time = (time.time() - start_time) * 1000

        assert response.status_code in [200, 201]
        assert processing_time < 200  # < 200ms for CRUD operations

# Integration test pattern
@pytest.mark.integration
class TestBlogIntegration:
    """Integration tests with real AWS services (test environment)."""

    @pytest.mark.asyncio
    async def test_full_blog_creation_flow(self):
        """Test complete blog creation including AI generation."""
        # This would test against actual test AWS resources
        pass

# Performance test pattern
@pytest.mark.performance
def test_endpoint_load_handling():
    """Test endpoint performance under load."""
    import concurrent.futures

    def make_request():
        return client.get("/api/blogs")

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(50)]
        results = [future.result() for future in futures]

    # All requests should succeed
    assert all(result.status_code == 200 for result in results)
```

---

## ⚛️ Frontend Standards (React + TypeScript + Chakra UI)

### **Component Architecture**

**Standard Component Pattern**:

```typescript
import React from "react";
import { Box, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt: string;
    expertiseLevel: "beginner" | "intermediate" | "expert";
    tags: string[];
    createdAt: string;
  };
  onSelect?: (blogId: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSelect = async () => {
    if (!onSelect) return;

    setIsLoading(true);
    try {
      await onSelect(blog.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      shadow="sm"
      cursor="pointer"
      _hover={{ shadow: "md" }}
      onClick={handleSelect}
    >
      <Heading size="md" mb={2}>
        {blog.title}
      </Heading>
      <Text color="gray.600" mb={2}>
        {blog.excerpt}
      </Text>
      <Text fontSize="sm" color="blue.500">
        Level: {blog.expertiseLevel}
      </Text>
    </Box>
  );
};
```

### **API Integration Pattern**:

```typescript
// api/blogApi.ts
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface CreateBlogRequest {
  title: string;
  content: string;
  tags: string[];
  expertiseLevel: "beginner" | "intermediate" | "expert";
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  expertiseLevel: "beginner" | "intermediate" | "expert";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const blogApi = {
  async createBlog(request: CreateBlogRequest): Promise<Blog> {
    const response = await apiClient.post("/api/blogs", request);
    return response.data.data;
  },

  async getBlog(id: string): Promise<Blog> {
    const response = await apiClient.get(`/api/blogs/${id}`);
    return response.data.data;
  },

  async listBlogs(): Promise<Blog[]> {
    const response = await apiClient.get("/api/blogs");
    return response.data.data;
  },
};
```

### **Error Handling Pattern**:

```typescript
import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";

export const useErrorHandler = () => {
  const toast = useToast();

  const handleError = (
    error: unknown,
    defaultMessage = "An error occurred"
  ) => {
    let message = defaultMessage;

    if (error instanceof AxiosError) {
      message = error.response?.data?.detail || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return { handleError };
};
```

---

## ☁️ Infrastructure Standards (Terraform)

### **Module Structure Pattern**:

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.environment}-cleverdocs-${var.bucket_purpose}"

  tags = merge(var.common_tags, {
    Name        = "${var.environment}-cleverdocs-${var.bucket_purpose}"
    Purpose     = var.bucket_purpose
    Environment = var.environment
  })
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bucket" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "bucket" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# modules/s3/variables.tf
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "bucket_purpose" {
  description = "Purpose of the bucket (uploads, content, etc.)"
  type        = string
}

variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
```

## 🔧 Development Scripts & Automation

### **Backend Validation Scripts**:

```bash
#!/bin/bash
# scripts/validate-backend.sh

set -e

echo "🐍 Validating CleverDocs Backend..."

# Change to backend directory
cd backend

# Check imports
echo "✅ Checking imports..."
python -c "import api; print('✅ Backend imports successfully')" || exit 1

# Type checking (if mypy configured)
if command -v mypy &> /dev/null; then
    echo "✅ Running type checks..."
    python -m mypy . --ignore-missing-imports || exit 1
fi

# Code formatting check
if command -v black &> /dev/null; then
    echo "✅ Checking code formatting..."
    python -m black . --check || exit 1
fi

# Security scanning
if command -v bandit &> /dev/null; then
    echo "✅ Running security scan..."
    python -m bandit -r . -ll || exit 1
fi

# Start server test
echo "✅ Testing server startup..."
timeout 10s python -m uvicorn api:app --host 0.0.0.0 --port 8001 &
SERVER_PID=$!
sleep 3

# Test health endpoint
curl -f http://localhost:8001/docs > /dev/null || {
    echo "❌ Server health check failed"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
}

# Cleanup
kill $SERVER_PID 2>/dev/null || true

echo "✅ Backend validation completed successfully!"
```

---

## 📊 Quality Metrics & Monitoring

### **Code Quality Targets**

- **Test Coverage**: >90% for critical paths, >70% overall
- **Response Time**: <200ms for CRUD, <2s for AI operations
- **Error Rate**: <1% for production endpoints
- **Security**: Zero critical vulnerabilities
- **Documentation**: All public APIs documented

### **Monitoring Pattern**:

```python
import structlog
from datetime import datetime

# Structured logging setup
logger = structlog.get_logger()

def log_api_call(endpoint: str, method: str, user_id: str, processing_time_ms: int):
    """Standard API call logging for CleverDocs."""
    logger.info(
        "api_call",
        endpoint=endpoint,
        method=method,
        user_id=user_id,
        processing_time_ms=processing_time_ms,
        timestamp=datetime.utcnow().isoformat(),
        service="cleverdocs-backend"
    )

def log_business_event(event_type: str, user_id: str, metadata: dict):
    """Log business events for analytics."""
    logger.info(
        "business_event",
        event_type=event_type,
        user_id=user_id,
        metadata=metadata,
        timestamp=datetime.utcnow().isoformat(),
        service="cleverdocs-backend"
    )
```

---

**This document serves as the authoritative source for CleverDocs coding standards. All implementation should follow these patterns to ensure consistency, security, and alignment with our mission of accelerating engineer onboarding.**
