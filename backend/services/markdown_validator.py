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