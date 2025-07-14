# CleverDocs Frontend Testing Guide

> **Purpose**: Comprehensive frontend testing strategies for React, TypeScript, and modern web development.

## 🧪 Frontend Testing Requirements

### Every Frontend Feature Must Have

1. **Component Tests**:
   - Render correctly with valid props
   - Handle edge cases (empty data, loading states)
   - Respond to user interactions appropriately

2. **Hook Tests**:
   - Return expected values and state changes
   - Handle side effects properly
   - Clean up resources when unmounted

3. **Integration Tests**:
   - Test component interaction with APIs
   - Test user workflows across components
   - Test error handling and recovery

## 📁 Frontend Test Structure

```
frontend/src/
├── __tests__/             # Test files mirror source structure
│   ├── components/        # Component unit tests
│   │   ├── BlogCard.test.tsx
│   │   ├── BlogsCardGrid.test.tsx
│   │   ├── BlogRater.test.tsx
│   │   └── RatingBadge.test.tsx
│   ├── hooks/            # Custom hook tests
│   │   ├── useBlogs.test.ts
│   │   ├── useBlogRating.test.ts
│   │   └── useLocalStorage.test.ts
│   ├── pages/            # Page integration tests
│   │   ├── HomePage.test.tsx
│   │   ├── BlogsGridPage.test.tsx
│   │   └── BlogDetailPage.test.tsx
│   ├── services/         # API client tests
│   │   └── client.test.ts
│   └── utils/            # Utility function tests
│       └── formatters.test.ts
├── test-utils/           # Testing utilities and mocks
│   ├── index.ts          # Custom render function with providers
│   ├── mocks/            # Mock data and handlers
│   │   ├── mockData.ts   # Mock blog data, user data, etc.
│   │   ├── handlers.ts   # MSW request handlers
│   │   └── server.ts     # MSW server setup
│   └── setup.ts          # Test environment setup
├── e2e/                  # End-to-end tests
│   ├── blog-workflow.spec.ts
│   ├── user-journey.spec.ts
│   └── accessibility.spec.ts
└── vitest.config.ts      # Test configuration
```

## 🚀 Running Frontend Tests

```bash
# Run all tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- BlogCard.test.tsx

# Run tests matching pattern
npm test -- --grep "blog"

# Run with UI (if using Vitest)
npm test -- --ui
```

## 🔧 Frontend Testing Tools

- **Vitest**: Fast test framework (recommended for Vite projects)
- **@testing-library/react**: Component testing with focus on user behavior
- **@testing-library/jest-dom**: Additional DOM matchers
- **@testing-library/user-event**: Realistic user interaction simulation
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **Playwright**: End-to-end testing and browser automation
- **@storybook/test**: Visual regression testing with Storybook
- **axe-core**: Accessibility testing

## 🎨 Frontend Testing Strategies

### 1. Component Unit Tests (3-Test Pattern)

Focus on testing component behavior, not implementation details:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogCard } from '@/components/BlogCard'
import { mockBlog } from '@/test-utils/mockData'

describe('BlogCard Component', () => {
  // Test 1: Expected use case (happy path)
  test('renders blog card with valid data', () => {
    render(<BlogCard blog={mockBlog} />)
    
    expect(screen.getByText(mockBlog.title)).toBeInTheDocument()
    expect(screen.getByText(mockBlog.author.name)).toBeInTheDocument()
    expect(screen.getByText(mockBlog.readTime)).toBeInTheDocument()
  })
  
  // Test 2: Edge case (boundary conditions)
  test('handles blog with no tags gracefully', () => {
    const blogWithNoTags = { ...mockBlog, tags: [] }
    render(<BlogCard blog={blogWithNoTags} />)
    
    expect(screen.queryByTestId('tag-list')).not.toBeInTheDocument()
    expect(screen.getByText(blogWithNoTags.title)).toBeInTheDocument()
  })
  
  // Test 3: Failure case (error handling)
  test('displays fallback when blog data is invalid', () => {
    const invalidBlog = { ...mockBlog, title: null, author: null }
    render(<BlogCard blog={invalidBlog} />)
    
    expect(screen.getByText(/unable to load blog/i)).toBeInTheDocument()
  })
})
```

### 2. Custom Hook Testing

Test hooks in isolation using `renderHook`:

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '@/test-utils/mocks/server'
import { useBlogs } from '@/hooks/useBlogs'
import { mockBlogs } from '@/test-utils/mockData'

describe('useBlogs hook', () => {
  // Test 1: Expected use case
  test('loads blogs on mount', async () => {
    const { result } = renderHook(() => useBlogs())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.blogs).toEqual([])
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.blogs).toHaveLength(mockBlogs.length)
    })
  })
  
  // Test 2: Edge case
  test('handles empty blog list', async () => {
    server.use(
      rest.get('/api/blogs', (req, res, ctx) => {
        return res(ctx.json([]))
      })
    )
    
    const { result } = renderHook(() => useBlogs())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.blogs).toEqual([])
      expect(result.current.error).toBe(null)
    })
  })
  
  // Test 3: Failure case
  test('handles API errors gracefully', async () => {
    server.use(
      rest.get('/api/blogs', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    const { result } = renderHook(() => useBlogs())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeTruthy()
      expect(result.current.blogs).toEqual([])
    })
  })
})
```

