from fastapi import FastAPI, HTTPException, Query, Path
from typing import Optional
import logging
import time

from models.blog import BlogsResponse, BlogResponse
from models.upload import MarkdownUploadRequest, UploadResponse
from services.blog_service import blog_service
from services.upload_service import UploadService
from core.cors import configure_cors

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

# Configure CORS
configure_cors(app)

# Initialize services
upload_service = UploadService()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/blogs", response_model=BlogsResponse)
async def get_blogs(
    docType: Optional[str] = Query(None, description="Filter by document type: 'official' or 'community'"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    expertiseLevel: Optional[str] = Query(None, description="Expertise level: 'beginner', 'intermediate', or 'expert'")
) -> BlogsResponse:
    """
    Get all blogs with optional filtering by docType, tags, and expertise level.
    
    - **docType**: Filter by document type ('official' or 'community')
    - **tags**: Filter by tags (comma-separated, e.g., 'React,Frontend')
    - **expertiseLevel**: Filter by expertise level ('beginner', 'intermediate', or 'expert')
    
    Returns blog data from shared/data/blogs.json with content adapted to expertise level when available.
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
        filtered_blogs = blog_service.get_filtered_blogs(docType, parsed_tags, expertiseLevel)
        
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

@app.get("/blogs/{blog_id}", response_model=BlogResponse)
async def get_blog_by_id(
    blog_id: str = Path(..., description="The ID of the blog to retrieve"),
    expertiseLevel: Optional[str] = Query(None, description="Expertise level: 'beginner', 'intermediate', or 'expert'")
) -> BlogResponse:
    """
    Get a specific blog by ID with optional expertise level adaptation.
    
    - **blog_id**: The unique identifier of the blog to retrieve
    - **expertiseLevel**: Filter by expertise level ('beginner', 'intermediate', or 'expert')
    
    Returns the blog data with content adapted to expertise level when available.
    """
    start_time = time.time()
    
    try:
        # Get blog by ID using service
        blog = blog_service.get_blog_by_id(blog_id, expertiseLevel)
        
        # Calculate processing time
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        if blog is None:
            logger.warning(f"GET /blogs/{blog_id} blog not found in {processing_time_ms}ms")
            raise HTTPException(status_code=404, detail=f"Blog with ID '{blog_id}' not found")
        
        # Log performance
        logger.info(f"GET /blogs/{blog_id} completed in {processing_time_ms}ms "
                   f"(expertise_level: {expertiseLevel or 'none'})")
        
        # Alert if performance target exceeded (100ms for single item operations)
        if processing_time_ms > 100:
            logger.warning(f"Performance target exceeded: {processing_time_ms}ms > 100ms")
        
        # Return structured response
        return BlogResponse(
            status="success",
            data=blog
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors, 404, etc.)
        processing_time_ms = int((time.time() - start_time) * 1000)
        logger.warning(f"GET /blogs/{blog_id} failed validation in {processing_time_ms}ms")
        raise
    except Exception as e:
        processing_time_ms = int((time.time() - start_time) * 1000)
        logger.error(f"GET /blogs/{blog_id} unexpected error after {processing_time_ms}ms: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/upload/markdown", response_model=UploadResponse, status_code=201)
async def upload_markdown(request: MarkdownUploadRequest):
    """
    Upload markdown content and generate multi-level blog
    
    - **filename**: Original filename (must end with .md)
    - **content**: Markdown content (max 1MB)
    - **metadata**: Upload metadata including source
    
    Returns blog ID and processing information for the generated blog.
    """
    start_time = time.time()
    
    try:
        # Process markdown upload using service
        result = await upload_service.process_markdown_upload(request)
        
        # Calculate processing time
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Log success
        logger.info(f"POST /api/upload/markdown completed in {processing_time_ms}ms "
                   f"(blog_id: {result['blog_id']})")
        
        # Alert if performance target exceeded (5 seconds for upload/generation)
        if processing_time_ms > 5000:
            logger.warning(f"Performance target exceeded: {processing_time_ms}ms > 5000ms")
        
        # Return structured response
        return UploadResponse(
            status="success",
            message="Markdown uploaded and blog generated successfully",
            data=result
        )
        
    except ValueError as e:
        # Handle validation errors
        processing_time_ms = int((time.time() - start_time) * 1000)
        logger.warning(f"POST /api/upload/markdown validation error in {processing_time_ms}ms: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        processing_time_ms = int((time.time() - start_time) * 1000)
        logger.error(f"POST /api/upload/markdown unexpected error after {processing_time_ms}ms: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")