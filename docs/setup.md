# Setup Doc

Setup doc holds all the info on setting up this project 

## Folder Structure
We are going to start with a mono foldser structure that holds forntend, backend, infra all in one repo to: 
1. Ensure simplicity 
2. Make it easier for Claude or Cursor to get context and make changes in all files that are affected 

cleverdocs/
├── docs/              # Holds PRDs, PRPs, Testing guidelines, Rules for AI assistants 
├── frontend/        # React + Chakra UI app
├── backend/        # FastAPI server
├── infra/               # Infra-as-code (Step Functions, Lambdas, S3, etc.)
├── shared/           # Reusable logic, types, constants, prompt templates
├── scripts/           # CLI helpers or dev tools (optional)
└── README.md

Later as the project grows and add contributors we can break each component into its own repo like frontenedRepo, BakendRepo etc 


### Detailed Folder structure bareak down 
Here we will break down what each of the main folder's structures 

#### Docs Folder Structure 
Here we put all the documentation of our app like:
- Project Requirements Doc (PRD)
- Prompting Requirements Doc (PRP): 
- Architecture diagrams 
- Folder structure information 
- Rules and guidelines for AI agents 

This gives great context to our AI agents helping them work with less hallucinations and be able to produce better code

Also helps future team members understand the project as it grows

```
docs/
├── prd/
│   └── note_to_blog_feature.md
├── prp/
│   └── ai_pipeline_prompt_templates.md
├── rules/
│   └── agent_usage_guidelines.md
├── architecture.md
└── README.md
```


#### Frontend folder structure 

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

#### Backend Folder Structure 
FastAPI app (Python async server)
-  exposes secure API, uploads notes to s3 buckets
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


#### Infra Folder Structure 
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

#### Shared Dolder Structure 
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


#### Scripts Folder Structure 
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