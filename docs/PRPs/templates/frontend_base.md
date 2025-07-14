---
name: "CleverDocs Frontend PRP Template v2"
description: |
  Frontend-focused PRP template for React + TypeScript + Chakra UI features in CleverDocs.
  Optimized for component-based architecture with accessibility and performance validation loops.
  Eliminates redundancy by referencing centralized documentation.
---

# CleverDocs Frontend Feature Implementation PRP

## Core Principles

1. **Frontend-Only Focus**: Single tier implementation - no backend or infrastructure mixing
2. **User Experience First**: Every component must be intuitive, accessible, and performant
3. **Component-Based Architecture**: Reusable components assembled into clean page layouts
4. **Validation Loops**: Comprehensive testing and accessibility validation at each phase
5. **CleverDocs Mission**: Every UI feature must accelerate engineer onboarding and knowledge sharing

---

## Goal

**Feature Name**: [Specific frontend functionality to be built]

**User Value**: [How this improves the engineer onboarding experience through better UX]

**Component Architecture**: [Main components, data flow, and user interactions]

## Why This Feature

- **User Impact**: [How this specifically improves knowledge discovery, content creation, or community engagement]
- **Technical Value**: [Integration with existing CleverDocs frontend architecture]
- **Mission Alignment**: [Reference specific user journeys: content discovery, knowledge sharing, onboarding acceleration]

## What to Build

**UI Components**: [Specific React components with Chakra UI styling]
**User Interactions**: [Click flows, form submissions, navigation patterns]
**Data Integration**: [API endpoints, state management, caching strategy]
**Accessibility Features**: [Keyboard navigation, screen reader support, WCAG compliance]

### Success Criteria

- [ ] **Component Architecture**: Clean separation of concerns with reusable components
- [ ] **Type Safety**: Full TypeScript coverage with strict mode enabled
- [ ] **User Experience**: Intuitive interactions with clear visual feedback
- [ ] **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation support
- [ ] **Performance**: < 1s first contentful paint, < 100ms interaction response
- [ ] **Error Handling**: User-friendly error messages with recovery options
- [ ] **Testing**: Component, integration, and accessibility tests pass with >90% coverage
- [ ] **CleverDocs Patterns**: Using Chakra UI exclusively, clean page architecture

## Testing Requirements

### **Every Component MUST Have Tests**

1. **Component Tests** (src/__tests__/components/):
   - One test for expected/happy path behavior
   - One test for edge cases (empty data, boundary conditions)
   - One test for error cases (API failures, invalid inputs)
   - Mock external dependencies and API calls

2. **Integration Tests** (src/__tests__/integration/):
   - Test full user workflows with MSW API mocking
   - Test component interactions and state management
   - Verify error handling and loading states

3. **Accessibility Tests**:
   - Zero axe-core violations
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast compliance

4. **Test Maintenance**:
   - After updating any component, check and update affected tests
   - Tests must pass before marking feature complete
   - Maintain >90% code coverage for new components

## Essential Context References

### **Project Foundation (Read First)**

```yaml
# Core Project Understanding - MUST READ in order
- file: README.md
  why: CleverDocs purpose, key features, business context

- file: docs/CLAUDE.md
  why: Global AI agent rules and CleverDocs-specific behavioral requirements

- file: docs/CODEBASE_GUIDE.md
  section: "🎨 frontend/ - React + TypeScript + Vite"
  why: Current frontend state and component structure

- file: docs/development/CODING_STANDARDS.md
  section: "⚛️ Frontend Standards (React + TypeScript + Chakra UI)"
  why: Frontend patterns, component guidelines, CleverDocs rules

- file: docs/development/TESTING_FRONTEND.md
  why: Frontend testing patterns, React Testing Library configuration

- file: docs/PRDs/CleverDocsPRD.md
  why: Detailed business requirements and user journey goals
```

### **Current Implementation State**

```yaml
# What Actually Exists vs What's Planned
- file: frontend/package.json
  why: Current dependencies and available scripts

- file: frontend/src/components/
  why: Existing component patterns to follow and extend

- file: frontend/src/pages/
  why: Current page structure and navigation patterns

- file: frontend/src/api/client.ts
  why: API integration patterns and error handling
# Note: See docs/CODEBASE_GUIDE.md for full frontend structure
```

### **External Documentation & Patterns**

```yaml
# Official React & TypeScript Documentation
- url: https://react.dev/learn/thinking-in-react
  section: Component design and data flow
  why: React best practices for component architecture

- url: https://react-typescript-cheatsheet.netlify.app/
  section: TypeScript with React patterns
  why: Type safety patterns and common patterns

- url: https://chakra-ui.com/docs/components
  section: Component library and theming
  why: Chakra UI components and styling patterns

- url: https://testing-library.com/docs/react-testing-library/intro/
  section: Component testing best practices
  why: User-focused testing approach

# CleverDocs-Specific UI Patterns
- url: https://accessibility.18f.gov/checklist/
  section: Accessibility compliance checklist
  why: WCAG 2.1 AA compliance requirements
```

## Implementation Architecture Decision

### **Component Strategy** (Choose based on feature complexity)

**Option A: Simple Component** (Single component with hooks)

