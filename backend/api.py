from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import json
import os
import logging
import time

# Configure logging for CleverDocs backend
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CleverDocs Backend API",
    description="AI-powered onboarding and knowledge sharing platform API",
    version="1.0.0"
)

# Pydantic models matching shared/types/blog.json schema
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

# Global variable to cache loaded blog data
_cached_blogs: Optional[List[Blog]] = None

def load_blogs_from_shared() -> List[Blog]:
    """Load blog data from shared/data/blogs.json with caching."""
    global _cached_blogs
    
    if _cached_blogs is not None:
        return _cached_blogs
    
    try:
        # Path to shared data relative to backend directory
        shared_data_path = os.path.join(os.path.dirname(__file__), "..", "shared", "data", "blogs.json")
        shared_data_path = os.path.normpath(shared_data_path)
        
        with open(shared_data_path, 'r') as f:
            blogs_data = json.load(f)
        
        # Validate and parse blog data
        _cached_blogs = [Blog(**blog) for blog in blogs_data]
        logger.info(f"✅ Loaded {len(_cached_blogs)} blogs from shared data")
        return _cached_blogs
        
    except FileNotFoundError:
        logger.error(f"Blog data file not found at {shared_data_path}")
        raise HTTPException(status_code=500, detail="Blog data unavailable")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in blog data: {e}")
        raise HTTPException(status_code=500, detail="Blog data corrupted")
    except Exception as e:
        logger.error(f"Error loading blog data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

def filter_blogs(blogs: List[Blog], doc_type: Optional[str], tags: Optional[List[str]]) -> List[Blog]:
    """Filter blogs by docType and tags with comprehensive validation."""
    if not blogs:
        logger.warning("No blogs available for filtering")
        return []
    
    filtered = blogs
    
    # DocType filtering with validation
    if doc_type:
        doc_type = doc_type.strip()
        if doc_type not in ["official", "community"]:
            logger.warning(f"Invalid docType requested: {doc_type}")
            raise HTTPException(
                status_code=400, 
                detail="Invalid docType. Must be 'official' or 'community'"
            )
        filtered = [blog for blog in filtered if blog.docType == doc_type]
        logger.info(f"Filtered by docType '{doc_type}': {len(filtered)} results")
    
    # Tags filtering with validation
    if tags:
        # Clean and validate tags
        tags_lower = [tag.strip().lower() for tag in tags if tag.strip()]
        if not tags_lower:
            logger.warning("Empty tags provided after cleaning")
            return filtered
        
        # Blog must have at least one of the requested tags (case-insensitive)
        filtered = [
            blog for blog in filtered 
            if any(tag in [blog_tag.lower() for blog_tag in blog.tags] for tag in tags_lower)
        ]
        logger.info(f"Filtered by tags {tags_lower}: {len(filtered)} results")
    
    return filtered

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/blogs", response_model=BlogsResponse)
async def get_blogs(
    docType: Optional[str] = Query(None, description="Filter by document type: 'official' or 'community'"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)")
) -> BlogsResponse:
    """
    Get all blogs with optional filtering by docType and tags.
    
    - **docType**: Filter by document type ('official' or 'community')
    - **tags**: Filter by tags (comma-separated, e.g., 'React,Frontend')
    
    Returns blog data from shared/data/blogs.json with metadata.
    """
    start_time = time.time()
    
    try:
        # Load all blogs
        all_blogs = load_blogs_from_shared()
        
        # Parse tags parameter
        parsed_tags = None
        if tags:
            parsed_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
        
        # Apply filters
        filtered_blogs = filter_blogs(all_blogs, docType, parsed_tags)
        
        # Calculate processing time
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Log performance
        logger.info(f"GET /blogs completed in {processing_time_ms}ms "
                   f"(total: {len(all_blogs)}, filtered: {len(filtered_blogs)})")
        
        # Alert if performance target exceeded (200ms for simple operations)
        if processing_time_ms > 200:
            logger.warning(f"Performance target exceeded: {processing_time_ms}ms > 200ms")
        
        # Return structured response
        return BlogsResponse(
            status="success",
            data=filtered_blogs,
            total=len(all_blogs),
            filteredTotal=len(filtered_blogs)
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors, etc.)
        processing_time_ms = int((time.time() - start_time) * 1000)
        logger.warning(f"GET /blogs failed validation in {processing_time_ms}ms")
        raise
    except Exception as e:
        processing_time_ms = int((time.time() - start_time) * 1000)
        logger.error(f"GET /blogs unexpected error after {processing_time_ms}ms: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")