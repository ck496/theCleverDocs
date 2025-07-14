# CleverDocs Codebase Guide

> **Purpose**: Comprehensive guide for AI agents and developers to understand the codebase organization, locate files efficiently, and implement features following established patterns.

## 📊 Status Legend
- ✅ **EXISTS** - Currently implemented and active
- 🔄 **PLANNED** - Planned implementation following this structure
- 🚧 **IN PROGRESS** - Currently being developed
- ⚠️ **AVAILABLE BUT UNUSED** - Exists but not actively used
- ❌ **LEGACY/CLEANUP** - Should be removed or refactored

## 🎯 Repository Overview

CleverDocs uses a **tier-specific monorepo** structure that enables independent development of frontend, backend, and infrastructure components while maintaining shared context.

```
theCleverDocs/
├── .claude/              # ✅ Claude Code automation & commands
├── docs/                 # ✅ Documentation & AI agent context
├── frontend/             # ✅ React + TypeScript + Chakra UI
├── backend/              # 🔄 FastAPI + Python + AWS integrations
├── infra/                # 🔄 Terraform + AWS infrastructure
├── shared/               # 🔄 Cross-tier utilities & types
├── scripts/              # 🔄 Development & deployment helpers
├── .gitignore            # ✅ Git ignore patterns
└── README.md             # ✅ Project overview & setup
```

## 🤖 .claude/ - AI Agent Automation

**Purpose**: Custom Claude Code commands for tier-specific development workflow.

**Status**: ✅ **EXISTS** - Full structure implemented

```
.claude/
├── commands/
│   ├── backend/
│   │   ├── generate-backend-prp.md     # ✅ Creates backend-focused PRPs
│   │   └── execute-backend-prp.md      # ✅ Implements backend features
│   ├── frontend/
│   │   ├── generate-frontend-prp.md    # ✅ Creates frontend-focused PRPs
│   │   └── execute-frontend-prp.md     # ✅ Implements frontend features
│   └── infra/
│       ├── generate-infra-prp.md       # ✅ Creates infrastructure PRPs
│       └── execute-infra-prp.md        # ✅ Implements AWS resources
└── settings.local.json                 # ✅ Claude Code permissions
```

**Usage Commands**:
```bash
/generate-backend-prp docs/backend/INITIAL_BACKEND_TEMPLATE.md   # Creates backend PRP
/execute-backend-prp docs/PRPs/generated/backend/feature-name.md  # Implements feature
/generate-frontend-prp docs/frontend/INITIAL_FRONTEND.md  # Creates frontend PRP
/execute-frontend-prp docs/PRPs/generated/frontend/feature-name.md  # Implements feature
/generate-infra-prp docs/infra/INITIAL_INFRA.md         # Creates infrastructure PRP
/execute-infra-prp docs/PRPs/generated/infra/feature-name.md  # Implements infrastructure
```

## 📚 docs/ - Documentation & Context

**Purpose**: Centralized documentation for AI agents and team members.

**Status**: ✅ **EXISTS** - Core structure implemented

```
docs/
├── backend/
│   └── INITIAL_BACKEND.md              # ✅ Backend feature request template
├── frontend/
│   └── INITIAL_FRONTEND.md             # ✅ Frontend feature request template
├── infra/
│   └── INITIAL_INFRA.md                # ✅ Infrastructure request template
├── PRPs/
│   ├── templates/                      # ✅ PRP generation templates
│   │   ├── backend_base.md             # ✅ Backend-specific PRP template
│   │   ├── frontend_base.md            # ✅ Frontend-specific PRP template
│   │   └── infra_base.md               # ✅ Infrastructure-specific PRP template
│   └── generated/                      # ✅ Generated PRPs organized by tier
│       ├── backend/                    # ✅ Backend implementation plans
│       ├── frontend/                   # ✅ Frontend implementation plans
│       └── infra/                      # ✅ Infrastructure implementation plans
├── PRDs/
│   ├── CleverDocsPRD.md               # ✅ Business requirements document
│   └── CleverDocsPRD.pdf              # ✅ Business requirements (PDF)
├── CLAUDE.md                          # ✅ Global AI agent rules & patterns
├── folder_structure.md                # ✅ Original folder structure doc
├── README.md                          # ✅ Documentation overview
└── .gitignore                         # ✅ Documentation-specific ignores
```

