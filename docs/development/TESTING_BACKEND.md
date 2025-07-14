# CleverDocs Backend Testing Guide

> **Purpose**: Comprehensive backend testing strategies for FastAPI, Python, and AWS services.

## 🧪 Backend Testing Requirements

### Every Backend Feature Must Have

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

## 📁 Backend Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py              # Shared fixtures and configuration
├── unit/                    # Unit tests (mocked dependencies)
│   ├── services/           # Business logic tests
│   │   └── test_*.py
│   └── models/             # Pydantic model tests
│       └── test_*.py
├── integration/            # Integration tests (real dependencies)
│   └── api/               # API endpoint tests
│       └── test_*.py
└── performance/           # Performance benchmarks
    └── test_*.py
```

## 🚀 Running Backend Tests

```bash
# Run all tests
cd backend
pytest

# Run with coverage
pytest --cov=app --cov-report=term-missing

# Run specific test type
pytest tests/unit/
pytest tests/integration/
pytest tests/performance/ --benchmark-only

# Run tests for specific feature
pytest -k "blog"

# Run with verbose output
pytest -v

# Run and fail if coverage < 90%
pytest --cov=app --cov-fail-under=90
```

## 🔧 Backend Testing Tools

- **pytest**: Test framework
- **pytest-asyncio**: Async test support
- **pytest-cov**: Coverage reporting
- **pytest-mock**: Mocking utilities
- **pytest-benchmark**: Performance testing
- **locust**: Load testing

## 💡 Backend Testing Patterns

### 1. Service Layer Testing (3-Test Pattern)

```python
"""
Example unit test demonstrating the 3-test pattern for CleverDocs services.
"""
import pytest
from unittest.mock import Mock, patch, AsyncMock
from typing import Dict, Any


class TestBlogService:
    """Test suite demonstrating the 3-test pattern."""
    
    @pytest.fixture
    def service(self):
        """Create service instance with mocked dependencies."""
        mock_ai_client = AsyncMock()
        return BlogService(ai_client=mock_ai_client)
    
    # Test 1: Expected use case (happy path)
    @pytest.mark.asyncio
    async def test_create_blog_with_valid_data_succeeds(self, service):
        """Test that valid blog data creates a blog successfully."""
        # Arrange
        valid_data = {
            "title": "Test Blog",
            "content": "This is test content",
            "author": "Test Author"
        }
        
        # Act
        result = await service.create_blog(valid_data)
        
        # Assert
        assert result.status == "success"
        assert result.data["title"] == "Test Blog"
        assert result.data["id"] is not None
    
    # Test 2: Edge case (boundary conditions)
    @pytest.mark.asyncio
    async def test_create_blog_with_empty_tags_uses_defaults(self, service):
        """Test that empty tags array uses default categorization."""
        # Arrange
        data_with_empty_tags = {
            "title": "Test Blog",
            "content": "Content here",
            "author": "Test Author",
            "tags": []
        }
        
        # Act
        result = await service.create_blog(data_with_empty_tags)
        
        # Assert
        assert result.status == "success"
        assert result.data["tags"] == ["uncategorized"]
    
    # Test 3: Failure case (error handling)
    @pytest.mark.asyncio
    async def test_create_blog_with_empty_title_raises_error(self, service):
        """Test that empty title raises appropriate validation error."""
        # Arrange
        invalid_data = {
            "title": "",
            "content": "Valid content",
            "author": "Valid Author"
        }
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            await service.create_blog(invalid_data)
        
        assert "title" in str(exc_info.value).lower()
        assert "required" in str(exc_info.value).lower()
```

### 2. API Endpoint Testing

```python
"""
Integration tests for API endpoints using FastAPI TestClient.
"""
import pytest
from fastapi import status


