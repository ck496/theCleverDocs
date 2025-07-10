# CleverDocs: An Onboarding and Knowledge Sharing Platform

The CleverDocs is an AI-powered onboarding and knowledge-sharing platform that accelerates new-hire ramp-up and empowers engineers to formalize and distribute institutional knowledge as polished, multi-level tech blogs and custom guides

<img src="frontend/public/images/mainLogo.webp" alt="alt text" width="100"/><img src="frontend/public/images/mainLogo.webp" alt="alt text" width="100"/><img src="frontend/public/images/mainLogo.webp" alt="alt text" width="100"/><img src="frontend/public/images/mainLogo.webp" alt="alt text" width="100"/>

## Key Features

1. **Rapid Note → Blog Generation:**
   Allow users to your years of cluttered, quickly jotted notes into well documented and in depth tech blogs with examples and share it with your community.

2. **Custom content for each readers level of expertise:**
   Offer on‑demand Beginner, Intermediate, and Expert variants of each blog.

3. **Custom guide builder:**
   Platform uses AI to combine multiple different blogs into one easy to follow step by step custom guide for their individual use-case.

4. **Community & Official sections:**
   Community: Open uploads, upvotes/downvotes, comments, version history.
   Official: Admin‑only publishing, audit logs, gated review, and comment moderation.

5. **Gamified Leaderboards:**
   Points for blog contributions, ratings received, comments posted.
   Leaderboards by team/organization and badges for milestones

## Setup

### Folder Structure

```
cleverdocs/
├── docs/              # Holds PRDs, PRPs, Testing guidelines, Rules for AI assistants
├── frontend/        # React + Chakra UI app
├── backend/        # FastAPI server
├── infra/               # Infra-as-code (Step Functions, Lambdas, S3, etc.)
├── shared/           # Reusable logic, types, constants, prompt templates
├── scripts/           # CLI helpers or dev tools (optional)
└── README.md

```

---

## Monorepo Structure

This repository uses a monorepo structure, containing:
- `frontend/`: React + Chakra UI app
- `backend/`: FastAPI server
- `infra/`: Infrastructure as code (AWS, Terraform, CDK, etc.)
- `shared/`: Shared logic, types, constants, and prompt templates
- `scripts/`: CLI helpers and dev tools
- `docs/`: Documentation, PRDs, architecture, and guidelines

> **Note:** All subfolders should have their own `.gitignore` files to exclude environment variables, secrets, and IDE settings (e.g., `.env`, `.vscode/`, `.idea/`).
