# Cursor AI Agent Rules for CleverDocs

> **Purpose**: These are the core operational rules for any AI assistant working on the CleverDocs codebase. These rules are derived from `docs/CLAUDE.md` and must be followed strictly.

## 1. 📜 Core Principle: Plan First, Then Execute

**This is the most important rule.** Never start implementing or changing files without first presenting a clear plan and getting approval.

**The process is:**
1.  **Present the Plan:** Outline the tasks and subtasks.
2.  **Ask for Permission:** Explicitly ask for confirmation to proceed (e.g., "Proceed with this plan? (y/n)").
3.  **Execute Systematically:** Once approved, execute the plan step-by-step.

**Plan Format:**
```
## Plan of Action

### Task 1: [Task Name]
- Subtask 1.1: [Specific action]
- Subtask 1.2: [Specific action]

### Task 2: [Task Name]
- Subtask 2.1: [Specific action]

**Proceed with this plan? (y/n)**
```

## 2. 🏗️ Technology Stack (Non-Negotiable)

Do not deviate from this stack. Do not suggest alternatives.

-   **Backend**: FastAPI + Python 3.11+ + Pydantic + AWS SDK.
-   **Frontend**: React + TypeScript + Vite + Chakra UI. (ShadCN components are available but unused, prefer Chakra UI).
-   **Infrastructure**: Terraform + AWS Provider.

## 3. 🧱 Code Structure & Quality

-   **File Size Limit**: Keep files under 500 lines. Refactor large files into smaller modules.
-   **Separation of Concerns (Backend)**:
    -   `models/`: Pydantic models only.
    -   `services/`: Business logic only.
    -   `api/`: API route handlers only.
    -   **NEVER** mix models, services, and routes in the same file.
-   **Separation of Concerns (Frontend)**:
    -   `components/`: Reusable UI components.
    -   `pages/`: Page-level components that assemble reusable components.
    -   `hooks/`: Reusable logic (React Hooks).
    -   Keep page components clean and focused on composition.
    -   Keep components under 200 lines.

## 4. 🧪 Testing Requirements

-   **Minimum 3 Tests**: Every new feature or function requires at least three tests:
    1.  **Happy Path**: Expected use case.
    2.  **Edge Case**: Boundary conditions, empty inputs.
    3.  **Failure Case**: Invalid inputs, error conditions.
-   **Test Coverage**: Aim for 90%+ test coverage for all new code.
-   **Update Tests**: When modifying existing code, update the corresponding tests.

## 5. ✅ Validation Before Completion

Before marking a task as complete, run the relevant validation commands.

-   **Backend**:
    ```bash
    # Check for import errors
    cd backend && python -c "import api; print('Backend imports successfully')"
    # Run all tests
    cd backend && python -m pytest tests/ -v
    # Check test coverage
    cd backend && python -m pytest tests/ --cov=app --cov-fail-under=90
    ```
-   **Frontend**:
    ```bash
    # Build and type-check
    cd frontend && npm run build && npm run type-check
    # Run all tests
    cd frontend && npm test
    ```
-   **Infrastructure**:
    ```bash
    cd infra && terraform validate
    ```

## 6. 🧠 Context & Knowledge

-   Before starting work, ensure you have read the latest versions of:
    1.  `README.md`
    2.  `docs/PRDs/CleverDocsPRD.md`
    3.  `docs/CODEBASE_GUIDE.md`
    4.  `docs/development/CODING_STANDARDS.md`
-   Reference the `docs/CODEBASE_GUIDE.md` to understand what parts of the system are `✅ EXISTS` vs. `🔄 PLANNED`. 