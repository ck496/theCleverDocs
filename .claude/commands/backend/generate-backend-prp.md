# Generate Backend PRP for CleverDocs

Generate a comprehensive Backend Feature Implementation PRP (Product Requirements Prompt) with thorough research and context. This command is optimized for CleverDocs backend features using FastAPI + Python + AWS, ensuring one-pass implementation success through comprehensive context engineering.

## Core Mission
Create backend features that support CleverDocs' core mission: **accelerating engineer onboarding and knowledge sharing through AI-powered content transformation**.

## Instructions

**CRITICAL: Follow CleverDocs Planning Protocol**
1. **Present the plan first** - Show all tasks and subtasks before starting
2. **Ask for permission** - Wait for approval before proceeding  
3. **Execute step by step** - Work through approved tasks systematically

Read the backend feature request file ($ARGUMENTS) first to understand what needs to be built. The feature must support CleverDocs' note→blog transformation, multi-level content generation, or community knowledge sharing capabilities.

### Step 1: Research Phase - Understand the Context

**Read ALL required context files in order (following refactored documentation structure):**

1. **`README.md`** - CleverDocs purpose and business goals
2. **`docs/PRDs/CleverDocsPRD.md`** - Business requirements 
3. **`docs/CLAUDE.md`** - Global AI agent rules and CleverDocs-specific requirements
4. **`docs/CODEBASE_GUIDE.md`** - Current backend state (✅ `api.py` vs 🔄 planned `app/` structure)
5. **`docs/development/CODING_STANDARDS.md`** - Enhanced backend patterns, validation templates, and conventions
6. **`backend/README.md`** - Concise backend-specific setup (references main docs)
7. **$ARGUMENTS** - The specific backend feature request

**Analyze the current codebase structure:**

```bash
# Check current backend state
tree backend/ -a
head -20 backend/api.py
```

**Research external documentation needs:**
- FastAPI async patterns: https://fastapi.tiangolo.com/async/
- Pydantic validation: https://docs.pydantic.dev/latest/
- AWS SDK patterns (if needed): https://boto3.amazonaws.com/v1/documentation/api/latest/

### Step 2: Implementation Strategy Decision

**Determine structural approach based on feature complexity:**

**Simple Feature** (single endpoint, minimal business logic):
- Extend current `backend/api.py` 
- Add routes directly to existing FastAPI app
- Keep single-file approach for MVP speed

**Complex Feature** (multiple endpoints, AWS integration, business logic):
- Migrate to planned `backend/app/` structure
- Create proper FastAPI application factory
- Implement modular service architecture

**Document your decision with rationale in the PRP.**

### Step 3: CleverDocs Backend Context Research

**For AI-powered features, research:**
- Content generation patterns for beginner/intermediate/expert levels
- AWS Bedrock integration patterns (if needed)
- File upload and processing patterns (if needed)
- Authentication patterns (if needed)

**For data features, research:**
- DynamoDB access patterns (if needed)
- S3 integration patterns (if needed)
- Performance requirements (< 200ms for simple operations)

### Step 4: Security & Validation Research

**Critical CleverDocs backend requirements:**
- All inputs validated with Pydantic models (no unvalidated data)
- Comprehensive error handling with user-friendly messages
- No credential exposure in logs or responses
- Proper async/await patterns for all I/O operations

### Step 5: Integration Planning

**Research frontend integration needs:**
- What API contracts need to be defined?
- What OpenAPI documentation will be auto-generated?
- How will error responses be formatted for frontend consumption?

**Research infrastructure needs:**
- What AWS services will be required?
- What environment variables need configuration?
- What database tables or S3 buckets are needed?

---

## *** CRITICAL: ULTRATHINK PHASE ***

**Before writing the PRP, synthesize all research:**

1. **Business Alignment**: How does this feature support CleverDocs' mission of accelerating engineer onboarding?
2. **Technical Architecture**: Simple `api.py` extension vs full `app/` structure migration?
3. **Integration Points**: What are the clean API contracts for frontend/infrastructure?
4. **Validation Strategy**: What can go wrong and how will we prevent/handle it?
5. **Implementation Confidence**: What's the likelihood of one-pass implementation success?

**Plan your PRP structure:**
- Goal section with clear business value
- Why section linking to CleverDocs mission
- What section with specific technical implementation
- Comprehensive context section with all required files and docs
- Implementation blueprint with progressive validation steps
- Success criteria with measurable outcomes

---

## Write the PRP

Use the **refactored** template structure from `docs/PRPs/templates/backend_base.md` with your research findings:

### Enhanced Structure (Post-Refactoring):

**Goal**: Be specific about the backend functionality and business value
**Why**: Connect directly to CleverDocs mission and user impact  
**What**: Detailed technical requirements with API contracts
**Context**: Reference-based system (no duplication) with ALL necessary documentation
**Implementation Blueprint**: Progressive tasks with comprehensive validation loops
**Success Criteria**: Measurable outcomes aligned with CleverDocs goals

### Critical Enhancements (From Refactoring):

1. **Reference-based context** - No duplication, clean references to authoritative docs
2. **Comprehensive validation loops** - 7-phase validation system with executable commands
3. **CleverDocs-specific patterns** - Mission alignment, multi-level content, error handling
4. **Performance requirements** - Response time targets and monitoring patterns
5. **Security validation** - Input validation, vulnerability scanning, secrets detection
6. **API contracts** - OpenAPI documentation and frontend integration readiness
7. **Infrastructure planning** - Environment variables and AWS service requirements

### Validation Commands to Include:

```bash
# Backend validation steps for the PRP (use new comprehensive script)
./scripts/validate-backend.sh

# Or individual phase validation:
cd backend

# Phase 1: Import validation
python3 -c "import api; print('Backend imports successfully')"

# Phase 2: API validation  
python3 -m uvicorn api:app --reload &
sleep 2
curl http://localhost:8000/docs # Check OpenAPI docs
curl http://localhost:8000/ # Test basic endpoint
kill %1

# Phase 3: Code quality validation
python3 -m black . --check
python3 -m flake8 .
python3 -m mypy . --ignore-missing-imports

# Phase 4: Security validation
python3 -m bandit -r . -ll
python3 -m safety check

# Phase 5: Test validation (when tests exist)
python3 -m pytest tests/ -v --cov=. --cov-report=term-missing

# Phase 6: Performance validation
python3 -m pytest tests/performance/ --benchmark-only

# Phase 7: CleverDocs pattern validation
# Verify multi-level content patterns, error handling, async usage
grep -r "beginner\|intermediate\|expert" . --include="*.py"
grep -r "HTTPException\|ValidationError" . --include="*.py"
grep -r "async def\|await " . --include="*.py"
```

### File the PRP

Save the completed PRP as:
`docs/PRPs/generated/backend/{feature-name}-backend.md`

Where `{feature-name}` describes the specific backend functionality (e.g., `blog-upload-api`, `content-generation-service`, `user-authentication`).

## PRP Quality Score

Before completing, score your PRP on a scale of 1-10 for one-pass implementation confidence:

- **Context completeness** (all necessary docs and patterns included)
- **Technical clarity** (specific implementation steps with validation)
- **CleverDocs alignment** (supports core mission and integrates properly)
- **Error prevention** (addresses common pitfalls and edge cases)
- **Progressive validation** (can catch and fix issues during implementation)

**Target Score: 8-10** for high confidence in bug-free, efficient implementation.

Remember: The goal is one-pass implementation success through comprehensive context engineering specifically tailored for CleverDocs backend features.
