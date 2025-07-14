# Backend Implementation Plan: Note → Blog Generation Feature

## Feature Overview

**Feature Name**: Note Upload and Blog Generation  
**PRD Reference**: Feature 5.1 Note → Blog Generation  
**Purpose**: Enable users to upload markdown notes and automatically generate three expertise-level versions (beginner, intermediate, expert) of blog content.

### Key Requirements
- Accept .md file uploads (max 1MB for MVP)
- Validate markdown syntax
- Generate 3 expertise levels of content (mock for MVP)
- Save generated blogs to shared/data/blogs.json
- Return generated blog ID for frontend navigation

### Out of Scope (MVP)
- PDF file processing (TODO: future feature)
- URL content extraction (TODO: future feature)
- Direct text input processing (TODO: future feature)
- AWS Bedrock AI integration (TODO: production feature)
- Real user authentication (TODO: production feature)

## API Design

### Upload Endpoint

**Endpoint**: `POST /api/upload/markdown`

**Purpose**: Accept markdown file upload and generate multi-level blog content

**Request**:
```json
{
  "filename": "my-notes.md",
  "content": "# My Technical Notes\n\nThis is my markdown content...",
  "metadata": {
    "source": "file_upload"
  }
}
```

**Response (Success - 201)**:
```json
{
  "status": "success",
  "message": "Blog generated successfully",
  "data": {
    "blog_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Technical Notes",
    "processing_time_ms": 1234,
    "expertise_levels": ["beginner", "intermediate", "expert"]
  }
}
```

**Response (Error - 400)**:
```json
{
  "status": "error",
  "message": "Invalid markdown file",
  "errors": [
    "File size exceeds 1MB limit",
    "Invalid markdown syntax at line 15"
  ]
}
```

## Data Models

### Request Models

```python
# backend/models/upload.py

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict
from datetime import datetime

class UploadMetadata(BaseModel):
    """Metadata for upload tracking"""
    source: str = Field(..., description="Source of upload: file_upload, text_input, url")
    # TODO: Add user_id when authentication is implemented
    # user_id: Optional[str] = None

class MarkdownUploadRequest(BaseModel):
    """Request model for markdown file upload"""
    filename: str = Field(..., min_length=1, max_length=255, description="Original filename")
    content: str = Field(..., min_length=10, max_length=1048576, description="Markdown content (max 1MB)")
    metadata: UploadMetadata
    
    @validator('filename')
    def validate_markdown_extension(cls, v):
        if not v.endswith('.md'):
            raise ValueError('Only .md files are allowed')
        return v
    
    @validator('content')
    def validate_content_size(cls, v):
        # 1MB limit check (1 char ≈ 1 byte for ASCII)
        if len(v) > 1048576:
            raise ValueError('Content exceeds 1MB limit')
        return v

class UploadResponse(BaseModel):
    """Response model for successful upload"""
    status: str
    message: str
    data: Dict[str, any]
```

### Blog Generation Models

```python
# backend/models/blog_generation.py

from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime
import uuid

class GeneratedBlogContent(BaseModel):
    """Model for generated blog content with expertise levels"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: Dict[str, str]  # {"beginner": "...", "intermediate": "...", "expert": "..."}
    author: Dict[str, str]  # {"name": "...", "avatar": "..."}
    publishedAt: str
    readTime: str
    tags: list[str]
    coverImage: str
    avgRating: float = 0.0
    totalRatings: int = 0
    docType: str = "community"
    
    # TODO: Replace with real user data when authentication is implemented
    @validator('author', pre=True, always=True)
    def set_default_author(cls, v):
        return {
            "name": "Tech Writer",  # TODO: Use authenticated user name
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=TechWriter"
        }
```

## Service Layer Design

### Upload Service

