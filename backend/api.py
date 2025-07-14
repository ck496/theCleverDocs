from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import logging
import time
import os

from models.blog import BlogsResponse
from services.blog_service import blog_service

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

# Configure CORS - Environment-based for security
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

if ENVIRONMENT == "development":
    # Development: Allow local origins
    allowed_origins = [
        "http://localhost:5173",    # Vite dev server
        "http://localhost:3000",    # React dev server
        "http://127.0.0.1:5173",    # Alternative localhost
        "http://127.0.0.1:3000"     # Alternative localhost
    ]
    allow_credentials = True
    logger.info("CORS configured for development environment")
else:
    # Production: Restrict to actual domain
    allowed_origins = [
        os.getenv("FRONTEND_URL", "https://cleverdocs.app"),
        # Add other production domains as needed
    ]
    allow_credentials = False  # More secure for production
    logger.info(f"CORS configured for production environment: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization", 
        "Accept",
        "Origin",
        "X-Requested-With"
    ],  # More restrictive than "*"
)

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
        # Load all blogs using service
        all_blogs = blog_service.get_all_blogs()
        
        # Parse tags parameter
        parsed_tags = None
        if tags:
            parsed_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
        
        # Apply filters using service
        filtered_blogs = blog_service.get_filtered_blogs(docType, parsed_tags)
        
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