class TestBlogsAPI:
    """Integration tests for blog-related endpoints."""
    
    # Test 1: Expected use case - Get blogs successfully
    def test_get_blogs_returns_list(self, client):
        """Test that GET /api/blogs returns a list of blogs."""
        # Act
        response = client.get("/api/blogs")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify blog structure
        first_blog = data[0]
        assert "id" in first_blog
        assert "title" in first_blog
        assert "content" in first_blog
    
    # Test 2: Edge case - Filtering and query parameters
    def test_get_blogs_with_filters(self, client):
        """Test that blogs can be filtered by query parameters."""
        # Act
        response = client.get("/api/blogs?docType=official")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        for blog in data:
            assert blog["docType"] == "official"
    
    # Test 3: Failure case - Invalid endpoint
    def test_get_invalid_endpoint_returns_404(self, client):
        """Test that invalid endpoints return 404."""
        # Act
        response = client.get("/api/nonexistent")
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
```

### 3. Pydantic Model Testing

```python
"""
Unit tests for Pydantic models focusing on validation logic.
"""
import pytest
from pydantic import ValidationError
from datetime import datetime


class TestBlogModels:
    """Test suite for blog-related Pydantic models."""
    
    # Test 1: Expected use case - Valid model creation
    def test_blog_request_with_valid_data(self):
        """Test that valid blog data creates model successfully."""
        # Arrange
        valid_data = {
            "title": "Understanding Python",
            "content": "Python is a great language for many applications.",
            "author": "Jane Developer",
            "expertise_level": "intermediate"
        }
        
        # Act
        blog = BlogRequest(**valid_data)
        
        # Assert
        assert blog.title == valid_data["title"]
        assert blog.expertise_level == "intermediate"
        assert isinstance(blog.tags, list)
    
    # Test 2: Edge case - Minimum valid data
    def test_blog_request_with_minimum_data(self):
        """Test model with only required fields."""
        # Arrange
        minimal_data = {
            "title": "A",
            "content": "Short post",
            "author": "X"
        }
        
        # Act
        blog = BlogRequest(**minimal_data)
        
        # Assert
        assert blog.expertise_level == "intermediate"  # Default
        assert blog.tags == []  # Default empty list
    
    # Test 3: Failure case - Invalid data
    def test_blog_request_with_invalid_data_raises_error(self):
        """Test that invalid data raises validation errors."""
        # Arrange
        invalid_data = {
            "title": "",  # Empty title
            "content": "Valid content",
            "author": "Valid Author"
        }
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            BlogRequest(**invalid_data)
        
        errors = exc_info.value.errors()
        assert any("title" in str(error["loc"]) for error in errors)
```

### 4. Performance Testing

```python
"""
Performance tests for CleverDocs API endpoints.
"""
import pytest
from fastapi.testclient import TestClient


class TestAPIPerformance:
    """Performance benchmarks for API endpoints."""
    
    @pytest.mark.benchmark(group="api-endpoints")
    def test_get_blogs_performance(self, client: TestClient, benchmark):
        """Benchmark GET /api/blogs endpoint performance."""
        
        def get_blogs():
            response = client.get("/api/blogs")
            assert response.status_code == 200
            return response.json()
        
        # Run benchmark
        result = benchmark(get_blogs)
        
        # Assert performance requirements
        assert benchmark.stats["mean"] < 0.2  # 200ms
        assert len(result) > 0
    
    @pytest.mark.benchmark(group="ai-operations")
    def test_ai_transformation_performance(self, client: TestClient, benchmark):
        """Benchmark AI-powered operations."""
        
        def transform_content():
            response = client.post(
                "/api/transform",
                json={"content": "Test content", "target": "blog"}
            )
            assert response.status_code == 200
            return response.json()
        
        # AI operations should complete within 2 seconds
        result = benchmark(transform_content, rounds=3)
        assert benchmark.stats["mean"] < 2.0