```python
# backend/services/upload_service.py

import logging
import re
from typing import Dict, Tuple
from datetime import datetime
import uuid

from models.upload import MarkdownUploadRequest
from models.blog_generation import GeneratedBlogContent
from services.markdown_validator import MarkdownValidator
from services.content_generator import ContentGenerator
from services.blog_service import BlogService

logger = logging.getLogger(__name__)

class UploadService:
    """Service for handling note uploads and blog generation"""
    
    def __init__(self):
        self.markdown_validator = MarkdownValidator()
        self.content_generator = ContentGenerator()
        self.blog_service = BlogService()
    
    async def process_markdown_upload(self, request: MarkdownUploadRequest) -> Dict[str, any]:
        """Process uploaded markdown and generate blog content"""
        start_time = datetime.now()
        
        try:
            # Step 1: Validate markdown syntax
            is_valid, errors = self.markdown_validator.validate(request.content)
            if not is_valid:
                raise ValueError(f"Invalid markdown: {', '.join(errors)}")
            
            # Step 2: Extract title from markdown (first H1 or filename)
            title = self._extract_title(request.content, request.filename)
            
            # Step 3: Generate excerpt
            excerpt = self._generate_excerpt(request.content)
            
            # Step 4: Generate content for three expertise levels
            # TODO: Replace with AWS Bedrock AI generation in production
            generated_content = await self.content_generator.generate_expertise_versions(
                original_content=request.content,
                title=title
            )
            
            # Step 5: Create blog object
            blog = GeneratedBlogContent(
                title=title,
                excerpt=excerpt,
                content=generated_content,
                publishedAt=datetime.now().strftime("%Y-%m-%d"),
                readTime=self._calculate_read_time(request.content),
                tags=self._extract_tags(request.content),
                coverImage=self._select_cover_image(title)
            )
            
            # Step 6: Save to shared/data/blogs.json
            self.blog_service.add_blog(blog)
            
            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            
            logger.info(f"Successfully generated blog {blog.id} from {request.filename}")
            
            return {
                "blog_id": blog.id,
                "title": blog.title,
                "processing_time_ms": int(processing_time),
                "expertise_levels": list(generated_content.keys())
            }
            
        except Exception as e:
            logger.error(f"Error processing upload: {str(e)}")
            raise
    
    def _extract_title(self, content: str, filename: str) -> str:
        """Extract title from markdown content or use filename"""
        # Look for first H1 heading
        h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if h1_match:
            return h1_match.group(1).strip()
        
        # Fallback to filename without extension
        return filename.replace('.md', '').replace('-', ' ').title()
    
    def _generate_excerpt(self, content: str, max_length: int = 150) -> str:
        """Generate excerpt from content"""
        # Remove markdown formatting
        clean_text = re.sub(r'[#*`\[\]()]', '', content)
        # Get first paragraph
        paragraphs = clean_text.split('\n\n')
        first_para = next((p for p in paragraphs if p.strip()), '')
        
        if len(first_para) <= max_length:
            return first_para
        return first_para[:max_length].rsplit(' ', 1)[0] + '...'
    
    def _calculate_read_time(self, content: str) -> str:
        """Calculate estimated read time"""
        words = len(content.split())
        minutes = max(1, round(words / 200))  # Assume 200 words per minute
        return f"{minutes} min read"
    
    def _extract_tags(self, content: str) -> list[str]:
        """Extract relevant tags from content"""
        # TODO: Implement smart tag extraction
        # For MVP, return generic tags
        return ["Tech", "Tutorial", "Documentation"]
    
    def _select_cover_image(self, title: str) -> str:
        """Select appropriate cover image based on title/content"""
        # TODO: Implement smart image selection based on content
        # For MVP, return a default tech image
        return "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80"
```

### Markdown Validator Service

```python
# backend/services/markdown_validator.py

import re
from typing import Tuple, List

class MarkdownValidator:
    """Service for validating markdown syntax"""
    
    def validate(self, content: str) -> Tuple[bool, List[str]]:
        """Validate markdown content and return errors if any"""
        errors = []
        
        # Check for basic markdown structure
        if not content.strip():
            errors.append("Content is empty")
            return False, errors
        
        # Check for unclosed code blocks
        code_blocks = re.findall(r'```', content)
        if len(code_blocks) % 2 != 0:
            errors.append("Unclosed code block detected")
        
        # Check for unclosed links
        link_starts = content.count('[')
        link_ends = content.count(']')
        if link_starts != link_ends:
            errors.append("Unclosed link bracket detected")
        
        # Check for basic markdown patterns
        if not any([
            re.search(r'^#+\s', content, re.MULTILINE),  # Headers
            re.search(r'\*\*.*\*\*', content),  # Bold
            re.search(r'\*.*\*', content),  # Italic
            re.search(r'^-\s', content, re.MULTILINE),  # Lists
        ]):
            errors.append("No markdown formatting detected")
        
        return len(errors) == 0, errors
