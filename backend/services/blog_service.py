import json
import os
import logging
from typing import List, Optional
from fastapi import HTTPException

from models.blog import Blog

logger = logging.getLogger(__name__)

class BlogService:
    """Service class for blog-related business logic."""
    
    def __init__(self):
        self._cached_blogs: Optional[List[Blog]] = None
    
    def load_blogs_from_shared(self) -> List[Blog]:
        """Load blog data from shared/data/blogs.json with caching."""
        if self._cached_blogs is not None:
            return self._cached_blogs
        
        try:
            # Path to shared data relative to backend directory
            shared_data_path = os.path.join(os.path.dirname(__file__), "..", "..", "shared", "data", "blogs.json")
            shared_data_path = os.path.normpath(shared_data_path)
            
            with open(shared_data_path, 'r') as f:
                blogs_data = json.load(f)
            
            # Validate and parse blog data
            self._cached_blogs = [Blog(**blog) for blog in blogs_data]
            logger.info(f"✅ Loaded {len(self._cached_blogs)} blogs from shared data")
            return self._cached_blogs
            
        except FileNotFoundError:
            logger.error(f"Blog data file not found at {shared_data_path}")
            raise HTTPException(status_code=500, detail="Blog data unavailable")
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in blog data: {e}")
            raise HTTPException(status_code=500, detail="Blog data corrupted")
        except Exception as e:
            logger.error(f"Error loading blog data: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")

    def filter_blogs(self, blogs: List[Blog], doc_type: Optional[str], tags: Optional[List[str]], expertise_level: Optional[str] = None) -> List[Blog]:
        """Filter blogs by docType, tags, and adapt content for expertise level."""
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
        
        # Expertise level content adaptation
        if expertise_level:
            expertise_level = expertise_level.strip().lower()
            if expertise_level not in ["beginner", "intermediate", "expert"]:
                logger.warning(f"Invalid expertiseLevel requested: {expertise_level}")
                raise HTTPException(
                    status_code=400, 
                    detail="Invalid expertiseLevel. Must be 'beginner', 'intermediate', or 'expert'"
                )
            
            # Adapt content for blogs that have expertise levels
            adapted_blogs = []
            for blog in filtered:
                if isinstance(blog.content, dict) and expertise_level in blog.content:
                    # Create new blog with content adapted for expertise level
                    adapted_blog = blog.model_copy(deep=True)
                    adapted_blog.content = blog.content[expertise_level]
                    adapted_blogs.append(adapted_blog)
                else:
                    # Keep original blog if no expertise level available
                    adapted_blogs.append(blog)
            
            filtered = adapted_blogs
            logger.info(f"Adapted content for expertise level '{expertise_level}': {len([b for b in filtered if isinstance(b.content, dict)])} blogs had expertise levels")
        
        return filtered

    def get_all_blogs(self) -> List[Blog]:
        """Get all blogs."""
        return self.load_blogs_from_shared()
    
    def get_filtered_blogs(self, doc_type: Optional[str] = None, tags: Optional[List[str]] = None, expertise_level: Optional[str] = None) -> List[Blog]:
        """Get filtered blogs by docType, tags, and/or expertise level."""
        all_blogs = self.load_blogs_from_shared()
        return self.filter_blogs(all_blogs, doc_type, tags, expertise_level)
    
    def get_blog_by_id(self, blog_id: str, expertise_level: Optional[str] = None) -> Optional[Blog]:
        """Get a specific blog by ID with optional expertise level adaptation."""
        all_blogs = self.load_blogs_from_shared()
        
        # Find blog by ID
        target_blog = None
        for blog in all_blogs:
            if blog.id == blog_id:
                target_blog = blog
                break
        
        if not target_blog:
            return None
        
        # Apply expertise level adaptation if requested
        if expertise_level:
            # Validate expertise level
            if expertise_level not in ["beginner", "intermediate", "expert"]:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid expertiseLevel. Must be 'beginner', 'intermediate', or 'expert'"
                )
            
            # Adapt content if expertise level is available
            if isinstance(target_blog.content, dict) and expertise_level in target_blog.content:
                adapted_blog = target_blog.model_copy(deep=True)
                adapted_blog.content = target_blog.content[expertise_level]
                return adapted_blog
        
        return target_blog

# Global service instance
blog_service = BlogService()