import pytest
import asyncio
from services.content_generator import ContentGenerator


class TestContentGenerator:
    """Test suite for ContentGenerator"""

    def setup_method(self):
        """Set up test environment"""
        self.generator = ContentGenerator()

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_structure(self):
        """Test that generate_expertise_versions returns correct structure"""
        original_content = "# Test Content\n\nThis is test content."
        title = "Test Title"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Check structure
        assert isinstance(result, dict)
        assert "beginner" in result
        assert "intermediate" in result
        assert "expert" in result
        
        # Check all values are strings
        assert isinstance(result["beginner"], str)
        assert isinstance(result["intermediate"], str)
        assert isinstance(result["expert"], str)
        
        # Check all values are non-empty
        assert len(result["beginner"]) > 0
        assert len(result["intermediate"]) > 0
        assert len(result["expert"]) > 0

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_title_inclusion(self):
        """Test that title is included in generated content"""
        original_content = "# Test Content\n\nThis is test content."
        title = "My Awesome Blog Post"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Check title is included in all versions
        assert title in result["beginner"]
        assert title in result["intermediate"]
        assert title in result["expert"]

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_original_content_preservation(self):
        """Test that original content is preserved in intermediate version"""
        original_content = "# Test Content\n\nThis is unique test content that should be preserved."
        title = "Test Title"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Intermediate version should contain original content
        assert original_content in result["intermediate"]

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_differentiation(self):
        """Test that different expertise levels have distinct content"""
        original_content = "# Test Content\n\nThis is test content."
        title = "Test Title"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # All versions should be different
        assert result["beginner"] != result["intermediate"]
        assert result["intermediate"] != result["expert"]
        assert result["beginner"] != result["expert"]

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_mock_indicators(self):
        """Test that mock content indicators are present"""
        original_content = "# Test Content\n\nThis is test content."
        title = "Test Title"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Check for mock indicators in all versions
        assert "mock content" in result["beginner"].lower()
        assert "mock content" in result["intermediate"].lower()
        assert "mock content" in result["expert"].lower()

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_aws_bedrock_todos(self):
        """Test that AWS Bedrock TODO comments are present"""
        original_content = "# Test Content\n\nThis is test content."
        title = "Test Title"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Check for AWS Bedrock TODO mentions
        assert "AWS Bedrock" in result["beginner"]
        assert "AWS Bedrock" in result["intermediate"]
        assert "AWS Bedrock" in result["expert"]

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_level_specific_content(self):
        """Test that each level has appropriate content characteristics"""
        original_content = "# Test Content\n\nThis is test content."
        title = "Test Title"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Beginner should have "simplified" or "beginner" keywords
        beginner_lower = result["beginner"].lower()
        assert any(keyword in beginner_lower for keyword in ["beginner", "simplified", "easy", "basic"])
        
        # Intermediate should have "comprehensive" or "practical" keywords
        intermediate_lower = result["intermediate"].lower()
        assert any(keyword in intermediate_lower for keyword in ["comprehensive", "practical", "detailed"])
        
        # Expert should have "advanced" or "expert" keywords
        expert_lower = result["expert"].lower()
        assert any(keyword in expert_lower for keyword in ["expert", "advanced", "deep", "sophisticated"])

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_empty_content(self):
        """Test behavior with empty original content"""
        original_content = ""
        title = "Empty Content Test"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Should still return structure with title
        assert isinstance(result, dict)
        assert "beginner" in result
        assert "intermediate" in result
        assert "expert" in result
        
        # All should contain the title
        assert title in result["beginner"]
        assert title in result["intermediate"]
        assert title in result["expert"]

    @pytest.mark.asyncio
    async def test_generate_expertise_versions_long_content(self):
        """Test behavior with long original content"""
        original_content = "# Long Content\n\n" + "This is a very long paragraph. " * 100
        title = "Long Content Test"
        
        result = await self.generator.generate_expertise_versions(original_content, title)
        
        # Should handle long content without issues
        assert isinstance(result, dict)
        assert len(result["beginner"]) > 0
        assert len(result["intermediate"]) > 0
        assert len(result["expert"]) > 0

    @pytest.mark.asyncio
    async def test_simplify_content_basic(self):
        """Test the _simplify_content helper method"""
        content = "Line 1\nLine 2\nLine 3\n\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11\nLine 12"
        
        simplified = self.generator._simplify_content(content)
        
        # Should be a string
        assert isinstance(simplified, str)
        
        # Should contain simplification indicator
        assert "simplified for beginners" in simplified.lower()
        
        # Should contain part of the original content plus the simplification message
        assert "Line 1" in simplified
        assert "[Content simplified for beginners...]" in simplified

    @pytest.mark.asyncio
    async def test_simplify_content_empty(self):
        """Test _simplify_content with empty content"""
        content = ""
        
        simplified = self.generator._simplify_content(content)
        
        # Should still return a string with simplification indicator
        assert isinstance(simplified, str)
        assert "simplified for beginners" in simplified.lower()

    @pytest.mark.asyncio
    async def test_simplify_content_short(self):
        """Test _simplify_content with short content"""
        content = "Short content here"
        
        simplified = self.generator._simplify_content(content)
        
        # Should include original content and simplification indicator
        assert isinstance(simplified, str)
        assert "simplified for beginners" in simplified.lower()


if __name__ == "__main__":
    pytest.main([__file__])