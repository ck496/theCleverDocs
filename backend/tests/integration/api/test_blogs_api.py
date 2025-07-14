"""
Integration tests for the blogs API endpoints.

These tests use the actual FastAPI test client to verify
the full request/response cycle.
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import patch
import json


class TestBlogsAPI:
    """Integration tests for blog-related endpoints."""
    
    @pytest.fixture
    def client(self):
        """Create test client using actual blog data."""
        from api import app
        return TestClient(app)
    
    # Test 1: Expected use case - Get blogs successfully
    def test_get_blogs_returns_success_response(self, client):
        """Test that GET /blogs returns a successful response with blog data."""
        # Act
        response = client.get("/blogs")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert isinstance(data["data"], list)
        assert len(data["data"]) == 6
        assert data["total"] == 6
        assert data["filteredTotal"] == 6
        
        # Verify blog structure
        first_blog = data["data"][0]
        assert "id" in first_blog
        assert "title" in first_blog
        assert "content" in first_blog
        assert "author" in first_blog
        assert "docType" in first_blog
    
    # Test 2: Expected use case - Get blogs with expertise level filter
    def test_get_blogs_with_expertise_level_filter(self, client):
        """Test that blogs can be filtered by expertise level."""
        # Act
        response = client.get("/blogs?expertiseLevel=beginner")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert len(data["data"]) == 6
        
        # Verify content is adapted for beginner level
        for blog in data["data"]:
            assert isinstance(blog["content"], str)  # Content should be string, not dict
            # Check that beginner-level content is present
            if blog["id"] == "1":
                assert "Kubernetes can seem complex" in blog["content"]
    
    # Test 3: Expected use case - Get blogs with docType filter
    def test_get_blogs_with_doc_type_filter(self, client):
        """Test that blogs can be filtered by docType."""
        # Act
        response = client.get("/blogs?docType=official")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert len(data["data"]) == 2  # Should have 2 official blogs
        for blog in data["data"]:
            assert blog["docType"] == "official"
    
    # Test 4: Expected use case - Get blogs with tags filter
    def test_get_blogs_with_tags_filter(self, client):
        """Test that blogs can be filtered by tags."""
        # Act
        response = client.get("/blogs?tags=DevOps,Security")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert len(data["data"]) >= 1  # At least one blog should have these tags
        
        for blog in data["data"]:
            assert any(tag in blog["tags"] for tag in ["DevOps", "Security"])
    
    # Test 5: Expected use case - Get blogs with combined filters
    def test_get_blogs_with_combined_filters(self, client):
        """Test that multiple filters work together."""
        # Act
        response = client.get("/blogs?docType=community&tags=Kubernetes&expertiseLevel=intermediate")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert len(data["data"]) >= 1
        for blog in data["data"]:
            assert blog["docType"] == "community"
            assert "Kubernetes" in blog["tags"]
            assert isinstance(blog["content"], str)  # Content should be adapted
    
    # Test 6: Edge case - Get blogs with no results
    def test_get_blogs_with_no_results(self, client):
        """Test that filtering with no matches returns empty data."""
        # Act
        response = client.get("/blogs?docType=community&tags=nonexistent")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert len(data["data"]) == 0
        assert data["total"] == 6  # Total blogs unchanged
        assert data["filteredTotal"] == 0  # But filtered total is 0
    
    # Test 7: Failure case - Invalid docType parameter
    def test_get_blogs_with_invalid_doc_type_returns_400(self, client):
        """Test that invalid docType returns 400 error."""
        # Act
        response = client.get("/blogs?docType=invalid_type")
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        error_detail = response.json()["detail"]
        assert "Invalid docType" in error_detail
    
    # Test 8: Failure case - Invalid expertise level parameter
    def test_get_blogs_with_invalid_expertise_level_returns_400(self, client):
        """Test that invalid expertise level returns 400 error."""
        # Act
        response = client.get("/blogs?expertiseLevel=super-expert")
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        error_detail = response.json()["detail"]
        assert "Invalid expertiseLevel" in error_detail
    
    # Test 9: Failure case - Invalid endpoint
    def test_get_invalid_endpoint_returns_404(self, client):
        """Test that invalid endpoints return 404."""
        # Act
        response = client.get("/invalid-endpoint")
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    # Test 10: Edge case - Empty tags parameter
    def test_get_blogs_with_empty_tags_parameter(self, client):
        """Test that empty tags parameter is handled gracefully."""
        # Act
        response = client.get("/blogs?tags=")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert len(data["data"]) == 6  # Should return all blogs
    
    # Test 11: Root endpoint
    def test_root_endpoint_returns_hello_world(self, client):
        """Test that root endpoint returns expected message."""
        # Act
        response = client.get("/")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Hello, World!"
    
    # Test 12: Individual blog endpoint - Get blog without expertise level
    def test_get_individual_blog_without_expertise_level(self, client):
        """Test that GET /blogs/{blog_id} returns individual blog without expertise level."""
        # Act
        response = client.get("/blogs/1")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert "data" in data
        assert data["data"]["id"] == "1"
        assert "title" in data["data"]
        assert "content" in data["data"]
        assert isinstance(data["data"]["content"], dict)  # Should be dict when no expertise level
        assert "beginner" in data["data"]["content"]
        assert "intermediate" in data["data"]["content"]
        assert "expert" in data["data"]["content"]
    
    # Test 13: Individual blog endpoint - Get blog with expert level
    def test_get_individual_blog_with_expert_level(self, client):
        """Test that GET /blogs/{blog_id}?expertiseLevel=expert returns adapted content."""
        # Act
        response = client.get("/blogs/1?expertiseLevel=expert")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert data["data"]["id"] == "1"
        assert isinstance(data["data"]["content"], str)  # Should be string when expertise level specified
        assert "Advanced Kubernetes" in data["data"]["content"]
    
    # Test 14: Individual blog endpoint - Get blog with beginner level
    def test_get_individual_blog_with_beginner_level(self, client):
        """Test that GET /blogs/{blog_id}?expertiseLevel=beginner returns adapted content."""
        # Act
        response = client.get("/blogs/1?expertiseLevel=beginner")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert data["data"]["id"] == "1"
        assert isinstance(data["data"]["content"], str)  # Should be string when expertise level specified
        assert "Kubernetes can seem complex" in data["data"]["content"]
    
    # Test 15: Individual blog endpoint - Get blog with intermediate level
    def test_get_individual_blog_with_intermediate_level(self, client):
        """Test that GET /blogs/{blog_id}?expertiseLevel=intermediate returns adapted content."""
        # Act
        response = client.get("/blogs/1?expertiseLevel=intermediate")
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert data["data"]["id"] == "1"
        assert isinstance(data["data"]["content"], str)  # Should be string when expertise level specified
        assert "Kubernetes Deployment Strategies" in data["data"]["content"]
    
    # Test 16: Individual blog endpoint - Blog not found
    def test_get_individual_blog_not_found(self, client):
        """Test that GET /blogs/{blog_id} returns 404 for non-existent blog."""
        # Act
        response = client.get("/blogs/999")
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
        data = response.json()
        assert "Blog with ID '999' not found" in data["detail"]
    
    # Test 17: Individual blog endpoint - Invalid expertise level
    def test_get_individual_blog_invalid_expertise_level(self, client):
        """Test that GET /blogs/{blog_id} returns 400 for invalid expertise level."""
        # Act
        response = client.get("/blogs/1?expertiseLevel=invalid")
        
        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()
        assert "Invalid expertiseLevel" in data["detail"]