```tsx
// Single file component with local state
// Use ONLY for: Simple displays, basic forms, minimal interactions
// ⚠️  MUST keep under 200 lines or break into smaller components

export const FeatureComponent: React.FC<Props> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Chakra UI components only
  return (
    <Box p={4}>
      <Heading>{data.title}</Heading>
      {/* Implementation */}
    </Box>
  )
}
```

**Option B: Component Hierarchy** (Recommended for most features)

```bash
# Implement proper component structure
# Use for: Multi-step flows, complex interactions, shared state

src/components/FeatureName/
├── index.tsx              # Main export
├── FeatureName.tsx        # Container component
├── FeatureHeader.tsx      # Header subcomponent
├── FeatureContent.tsx     # Content subcomponent
├── FeatureActions.tsx     # Actions subcomponent
├── FeatureName.types.ts   # TypeScript interfaces
└── __tests__/            # Component tests
    ├── FeatureName.test.tsx
    └── FeatureHeader.test.tsx
```

**Component Size Rule**: Max 200 lines per component - split when approaching limit.

**Document your choice with rationale.**

## CleverDocs-Specific Implementation Patterns

### **Component Testing Pattern Template**

```tsx
// Required testing pattern for every new component
// File: src/__tests__/components/FeatureName.test.tsx

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { rest } from 'msw'
import { server } from '@/test-utils/mocks/server'
import { FeatureComponent } from '@/components/FeatureComponent'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  )
}

describe('FeatureComponent', () => {
  // Test 1: Expected use case
  test('renders with valid data', () => {
    const mockData = { title: 'Test Feature', content: 'Test content' }
    renderWithProviders(<FeatureComponent data={mockData} />)
    
    expect(screen.getByText('Test Feature')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
  
  // Test 2: Edge case
  test('handles empty data gracefully', () => {
    renderWithProviders(<FeatureComponent data={null} />)
    
    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })
  
  // Test 3: Error case
  test('displays error state on API failure', async () => {
    server.use(
      rest.get('/api/feature', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    renderWithProviders(<FeatureComponent />)
    
    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument()
    })
  })
}
```

### **Chakra UI Component Pattern**

```tsx
// Required CleverDocs component pattern
import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  useColorModeValue,
  useToast,
  Skeleton,
  Alert,
  AlertIcon
} from '@chakra-ui/react'

export const CleverDocsComponent: React.FC<Props> = ({ data, loading, error }) => {
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Loading state (required pattern)
  if (loading) {
    return (
      <VStack spacing={4}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </VStack>
    )
  }

  // Error state (required pattern)
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error.message}
      </Alert>
    )
  }

  return (
    <Box
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md">{data.title}</Heading>
        <Text color="gray.600">{data.description}</Text>
        
        <HStack spacing={2}>
          <Button
            colorScheme="blue"
            onClick={handlePrimaryAction}
            isLoading={loading}
          >
            Primary Action
          </Button>
          <Button variant="outline" onClick={handleSecondaryAction}>
            Secondary Action
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
```

### **Accessibility Pattern** (Required)

```tsx
// Accessibility requirements for CleverDocs components
import { useEffect, useRef } from 'react'

export const AccessibleComponent: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Focus management for screen readers
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus()
    }
  }, [])

  return (
    <Box role="main" aria-labelledby="main-heading">
      <Heading
        id="main-heading"
        ref={headingRef}
        tabIndex={-1}
        _focus={{ outline: '2px solid', outlineColor: 'blue.500' }}
      >
        Accessible Heading
      </Heading>
      
      <Button
        aria-describedby="action-description"
        _focus={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' }}
      >
        Accessible Action
      </Button>
      
      <Text id="action-description" fontSize="sm" color="gray.600">
        This action will perform the main feature operation
      </Text>
    </Box>
  )
}
```

## **MANDATORY: Feature Documentation**

**🚨 CRITICAL REQUIREMENT**: Upon PRP completion, you MUST create a comprehensive feature implementation summary.

### **Documentation Process**

1. **Use Template**: Copy `docs/features/templates/frontend-feature-summary.md`
2. **Create Summary**: Save as `docs/features/implemented/frontend/YYYY-MM-DD-feature-name-frontend.md`
3. **Complete All Sections**:
   - Implementation details with phase breakdown
   - All files created/modified with specific changes
   - Testing performed (component, integration, accessibility)
   - Integration points and breaking changes
   - Performance considerations and accessibility compliance
   - Troubleshooting guide and future considerations

### **Success Criteria**
- [ ] **Feature Summary Created**: Comprehensive documentation following template
- [ ] **All Phases Documented**: Each implementation phase with tasks and testing
- [ ] **Files Catalogued**: Complete list of created/modified files with descriptions
- [ ] **Testing Recorded**: All component, integration, and manual testing documented
- [ ] **Integration Documented**: Dependencies, breaking changes, cross-component impact
- [ ] **Accessibility Verified**: WCAG 2.1 AA compliance and testing methods recorded
- [ ] **Performance Measured**: Optimizations and metrics documented
- [ ] **Troubleshooting Added**: Common issues and solutions documented

**The PRP is NOT considered complete until the feature documentation is created.**

---

**Note**: This template eliminates redundancy by referencing centralized documentation instead of duplicating information. All component patterns, testing guidelines, and accessibility requirements are maintained in their authoritative locations.
EOF < /dev/null