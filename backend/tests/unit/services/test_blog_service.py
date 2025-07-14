"""
Unit tests for BlogService with new content structure.

Tests focus on expertise level filtering and content adaptation.
"""
import pytest
import json
import os
from unittest.mock import Mock, patch, mock_open
from fastapi import HTTPException
from services.blog_service import BlogService
from models.blog import Blog


class TestBlogService:
    """Test suite for BlogService following the 3-test pattern."""
    
    @pytest.fixture
    def service(self):
        """Create BlogService instance with cleared cache."""
        service = BlogService()
        service._cached_blogs = None
        return service
    
    @pytest.fixture
    def sample_blogs_data(self):
        """Sample blog data with new content structure."""
        return [
            {
                "id": "1",
                "title": "Python Testing Guide",
                "excerpt": "Learn Python testing fundamentals",
                "content": {
                    "beginner": "Python testing is about checking if your code works correctly...",
                    "intermediate": "Testing in Python involves unit tests, integration tests, and mocking...",
                    "expert": "Advanced testing strategies include property-based testing and mutation testing..."
                },
                "author": {
                    "name": "Test Author",
                    "avatar": "https://example.com/avatar.jpg"
                },
                "publishedAt": "2024-01-15",
                "readTime": "8 min read",
                "tags": ["python", "testing", "development"],
                "coverImage": "https://example.com/cover.jpg",
                "avgRating": 4.5,
                "totalRatings": 100,
                "docType": "community"
            },
            {
                "id": "2",
                "title": "FastAPI Best Practices",
                "excerpt": "Official FastAPI development guide",
                "content": {
                    "beginner": "FastAPI is a modern Python web framework...",
                    "intermediate": "FastAPI provides automatic API documentation and validation...",
                    "expert": "Advanced FastAPI features include dependency injection and middleware..."
                },
                "author": {
                    "name": "Platform Team",
                    "avatar": "https://example.com/team-avatar.jpg"
                },
                "publishedAt": "2024-01-20",
                "readTime": "12 min read",
                "tags": ["fastapi", "python", "api"],
                "coverImage": "https://example.com/fastapi-cover.jpg",
                "avgRating": 4.8,
                "totalRatings": 200,
                "docType": "official",
                "teamInfo": {
                    "teamName": "Backend Team",
                    "email": "backend@example.com"
                }
            }
        ]
    
    # Test 1: Expected use case - Load blogs successfully
    def test_load_blogs_from_shared_success(self, service, sample_blogs_data):
        """Test that blogs are loaded successfully from shared data."""
        # Arrange
        mock_json_data = json.dumps(sample_blogs_data)
        
        with patch("builtins.open", mock_open(read_data=mock_json_data)), \
             patch("os.path.exists", return_value=True):
            
            # Act
            blogs = service.load_blogs_from_shared()
            
            # Assert
            assert len(blogs) == 2
            assert blogs[0].id == "1"
            assert blogs[0].title == "Python Testing Guide"
            assert isinstance(blogs[0].content, dict)
            assert "beginner" in blogs[0].content
            assert "intermediate" in blogs[0].content
            assert "expert" in blogs[0].content
            assert blogs[1].docType == "official"
            assert blogs[1].teamInfo is not None
    
    # Test 2: Expected use case - Filter blogs by expertise level
    def test_filter_blogs_by_expertise_level_success(self, service, sample_blogs_data):
        """Test that blogs are filtered and content adapted by expertise level."""
        # Arrange
        blogs = [Blog(**blog_data) for blog_data in sample_blogs_data]
        expertise_level = "beginner"
        
        # Act
        filtered_blogs = service.filter_blogs(blogs, None, None, expertise_level)
        
        # Assert
        assert len(filtered_blogs) == 2
        for blog in filtered_blogs:
            assert isinstance(blog.content, str)  # Content should be adapted to string
            assert "beginner" in blog.content or "Python" in blog.content
        
        # Check that beginner content was selected
        first_blog = filtered_blogs[0]
        assert "checking if your code works correctly" in first_blog.content
    
    # Test 3: Expected use case - Filter blogs by docType
    def test_filter_blogs_by_doc_type_success(self, service, sample_blogs_data):
        """Test that blogs are filtered by docType successfully."""
        # Arrange
        blogs = [Blog(**blog_data) for blog_data in sample_blogs_data]
        doc_type = "official"
        
        # Act
        filtered_blogs = service.filter_blogs(blogs, doc_type, None, None)
        
        # Assert
        assert len(filtered_blogs) == 1
        assert filtered_blogs[0].docType == "official"
        assert filtered_blogs[0].title == "FastAPI Best Practices"
    
    # Test 4: Expected use case - Filter blogs by tags
    def test_filter_blogs_by_tags_success(self, service, sample_blogs_data):
        """Test that blogs are filtered by tags successfully."""
        # Arrange
        blogs = [Blog(**blog_data) for blog_data in sample_blogs_data]
        tags = ["python", "testing"]
        
        # Act
        filtered_blogs = service.filter_blogs(blogs, None, tags, None)
        
        # Assert
        assert len(filtered_blogs) == 2  # Both blogs have 'python' tag
        for blog in filtered_blogs:
            assert any(tag in blog.tags for tag in ["python", "testing"])
    
    # Test 5: Edge case - Empty blogs list
    def test_filter_blogs_with_empty_list(self, service):
        """Test that filtering empty blogs list returns empty list."""
        # Arrange
        empty_blogs = []
        
        # Act
        filtered_blogs = service.filter_blogs(empty_blogs, None, None, "beginner")
        
        # Assert
        assert len(filtered_blogs) == 0
    
    # Test 6: Edge case - Blog without specific expertise level in content
    def test_filter_blogs_without_specific_expertise_level(self, service):
        """Test that blogs without specific expertise level are handled gracefully."""
        # Arrange
        blog_missing_level = Blog(
            id="3",
            title="Incomplete Blog",
            excerpt="Blog missing some expertise levels",
            content={
                "beginner": "Only has beginner content",
                "intermediate": "And intermediate content"
                # Missing "expert" level
            },
            author={"name": "Author", "avatar": "https://example.com/avatar.jpg"},
            publishedAt="2024-01-15",
            readTime="5 min read",
            tags=["simple"],
            coverImage="https://example.com/cover.jpg",
            avgRating=4.0,
            totalRatings=50,
            docType="community"
        )
        
        # Act - Try to filter for expert level which doesn't exist
        filtered_blogs = service.filter_blogs([blog_missing_level], None, None, "expert")
        
        # Assert
        assert len(filtered_blogs) == 1
        # Since expert level doesn't exist, original content structure should be preserved
        assert isinstance(filtered_blogs[0].content, dict)
    
    # Test 7: Failure case - Invalid docType raises error
    def test_filter_blogs_with_invalid_doc_type_raises_error(self, service, sample_blogs_data):
        """Test that invalid docType raises HTTPException."""
        # Arrange
        blogs = [Blog(**blog_data) for blog_data in sample_blogs_data]
        invalid_doc_type = "invalid_type"
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.filter_blogs(blogs, invalid_doc_type, None, None)
        
        assert exc_info.value.status_code == 400
        assert "Invalid docType" in str(exc_info.value.detail)
    
    # Test 8: Failure case - Invalid expertise level raises error
    def test_filter_blogs_with_invalid_expertise_level_raises_error(self, service, sample_blogs_data):
        """Test that invalid expertise level raises HTTPException."""
        # Arrange
        blogs = [Blog(**blog_data) for blog_data in sample_blogs_data]
        invalid_expertise_level = "super-expert"
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.filter_blogs(blogs, None, None, invalid_expertise_level)
        
        assert exc_info.value.status_code == 400
        assert "Invalid expertiseLevel" in str(exc_info.value.detail)
    
    # Test 9: Failure case - File not found raises error
    def test_load_blogs_file_not_found_raises_error(self, service):
        """Test that missing blog data file raises HTTPException."""
        # Arrange
        with patch("builtins.open", side_effect=FileNotFoundError("File not found")):
            
            # Act & Assert
            with pytest.raises(HTTPException) as exc_info:
                service.load_blogs_from_shared()
            
            assert exc_info.value.status_code == 500
            assert "Blog data unavailable" in str(exc_info.value.detail)
    
    # Test 10: Failure case - Invalid JSON raises error
    def test_load_blogs_invalid_json_raises_error(self, service):
        """Test that invalid JSON in blog data raises HTTPException."""
        # Arrange
        invalid_json = "{ invalid json content"
        
        with patch("builtins.open", mock_open(read_data=invalid_json)):
            
            # Act & Assert
            with pytest.raises(HTTPException) as exc_info:
                service.load_blogs_from_shared()
            
            assert exc_info.value.status_code == 500
            assert "Blog data corrupted" in str(exc_info.value.detail)
    
    # Test 11: Caching behavior
    def test_load_blogs_caching_behavior(self, service, sample_blogs_data):
        """Test that blog data is cached after first load."""
        # Arrange
        mock_json_data = json.dumps(sample_blogs_data)
        
        with patch("builtins.open", mock_open(read_data=mock_json_data)) as mock_file:
            
            # Act
            blogs1 = service.load_blogs_from_shared()
            blogs2 = service.load_blogs_from_shared()
            
            # Assert
            assert len(blogs1) == 2
            assert len(blogs2) == 2
            assert blogs1 is blogs2  # Same cached instance
            mock_file.assert_called_once()  # File only read once
    
    # Test 12: Combined filtering
    def test_filter_blogs_combined_filters(self, service, sample_blogs_data):
        """Test that multiple filters work together correctly."""
        # Arrange
        blogs = [Blog(**blog_data) for blog_data in sample_blogs_data]
        
        # Act
        filtered_blogs = service.filter_blogs(
            blogs, 
            doc_type="community", 
            tags=["python"], 
            expertise_level="intermediate"
        )
        
        # Assert
        assert len(filtered_blogs) == 1
        assert filtered_blogs[0].docType == "community"
        assert "python" in filtered_blogs[0].tags
        assert "unit tests, integration tests" in filtered_blogs[0].content
    
    # Test 13: Get blog by ID - Success case
    def test_get_blog_by_id_success(self, service, sample_blogs_data):
        """Test that get_blog_by_id returns correct blog."""
        # Arrange
        mock_json_data = json.dumps(sample_blogs_data)
        
        with patch("builtins.open", mock_open(read_data=mock_json_data)):
            # Act
            blog = service.get_blog_by_id("1")
            
            # Assert
            assert blog is not None
            assert blog.id == "1"
            assert blog.title == "Python Testing Guide"
            assert isinstance(blog.content, dict)
            assert "beginner" in blog.content
    
    # Test 14: Get blog by ID with expertise level - Success case
    def test_get_blog_by_id_with_expertise_level_success(self, service, sample_blogs_data):
        """Test that get_blog_by_id with expertise level returns adapted content."""
        # Arrange
        mock_json_data = json.dumps(sample_blogs_data)
        
        with patch("builtins.open", mock_open(read_data=mock_json_data)):
            # Act
            blog = service.get_blog_by_id("1", "expert")
            
            # Assert
            assert blog is not None
            assert blog.id == "1"
            assert blog.title == "Python Testing Guide"
            assert isinstance(blog.content, str)
            assert "Advanced testing strategies" in blog.content
    
    # Test 15: Get blog by ID - Blog not found
    def test_get_blog_by_id_not_found(self, service, sample_blogs_data):
        """Test that get_blog_by_id returns None for non-existent blog."""
        # Arrange
        mock_json_data = json.dumps(sample_blogs_data)
        
        with patch("builtins.open", mock_open(read_data=mock_json_data)):
            # Act
            blog = service.get_blog_by_id("999")
            
            # Assert
            assert blog is None
    
    # Test 16: Get blog by ID with invalid expertise level
    def test_get_blog_by_id_invalid_expertise_level_raises_error(self, service, sample_blogs_data):
        """Test that get_blog_by_id with invalid expertise level raises error."""
        # Arrange
        mock_json_data = json.dumps(sample_blogs_data)
        
        with patch("builtins.open", mock_open(read_data=mock_json_data)):
            # Act & Assert
            with pytest.raises(HTTPException) as exc_info:
                service.get_blog_by_id("1", "invalid")
            
            assert exc_info.value.status_code == 400
            assert "Invalid expertiseLevel" in str(exc_info.value.detail)
    
    # Test 17: Get blog by ID with expertise level not in content
    def test_get_blog_by_id_missing_expertise_level_in_content(self, service):
        """Test that get_blog_by_id handles missing expertise level in content."""
        # Arrange
        blog_data = {
            "id": "1",
            "title": "Incomplete Blog",
            "excerpt": "Blog missing expert level",
            "content": {
                "beginner": "Beginner content",
                "intermediate": "Intermediate content"
                # Missing expert level
            },
            "author": {"name": "Author", "avatar": "https://example.com/avatar.jpg"},
            "publishedAt": "2024-01-15",
            "readTime": "5 min read",
            "tags": ["test"],
            "coverImage": "https://example.com/cover.jpg",
            "avgRating": 4.0,
            "totalRatings": 50,
            "docType": "community"
        }
        
        mock_json_data = json.dumps([blog_data])
        
        with patch("builtins.open", mock_open(read_data=mock_json_data)):
            # Act
            blog = service.get_blog_by_id("1", "expert")
            
            # Assert
            assert blog is not None
            assert blog.id == "1"
            # Should return original content structure when expertise level doesn't exist
            assert isinstance(blog.content, dict)
            assert "beginner" in blog.content
            assert "intermediate" in blog.content