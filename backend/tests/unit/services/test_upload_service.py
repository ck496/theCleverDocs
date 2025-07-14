import pytest
import asyncio
import json
import uuid
from unittest.mock import Mock, patch, mock_open
from typing import Dict, Any

from models.upload import MarkdownUploadRequest, UploadMetadata
from services.upload_service import UploadService

# Configure pytest-asyncio
pytest_plugins = ("pytest_asyncio",)


class TestUploadService:
    """Test suite for UploadService"""

    def setup_method(self):
        """Set up test environment"""
        self.upload_service = UploadService()
        self.sample_markdown = """# Test Blog Post

This is a test blog post with markdown content.

## Introduction

This is the introduction section.

### Key Points

- Point 1
- Point 2
- Point 3

```python
print("Hello, World!")
```

## Conclusion

This is the conclusion.
"""

    def test_extract_title_from_h1(self):
        """Test title extraction from H1 heading"""
        content = "# My Blog Title\n\nContent here"
        title = self.upload_service._extract_title(content, "test.md")
        assert title == "My Blog Title"

    def test_extract_title_from_filename(self):
        """Test title extraction from filename when no H1"""
        content = "Just content without H1"
        title = self.upload_service._extract_title(content, "my-blog-post.md")
        assert title == "My Blog Post"

    def test_generate_excerpt_short_content(self):
        """Test excerpt generation for short content"""
        content = "This is a short paragraph."
        excerpt = self.upload_service._generate_excerpt(content)
        assert excerpt == "This is a short paragraph."

    def test_generate_excerpt_long_content(self):
        """Test excerpt generation for long content"""
        content = "This is a very long paragraph that should be truncated because it exceeds the maximum length limit for excerpts in the system."
        excerpt = self.upload_service._generate_excerpt(content, max_length=50)
        assert len(excerpt) <= 53  # 50 + "..."
        assert excerpt.endswith("...")

    def test_calculate_read_time(self):
        """Test read time calculation"""
        content = " ".join(["word"] * 200)  # 200 words
        read_time = self.upload_service._calculate_read_time(content)
        assert read_time == "1 min read"

        content = " ".join(["word"] * 400)  # 400 words
        read_time = self.upload_service._calculate_read_time(content)
        assert read_time == "2 min read"

    def test_extract_tags(self):
        """Test tag extraction (MVP version)"""
        content = "Some content here"
        tags = self.upload_service._extract_tags(content)
        assert tags == ["Tech", "Tutorial", "Documentation"]

    def test_select_cover_image(self):
        """Test cover image selection (MVP version)"""
        title = "Test Title"
        cover_image = self.upload_service._select_cover_image(title)
        assert cover_image.startswith("https://")
        assert "unsplash.com" in cover_image

    @pytest.mark.asyncio
    @patch('services.upload_service.uuid.uuid4')
    @patch('services.upload_service.datetime')
    @patch.object(UploadService, '_extract_title')
    @patch.object(UploadService, '_generate_excerpt')
    @patch.object(UploadService, '_calculate_read_time')
    @patch.object(UploadService, '_extract_tags')
    @patch.object(UploadService, '_select_cover_image')
    async def test_process_markdown_upload_success(
        self, 
        mock_select_cover_image,
        mock_extract_tags,
        mock_calculate_read_time,
        mock_generate_excerpt,
        mock_extract_title,
        mock_datetime,
        mock_uuid
    ):
        """Test successful markdown upload processing"""
        # Mock dependencies
        mock_uuid.return_value = "test-uuid"
        mock_datetime.now.return_value.strftime.return_value = "2024-01-01"
        mock_extract_title.return_value = "Test Title"
        mock_generate_excerpt.return_value = "Test excerpt"
        mock_calculate_read_time.return_value = "5 min read"
        mock_extract_tags.return_value = ["Tech", "Tutorial"]
        mock_select_cover_image.return_value = "https://example.com/image.jpg"

        # Mock validator
        self.upload_service.markdown_validator.validate = Mock(return_value=(True, []))

        # Mock content generator
        mock_content = {
            "beginner": "Beginner content",
            "intermediate": "Intermediate content",
            "expert": "Expert content"
        }
        self.upload_service.content_generator.generate_expertise_versions = Mock(return_value=asyncio.Future())
        self.upload_service.content_generator.generate_expertise_versions.return_value.set_result(mock_content)

        # Mock blog service
        self.upload_service.blog_service.add_blog = Mock()

        # Create test request
        request = MarkdownUploadRequest(
            filename="test.md",
            content=self.sample_markdown,
            metadata=UploadMetadata(source="file_upload")
        )

        # Execute
        result = await self.upload_service.process_markdown_upload(request)

        # Assertions
        assert result["blog_id"] == "test-uuid"
        assert result["title"] == "Test Title"
        assert "processing_time_ms" in result
        assert result["expertise_levels"] == ["beginner", "intermediate", "expert"]

        # Verify service calls
        self.upload_service.markdown_validator.validate.assert_called_once_with(self.sample_markdown)
        self.upload_service.content_generator.generate_expertise_versions.assert_called_once()
        self.upload_service.blog_service.add_blog.assert_called_once()

    @pytest.mark.asyncio
    async def test_process_markdown_upload_validation_error(self):
        """Test upload processing with validation error"""
        # Mock validator to return error
        self.upload_service.markdown_validator.validate = Mock(return_value=(False, ["Invalid markdown"]))

        # Create test request
        request = MarkdownUploadRequest(
            filename="test.md",
            content="Invalid markdown content",
            metadata=UploadMetadata(source="file_upload")
        )

        # Execute and assert error
        with pytest.raises(ValueError) as exc_info:
            await self.upload_service.process_markdown_upload(request)

        assert "Invalid markdown: Invalid markdown" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_process_markdown_upload_content_generator_error(self):
        """Test upload processing with content generator error"""
        # Mock validator to pass
        self.upload_service.markdown_validator.validate = Mock(return_value=(True, []))

        # Mock content generator to raise error
        failing_future = asyncio.Future()
        failing_future.set_exception(Exception("AI service error"))
        self.upload_service.content_generator.generate_expertise_versions = Mock(
            return_value=failing_future
        )

        # Create test request
        request = MarkdownUploadRequest(
            filename="test.md",
            content=self.sample_markdown,
            metadata=UploadMetadata(source="file_upload")
        )

        # Execute and assert error
        with pytest.raises(Exception) as exc_info:
            await self.upload_service.process_markdown_upload(request)

        assert "AI service error" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_process_markdown_upload_blog_service_error(self):
        """Test upload processing with blog service error"""
        # Mock validator to pass
        self.upload_service.markdown_validator.validate = Mock(return_value=(True, []))

        # Mock content generator to succeed
        mock_content = {
            "beginner": "Beginner content",
            "intermediate": "Intermediate content",
            "expert": "Expert content"
        }
        self.upload_service.content_generator.generate_expertise_versions = Mock(return_value=asyncio.Future())
        self.upload_service.content_generator.generate_expertise_versions.return_value.set_result(mock_content)

        # Mock blog service to raise error
        self.upload_service.blog_service.add_blog = Mock(side_effect=Exception("Database error"))

        # Create test request
        request = MarkdownUploadRequest(
            filename="test.md",
            content=self.sample_markdown,
            metadata=UploadMetadata(source="file_upload")
        )

        # Execute and assert error
        with pytest.raises(Exception) as exc_info:
            await self.upload_service.process_markdown_upload(request)

        assert "Database error" in str(exc_info.value)


if __name__ == "__main__":
    pytest.main([__file__])