```

## 🛠️ Test Configuration

### pytest Configuration (pytest.ini)
```ini
[tool:pytest]
minversion = 6.0
addopts = 
    -ra
    --strict-markers
    --strict-config
    --cov=app
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
python_files = tests/*.py test_*.py *_test.py
testpaths = tests
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    integration: marks tests as integration tests
    unit: marks tests as unit tests
```

### Shared Fixtures (conftest.py)
```python
"""
Pytest configuration and shared fixtures for CleverDocs backend tests.
"""
import pytest
from fastapi.testclient import TestClient
from typing import Generator
import os
import sys

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from api import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def mock_aws_services(monkeypatch):
    """Mock AWS service calls for unit tests."""
    import boto3
    from unittest.mock import MagicMock
    
    mock_s3 = MagicMock()
    mock_dynamodb = MagicMock()
    mock_bedrock = MagicMock()
    
    monkeypatch.setattr(boto3, 's3', mock_s3)
    monkeypatch.setattr(boto3, 'dynamodb', mock_dynamodb)
    monkeypatch.setattr(boto3, 'bedrock', mock_bedrock)
    
    return {
        's3': mock_s3,
        'dynamodb': mock_dynamodb,
        'bedrock': mock_bedrock
    }


@pytest.fixture
def sample_blog_data():
    """Sample blog data for testing."""
    return {
        "title": "Test Blog Post",
        "content": "This is test content for a blog post.",
        "author": "Test Author",
        "expertise_level": "intermediate",
        "tags": ["testing", "pytest", "fastapi"]
    }
```

## 🏃‍♂️ Backend Testing Best Practices

### 1. Mock External Dependencies
```python
# ✅ Good - Mock external services
@patch('app.services.ai_service.OpenAIClient')
async def test_generate_content(mock_openai):
    mock_openai.return_value.generate.return_value = "Generated content"
    result = await ai_service.generate_blog_content("input")
    assert result == "Generated content"

# ❌ Bad - Making real API calls in tests
async def test_generate_content():
    result = await ai_service.generate_blog_content("input")  # Real API call
    assert result is not None
```

### 2. Test Error Handling
```python
# Test various error scenarios
async def test_service_handles_network_error():
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_get.side_effect = httpx.ConnectError("Network error")
        
        with pytest.raises(ServiceUnavailableError):
            await external_service.fetch_data()

async def test_service_handles_timeout():
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_get.side_effect = httpx.TimeoutException("Timeout")
        
        result = await external_service.fetch_data_with_fallback()
        assert result == "fallback_data"
```

### 3. Test Async Code Properly
```python
# ✅ Good - Proper async testing
@pytest.mark.asyncio
async def test_async_function():
    result = await async_service.process()
    assert result.success

# ✅ Good - Testing multiple async operations
@pytest.mark.asyncio
async def test_concurrent_operations():
    tasks = [async_service.process(i) for i in range(3)]
    results = await asyncio.gather(*tasks)
    assert len(results) == 3
    assert all(r.success for r in results)
```

### 4. Use Parameterized Tests
```python
@pytest.mark.parametrize("expertise_level,expected_complexity", [
    ("beginner", "simple"),
    ("intermediate", "moderate"),
    ("expert", "advanced"),
])
def test_content_complexity_by_expertise(expertise_level, expected_complexity):
    result = content_service.determine_complexity(expertise_level)
    assert result == expected_complexity
```

### 5. Test Database Operations (if using DB)
```python
@pytest.fixture
def db_session():
    """Create a test database session."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_create_blog_in_db(db_session):
    blog = Blog(title="Test", content="Content")
    db_session.add(blog)
    db_session.commit()
    
    retrieved = db_session.query(Blog).filter_by(title="Test").first()
    assert retrieved is not None
    assert retrieved.content == "Content"
```

## 🚨 Common Backend Testing Pitfalls

1. **Not Mocking External Services**: Always mock AWS, OpenAI, external APIs
2. **Testing Implementation Details**: Test behavior, not internal state
3. **Ignoring Async Context**: Use `@pytest.mark.asyncio` for async tests
4. **Poor Test Data Management**: Use fixtures for consistent test data
5. **Not Testing Edge Cases**: Always test empty inputs, null values, etc.

## 📈 Coverage and Quality

### Measuring Coverage
```bash
# Generate HTML coverage report
pytest --cov=app --cov-report=html
open htmlcov/index.html

# Check specific module coverage
pytest --cov=app.services.blog_service --cov-report=term-missing

# Fail if coverage below threshold
pytest --cov=app --cov-fail-under=90
```

### Quality Metrics
- **Unit Tests**: >95% coverage
- **Integration Tests**: Cover all API endpoints
- **Performance Tests**: All endpoints under target times
- **Test Execution**: All tests under 30 seconds total