**Key Files for AI Agents**:
- `CLAUDE.md` → Global rules and technology patterns
- `backend/INITIAL_BACKEND.md` → Template for backend feature requests
- `frontend/INITIAL_FRONTEND.md` → Template for frontend feature requests
- `infra/INITIAL_INFRA.md` → Template for infrastructure requests
- `PRPs/templates/` → PRP generation templates for each tier

## ⚛️ frontend/ - React Application

**Purpose**: User-facing web application with responsive design.

**Tech Stack**: React + TypeScript + Vite + Chakra UI

**Status**: ✅ **ACTIVE** - Core application structure implemented

```
frontend/
├── src/
│   ├── components/                     # ✅ Reusable UI components
│   │   ├── ui/                         # ⚠️ ShadCN components (available but unused)
│   │   │   ├── accordion.tsx           # ⚠️ Pre-built component
│   │   │   ├── button.tsx              # ⚠️ Pre-built component
│   │   │   ├── card.tsx                # ⚠️ Pre-built component
│   │   │   └── [40+ more components]   # ⚠️ Full ShadCN library
│   │   └── [FeatureName]/              # 🔄 PLANNED - Feature-specific components
│   ├── lib/
│   │   └── utils.ts                    # ✅ Tailwind class merging utility
│   ├── pages/                          # ✅ Page-level route components
│   │   └── HomePage.tsx                # ✅ Main landing page (IMPLEMENTED)
│   ├── stories/                        # ⚠️ Storybook stories (unused)
│   │   └── [component].stories.tsx     # ⚠️ Stories for ShadCN components
│   ├── types/                          # ✅ TypeScript type definitions
│   │   └── supabase.ts                 # ⚠️ Supabase types (unused)
│   ├── hooks/                          # 🔄 PLANNED - Custom React hooks
│   │   ├── api/                        # 🔄 PLANNED - React Query hooks
│   │   └── ui/                         # 🔄 PLANNED - UI-specific hooks
│   ├── api/                            # 🔄 PLANNED - API client functions
│   │   ├── base.ts                     # 🔄 PLANNED - Axios configuration
│   │   ├── blog.ts                     # 🔄 PLANNED - Blog-related API calls
│   │   └── upload.ts                   # 🔄 PLANNED - File upload API calls
│   ├── theme/                          # 🔄 PLANNED - Chakra UI theme config
│   ├── utils/                          # 🔄 PLANNED - Frontend utilities
│   └── App.tsx                         # 🔄 PLANNED - Main app component
├── public/
│   └── vite.svg                        # ✅ Vite favicon
├── notes/
│   └── directory-breakdown.md          # ✅ Current structure analysis
├── .next/                              # ❌ LEGACY - Next.js artifact (remove)
├── node_modules/                       # ✅ Dependencies
├── package.json                        # ✅ Dependencies & scripts
├── vite.config.ts                      # ✅ Vite build configuration
├── tsconfig.json                       # ✅ TypeScript configuration
├── tailwind.config.js                  # ✅ Tailwind CSS configuration
├── index.html                          # ✅ Main HTML entry point
└── README.md                           # 🔄 PLANNED - Frontend documentation
```

**Current Implementation Status**:
- ✅ **Active**: Vite build system, React with TypeScript, Chakra UI styling
- ✅ **Working**: HomePage with complete landing page structure
- ⚠️ **Available but Unused**: ShadCN UI library, Storybook, Supabase types, Tailwind CSS
- ❌ **Cleanup Needed**: `.next/` directory (Next.js artifact)

**Development Commands**:
```bash
cd frontend
npm run dev          # ✅ Start development server
npm run build        # ✅ Production build
npm run test         # 🔄 PLANNED - Run tests
npm run type-check   # 🔄 PLANNED - TypeScript validation
```

## 🐍 backend/ - FastAPI Server

**Purpose**: API server with AWS integrations and AI content generation.

