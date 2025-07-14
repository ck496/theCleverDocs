# Execute CleverDocs Frontend PRP

Implement a frontend feature using a comprehensive Frontend PRP (Product Requirements Prompt). This command is optimized for CleverDocs' React + TypeScript + Chakra UI stack, ensuring accessible, performant, and user-friendly implementation aligned with the mission of accelerating engineer onboarding.

## Core Mission

Execute frontend features that support CleverDocs' core mission: **accelerating engineer onboarding and knowledge sharing through intuitive, accessible user interfaces**.

## Instructions

**CRITICAL: Follow CleverDocs Planning Protocol**
1. **Present the plan first** - Show all tasks and subtasks before starting
2. **Ask for permission** - Wait for approval before proceeding  
3. **Execute step by step** - Work through approved tasks systematically

Read the PRP file ($ARGUMENTS) thoroughly and implement the feature following CleverDocs' established patterns and validation loops.

### Step 1: Context Validation & Understanding

**Verify all required context is available:**

```bash
# Validate PRP completeness
echo "📋 Validating PRP context..."

# Check if required files exist
if [ \! -f "docs/CLAUDE.md" ]; then
    echo "❌ Missing: docs/CLAUDE.md"
    exit 1
fi

if [ \! -f "docs/CODEBASE_GUIDE.md" ]; then
    echo "❌ Missing: docs/CODEBASE_GUIDE.md"
    exit 1
fi

if [ \! -f "docs/development/CODING_STANDARDS.md" ]; then
    echo "❌ Missing: docs/development/CODING_STANDARDS.md"
    exit 1
fi

if [ \! -f "frontend/package.json" ]; then
    echo "❌ Missing: frontend/package.json"
    exit 1
fi

echo "✅ Core context files validated"
```

**Read and internalize the PRP structure:**

1. **Goal** - What frontend functionality to build
2. **Why** - User value and CleverDocs mission alignment
3. **What** - Technical requirements and component architecture
4. **Context** - All referenced documentation (do not duplicate)
5. **Implementation Blueprint** - Progressive tasks with validation
6. **Success Criteria** - Measurable outcomes

### Step 2: Architecture Decision Analysis

**Determine implementation strategy based on PRP complexity assessment:**

```typescript
// Analyze PRP requirements to choose architecture approach
console.log("🏗️ Analyzing implementation strategy...")

// Simple Feature Indicators:
// - Single component with local state
// - Direct API calls using existing client
// - Basic user interactions
// - No complex state management

// Complex Feature Indicators:
// - Multiple components with shared state
// - Real-time features or WebSocket connections
// - Complex form workflows
// - Advanced performance requirements

console.log("Architecture decision based on PRP analysis:")
console.log("Option A: Simple component with hooks (Simple)")
console.log("Option B: Component hierarchy with context/state management (Complex)")
```

### Step 3: Progressive Implementation with Validation Loops

## Phase 1: Foundation Setup

### **Task 1.1: Environment Preparation**

```bash
# Navigate to frontend directory
cd frontend

# Validate current environment
echo "🔧 Setting up implementation environment..."

# Ensure dependencies are installed
npm install

# Validate current build
npm run build || {
    echo "⚠️ Build failed - fixing issues first"
    exit 1
}

# Type check
npm run type-check || {
    echo "⚠️ Type errors found - fixing first"
    exit 1
}

echo "✅ Frontend environment ready"
```

### **Task 1.2: Component Structure Decision**

**For Simple Features (Single Component):**

```tsx
// src/components/[FeatureName].tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Stack,
  Text,
  Heading,
  useToast,
  Skeleton,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { api } from '@/api/client'

interface [FeatureName]Props {
  // Define props based on PRP requirements
}

export const [FeatureName]: React.FC<[FeatureName]Props> = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState(null)
  const toast = useToast()

  // Component implementation following CleverDocs patterns
  
  if (loading) {
    return (
      <Stack spacing={4}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Component UI */}
    </Box>
  )
}
```

**For Complex Features (Component Hierarchy):**

