# Folder Structure Doc

We are going to start with a mono Folder structure that holds frontend, backend, infra all in one repo to ensure simplicity and make it easier for AI assistants to access all relevant files.

## Overall Folder Structure

```
theCleverDocs/
└── .claude             # Claude Code configurations and commands
├── docs/              # Holds PRDs, PRPs, Testing guidelines, Rules for AI assistants
├── frontend/         # React + Chakra  + TS + Vite UI app
├── backend/          # FastAPI backend/server
├── infra/            # Infra-as-code
├── scripts/          # CLI helpers or dev tools (optional)
├── shared/           # Reusable logic, types, constants, prompt templates for bedrock
└── .gitignore
└── README.md

```

Note: Later as the project grows and add contributors we can break each component into its own repo like frontendRepo, backendRepo.

## .claude Folder Structure

The .claude folder contains Claude Code configuration and custom commands.

Notice we have a Tier-Specific Implementation

```
theCleverDocs/
└── .claude/
    ├── commands/                    # Custom slash commands for Claude Code
    │   ├── backend/
    │   │   ├── generate-backend-prp.md    # /generate-backend-prp command
    │   │   └── execute-backend-prp.md     # /execute-backend-prp command
    │   ├── frontend/
    │   │   ├── generate-frontend-prp.md   # /generate-frontend-prp command
    │   │   └── execute-frontend-prp.md    # /execute-frontend-prp command
    │   └── infra/
    │       ├── generate-infra-prp.md      # /generate-infra-prp command
    │       └── execute-infra-prp.md       # /execute-infra-prp command
    └── settings.local.json          # Claude Code permissions and settings
```

## Docs Folder Structure

Here we put all the documentation of our app like:

- Project Requirements Doc (PRD)
- Prompting Requirements Doc (PRP): Templates and Generated PRPs
- Architecture diagrams
- Folder structure information
- Rules and guidelines for AI agents

This gives great context to our AI agents helping them work with less hallucinations and be able to produce better code

Also helps future team members understand the project as it grows

```

theCleverDocs/
└── docs/
    ├── backend/INITIAL_BACKEND.md      # Backend feature requests
    ├── frontend/INITIAL_FRONTEND.md    # Frontend feature requests
    ├── infra/INITIAL_INFRA.md          # Infrastructure feature requests
    └──  PRPs/templates/                # PRP base templates by tier
    │   ├── backend_base.md
    │   ├── frontend_base.md
    │   └── infrastructure_base.md
    └── PRPs/generated/                 # Generated PRPs by tier
        ├── backend/
        ├── frontend/
        └── infra/
```

## Frontend Folder Structure

Holds our react app and all its dependency docs

```
frontend/
├── src/
│   ├── components/         # BlogsGrid, header, Navbar, etc.
│   ├── pages/              # HomePage.tsx, BlogsGridPage.tsx, BlogDetails.tsx
│   ├── api/                # Axios wrappers for FastAPI routes
│   ├── hooks/              # React Query, form hooks
│   ├── types/              # Blog type, Upload type
│   └── theme/              # Chakra theme
├── public/
├── vite.config.ts
└── package.json
└── README.md
```

## Backend Folder Structure

FastAPI app (Python async server)

- exposes secure API, uploads notes to s3 buckets etc
-

```
backend/
├── app/
│   ├── api/                # upload.py, blog.py, publish.py
│   ├── services/           # blog_service.py, s3_service.py
│   ├── models/             # Blog, UploadRequest (Pydantic models)
│   ├── clients/            # S3, Bedrock, Dynamo wrappers
│   ├── db/                 # Dynamo or RDS abstraction
│   ├── config.py
│   └── main.py             # FastAPI entrypoint
├── tests/                  # Pytest tests
├── Dockerfile
└── requirements.txt
└── README.md
```

## Infra Folder Structure

All AWS infrastructure as code to build AWS resources (Step Functions, Lambdas, S3, etc.)

- Each `lambdas/*` dir should be independently deployable. Use `requirements.txt` or zip bundle.
- You can also wrap all infra in **CDK or Terraform modules** if you're comfortable.

```
infra/
├── lambdas/
│   ├── sanitize/              # Lambda to redact secrets
│   │   └── handler.py
│   ├── llm_step1/             # Rewrite notes → blog
│   ├── llm_step2/             # Add diagrams + code
│   └── save_to_db/
│
├── stepfunctions/
│   └── blog_generation.asl.json  # Amazon States Language (or CDK if you use it)
│
├── terraform/               # OR use CDK/Pulumi
│   ├── s3.tf
│   ├── iam.tf
│   ├── stepfunction.tf
│   └── lambda.tf
│
└── README.md
```

## Shared Folder Structure

Common code across frontend + backend + lambdas

- You define a `BlogPost` model in shared → import it in both FastAPI + frontend

```
shared/
├── types/                  # Blog, UploadRequest, etc. (in JSONSchema or Python/TS)
├── prompts/                # Claude prompt templates
├── constants/              # Enums, roles, status codes
├── templates/              # Markdown blog scaffolds (header/footer)
└── utils/                  # File parsers, chunkers, token counters
```

## Scripts Folder Structure

For local dev helpers, CLI tools, formatters, etc.

```
scripts/
├── seed_sample_blog.py
├── format_all.sh
└── deploy_infra.sh
```

## Testing

- `backend/tests/` → Pytest for API and service logic
- `infra/lambdas/**/tests/` → Unit tests for each lambda
- `frontend/src/__tests__/` → React Testing Lib or Playwright
- End-to-end: Cypress or Playwright in root or `frontend/`
