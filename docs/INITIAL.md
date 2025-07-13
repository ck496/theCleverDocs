# theCleverDocs Project Context

## Project Overview
AI-powered platform for transforming notes into polished tech blogs with dynamic expertise levels and custom guide generation.

## Architecture
- **Frontend**: React + Vite + TypeScript + Chakra UI
- **Backend**: FastAPI + Python (async)
- **Infrastructure**: AWS (Step Functions, Lambda, S3, DynamoDB, Bedrock)
- **Shared**: Common types, utilities, and constants

## Key Technologies
- **Frontend**: React, Vite, Chakra UI, React Router, React Query
- **Backend**: FastAPI, Pydantic, Boto3, pytest
- **Infrastructure**: Terraform, AWS CDK, Step Functions
- **AI**: AWS Bedrock, OpenSearch, Comprehend

## Current State
- Frontend: Landing page with Chakra UI components
- Backend: Not yet implemented
- Infrastructure: Planned AWS serverless architecture, Not Yet implemented

## Development Workflow
1. Feature planning in PRPs
2. Implementation across relevant layers
3. Testing at component and integration levels
4. Deployment via infrastructure as code

## File Locations
read 
- Components: `frontend/src/components/`
- API routes: `backend/app/api/`
- Lambda functions: `infra/lambdas/`
- Shared types: `shared/types/`
- Documentation: `docs/`


## Key Conventions
- Use TypeScript throughout
- Shared types between frontend/backend
- Async/await patterns
- Comprehensive error handling
- Infrastructure as code

## DOCUMENTATION:
Project Requiremnt Description: `docs/PRDs/CleverDocsPRD.md`
Folder structure information: `docs/folder_structure.md`

## OTHER CONSIDERATIONS:
Include a .env.example, README with instructions for setup including how to configure Gmail and Brave.
Include the project structure in the README.
Virtual environment 'dev' already been set up with the necessary dependencies.
Use python_dotenv and load_env() for environment variables