**Tech Stack**: FastAPI + Python 3.11+ + AWS SDK + Pydantic

**Status**: 🔄 **PLANNED** - Basic structure exists, full implementation planned

```
backend/
├── app/                                # 🔄 PLANNED - Main application package
│   ├── api/                            # 🔄 PLANNED - API route handlers
│   │   ├── __init__.py                 # 🔄 PLANNED
│   │   ├── blogs.py                    # 🔄 PLANNED - Blog CRUD operations
│   │   ├── upload.py                   # 🔄 PLANNED - File upload endpoints
│   │   ├── auth.py                     # 🔄 PLANNED - Authentication endpoints
│   │   └── ai.py                       # 🔄 PLANNED - AI content generation
│   ├── services/                       # 🔄 PLANNED - Business logic layer
│   │   ├── __init__.py                 # 🔄 PLANNED
│   │   ├── blog_service.py             # 🔄 PLANNED - Blog business logic
│   │   ├── upload_service.py           # 🔄 PLANNED - File processing logic
│   │   ├── ai_service.py               # 🔄 PLANNED - AI content generation
│   │   └── auth_service.py             # 🔄 PLANNED - Authentication logic
│   ├── models/                         # 🔄 PLANNED - Pydantic data models
│   │   ├── __init__.py                 # 🔄 PLANNED
│   │   ├── blog.py                     # 🔄 PLANNED - Blog request/response models
│   │   ├── upload.py                   # 🔄 PLANNED - File upload models
│   │   ├── user.py                     # 🔄 PLANNED - User models
│   │   └── ai.py                       # 🔄 PLANNED - AI generation models
│   ├── clients/                        # 🔄 PLANNED - AWS service clients
│   │   ├── __init__.py                 # 🔄 PLANNED
│   │   ├── dynamodb.py                 # 🔄 PLANNED - DynamoDB operations
│   │   ├── s3.py                       # 🔄 PLANNED - S3 file operations
│   │   ├── bedrock.py                  # 🔄 PLANNED - AI content generation
│   │   └── stepfunctions.py            # 🔄 PLANNED - Step Functions orchestration
│   ├── core/                           # 🔄 PLANNED - Core application components
│   │   ├── __init__.py                 # 🔄 PLANNED
│   │   ├── config.py                   # 🔄 PLANNED - Application configuration
│   │   ├── security.py                 # 🔄 PLANNED - Security utilities
│   │   ├── dependencies.py             # 🔄 PLANNED - FastAPI dependencies
│   │   └── exceptions.py               # 🔄 PLANNED - Custom exception handlers
│   ├── utils/                          # 🔄 PLANNED - Utility functions
│   │   ├── __init__.py                 # 🔄 PLANNED
│   │   ├── logging.py                  # 🔄 PLANNED - Structured logging
│   │   ├── validation.py               # 🔄 PLANNED - Data validation utilities
│   │   └── file_processing.py          # 🔄 PLANNED - File handling utilities
│   └── main.py                         # 🔄 PLANNED - FastAPI application entry point
├── tests/                              # 🔄 PLANNED - Test suite
│   ├── api/                            # 🔄 PLANNED - API endpoint tests
│   ├── services/                       # 🔄 PLANNED - Service layer tests
│   ├── clients/                        # 🔄 PLANNED - AWS client tests
│   └── conftest.py                     # 🔄 PLANNED - Pytest configuration
├── api.py                              # ✅ EXISTS - Current basic API file
├── .gitignore                          # ✅ EXISTS - Python-specific ignores
├── README.md                           # ✅ EXISTS - Backend documentation
├── requirements.txt                    # 🔄 PLANNED - Python dependencies
└── Dockerfile                          # 🔄 PLANNED - Container configuration
```

**Current Implementation Status**:
- ✅ **Exists**: `api.py` (basic API file), `README.md`, `.gitignore`
- 🔄 **Planned**: Full FastAPI application structure with proper organization