```

### Content Generator Service (Mock Implementation)

```python
# backend/services/content_generator.py

import logging
from typing import Dict

logger = logging.getLogger(__name__)

class ContentGenerator:
    """Service for generating multiple expertise versions of content"""
    
    async def generate_expertise_versions(self, original_content: str, title: str) -> Dict[str, str]:
        """Generate beginner, intermediate, and expert versions of content"""
        
        # TODO: Integrate with AWS Bedrock for actual AI generation
        # TODO: Add proper prompt engineering for each expertise level
        # TODO: Implement content sanitization before AI processing
        
        # For MVP, create simple mock versions with clear differences
        beginner_content = f"""# {title} - Beginner's Guide

## Introduction for Beginners

This is a simplified version of the content, perfect for those just starting out.

### Key Concepts Explained Simply

{self._simplify_content(original_content)}

### Summary

This beginner version breaks down complex topics into easy-to-understand concepts.

**Note: This is mock content. In production, AWS Bedrock will generate appropriate beginner-level content.**
"""

        intermediate_content = f"""# {title} - Comprehensive Guide

## Overview

This guide provides a balanced view of the topic with practical examples.

### Detailed Explanation

{original_content}

### Practical Applications

This intermediate version includes the original content with additional context and examples.

**Note: This is mock content. In production, AWS Bedrock will generate enhanced intermediate-level content.**
"""

        expert_content = f"""# {title} - Expert Deep Dive

## Advanced Concepts

This expert-level guide explores advanced topics and edge cases.

### Technical Deep Dive

{original_content}

### Advanced Techniques and Optimizations

- Performance considerations
- Scalability patterns
- Security implications
- Best practices for production

### References and Further Reading

This expert version includes advanced concepts and professional insights.

**Note: This is mock content. In production, AWS Bedrock will generate sophisticated expert-level content with advanced topics.**
"""

        logger.info(f"Generated mock content for 3 expertise levels")
        
        return {
            "beginner": beginner_content,
            "intermediate": intermediate_content,
            "expert": expert_content
        }
    
    def _simplify_content(self, content: str) -> str:
        """Mock simplification of content for beginners"""
        # For MVP, just return a truncated version
        lines = content.split('\n')
        simplified = []
        for line in lines[:10]:  # Take first 10 lines
            if line.strip():
                simplified.append(line)
        return '\n'.join(simplified) + "\n\n[Content simplified for beginners...]"
```

## Integration with Existing Blog Service

### Modified Blog Service

```python
# Updates to backend/services/blog_service.py

def add_blog(self, blog: GeneratedBlogContent) -> None:
    """Add a new blog to the shared data store"""
    try:
        # Load current blogs
        blogs = self.load_blogs_from_shared()
        
        # Convert new blog to dict and add to list
        blog_dict = blog.dict()
        blogs_data = [b.dict() for b in blogs]
        blogs_data.append(blog_dict)
        
        # Save back to shared/data/blogs.json
        shared_data_path = os.path.join(
            os.path.dirname(__file__), 
            "..", "..", "shared", "data", "blogs.json"
        )
        shared_data_path = os.path.normpath(shared_data_path)
        
        with open(shared_data_path, 'w') as f:
            json.dump(blogs_data, f, indent=2)
        
        # Clear cache to force reload
        self._cached_blogs = None
        
        logger.info(f"Successfully added blog {blog.id} to shared data")
        
    except Exception as e:
        logger.error(f"Error adding blog: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save blog")
```

## API Route Implementation

```python
# backend/api/upload.py