```bash
# Create component structure
mkdir -p src/components/[FeatureName]
touch src/components/[FeatureName]/index.tsx
touch src/components/[FeatureName]/[FeatureName]Context.tsx
touch src/components/[FeatureName]/[FeatureName]Header.tsx
touch src/components/[FeatureName]/[FeatureName]Content.tsx
touch src/components/[FeatureName]/[FeatureName].types.ts

echo "✅ Created component structure"
```

## Phase 2: Type Definitions

### **Task 2.1: TypeScript Types (CleverDocs Pattern)**

```tsx
// src/types/[featureName].ts
export interface [FeatureName]Data {
  id: string
  title: string
  content: string
  expertiseLevel: 'beginner' | 'intermediate' | 'expert'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface [FeatureName]Request {
  title: string
  content: string
  expertiseLevel: 'beginner' | 'intermediate' | 'expert'
  tags: string[]
}

export interface [FeatureName]Response {
  status: 'success' | 'error'
  data?: [FeatureName]Data
  error?: string
}

// Validation
const validateTypeScript = () => {
  console.log('✅ TypeScript types defined')
}
```

### **Validation Loop 2: Type Safety**

```bash
cd frontend

# Validate TypeScript compilation
npm run type-check || {
    echo "❌ Type errors found"
    exit 1
}

echo "✅ Type validation passed"
```

## Phase 3: Component Implementation

### **Task 3.1: Main Component (Following CleverDocs Rules)**

```tsx
// src/components/[FeatureName]/[FeatureName].tsx
import React, { useState, useCallback } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  useToast,
  useColorModeValue,
  Spinner,
  Center
} from '@chakra-ui/react'
import { use[FeatureName] } from '@/hooks/use[FeatureName]'

export const [FeatureName]: React.FC = () => {
  const { data, loading, error, refetch } = use[FeatureName]()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleAction = useCallback(async () => {
    try {
      // Action implementation
      toast({
        title: 'Success',
        description: 'Action completed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to complete action',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [toast])

  // Loading state (CleverDocs pattern)
  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  // Error state (CleverDocs pattern)
  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error loading data</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button mt={4} onClick={refetch}>
          Try Again
        </Button>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Feature Title</Heading>
        
        <Box
          bg={bgColor}
          borderWidth={1}
          borderColor={borderColor}
          borderRadius="lg"
          p={6}
        >
          {/* Feature content */}
        </Box>
      </VStack>
    </Container>
  )
}
```

### **Task 3.2: Custom Hook Implementation**

```tsx
// src/hooks/use[FeatureName].ts
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/api/client'
import type { [FeatureName]Data } from '@/types/[featureName]'

export const use[FeatureName] = () => {
  const [data, setData] = useState<[FeatureName]Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.get('/api/[feature-endpoint]')
      setData(response.data.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
```

### **Validation Loop 3: Component Functionality**

```bash
cd frontend

# Start development server
npm run dev &
DEV_PID=$\!

# Wait for server
sleep 5

# Check if component renders (would need e2e test in real scenario)
echo "🔍 Component should be accessible at http://localhost:5173"
echo "✅ Development server running"

# Stop server
kill $DEV_PID 2>/dev/null || true
```

## Phase 4: Integration & API Connection

### **Task 4.1: API Client Integration**

```tsx
// src/api/[featureName]Api.ts
import { apiClient } from './client'
import type { 
  [FeatureName]Request, 
  [FeatureName]Response,
  [FeatureName]Data 
} from '@/types/[featureName]'

export const [featureName]Api = {
  async create(data: [FeatureName]Request): Promise<[FeatureName]Data> {
    const response = await apiClient.post<[FeatureName]Response>(
      '/api/[feature-endpoint]',
      data
    )
    
    if (response.data.status === 'error') {
      throw new Error(response.data.error || 'Unknown error')
    }
    
    return response.data.data\!
  },

  async list(): Promise<[FeatureName]Data[]> {
    const response = await apiClient.get<{
      status: string
      data: [FeatureName]Data[]
    }>('/api/[feature-endpoint]')
    
    return response.data.data
  },

  async get(id: string): Promise<[FeatureName]Data> {
    const response = await apiClient.get<[FeatureName]Response>(
      `/api/[feature-endpoint]/${id}`
    )
    
    if (\!response.data.data) {
      throw new Error('Not found')
    }
    
    return response.data.data
  }
}
```

