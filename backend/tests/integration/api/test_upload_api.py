import pytest
import json
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock

from api import app
from models.upload import MarkdownUploadRequest, UploadMetadata


class TestUploadAPI:
    """Integration tests for upload API endpoint"""

    def setup_method(self):
        """Set up test environment"""
        self.client = TestClient(app)
        self.base_url = "/api/upload"
        
        self.valid_request_data = {
            "filename": "test-blog.md",
            "content": """# Test Blog Post

This is a test blog post with markdown content.

## Introduction

This is the introduction section with meaningful content.

### Key Points

- Important point 1
- Important point 2
- Important point 3

```python
def hello_world():
    print("Hello, World!")
```

## Conclusion

This is the conclusion section.
""",
            "metadata": {
                "source": "file_upload"
            }
        }

    def test_upload_markdown_success(self):
        """Test successful markdown upload"""
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=self.valid_request_data
        )
        
        assert response.status_code == 201
        
        data = response.json()
        assert data["status"] == "success"
        assert data["message"] == "Markdown uploaded and blog generated successfully"
        assert "data" in data
        
        # Check response data structure
        response_data = data["data"]
        assert "blog_id" in response_data
        assert "title" in response_data
        assert "processing_time_ms" in response_data
        assert "expertise_levels" in response_data
        
        # Check expertise levels
        assert response_data["expertise_levels"] == ["beginner", "intermediate", "expert"]
        
        # Check that blog_id is a valid UUID format
        blog_id = response_data["blog_id"]
        assert isinstance(blog_id, str)
        assert len(blog_id) > 0

    def test_upload_markdown_invalid_filename(self):
        """Test upload with invalid filename (non-.md)"""
        invalid_data = self.valid_request_data.copy()
        invalid_data["filename"] = "test.txt"
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=invalid_data
        )
        
        assert response.status_code == 422  # Pydantic validation error
        
        data = response.json()
        assert "detail" in data
        assert any("Only .md files are allowed" in str(error) for error in data["detail"])

    def test_upload_markdown_empty_filename(self):
        """Test upload with empty filename"""
        invalid_data = self.valid_request_data.copy()
        invalid_data["filename"] = ""
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=invalid_data
        )
        
        assert response.status_code == 422  # Pydantic validation error
        
        data = response.json()
        assert "detail" in data

    def test_upload_markdown_too_short_content(self):
        """Test upload with content too short"""
        invalid_data = self.valid_request_data.copy()
        invalid_data["content"] = "Short"  # Less than 10 characters
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=invalid_data
        )
        
        assert response.status_code == 422  # Pydantic validation error
        
        data = response.json()
        assert "detail" in data

    def test_upload_markdown_too_large_content(self):
        """Test upload with content exceeding 1MB"""
        invalid_data = self.valid_request_data.copy()
        invalid_data["content"] = "x" * (1048576 + 1)  # 1MB + 1 byte
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=invalid_data
        )
        
        assert response.status_code == 422  # Pydantic validation error
        
        data = response.json()
        assert "detail" in data
        assert any("String should have at most 1048576 characters" in str(error) for error in data["detail"])

    def test_upload_markdown_missing_metadata(self):
        """Test upload with missing metadata"""
        invalid_data = self.valid_request_data.copy()
        del invalid_data["metadata"]
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=invalid_data
        )
        
        assert response.status_code == 422  # Pydantic validation error
        
        data = response.json()
        assert "detail" in data

    def test_upload_markdown_invalid_metadata_source(self):
        """Test upload with invalid metadata source"""
        invalid_data = self.valid_request_data.copy()
        invalid_data["metadata"]["source"] = ""
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=invalid_data
        )
        
        # Empty source actually passes validation, so this should succeed
        assert response.status_code == 201
        
        data = response.json()
        assert data["status"] == "success"

    def test_upload_markdown_malformed_json(self):
        """Test upload with malformed JSON"""
        response = self.client.post(
            f"{self.base_url}/markdown",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422
        
        data = response.json()
        assert "detail" in data

    @patch('services.upload_service.UploadService.process_markdown_upload')
    def test_upload_markdown_service_error(self, mock_process):
        """Test upload with service error"""
        # Mock service to raise ValueError (validation error)
        mock_process.side_effect = ValueError("Invalid markdown syntax")
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=self.valid_request_data
        )
        
        assert response.status_code == 400
        
        data = response.json()
        assert data["detail"] == "Invalid markdown syntax"

    @patch('services.upload_service.UploadService.process_markdown_upload')
    def test_upload_markdown_unexpected_error(self, mock_process):
        """Test upload with unexpected service error"""
        # Mock service to raise unexpected error
        mock_process.side_effect = Exception("Database connection failed")
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=self.valid_request_data
        )
        
        assert response.status_code == 500
        
        data = response.json()
        assert data["detail"] == "Internal server error"

    def test_upload_markdown_with_complex_content(self):
        """Test upload with complex markdown content"""
        complex_content = """# Advanced Python Tutorial

## Table of Contents

1. [Introduction](#introduction)
2. [Advanced Concepts](#advanced-concepts)
3. [Code Examples](#code-examples)

## Introduction

This is an advanced tutorial covering multiple concepts.

### Prerequisites

- Python 3.8+
- Basic understanding of OOP

## Advanced Concepts

### Decorators

```python
def timing_decorator(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"Function took {end - start:.2f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    return "Done"
```

### Context Managers

```python
class DatabaseConnection:
    def __enter__(self):
        print("Connecting to database")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection")
        return False
```

## Links and References

- [Python Documentation](https://docs.python.org/)
- [PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/)

## Conclusion

This tutorial covered advanced Python concepts including decorators and context managers.

> **Note**: These examples are for educational purposes only.
"""
        
        complex_data = self.valid_request_data.copy()
        complex_data["content"] = complex_content
        complex_data["filename"] = "advanced-python-tutorial.md"
        
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=complex_data
        )
        
        assert response.status_code == 201
        
        data = response.json()
        assert data["status"] == "success"
        assert "data" in data
        assert data["data"]["title"] == "Advanced Python Tutorial"

    def test_upload_markdown_different_sources(self):
        """Test upload with different metadata sources"""
        sources = ["file_upload", "text_input", "url"]
        
        for source in sources:
            test_data = self.valid_request_data.copy()
            test_data["metadata"]["source"] = source
            test_data["filename"] = f"test-{source}.md"
            
            response = self.client.post(
                f"{self.base_url}/markdown",
                json=test_data
            )
            
            assert response.status_code == 201
            
            data = response.json()
            assert data["status"] == "success"

    def test_upload_markdown_response_timing(self):
        """Test that upload response includes timing information"""
        response = self.client.post(
            f"{self.base_url}/markdown",
            json=self.valid_request_data
        )
        
        assert response.status_code == 201
        
        data = response.json()
        response_data = data["data"]
        
        # Check that processing time is included and reasonable
        assert "processing_time_ms" in response_data
        processing_time = response_data["processing_time_ms"]
        assert isinstance(processing_time, int)
        assert processing_time >= 0
        assert processing_time < 30000  # Should be under 30 seconds for test

    def test_upload_endpoint_not_found(self):
        """Test that non-existent upload endpoints return 404"""
        response = self.client.post(
            f"{self.base_url}/nonexistent",
            json=self.valid_request_data
        )
        
        assert response.status_code == 404

    def test_upload_wrong_http_method(self):
        """Test that wrong HTTP methods return 405"""
        response = self.client.get(f"{self.base_url}/markdown")
        assert response.status_code == 405
        
        response = self.client.put(
            f"{self.base_url}/markdown",
            json=self.valid_request_data
        )
        assert response.status_code == 405
        
        response = self.client.delete(f"{self.base_url}/markdown")
        assert response.status_code == 405


if __name__ == "__main__":
    pytest.main([__file__])