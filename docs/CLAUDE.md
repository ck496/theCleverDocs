# CleverDocs AI Assistant Rules

### 🔄 Project Awareness & Context
- **Always read project documentation** at the start of a new conversation to understand the project's architecture, goals, and constraints.
- **Reference the monorepo structure** when making changes that affect multiple layers (frontend/backend/infra).
- **Use consistent naming conventions and file structure** as defined in the project documentation.
- **Consider cross-layer impacts** when implementing features that span frontend, backend, and infrastructure.

### 🏗️ Architecture & Technology Stack
- **Frontend**: React + Vite + TypeScript + Chakra UI only (NO other UI libraries)
- **Backend**: FastAPI + Python 3.11+ with async/await patterns  
- **Infrastructure**: Terraform + AWS services (S3, Lambda, DynamoDB, Bedrock, Step Functions)
- **Shared**: JSON Schema for cross-language type definitions
- **Environment**: Use `python-dotenv` and `load_dotenv()` for environment variables

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If approaching this limit, refactor into modules.
- **Organize code by feature, not by file type**:
  - Frontend: Group components, hooks, and types by feature
  - Backend: Group routes, services, models, and clients by domain
  - Infrastructure: Group resources by AWS service or environment
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Follow the established monorepo patterns** for shared utilities and types.

### 🎨 Frontend Conventions (React + TypeScript)
- **Use Chakra UI components exclusively** (Box, Flex, Heading, Text, Input, Textarea, Button, Spinner, Alert, etc.).
- **Implement proper loading states** with `<Spinner>` for all async operations.
- **Show `<Alert status="error">` for all error conditions** with specific error messages.
- **Ensure responsive layout** that stacks properly on mobile devices.
- **Use React Query** for all API state management and caching.
- **Implement TypeScript strictly** with proper type definitions and interfaces.
- **Use React Router** for navigation with proper error boundaries.

### 🐍 Backend Conventions (Python + FastAPI)
- **Use async/await patterns** for all I/O operations (database, S3, external APIs).
- **Use Pydantic models** for all request/response validation and serialization.
- **Follow FastAPI best practices**:
  - Dependency injection for shared services
  - Proper HTTP status codes and error responses
  - OpenAPI documentation with proper descriptions
- **Implement comprehensive error handling** with structured logging.
- **Use type hints throughout** with proper Python typing.
- **Write docstrings** for all functions using Google style.

### ☁️ Infrastructure Conventions (Terraform + AWS)
- **Use Terraform modules** for reusable infrastructure components.
- **Implement proper environment separation** (dev/staging/prod).
- **Follow AWS best practices**:
  - Least privilege IAM policies
  - Encryption at rest and in transit
  - Proper VPC and security group configurations
- **Use AWS Bedrock** for AI content generation with proper error handling.
- **Implement Step Functions** for complex workflows with proper error states.

### 🤖 AI Integration Patterns
- **AWS Bedrock Integration**:
  - Use Claude 3 Sonnet as the primary model
  - Implement proper prompt templates stored in `shared/prompts/`
  - Handle token limits and chunking for long content
  - Implement fallback mechanisms for AI service failures
- **Content Generation**:
  - Validate AI outputs before storing
  - Implement content versioning for different expertise levels
  - Store generated content with metadata (model version, timestamp, input hash)
- **Error Handling**:
  - Graceful degradation when AI services are unavailable
  - Retry logic with exponential backoff
  - Clear error messages to users about AI generation failures

### 🧪 Testing & Reliability
- **Always create comprehensive tests for new features**:
  - Frontend: Jest + React Testing Library for components, Cypress for E2E
  - Backend: pytest with async fixtures for FastAPI routes and services  
  - Infrastructure: Terraform validation and AWS resource testing
- **Test structure should mirror application structure**.
- **Include at least**:
  - Happy path tests
  - Edge case handling
  - Error condition testing
  - Integration tests for cross-layer functionality
- **Mock external services** (AWS Bedrock, S3) in unit tests.

### 🔐 Security & Performance Requirements
- **Security**:
  - Never expose AWS credentials in frontend code
  - Implement proper CORS configuration
  - Use JWT tokens for authentication with proper expiration
  - Validate all inputs with Pydantic models
  - Implement rate limiting for AI generation endpoints
- **Performance**:
  - Frontend bundle size < 500KB initial load
  - API response times < 200ms for simple queries
  - AI generation timeout after 30 seconds with progress updates
  - Implement proper caching strategies (React Query, CloudFront)
  - Use connection pooling for database connections

### 📊 Data Flow & State Management
- **Frontend State**:
  - Use React Query for server state
  - Use React hooks (useState, useContext) for local state
  - Implement proper loading and error states for all async operations
- **Backend State**:
  - Use DynamoDB for persistent data with proper indexes
  - Implement caching for frequently accessed data
  - Use S3 for file storage with proper lifecycle policies
- **Cross-Layer Communication**:
  - Define API contracts with OpenAPI specifications
  - Use JSON Schema for shared type definitions
  - Implement proper error propagation from backend to frontend

### ✅ Task Completion & Documentation
- **Update documentation** when adding new features or changing architecture.
- **Comment complex business logic** with inline explanations of "why", not just "what".
- **Update OpenAPI specs** when modifying API endpoints.
- **Update shared type definitions** when modifying data structures.

### 🧠 AI Behavior Rules
- **Never assume missing context** - ask questions about requirements, constraints, or unclear specifications.
- **Never hallucinate libraries, APIs, or AWS services** - only use verified, documented services.
- **Always confirm file paths and module names** exist before referencing them.
- **Follow the established patterns** from existing codebase rather than introducing new approaches.
- **Consider the full stack impact** when implementing features - ensure frontend, backend, and infrastructure changes are coordinated.
- **Prioritize security and performance** in all implementations.
- **Test thoroughly** before marking features as complete.

### 🎯 CleverDocs-Specific Rules
- **Content Generation**: Always generate content for Beginner, Intermediate, and Expert levels when creating blog content.
- **User Experience**: Prioritize simplicity and ease of use - the goal is to make note-to-blog transformation effortless.
- **AI Integration**: Implement robust error handling and fallbacks for AI generation failures.
- **Community Features**: When implementing social features (upvotes, comments), ensure proper moderation capabilities.
- **Performance**: Optimize for fast content generation and responsive user experience.
- **Scalability**: Design all components to handle growth in users and content volume.