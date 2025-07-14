"""
Integration tests for the blogs API endpoints.

These tests use the actual FastAPI test client to verify
the full request/response cycle.
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
        assert "author" in first_blog
    
    # Test 2: Edge case - Get blogs with query parameters
    def test_get_blogs_with_filters(self, client):
        """Test that blogs can be filtered by query parameters."""
        # Act
        response = client.get("/api/blogs?expertise_level=beginner")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # All returned blogs should be beginner level
        for blog in data:
            if "expertise_level" in blog:
                assert blog["expertise_level"] == "beginner"
    
    # Test 3: Failure case - Invalid endpoint
    def test_get_invalid_endpoint_returns_404(self, client):
        """Test that invalid endpoints return 404."""
        # Act
        response = client.get("/api/invalid-endpoint")
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    # Additional test: Create blog (if endpoint exists)
    @pytest.mark.skip(reason="POST /api/blogs endpoint not yet implemented")
    def test_create_blog_with_valid_data(self, client, sample_blog_data):
        """Test creating a new blog post."""
        # Act
        response = client.post("/api/blogs", json=sample_blog_data)
        
        # Assert
        assert response.status_code == status.HTTP_201_CREATED
        created_blog = response.json()
        assert created_blog["title"] == sample_blog_data["title"]
        assert "id" in created_blog
    
    # Test error handling
    @pytest.mark.skip(reason="POST /api/blogs endpoint not yet implemented")
    def test_create_blog_with_invalid_data_returns_422(self, client):
        """Test that invalid blog data returns validation error."""
        # Arrange
        invalid_data = {
            "title": "",  # Empty title should be invalid
            "content": "Content without title"
        }
        
        # Act
        response = client.post("/api/blogs", json=invalid_data)
        
        # Assert
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        error_detail = response.json()["detail"]
        assert any("title" in str(error).lower() for error in error_detail)