**Development Commands**:
```bash
cd backend
python -m uvicorn api:app --reload      # ✅ Start current basic server
# 🔄 PLANNED commands:
python -m uvicorn app.main:app --reload  # Start full FastAPI server
python -m pytest tests/ -v              # Run tests
python -m pytest tests/ --cov=app       # Run tests with coverage
```

## ☁️ infra/ - AWS Infrastructure

**Purpose**: Infrastructure as Code for AWS resources.

**Tech Stack**: Terraform + AWS Provider

**Status**: 🔄 **PLANNED** - Structure planned, not yet implemented

```
infra/
├── modules/                            # 🔄 PLANNED - Reusable Terraform modules
│   ├── s3/                             # 🔄 PLANNED - S3 bucket configurations
│   │   ├── main.tf                     # 🔄 PLANNED
│   │   ├── variables.tf                # 🔄 PLANNED
│   │   └── outputs.tf                  # 🔄 PLANNED
│   ├── dynamodb/                       # 🔄 PLANNED - DynamoDB table configurations
│   │   ├── main.tf                     # 🔄 PLANNED
│   │   ├── variables.tf                # 🔄 PLANNED
│   │   └── outputs.tf                  # 🔄 PLANNED
│   ├── lambda/                         # 🔄 PLANNED - Lambda function configurations
│   │   ├── main.tf                     # 🔄 PLANNED
│   │   ├── variables.tf                # 🔄 PLANNED
│   │   └── outputs.tf                  # 🔄 PLANNED
│   └── stepfunctions/                  # 🔄 PLANNED - Step Functions configurations
│       ├── main.tf                     # 🔄 PLANNED
│       ├── variables.tf                # 🔄 PLANNED
│       └── outputs.tf                  # 🔄 PLANNED
├── environments/                       # 🔄 PLANNED - Environment-specific configs
│   ├── dev/                            # 🔄 PLANNED - Development environment
│   │   ├── main.tf                     # 🔄 PLANNED
│   │   ├── variables.tf                # 🔄 PLANNED
│   │   └── terraform.tfvars            # 🔄 PLANNED
│   ├── staging/                        # 🔄 PLANNED - Staging environment
│   │   ├── main.tf                     # 🔄 PLANNED
│   │   ├── variables.tf                # 🔄 PLANNED
│   │   └── terraform.tfvars            # 🔄 PLANNED
│   └── prod/                           # 🔄 PLANNED - Production environment
│       ├── main.tf                     # 🔄 PLANNED
│       ├── variables.tf                # 🔄 PLANNED
│       └── terraform.tfvars            # 🔄 PLANNED
├── lambdas/                            # 🔄 PLANNED - Lambda function source code
│   ├── blog-processor/                 # 🔄 PLANNED - Blog content processing
│   │   ├── handler.py                  # 🔄 PLANNED
│   │   └── requirements.txt            # 🔄 PLANNED
│   ├── ai-generator/                   # 🔄 PLANNED - AI content generation
│   │   ├── handler.py                  # 🔄 PLANNED
│   │   └── requirements.txt            # 🔄 PLANNED
│   └── file-validator/                 # 🔄 PLANNED - File validation and processing
│       ├── handler.py                  # 🔄 PLANNED
│       └── requirements.txt            # 🔄 PLANNED
└── README.md                           # ✅ EXISTS - Infrastructure documentation
```

**Current Implementation Status**:
- ✅ **Exists**: `README.md` with basic infrastructure documentation
- 🔄 **Planned**: Complete Terraform infrastructure setup

**Development Commands**:
```bash
cd infra/environments/dev
terraform init                          # 🔄 PLANNED - Initialize Terraform
terraform plan                          # 🔄 PLANNED - Preview changes
terraform apply                         # 🔄 PLANNED - Apply changes
terraform destroy                       # 🔄 PLANNED - Cleanup resources
```

## 🔗 shared/ - Cross-Tier Utilities

**Purpose**: Code and resources shared across frontend, backend, and infrastructure.

**Status**: 🔄 **PLANNED** - Structure planned, basic README exists