### **Validation Loop 4: API Integration**

```typescript
// Test API integration
import { [featureName]Api } from '@/api/[featureName]Api'

const testApiIntegration = async () => {
  try {
    // Test list endpoint
    const items = await [featureName]Api.list()
    console.log('✅ API list endpoint working')
    
    // Test error handling
    try {
      await [featureName]Api.get('invalid-id')
    } catch (error) {
      console.log('✅ API error handling working')
    }
  } catch (error) {
    console.error('❌ API integration failed:', error)
  }
}
```

## Phase 5: Testing Implementation

### **Task 5.1: Component Tests**

```tsx
// src/components/[FeatureName]/[FeatureName].test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { [FeatureName] } from './[FeatureName]'
import { rest } from 'msw'
import { server } from '@/test-utils/mocks/server'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  )
}

describe('[FeatureName] Component', () => {
  // Test 1: Happy path
  test('renders data successfully', async () => {
    renderWithProviders(<[FeatureName] />)
    
    // Should show loading initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Feature Title')).toBeInTheDocument()
    })
  })
  
  // Test 2: Error handling
  test('displays error message on API failure', async () => {
    server.use(
      rest.get('/api/[feature-endpoint]', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    renderWithProviders(<[FeatureName] />)
    
    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument()
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    })
  })
  
  // Test 3: User interaction
  test('handles user actions correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(<[FeatureName] />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: /action/i }))
    
    // Verify action result
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })
})
```

### **Validation Loop 5: Test Execution**

```bash
cd frontend

# Run tests
npm test -- --run

# Run with coverage
npm test -- --coverage

echo "✅ Tests completed"
```

## Phase 6: Accessibility & Performance

### **Task 6.1: Accessibility Validation**

```tsx
// Add accessibility tests
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('has no accessibility violations', async () => {
  const { container } = renderWithProviders(<[FeatureName] />)
  
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

// Keyboard navigation test
test('supports keyboard navigation', async () => {
  const user = userEvent.setup()
  renderWithProviders(<[FeatureName] />)
  
  await waitFor(() => {
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  
  // Tab to button
  await user.tab()
  expect(screen.getByRole('button')).toHaveFocus()
  
  // Activate with Enter
  await user.keyboard('{Enter}')
  // Verify action
})
```

### **Task 6.2: Performance Optimization**

```tsx
// Optimize with React.memo and useMemo
import React, { memo, useMemo } from 'react'

export const [FeatureName]Item = memo(({ item }: { item: ItemType }) => {
  const processedData = useMemo(() => {
    // Expensive calculation
    return processItem(item)
  }, [item.id])
  
  return <Box>{/* Render item */}</Box>
})

// Lazy loading for code splitting
const [FeatureName]Page = React.lazy(() => 
  import('./pages/[FeatureName]Page')
)
```

## Phase 7: Final Validation

### **Task 7.1: Comprehensive Validation**

```bash
cd frontend

echo "🔍 Running comprehensive frontend validation..."

# Phase 1: Build validation
echo "Phase 1: Build Validation"
npm run build || { echo "❌ Build failed"; exit 1; }
echo "✅ Build successful"

# Phase 2: Type checking
echo "Phase 2: Type Checking"
npm run type-check || { echo "❌ Type check failed"; exit 1; }
echo "✅ Types valid"

# Phase 3: Linting
echo "Phase 3: Linting"
npm run lint || { echo "❌ Linting failed"; exit 1; }
echo "✅ Code quality passed"

# Phase 4: Testing
echo "Phase 4: Testing"
npm test -- --run || { echo "❌ Tests failed"; exit 1; }
echo "✅ All tests passed"

# Phase 5: Bundle analysis (if configured)
if [ -f "vite.config.ts" ]; then
  echo "Phase 5: Bundle Analysis"
  npm run build -- --mode analyze || echo "⚠️ Bundle analysis not configured"
fi

echo "✅ Frontend validation completed successfully"
```

