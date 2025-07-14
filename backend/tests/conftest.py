"""
Pytest configuration and shared fixtures for CleverDocs backend tests.
"""
import pytest
from fastapi.testclient import TestClient
from typing import Generator
import os
import sys

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from api import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def mock_aws_services(monkeypatch):
    """Mock AWS service calls for unit tests."""
    # Mock boto3 clients as needed
    import boto3
    from unittest.mock import MagicMock
    
    mock_s3 = MagicMock()
    mock_dynamodb = MagicMock()
    mock_bedrock = MagicMock()
    
    monkeypatch.setattr(boto3, 's3', mock_s3)
    monkeypatch.setattr(boto3, 'dynamodb', mock_dynamodb)
    monkeypatch.setattr(boto3, 'bedrock', mock_bedrock)
    
    return {
        's3': mock_s3,
        'dynamodb': mock_dynamodb,
        'bedrock': mock_bedrock
    }


@pytest.fixture
def sample_blog_data():
    """Sample blog data for testing."""
    return {
        "title": "Test Blog Post",
        "content": "This is test content for a blog post.",
        "author": "Test Author",
        "expertise_level": "intermediate",
        "tags": ["testing", "pytest", "fastapi"]
    }


@pytest.fixture
def sample_note_data():
    """Sample note data for testing."""
    return {
        "content": "Quick note about testing",
        "type": "markdown",
        "metadata": {
            "created_at": "2024-01-01T00:00:00Z",
            "author": "test_user"
        }
    }