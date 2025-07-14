# CleverDocs AI Agent Rules

> **Purpose**: Core behavioral rules for Claude Code agents working on CleverDocs features.

## 🔄 Project Context & Reading Order

### **Always Read These Files First (In Order)**

1. **`README.md`** → Understand CleverDocs purpose and key features
2. **`docs/PRDs/CleverDocsPRD.md`** → Business requirements and user goals
3. **`docs/CODEBASE_GUIDE.md`** → Current structure (what exists ✅ vs planned 🔄)
4. **`docs/development/CODING_STANDARDS.md`** → Detailed patterns and conventions
5. **`docs/PLANNING.md`** (when it exists) → Current priorities and decisions
6. **`docs/TASK.md`** (when it exists) → Active work and dependencies

### **Tier-Specific Context**

- **Backend work** → `docs/backend/INITIAL_BACKEND.md`
- **Frontend work** → `docs/frontend/INITIAL_FRONTEND.md`
- **Infrastructure work** → `docs/infra/INITIAL_INFRA.md`

## 🏗️ Technology Stack (Non-Negotiable)

### **Backend**: FastAPI + Python 3.11+ + AWS SDK + Pydantic

- Current: `backend/api.py` ✅ | Planned: `backend/app/` structure 🔄
- Always use async/await for I/O operations
- Validate ALL inputs with Pydantic models
- **NEVER put models, services, and API routes in one file** - always separate concerns

## 🧱 Code Structure & Modularity

### **File Organization Rules**

- **Max 500 lines per file** - if approaching limit, split into modules
- **Separate by responsibility** - models, services, API routes in different files
- **Group by feature** - related functionality stays together

### **Backend Structure Pattern**
```
backend/app/
├── models/          # Pydantic models only
├── services/        # Business logic only  
├── api/            # Route handlers only
└── utils/          # Shared utilities
```

### **Frontend**: React + TypeScript + Vite + Chakra UI

- Current: `frontend/src/pages/HomePage.tsx` ✅
- **MUST use Chakra UI components** - don't create custom styled components
- **MUST create reusable components** in `frontend/src/components/`
- **MUST keep page files clean** - pages should assemble components, not implement everything
- **File structure**: components/ for reusable UI, pages/ for route components, hooks/ for logic
- Always implement loading states and error handling
- Keep components under 200 lines - extract to smaller components or hooks

### **Infrastructure**: Terraform + AWS Provider

- Current: Documentation ✅ | Planned: Full implementation 🔄
- Module-based approach with environment separation

## 🚨 Critical Error Prevention

### **Never Assume, Always Verify**

- **File structure** → Check `docs/CODEBASE_GUIDE.md` for current state
- **Business requirements** → Reference README.md and PRD before implementing
- **Technology choices** → Follow established stack, don't suggest alternatives
- **Feature scope** → Implement only within single tier per session

### **Validation Before Completion**

```bash
# Backend
cd backend && python -c "import api; print('Backend imports successfully')"
cd backend && python -m pytest tests/ -v  # Run all tests
cd backend && python -m pytest tests/ --cov=app --cov-fail-under=90  # Check coverage

# Frontend
cd frontend && npm run build && npm run type-check
cd frontend && npm test  # Run all tests

# Infrastructure
cd infra && terraform validate
```

## 🎯 CleverDocs Mission Alignment

**Every feature must support**: Accelerating engineer onboarding and knowledge sharing

**Core capabilities**:

- Rapid note → blog transformation
- Multi-level content (Beginner/Intermediate/Expert)
- Community knowledge sharing
- AI-powered content generation

## 🧪 Testing Requirements

### **Every Feature Must Have Tests**

- **3 Tests Minimum** per feature/function:
  1. Expected use case (happy path)
  2. Edge case (boundary conditions, empty inputs)
  3. Failure case (invalid inputs, errors)
- **Test First** approach when fixing bugs
- **Update Tests** when modifying existing code
- **90% Coverage** for all new code

### **Test Organization**

```
backend/tests/
├── unit/           # Unit tests with mocked dependencies
│   ├── services/   # Service layer tests
│   └── models/     # Model validation tests
├── integration/    # Integration tests with real services
│   └── api/        # API endpoint tests
└── performance/    # Performance benchmarks
```

## 🧠 AI Behavior Rules

### **Planning and Permission Protocol**

**ALWAYS follow this sequence for ANY request:**

1. **Present the Plan First** - Show tasks and subtasks before starting
2. **Ask for Permission** - Wait for approval before proceeding
3. **Execute Step by Step** - Work through approved tasks systematically

**Plan Format:**
```
## Plan of Action

### Task 1: [Task Name]
- Subtask 1.1: [Specific action]
- Subtask 1.2: [Specific action]

### Task 2: [Task Name]  
- Subtask 2.1: [Specific action]
- Subtask 2.2: [Specific action]

**Proceed with this plan? (y/n)**
```

### **Work Style**

- **Focus on single tier** per implementation session
- **Follow existing patterns** rather than inventing new approaches
- **Start simple, then enhance** with validation at each step
- **Write tests** for every new feature before marking complete
- **Document assumptions** and next steps for other tiers

### **Communication**

- **ALWAYS present plan first** - Never start implementation without showing the plan
- **Be explicit** about current vs planned structure when explaining
- **Reference specific files** when discussing existing code
- **Ask questions** when requirements are unclear
- **Provide validation steps** for testing implementations
- **Wait for permission** before proceeding with any file changes or implementations

### **Error Handling**

- **Never expose errors** without user-friendly messages
- **Always implement fallbacks** for AI service failures
- **Log structured data** for debugging
- **Validate at every layer** (frontend + backend + infrastructure)

### **Task Completion**
Mark completed tasks in TASK.md immediately after finishing them.
Add new sub-tasks or TODOs discovered during development to TASK.md under a "Discovered During Work" section.

### **Feature Documentation Requirements**

**MANDATORY for ALL PRP executions:**

After completing any PRP (frontend, backend, or infrastructure), you MUST create a comprehensive feature implementation summary:

1. **Create Feature Summary Document**:
   - Use template from `docs/features/templates/[tier]-feature-summary.md`
   - Save to `docs/features/implemented/[tier]/YYYY-MM-DD-feature-name-[tier].md`
   - Include all phases, files changed, testing performed, and integration details

2. **Required Documentation Elements**:
   - **Implementation Details**: Complete phase breakdown with tasks and testing
   - **Files Created/Modified**: Exact changes made to codebase
   - **Testing & Validation**: All tests created, manual testing performed
   - **Integration Points**: Dependencies, breaking changes, cross-component impact
   - **Future Considerations**: Known limitations, planned enhancements, maintenance needs

3. **Documentation Standards**:
   - Link to original PRP and PRD references
   - Include troubleshooting guide for common issues
   - Document accessibility compliance (frontend features)
   - Record performance considerations and optimizations

**This documentation is NOT optional** - it enables knowledge transfer, debugging support, and maintenance planning for all CleverDocs features.

---

**For detailed patterns, testing guidelines, and security requirements, see files in `docs/development/`**

**Testing Documentation**:
- `docs/development/TESTING_OVERVIEW.md` → General testing philosophy and requirements
- `docs/development/TESTING_BACKEND.md` → Backend testing with pytest and FastAPI
- `docs/development/TESTING_FRONTEND.md` → Frontend testing with Vitest and React Testing Library