```
shared/
├── types/                              # 🔄 PLANNED - Cross-language type definitions
│   ├── blog.json                       # 🔄 PLANNED - Blog schema (JSON Schema)
│   ├── user.json                       # 🔄 PLANNED - User schema (JSON Schema)
│   └── api.json                        # 🔄 PLANNED - API contract definitions
├── prompts/                            # 🔄 PLANNED - AI prompt templates
│   ├── blog-generation/                # 🔄 PLANNED
│   │   ├── beginner.txt                # 🔄 PLANNED - Beginner-level prompts
│   │   ├── intermediate.txt            # 🔄 PLANNED - Intermediate-level prompts
│   │   └── expert.txt                  # 🔄 PLANNED - Expert-level prompts
│   └── content-validation/             # 🔄 PLANNED
│       ├── quality-check.txt           # 🔄 PLANNED - Content quality validation
│       └── safety-check.txt            # 🔄 PLANNED - Content safety validation
├── constants/                          # 🔄 PLANNED - Shared constants and enums
│   ├── blog-status.json               # 🔄 PLANNED - Blog status definitions
│   ├── user-roles.json                # 🔄 PLANNED - User role definitions
│   └── api-endpoints.json             # 🔄 PLANNED - API endpoint constants
├── templates/                          # 🔄 PLANNED - Content templates
│   ├── blog-structure.md              # 🔄 PLANNED - Standard blog structure
│   └── guide-structure.md             # 🔄 PLANNED - Custom guide structure
├── utils/                              # 🔄 PLANNED - Shared utility functions
│   ├── file-validation.js             # 🔄 PLANNED - File validation utilities
│   ├── content-processing.js          # 🔄 PLANNED - Content processing utilities
│   └── token-counting.js              # 🔄 PLANNED - AI token counting utilities
└── README.md                           # ✅ EXISTS - Shared resources documentation
```

## 🛠️ scripts/ - Development Tools

**Purpose**: Automation scripts for development and deployment.

**Status**: 🔄 **PLANNED** - Structure planned, not yet implemented

```
scripts/
├── setup/                              # 🔄 PLANNED
│   ├── install-dependencies.sh        # 🔄 PLANNED - Install all project dependencies
│   ├── setup-env.sh                   # 🔄 PLANNED - Environment setup
│   └── init-database.sh               # 🔄 PLANNED - Database initialization
├── development/                        # 🔄 PLANNED
│   ├── start-dev.sh                   # 🔄 PLANNED - Start all development services
│   ├── run-tests.sh                   # 🔄 PLANNED - Run all tests
│   └── format-code.sh                 # 🔄 PLANNED - Code formatting
├── deployment/                         # 🔄 PLANNED
│   ├── deploy-dev.sh                  # 🔄 PLANNED - Deploy to development
│   ├── deploy-staging.sh              # 🔄 PLANNED - Deploy to staging
│   └── deploy-prod.sh                 # 🔄 PLANNED - Deploy to production
└── utilities/                          # 🔄 PLANNED
    ├── seed-data.py                   # 🔄 PLANNED - Seed development data
    ├── cleanup.sh                     # 🔄 PLANNED - Cleanup temporary files
    └── generate-types.py             # 🔄 PLANNED - Generate types from schemas
```

## 🔍 File Location Quick Reference

### For AI Agents:
- **Global Rules**: `docs/CLAUDE.md` ✅
- **Feature Requests**: `docs/{tier}/INITIAL_{TIER}.md` ✅
- **PRP Templates**: `docs/PRPs/templates/{tier}_base.md` ✅
- **Generated PRPs**: `docs/PRPs/generated/{tier}/` ✅

### For Developers:
- **Current Frontend**: `frontend/src/pages/HomePage.tsx` ✅
- **Current Backend**: `backend/api.py` ✅
- **Documentation**: `docs/README.md` ✅
- **Project Structure**: This file (`docs/CODEBASE_GUIDE.md`)

### For Testing:
- **Frontend Tests**: `frontend/src/__tests__/` 🔄 PLANNED
- **Backend Tests**: `backend/tests/` 🔄 PLANNED
- **Test Scripts**: `scripts/development/run-tests.sh` 🔄 PLANNED

## 🚀 Development Workflow

