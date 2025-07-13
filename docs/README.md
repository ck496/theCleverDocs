# Docs Folder

This folder contains all documentation for the CleverDocs project, including:
- Project Requirements Doc (PRD)
- Prompting Requirements Doc (PRP)
- Architecture diagrams
- Folder structure information
- Rules and guidelines for AI agents

Refer to the setup documentation for more details on structure and usage.

Folder Structure:
```
cleverdocs/
├── docs/
│   ├── initial.md              # Main project context (see section 2)
│   ├── prps/
│   │   ├── templates/
│   │   │   └── prp_base.md     # Base template (see section 3)
│   │   ├── frontend_feature.md
│   │   ├── backend_feature.md
│   │   ├── infra_feature.md
│   │   └── fullstack_feature.md
│   ├── claude-code/
│   │   ├── generate-prp.md     # Modified for multi-stack (see section 4)
│   │   └── execute-prp.md      # Modified for multi-stack (see section 4)
│   └── best-practices/
│       ├── frontend.md         # React/TypeScript best practices
│       ├── backend.md          # FastAPI/Python best practices
│       ├── infra.md           # AWS/Terraform best practices
│       └── testing.md         # Testing guidelines

```