from fastapi import APIRouter, HTTPException, status
from models.upload import MarkdownUploadRequest, UploadResponse
from services.upload_service import UploadService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/upload", tags=["upload"])

upload_service = UploadService()

@router.post("/markdown", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_markdown(request: MarkdownUploadRequest):
    """
    Upload markdown file and generate blog content
    
    - Validates markdown syntax
    - Generates 3 expertise levels (mock for MVP)
    - Saves to shared/data/blogs.json
    - Returns blog ID for navigation
    """
    try:
        result = await upload_service.process_markdown_upload(request)
        
        return UploadResponse(
            status="success",
            message="Blog generated successfully",
            data=result
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Upload processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process upload"
        )

# TODO: Future endpoints
# @router.post("/pdf") - Handle PDF uploads
# @router.post("/url") - Handle URL content extraction
# @router.post("/text") - Handle direct text input
```

## Frontend Integration Requirements

### Changes Needed in UploadNotes.tsx

1. **Simplify File Input**: Only accept .md files
```typescript
<Input
  type="file"
  accept=".md"
  onChange={handleFileChange}
  ref={fileInputRef}
/>
```

2. **Update API Call**: Send to new backend endpoint
```typescript
const handleUpload = async (file: File) => {
  const content = await file.text();
  
  const response = await apiClient.post('/upload/markdown', {
    filename: file.name,
    content: content,
    metadata: {
      source: 'file_upload'
    }
  });
  
  if (response.data.status === 'success') {
    navigate(`/blog/${response.data.data.blog_id}`);
  }
};
```

3. **Remove Mock Generation**: Replace current `generateBlogFromInput` with API call

4. **Simplify UI**: 
   - Remove URL and text input options for MVP
   - Add clear file size limit message (1MB)
   - Show only .md file upload option

### API Contract

**Request Format**:
- Content-Type: application/json
- Body: JSON with filename, content, and metadata

**Response Handling**:
- Success (201): Navigate to `/blog/{blog_id}`
- Validation Error (400): Show error messages
- Server Error (500): Show generic error message

## Testing Requirements

### Unit Tests
```python
# backend/tests/unit/services/test_upload_service.py
- Test markdown validation
- Test title extraction
- Test excerpt generation
- Test read time calculation

# backend/tests/unit/services/test_content_generator.py
- Test mock content generation
- Test expertise level differences

# backend/tests/unit/models/test_upload_models.py
- Test request validation
- Test file size limits
- Test filename validation
```

### Integration Tests
```python
# backend/tests/integration/api/test_upload_api.py
- Test successful markdown upload
- Test validation errors
- Test file size rejection
- Test blog creation and storage
```

## Implementation Priority

1. **Phase 1 (MVP)**:
   - Basic markdown upload endpoint
   - Mock content generation
   - Save to blogs.json
   - Simple frontend integration

2. **Phase 2 (Future)**:
   - AWS Bedrock integration (TODO)
   - PDF processing (TODO)
   - URL extraction (TODO)
   - Real-time progress (TODO)
   - User authentication (TODO)

## Configuration

### Environment Variables
```env
# .env
MAX_UPLOAD_SIZE_MB=1
ALLOWED_FILE_TYPES=.md
# TODO: Add AWS Bedrock configuration
# AWS_BEDROCK_MODEL_ID=anthropic.claude-v2
# AWS_BEDROCK_REGION=us-east-1
```

## Security Considerations

- File size validation (1MB limit)
- Markdown syntax validation
- Content sanitization (TODO for production)
- Rate limiting (TODO for production)
- Authentication (TODO for production)

## Performance Considerations

- Mock generation is synchronous for MVP
- TODO: Implement async processing with progress tracking
- TODO: Add caching for repeated content
- TODO: Implement S3 storage for large files

## Success Metrics

- Upload success rate > 95%
- Processing time < 2 seconds (mock)
- Valid markdown detection accuracy
- User navigation to generated blog

## Next Steps

1. Implement the backend services following this plan
2. Update frontend to use new API endpoint
3. Add comprehensive tests
4. Deploy and monitor MVP
5. Plan Phase 2 with AWS Bedrock integration