from pydantic import BaseModel, Field
from typing import List, Optional, Literal

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
    content: str = Field(..., min_length=10)
    author: Author
    publishedAt: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    readTime: str = Field(..., pattern=r"^\d+ min read$")
    tags: List[str] = Field(..., max_items=10)
    coverImage: str = Field(..., description="Blog cover image URL")
    avgRating: float = Field(..., ge=0, le=5)
    totalRatings: int = Field(..., ge=0)
    docType: Literal["official", "community"]
    teamInfo: Optional[TeamInfo] = None

class BlogsResponse(BaseModel):
    status: str
    data: List[Blog]
    total: int
    filteredTotal: int