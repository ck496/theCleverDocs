# Generate Frontend PRP for CleverDocs

Generate a comprehensive Frontend Feature Implementation PRP (Product Requirements Prompt) with thorough research and context. This command is optimized for CleverDocs frontend features using React + TypeScript + Chakra UI, ensuring one-pass implementation success through comprehensive context engineering.

## Core Mission
Create frontend features that support CleverDocs' core mission: **accelerating engineer onboarding and knowledge sharing through intuitive, accessible user interfaces**.

## Instructions

**CRITICAL: Follow CleverDocs Planning Protocol**
1. **Present the plan first** - Show all tasks and subtasks before starting
2. **Ask for permission** - Wait for approval before proceeding  
3. **Execute step by step** - Work through approved tasks systematically

Read the frontend feature request file ($ARGUMENTS) first to understand what needs to be built. The feature must support CleverDocs' user experience goals for knowledge discovery, content creation, and community engagement.

### Step 1: Research Phase - Understand the Context

**Read ALL required context files in order (following refactored documentation structure):**

1. **`README.md`** - CleverDocs purpose and business goals
2. **`docs/PRDs/CleverDocsPRD.md`** - Business requirements and user journeys
3. **`docs/CLAUDE.md`** - Global AI agent rules and CleverDocs-specific requirements
4. **`docs/CODEBASE_GUIDE.md`** - Current frontend state and component architecture
5. **`docs/development/CODING_STANDARDS.md`** - Enhanced frontend patterns, component guidelines
6. **`docs/development/TESTING_FRONTEND.md`** - Frontend testing requirements and patterns
7. **`frontend/README.md`** - Frontend-specific setup and architecture
8. **$ARGUMENTS** - The specific frontend feature request

**Analyze the current component structure:**

```bash
# Check current frontend state
tree frontend/src -I 'node_modules|dist' -L 3
ls -la frontend/src/components/
ls -la frontend/src/pages/
ls -la frontend/src/hooks/
cat frontend/package.json | grep -A 10 "dependencies"
```

**Research external documentation needs:**
- React patterns: https://react.dev/learn/thinking-in-react
- TypeScript with React: https://react-typescript-cheatsheet.netlify.app/
- Chakra UI components: https://chakra-ui.com/docs/components
- React Query (if data fetching): https://tanstack.com/query/latest
- React Router (if routing): https://reactrouter.com/en/main

### Step 2: Component Architecture Decision

**Determine structural approach based on feature complexity:**

**Simple Feature** (single component, local state):
- Single component file with hooks
- Direct API calls using existing client
- Local state management with useState/useReducer
- Chakra UI components for styling

**Complex Feature** (multiple components, shared state):
- Component hierarchy with clear separation
- Custom hooks for business logic
- Context API or external state management
- Separate service layers for API calls
- Performance optimizations (memoization, lazy loading)

**Document your decision with rationale in the PRP.**

### Step 3: CleverDocs Frontend Context Research

**For UI/UX features, research:**
- Existing component patterns in `frontend/src/components/`
- Chakra UI theme customizations
- Responsive design breakpoints
- Animation and transition patterns
- Accessibility requirements (WCAG 2.1 AA)

**For data-driven features, research:**
- API client patterns in `frontend/src/api/client.ts`
- Data fetching hooks in `frontend/src/hooks/`
- Type definitions in `frontend/src/types/`
- Error handling patterns
- Loading and skeleton states

### Step 4: Performance & Accessibility Research

**Critical CleverDocs frontend requirements:**
- All inputs validated before submission
- Comprehensive error handling with user-friendly messages
- Loading states for all async operations
- Keyboard navigation support
- Screen reader compatibility
- Mobile-responsive design

### Step 5: Integration Planning

**Research backend integration needs:**
- What API endpoints will be consumed?
- What TypeScript types need to be defined?
- How will error responses be handled?
- What caching strategy is appropriate?

**Research testing requirements:**
- Component unit tests with React Testing Library
- Integration tests with MSW for API mocking
- Accessibility tests with axe-core
- Visual regression tests with Storybook

---

## *** CRITICAL: ULTRATHINK PHASE ***

**Before writing the PRP, synthesize all research:**

1. **User Impact**: How does this feature improve the engineer onboarding experience?
2. **Technical Architecture**: Simple component vs complex component hierarchy?
3. **Data Flow**: How does data flow from API to UI? What's the state management strategy?
4. **Accessibility**: How will all users be able to use this feature effectively?
5. **Performance**: What optimizations are needed for smooth user experience?

**Plan your PRP structure:**
- Goal section with clear user value
- Why section linking to CleverDocs mission
- What section with specific technical implementation
- Comprehensive context section with all required files and docs
- Implementation blueprint with progressive validation steps
- Success criteria with measurable outcomes

---

## Write the PRP

Use the **refactored** template structure from `docs/PRPs/templates/frontend_base.md` with your research findings:

### Enhanced Structure (Post-Refactoring):

**Goal**: Be specific about the frontend functionality and user value
**Why**: Connect directly to CleverDocs mission and user experience goals
**What**: Detailed technical requirements with component architecture
**Context**: Reference-based system (no duplication) with ALL necessary documentation
**Implementation Blueprint**: Progressive tasks with comprehensive validation loops
**Success Criteria**: Measurable outcomes aligned with CleverDocs goals

### Critical Enhancements (From Refactoring):

1. **Component-based architecture** - Clear hierarchy and separation of concerns
2. **Comprehensive testing** - Unit, integration, and accessibility tests
3. **CleverDocs-specific patterns** - Loading states, error handling, responsive design
4. **Performance requirements** - First contentful paint, interaction responsiveness
5. **Accessibility validation** - WCAG compliance, keyboard navigation
6. **Type safety** - Full TypeScript coverage with strict mode
7. **User experience** - Intuitive interactions, clear feedback

### Validation Commands to Include:

```bash
# Frontend validation steps for the PRP
cd frontend

# Phase 1: Build validation
npm run build
npm run type-check

# Phase 2: Component validation
npm run storybook # If Storybook is set up

# Phase 3: Test validation
npm test -- --run
npm test -- --coverage

# Phase 4: Accessibility validation
# Include axe-core tests in component tests

# Phase 5: Bundle size validation
npm run build -- --analyze # If configured

# Phase 6: Linting validation
npm run lint
npm run format:check

# Phase 7: CleverDocs pattern validation
# Verify loading states, error handling, responsive design
grep -r "loading" src/components --include="*.tsx"
grep -r "error" src/components --include="*.tsx"
grep -r "useMediaQuery\|breakpoint" src --include="*.tsx"
```

### File the PRP

Save the completed PRP as:
`docs/PRPs/generated/frontend/{feature-name}-frontend.md`

Where `{feature-name}` describes the specific frontend functionality (e.g., `blog-upload-ui`, `real-time-collaboration`, `analytics-dashboard`).

## PRP Quality Score

Before completing, score your PRP on a scale of 1-10 for one-pass implementation confidence:

- **Context completeness** (all necessary docs and patterns included)
- **Technical clarity** (specific implementation steps with validation)
- **CleverDocs alignment** (supports core mission and integrates properly)
- **User experience** (intuitive, accessible, performant)
- **Progressive validation** (can catch and fix issues during implementation)

**Target Score: 8-10** for high confidence in bug-free, efficient implementation.

Remember: The goal is one-pass implementation success through comprehensive context engineering specifically tailored for CleverDocs frontend features.