### Backend Feature Development:
```bash
# 1. Create feature request
vim docs/backend/INITIAL_BACKEND.md

# 2. Generate backend PRP
/generate-backend-prp docs/backend/INITIAL_BACKEND.md

# 3. Implement backend feature
/execute-backend-prp docs/PRPs/generated/backend/feature-name.md

# 4. Test backend (current)
cd backend && python -m uvicorn api:app --reload
```

### Frontend Feature Development:
```bash
# 1. Create feature request
vim docs/frontend/INITIAL_FRONTEND.md

# 2. Generate frontend PRP
/generate-frontend-prp docs/frontend/INITIAL_FRONTEND.md

# 3. Implement frontend feature
/execute-frontend-prp docs/PRPs/generated/frontend/feature-name.md

# 4. Test frontend
cd frontend && npm run dev
```

### Infrastructure Changes:
```bash
# 1. Create infrastructure request
vim docs/infra/INITIAL_INFRA.md

# 2. Generate infrastructure PRP
/generate-infra-prp docs/infra/INITIAL_INFRA.md

# 3. Implement infrastructure
/execute-infra-prp docs/PRPs/generated/infra/feature-name.md

# 4. Deploy infrastructure (when ready)
cd infra/environments/dev && terraform apply
```

## 📝 Naming Conventions

### Files:
- **Components**: PascalCase (`BlogCard.tsx`, `UserProfile.tsx`)
- **Services**: snake_case (`blog_service.py`, `upload_service.py`)
- **API Routes**: kebab-case (`/api/blog-posts`, `/api/user-profile`)
- **Infrastructure**: kebab-case (`s3-bucket`, `dynamodb-table`)

### Directories:
- **Feature Groups**: kebab-case (`blog-management/`, `user-authentication/`)
- **Utility Folders**: kebab-case (`api-clients/`, `shared-components/`)

### Variables:
- **Frontend**: camelCase (`blogData`, `userProfile`)
- **Backend**: snake_case (`blog_data`, `user_profile`)
- **Infrastructure**: snake_case (`blog_table`, `upload_bucket`)

## ⚠️ Important Notes

### For AI Agents:
- Always check `docs/CLAUDE.md` for global rules before implementation
- Use tier-specific INITIAL templates for feature requests
- Follow the established PRP generation and execution workflow
- Validate implementation using tier-specific test commands
- **Current state**: Frontend has basic structure, backend is minimal, infra is planned

### For Developers:
- **Frontend**: Currently using Chakra UI (ShadCN available but unused)
- **Backend**: Single `api.py` file exists, full structure planned
- **Infrastructure**: Documentation exists, implementation planned
- Each tier will have its own README with specific setup instructions
- Follow the established naming conventions and folder structure
- Update this guide when implementing planned features

### Cleanup Tasks:
- Remove `frontend/.next/` directory (Next.js artifact)
- Decide between Chakra UI and ShadCN for frontend components
- Implement planned backend structure when creating first API
- Set up infrastructure when AWS integration needed

### Security:
- Never commit `.env` files or AWS credentials (✅ `.gitignore` configured)
- Use environment variables for sensitive configuration
- Follow security patterns when implementing backend
- Validate all inputs using Pydantic models in the backend

## 🔄 Migration Path

### Phase 1: Backend Setup (Next)
1. Restructure `backend/api.py` into proper FastAPI app structure
2. Implement `backend/app/main.py` as new entry point
3. Add basic Pydantic models and API routes
4. Set up testing framework

### Phase 2: Frontend Enhancement
1. Remove unused ShadCN components if sticking with Chakra UI
2. Implement planned directory structure (`hooks/`, `api/`, `theme/`)
3. Add API integration with React Query
4. Remove `.next/` directory

### Phase 3: Infrastructure Implementation
1. Create basic Terraform modules for S3 and DynamoDB
2. Set up development environment
3. Implement Lambda functions for AI processing
4. Add CI/CD pipeline

### Phase 4: Shared Resources
1. Implement shared type definitions
2. Add AI prompt templates
3. Create utility functions
4. Set up development scripts

This guide serves as both current state documentation and implementation roadmap. Update status indicators as features are implemented.