### **Task 7.2: CleverDocs Pattern Validation**

```bash
echo "🎯 Validating CleverDocs patterns..."

# Check for Chakra UI usage
if grep -r "styled-components\|@emotion/styled" src/ --include="*.tsx" --include="*.ts"; then
  echo "⚠️ Found styled-components usage - should use Chakra UI"
else
  echo "✅ Using Chakra UI consistently"
fi

# Check for loading states
if grep -r "loading\|isLoading" src/components --include="*.tsx" | grep -q "Skeleton\|Spinner"; then
  echo "✅ Loading states implemented"
else
  echo "⚠️ Missing loading state implementations"
fi

# Check for error handling
if grep -r "error\|Error" src/components --include="*.tsx" | grep -q "Alert\|toast"; then
  echo "✅ Error handling implemented"
else
  echo "⚠️ Missing error handling"
fi

# Check component size
for file in src/components/**/*.tsx; do
  lines=$(wc -l < "$file" 2>/dev/null || echo 0)
  if [ $lines -gt 200 ]; then
    echo "⚠️ $file has $lines lines (should be < 200)"
  fi
done

echo "✅ Pattern validation completed"
```

## Final Success Confirmation

### **Implementation Checklist**

Verify all success criteria from the PRP are met:

- [ ] **Component Architecture**: Clean separation of concerns
- [ ] **Type Safety**: Full TypeScript coverage with strict mode
- [ ] **Error Handling**: User-friendly error messages and recovery
- [ ] **Loading States**: Skeleton screens or spinners for all async operations
- [ ] **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation
- [ ] **Performance**: Fast initial load, responsive interactions
- [ ] **Testing**: Component, integration, and accessibility tests pass
- [ ] **CleverDocs Patterns**: Using Chakra UI, reusable components, clean pages

### **Quality Gates**

```bash
echo "🎉 Final Quality Gates Validation"

# Performance check
echo "Performance: First contentful paint < 1s ✅"

# Accessibility check
echo "Accessibility: Zero axe violations ✅"

# User experience check
echo "UX: Intuitive interactions with clear feedback ✅"

# Code quality check
echo "Code Quality: TypeScript strict, linting passed ✅"

echo "🚀 Implementation completed successfully\!"
echo "Frontend feature ready for CleverDocs deployment"
```

### **Next Steps & Integration**

```bash
echo "📋 Next Steps:"
echo "1. Backend Integration: Ensure API endpoints match expected contracts"
echo "2. E2E Testing: Add Playwright tests for critical user flows"
echo "3. Performance Monitoring: Set up metrics collection"
echo "4. Documentation: Update component documentation and Storybook"
echo "5. Deployment: Add to build pipeline"

echo "🔗 Integration Points:"
echo "- API Types: Ensure frontend types match backend responses"
echo "- Error Formats: Consistent error handling across stack"
echo "- Authentication: Integrate with auth context when ready"
echo "- Analytics: Add user interaction tracking"
```

---

## Anti-Patterns to Avoid

- ❌ **Large page files** - Extract components and logic
- ❌ **Inline styles** - Use Chakra UI props and theme
- ❌ **Missing TypeScript types** - Always define interfaces
- ❌ **No loading states** - Every async operation needs feedback
- ❌ **Poor error handling** - Always show user-friendly messages
- ❌ **Ignoring accessibility** - Test with keyboard and screen readers
- ❌ **Component coupling** - Keep components independent and reusable
- ❌ **Performance issues** - Profile and optimize expensive operations

Remember: The goal is to create intuitive, accessible, and performant user interfaces that accelerate engineer onboarding through excellent user experience - the core CleverDocs mission.
EOF < /dev/null