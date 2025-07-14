"""
Unit tests for Pydantic models used in the blog feature.

Tests focus on validation logic and serialization.
"""
import pytest
from pydantic import BaseModel, Field, ValidationError
from typing import Optional, List, Literal
from datetime import datetime


# Example model (would normally be imported from backend.app.models.blog)
class BlogRequest(BaseModel):
    """Request model for creating/updating a blog post."""
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=10)
    author: str = Field(..., min_length=1)
    expertise_level: Literal["beginner", "intermediate", "expert"] = "intermediate"
    tags: Optional[List[str]] = Field(default_factory=list, max_items=10)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Getting Started with FastAPI",
                "content": "FastAPI is a modern web framework...",
                "author": "John Doe",
                "expertise_level": "beginner",
                "tags": ["python", "fastapi", "tutorial"]
            }
        }


class BlogResponse(BlogRequest):
    """Response model for blog posts."""
    id: str
    created_at: datetime
    updated_at: datetime
    word_count: int
    reading_time_minutes: int


class TestBlogModels:
    """Test suite for blog-related Pydantic models."""
    
    # Test 1: Expected use case - Valid blog request
    def test_blog_request_with_valid_data(self):
        """Test that valid blog data creates model successfully."""
        # Arrange
        valid_data = {
            "title": "Understanding Python Type Hints",
            "content": "Type hints in Python help improve code readability and catch errors early.",
            "author": "Jane Developer",
            "expertise_level": "intermediate",
            "tags": ["python", "types", "best-practices"]
        }
        
        # Act
        blog = BlogRequest(**valid_data)
        
        # Assert
        assert blog.title == valid_data["title"]
        assert blog.content == valid_data["content"]
        assert blog.author == valid_data["author"]
        assert blog.expertise_level == "intermediate"
        assert len(blog.tags) == 3
    
    # Test 2: Edge case - Minimum valid data
    def test_blog_request_with_minimum_data(self):
        """Test model with only required fields."""
        # Arrange
        minimal_data = {
            "title": "A",  # Minimum length title
            "content": "Short post",  # Exactly 10 characters
            "author": "X"  # Single character author
        }
        
        # Act
        blog = BlogRequest(**minimal_data)
        
        # Assert
        assert blog.title == "A"
        assert blog.content == "Short post"
        assert blog.expertise_level == "intermediate"  # Default value
        assert blog.tags == []  # Default empty list
    
    # Test 3: Failure case - Invalid data raises validation error
    def test_blog_request_with_empty_title_raises_error(self):
        """Test that empty title raises validation error."""
        # Arrange
        invalid_data = {
            "title": "",  # Empty title
            "content": "This is valid content",
            "author": "Valid Author"
        }
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            BlogRequest(**invalid_data)
        
        errors = exc_info.value.errors()
        assert len(errors) == 1
        assert errors[0]["loc"] == ("title",)
        assert "at least 1 character" in str(errors[0]["msg"])
    
    # Additional test: Title too long
    def test_blog_request_with_title_too_long_raises_error(self):
        """Test that title exceeding max length raises error."""
        # Arrange
        invalid_data = {
            "title": "A" * 201,  # 201 characters (max is 200)
            "content": "Valid content",
            "author": "Valid Author"
        }
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            BlogRequest(**invalid_data)
        
        errors = exc_info.value.errors()
        assert any("at most 200 characters" in str(error["msg"]) for error in errors)
    
    # Test invalid expertise level
    def test_blog_request_with_invalid_expertise_level_raises_error(self):
        """Test that invalid expertise level raises error."""
        # Arrange
        invalid_data = {
            "title": "Valid Title",
            "content": "Valid content here",
            "author": "Valid Author",
            "expertise_level": "super-advanced"  # Not in allowed values
        }
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            BlogRequest(**invalid_data)
        
        errors = exc_info.value.errors()
        assert any("expertise_level" in str(error["loc"]) for error in errors)
    
    # Test serialization
    def test_blog_response_serialization(self):
        """Test that BlogResponse model serializes correctly."""
        # Arrange
        response_data = {
            "id": "blog-123",
            "title": "Test Blog",
            "content": "This is test content for serialization",
            "author": "Test Author",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "word_count": 6,
            "reading_time_minutes": 1
        }
        
        # Act
        blog_response = BlogResponse(**response_data)
        json_data = blog_response.model_dump_json()
        
        # Assert
        assert "blog-123" in json_data
        assert "Test Blog" in json_data
        assert "word_count" in json_data