### 3. Integration Testing with MSW

Mock API calls realistically for component integration:

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '@/test-utils/mocks/server'
import { BlogsGridPage } from '@/pages/BlogsGridPage'
import { mockBlogs } from '@/test-utils/mockData'

describe('BlogsGridPage Integration', () => {
  test('filters blogs by type when switching tabs', async () => {
    const user = userEvent.setup()
    render(<BlogsGridPage />)
    
    // Initially shows community blogs
    await waitFor(() => {
      expect(screen.getByText('Community Blog Title')).toBeInTheDocument()
    })
    
    // Switch to official tab
    await user.click(screen.getByRole('tab', { name: /official/i }))
    
    // Mock API response for official blogs
    server.use(
      rest.get('/api/blogs', (req, res, ctx) => {
        const docType = req.url.searchParams.get('docType')
        const filteredBlogs = mockBlogs.filter(blog => blog.docType === docType)
        return res(ctx.json(filteredBlogs))
      })
    )
    
    // Wait for official blogs to load
    await waitFor(() => {
      expect(screen.getByText('Official Blog Title')).toBeInTheDocument()
      expect(screen.queryByText('Community Blog Title')).not.toBeInTheDocument()
    })
  })
})
```

### 4. User Interaction Testing

Test realistic user interactions:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogRater } from '@/components/BlogRater'

describe('BlogRater User Interactions', () => {
  test('allows user to submit rating', async () => {
    const user = userEvent.setup()
    const onRate = jest.fn()
    
    render(<BlogRater blogId="123" onRate={onRate} />)
    
    // User selects 5 stars
    await user.click(screen.getByLabelText(/5 stars/i))
    
    // Submit rating
    await user.click(screen.getByRole('button', { name: /submit rating/i }))
    
    // Verify callback was called
    expect(onRate).toHaveBeenCalledWith(5)
    
    // Verify success message
    expect(screen.getByText(/thank you for rating/i)).toBeInTheDocument()
  })
  
  test('validates rating selection before submission', async () => {
    const user = userEvent.setup()
    render(<BlogRater blogId="123" />)
    
    // Try to submit without selecting rating
    await user.click(screen.getByRole('button', { name: /submit rating/i }))
    
    // Should show validation error
    expect(screen.getByText(/please select a rating/i)).toBeInTheDocument()
  })
})
```

### 5. Form Testing

Test form validation and submission:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/components/ContactForm'

describe('ContactForm', () => {
  test('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Submit empty form
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Check validation errors
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/message is required/i)).toBeInTheDocument()
  })
  
  test('submits form with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello world')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Verify submission
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      message: 'Hello world'
    })
  })
})
```

### 6. Accessibility Testing

Ensure components are accessible:

```tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { BlogCard } from '@/components/BlogCard'
import { mockBlog } from '@/test-utils/mockData'

expect.extend(toHaveNoViolations)

describe('BlogCard Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<BlogCard blog={mockBlog} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  
  test('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<BlogCard blog={mockBlog} />)
    
    const blogLink = screen.getByRole('link', { name: mockBlog.title })
    
    // Tab to the link
    await user.tab()
    expect(blogLink).toHaveFocus()
    
    // Press Enter
    await user.keyboard('{Enter}')
    // Verify navigation (would need routing setup)
  })
})
```

### 7. Error Boundary Testing

Test error handling and recovery:

```tsx
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

