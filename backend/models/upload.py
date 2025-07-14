from pydantic import BaseModel, Field, validator
from typing import Dict, Optional, Any
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
    data: Dict[str, Any]