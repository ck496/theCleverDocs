import logging
import re
from typing import Dict, Tuple, List
from datetime import datetime
import uuid

from models.upload import MarkdownUploadRequest
from models.blog import Blog
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
            blog = Blog(
                id=str(uuid.uuid4()),
                title=title,
                excerpt=excerpt,
                content=generated_content,
                author={
                    "name": "Tech Writer",  # TODO: Use authenticated user name
                    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=TechWriter"
                },
                publishedAt=datetime.now().strftime("%Y-%m-%d"),
                readTime=self._calculate_read_time(request.content),
                tags=self._extract_tags(request.content),
                coverImage=self._select_cover_image(title),
                avgRating=0.0,
                totalRatings=0,
                docType="community"
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
    
    def _extract_tags(self, content: str) -> List[str]:
        """Extract relevant tags from content"""
        # TODO: Implement smart tag extraction
        # For MVP, return generic tags
        return ["Tech", "Tutorial", "Documentation"]
    
    def _select_cover_image(self, title: str) -> str:
        """Select appropriate cover image based on title/content"""
        # TODO: Implement smart image selection based on content
        # For MVP, return a default tech image
        return "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80"