describe('ErrorBoundary', () => {
  test('catches and displays error', () => {
    const ThrowError = () => {
      throw new Error('Test error')
      return <div>Should not render</div>
    }
    
    // Suppress error logging in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})
```

## 🛠️ Test Configuration

### Vitest Configuration (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      exclude: [
        'node_modules/',
        'src/test-utils/',
        '**/*.d.ts',
        '**/*.stories.tsx',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Test Setup (src/test-utils/setup.ts)
```typescript
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

// MSW setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

### Custom Render Utility (src/test-utils/index.ts)
```typescript
import { render, RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement } from 'react'

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
export { userEvent } from '@testing-library/user-event'
```

### MSW Setup (src/test-utils/mocks/server.ts)
```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### API Handlers (src/test-utils/mocks/handlers.ts)
```typescript
import { rest } from 'msw'
import { mockBlogs } from './mockData'

export const handlers = [
  rest.get('/api/blogs', (req, res, ctx) => {
    const docType = req.url.searchParams.get('docType')
    const tags = req.url.searchParams.get('tags')
    
    let filteredBlogs = mockBlogs
    
    if (docType) {
      filteredBlogs = filteredBlogs.filter(blog => blog.docType === docType)
    }
    
    if (tags) {
      const tagList = tags.split(',')
      filteredBlogs = filteredBlogs.filter(blog =>
        tagList.some(tag => blog.tags.includes(tag.trim()))
      )
    }
    
    return res(ctx.json(filteredBlogs))
  }),
  
  rest.post('/api/blogs/:id/rate', (req, res, ctx) => {
    return res(ctx.json({ 
      success: true, 
      newRating: 4.2,
      message: 'Rating submitted successfully'
    }))
  }),
  
  rest.get('/api/blogs/:id', (req, res, ctx) => {
    const { id } = req.params
    const blog = mockBlogs.find(b => b.id === id)
    
    if (!blog) {
      return res(ctx.status(404), ctx.json({ error: 'Blog not found' }))
    }
    
    return res(ctx.json(blog))
  })
]
```

## 🏃‍♂️ Frontend Testing Best Practices

### 1. Test User Behavior, Not Implementation
```tsx
// ✅ Good - Tests what user sees and does
test('shows error message when form is invalid', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)
  
  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(screen.getByText(/email is required/i)).toBeInTheDocument()
})

// ❌ Bad - Tests internal state
test('sets error state when validation fails', () => {
  const { container } = render(<ContactForm />)
  // Don't test component internals
})
```

### 2. Use Semantic Queries
```tsx
// ✅ Good - Accessible and robust
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email address/i)
screen.getByText(/welcome back/i)

// ❌ Bad - Brittle and not accessible
screen.getByClassName('submit-btn')
screen.getByTestId('email-input')
```

### 3. Wait for Async Operations
```tsx
// ✅ Good - Properly waits for async updates
test('loads and displays blogs', async () => {
  render(<BlogsList />)
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
  
  expect(screen.getByText(/react best practices/i)).toBeInTheDocument()
})
```

### 4. Mock External Dependencies
```tsx
// ✅ Good - Mock API calls with MSW
// Already handled in test setup

// ✅ Good - Mock complex dependencies
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User' },
    isAuthenticated: true
  })
}))
```

### 5. Test Different States
```tsx
describe('BlogCard States', () => {
  test('loading state', () => {
    render(<BlogCard loading={true} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
  
  test('error state', () => {
    render(<BlogCard error="Failed to load" />)
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
  
  test('empty state', () => {
    render(<BlogCard blogs={[]} />)
    expect(screen.getByText(/no blogs found/i)).toBeInTheDocument()
  })
})
```

## 🚨 Common Frontend Testing Pitfalls

1. **Testing Implementation Details**: Focus on user behavior, not internal state
2. **Not Waiting for Async Updates**: Always use `waitFor` or `findBy*` for async operations
3. **Overusing `getByTestId`**: Prefer semantic queries that match how users interact
4. **Not Testing Edge Cases**: Always test loading, empty, and error states
5. **Ignoring Accessibility**: Use `axe-core` and keyboard navigation tests
6. **Brittle Selectors**: Use text content and roles instead of classes or IDs

## 📈 Coverage and Quality

### Measuring Coverage
```bash
# Generate HTML coverage report
npm test -- --coverage --coverageReporters=html
open coverage/index.html

# Check specific component coverage
npm test -- --coverage --coverageDirectory=coverage/components BlogCard.test.tsx

# Fail if coverage below threshold
npm test -- --coverage --coverageThresholds='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

### Quality Metrics
- **Component Tests**: >90% coverage
- **Hook Tests**: >95% coverage  
- **Integration Tests**: Cover all user workflows
- **E2E Tests**: Cover critical user journeys
- **Accessibility**: Zero axe violations