from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal, Union

class Author(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    avatar: str = Field(..., description="Author avatar image URL")

class TeamInfo(BaseModel):
    teamName: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., description="Team contact email")

class Blog(BaseModel):
    id: str
    title: str = Field(..., min_length=1, max_length=200)
    excerpt: str = Field(..., min_length=10, max_length=500)
    content: dict = Field(..., description="Content at different expertise levels")
    author: Union[Author, str] = Field(..., description="Author info or name")
    publishedAt: Optional[str] = Field(None, description="Publication date")
    date: Optional[str] = Field(None, description="Alternative date field")
    readTime: str = Field(..., pattern=r"^\d+ min read$")
    tags: List[str] = Field(..., max_items=10)
    coverImage: Optional[str] = Field(None, description="Blog cover image URL")
    avgRating: float = Field(..., ge=0, le=5)
    totalRatings: int = Field(..., ge=0)
    docType: Union[Literal["official", "community"], str] = Field(..., description="Document type")
    teamInfo: Optional[TeamInfo] = None

    @validator('author', pre=True)
    def handle_author_formats(cls, v):
        """Handle both string and object author formats"""
        if isinstance(v, str):
            return {
                "name": v,
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=" + v.replace(" ", "")
            }
        return v

    @validator('publishedAt', pre=True)
    def handle_date_fields(cls, v, values):
        """Handle both publishedAt and date fields"""
        if v is None and 'date' in values:
            return values.get('date')
        return v

    @validator('docType', pre=True)
    def handle_doc_type(cls, v):
        """Handle various docType values"""
        if v in ["tutorial", "guide", "documentation"]:
            return "community"
        elif v in ["official", "community"]:
            return v
        else:
            return "community"  # Default fallback

    @validator('coverImage', pre=True)
    def handle_missing_cover_image(cls, v):
        """Provide default cover image if missing"""
        if v is None:
            return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        return v

class BlogsResponse(BaseModel):
    status: str
    data: List[Blog]
    total: int
    filteredTotal: int

class BlogResponse(BaseModel):
    status: str
    data: Blog