# CleverDocs Testing Guidelines

> **Purpose**: Overview of CleverDocs testing strategy and links to specific implementation guides.

## 🎯 Testing Philosophy

Every feature in CleverDocs must have tests. Testing is not optional - it's a core requirement for maintaining code quality and ensuring our mission of accelerating engineer onboarding.

### Core Testing Principles

1. **Test-Driven Development (TDD)**: Write tests before or alongside implementation
2. **3-Test Minimum**: Every feature must have at least 3 tests
3. **90% Coverage Target**: New code must achieve >90% test coverage
4. **Continuous Testing**: Tests run on every commit and PR

## 🧪 The 3-Test Pattern

For every new function, class, or feature, write:

1. **Expected Use Case Test** (Happy Path)
   - Test normal, expected behavior
   - Verify correct outputs for valid inputs
   - Ensure successful completion

2. **Edge Case Test** (Boundary Conditions)
   - Test with empty inputs
   - Test with maximum/minimum values
   - Test with unusual but valid data

3. **Failure Case Test** (Error Handling)
   - Test with invalid inputs
   - Test error messages and status codes
   - Verify graceful failure handling

## 📊 Coverage Requirements

- **Overall Coverage**: >70% minimum
- **New Feature Coverage**: >90% required
- **Critical Path Coverage**: >95% (auth, data processing, AI services)

## 📁 Testing Documentation Structure

### 🐍 Backend Testing
**File**: [`TESTING_BACKEND.md`](./TESTING_BACKEND.md)

**Covers**:
- pytest patterns and configuration
- FastAPI testing strategies
- Backend test organization
- Unit, integration, and performance tests
- Backend-specific examples and best practices

### ⚛️ Frontend Testing
**File**: [`TESTING_FRONTEND.md`](./TESTING_FRONTEND.md)

**Covers**:
- React Testing Library patterns
- Vitest configuration and setup
- Component and hook testing
- Integration testing with MSW
- Frontend-specific examples and best practices

## 🚀 Quick Start

### Backend
```bash
cd backend
pytest --cov=app --cov-report=term-missing
```

### Frontend
```bash
cd frontend
npm test -- --coverage
```

## 📋 Test Review Checklist

- [ ] All new features have tests
- [ ] Tests follow the 3-test pattern
- [ ] Coverage meets requirements (>90% for new code)
- [ ] Tests are readable and well-named
- [ ] No hardcoded test data that might break
- [ ] Mocks are properly cleaned up
- [ ] Tests run quickly (<10s for unit tests)

## 🚨 Common Pitfalls

1. **Testing Implementation, Not Behavior**: Focus on what, not how
2. **Overmocking**: Don't mock everything, just external dependencies
3. **Brittle Tests**: Avoid testing exact string matches or ordering
4. **Slow Tests**: Keep unit tests fast, save slow tests for integration
5. **Skipping Tests**: Never skip tests without a good reason

## 🎯 Testing and CleverDocs Mission

Remember: Our mission is to accelerate engineer onboarding. Comprehensive tests:
- Serve as living documentation
- Provide examples of how to use code
- Ensure reliability for new engineers
- Build confidence in the codebase

Every test you write helps a future engineer understand and trust the code better.

---

**For detailed implementation guides, see**:
- [Backend Testing Guide](./TESTING_BACKEND.md)
- [Frontend Testing Guide](./TESTING_FRONTEND.md)