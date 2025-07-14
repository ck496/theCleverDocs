"""
Unit tests for Pydantic models used in the blog feature.

Tests focus on validation logic and serialization.
"""
import pytest
from pydantic import ValidationError
from models.blog import Blog, Author, TeamInfo, BlogsResponse


class TestBlogModels:
    """Test suite for blog-related Pydantic models."""
    
    # Test 1: Expected use case - Valid blog with new content structure
    def test_blog_with_valid_expertise_content(self):
        """Test that valid blog data with expertise content creates model successfully."""
        # Arrange
        valid_data = {
            "id": "1",
            "title": "Understanding Python Type Hints",
            "excerpt": "A comprehensive guide to Python type hints",
            "content": {
                "beginner": "Python type hints are simple annotations that help...",
                "intermediate": "Type hints in Python provide static type information...",
                "expert": "Advanced type hinting with generics and protocols..."
            },
            "author": {
                "name": "Jane Developer",
                "avatar": "https://example.com/avatar.jpg"
            },
            "publishedAt": "2024-01-15",
            "readTime": "5 min read",
            "tags": ["python", "types", "best-practices"],
            "coverImage": "https://example.com/cover.jpg",
            "avgRating": 4.5,
            "totalRatings": 120,
            "docType": "community"
        }
        
        # Act
        blog = Blog(**valid_data)
        
        # Assert
        assert blog.title == valid_data["title"]
        assert isinstance(blog.content, dict)
        assert "beginner" in blog.content
        assert "intermediate" in blog.content
        assert "expert" in blog.content
        assert blog.author.name == "Jane Developer"
        assert blog.docType == "community"
        assert len(blog.tags) == 3
    
    # Test 2: Edge case - Official blog with team info
    def test_blog_with_official_doc_type_and_team_info(self):
        """Test official blog with required team info."""
        # Arrange
        official_data = {
            "id": "2",
            "title": "Official Documentation",
            "excerpt": "Official guide to our platform",
            "content": {
                "beginner": "Welcome to our platform...",
                "intermediate": "Our platform provides advanced features...",
                "expert": "Enterprise-level configuration and customization..."
            },
            "author": {
                "name": "Team Lead",
                "avatar": "https://example.com/team-avatar.jpg"
            },
            "publishedAt": "2024-01-20",
            "readTime": "10 min read",
            "tags": ["official", "documentation"],
            "coverImage": "https://example.com/official-cover.jpg",
            "avgRating": 4.8,
            "totalRatings": 200,
            "docType": "official",
            "teamInfo": {
                "teamName": "Platform Team",
                "email": "platform@example.com"
            }
        }
        
        # Act
        blog = Blog(**official_data)
        
        # Assert
        assert blog.docType == "official"
        assert blog.teamInfo is not None
        assert blog.teamInfo.teamName == "Platform Team"
        assert blog.teamInfo.email == "platform@example.com"
    
    # Test 3: Failure case - Invalid content structure raises error
    def test_blog_with_invalid_content_structure_raises_error(self):
        """Test that invalid content structure raises validation error."""
        # Arrange
        invalid_data = {
            "id": "3",
            "title": "Invalid Content Blog",
            "excerpt": "This blog has invalid content structure",
            "content": "This should be a dict with expertise levels",  # Invalid: should be dict
            "author": {
                "name": "Author",
                "avatar": "https://example.com/avatar.jpg"
            },
            "publishedAt": "2024-01-15",
            "readTime": "5 min read",
            "tags": ["test"],
            "coverImage": "https://example.com/cover.jpg",
            "avgRating": 4.0,
            "totalRatings": 50,
            "docType": "community"
        }
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            Blog(**invalid_data)
        
        errors = exc_info.value.errors()
        assert any("content" in str(error["loc"]) for error in errors)
    
    # Test 4: Failure case - Invalid docType raises error
    def test_blog_with_invalid_doc_type_raises_error(self):
        """Test that invalid docType raises validation error."""
        # Arrange
        invalid_data = {
            "id": "4",
            "title": "Invalid DocType Blog",
            "excerpt": "This blog has invalid docType",
            "content": {
                "beginner": "Content here",
                "intermediate": "More content",
                "expert": "Advanced content"
            },
            "author": {
                "name": "Author",
                "avatar": "https://example.com/avatar.jpg"
            },
            "publishedAt": "2024-01-15",
            "readTime": "5 min read",
            "tags": ["test"],
            "coverImage": "https://example.com/cover.jpg",
            "avgRating": 4.0,
            "totalRatings": 50,
            "docType": "invalid_type"  # Invalid: should be "official" or "community"
        }
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            Blog(**invalid_data)
        
        errors = exc_info.value.errors()
        assert any("docType" in str(error["loc"]) for error in errors)
    
    # Test 5: BlogsResponse model works correctly
    def test_blogs_response_model(self):
        """Test that BlogsResponse model serializes correctly."""
        # Arrange
        sample_blog = Blog(
            id="1",
            title="Test Blog",
            excerpt="Test excerpt",
            content={
                "beginner": "Beginner content",
                "intermediate": "Intermediate content",
                "expert": "Expert content"
            },
            author=Author(name="Author", avatar="https://example.com/avatar.jpg"),
            publishedAt="2024-01-15",
            readTime="5 min read",
            tags=["test"],
            coverImage="https://example.com/cover.jpg",
            avgRating=4.0,
            totalRatings=50,
            docType="community"
        )
        
        response_data = {
            "status": "success",
            "data": [sample_blog],
            "total": 1,
            "filteredTotal": 1
        }
        
        # Act
        response = BlogsResponse(**response_data)
        
        # Assert
        assert response.status == "success"
        assert len(response.data) == 1
        assert response.total == 1
        assert response.filteredTotal == 1
        assert response.data[0].id == "1"