# Backend Folder

This folder contains the FastAPI backend for the CleverDocs project. It exposes secure APIs, handles uploads to S3, and manages blog and user data.

## Structure (planned)
- `app/api/`: API route handlers (e.g., upload.py, blog.py, publish.py)
- `app/services/`: Business logic and integrations (e.g., blog_service.py, s3_service.py)
- `app/models/`: Pydantic models for request/response validation
- `app/clients/`: Wrappers for S3, Bedrock, DynamoDB, etc.
- `app/db/`: Database abstraction (DynamoDB, RDS, etc.)
- `app/config.py`: Configuration
- `app/main.py`: FastAPI entrypoint
- `tests/`: Pytest tests

Refer to the setup documentation for more details. 