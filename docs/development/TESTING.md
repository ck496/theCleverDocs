# CleverDocs Testing Guidelines

> **Purpose**: Comprehensive testing strategy to ensure code quality and reliability across all CleverDocs features.

## 🎯 Testing Philosophy

Every feature in CleverDocs must have tests. Testing is not optional - it's a core requirement for maintaining code quality and ensuring our mission of accelerating engineer onboarding.

### Core Testing Principles

1. **Test-Driven Development (TDD)**: Write tests before or alongside implementation
2. **3-Test Minimum**: Every feature must have at least 3 tests
3. **90% Coverage Target**: New code must achieve >90% test coverage
4. **Continuous Testing**: Tests run on every commit and PR

## 🧪 Test Requirements

### The 3-Test Pattern

For every new function, class, or API endpoint, write:

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

### Example Implementation

```python
class TestBlogService:
    # Test 1: Expected use case
    async def test_create_blog_with_valid_data_succeeds(self):
        result = await service.create_blog(valid_data)
        assert result.status == "success"
    
    # Test 2: Edge case
    async def test_create_blog_with_empty_tags_uses_defaults(self):
        data = {**valid_data, "tags": []}
        result = await service.create_blog(data)
        assert result.tags == ["uncategorized"]
    
    # Test 3: Failure case
    async def test_create_blog_with_empty_title_raises_error(self):
        invalid_data = {**valid_data, "title": ""}
        with pytest.raises(ValidationError):
            await service.create_blog(invalid_data)
```

## 📁 Test Organization

### Backend Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py              # Shared fixtures and configuration
├── unit/                    # Unit tests (mocked dependencies)
│   ├── services/           # Business logic tests
│   │   └── test_*.py
│   └── models/             # Pydantic model tests
│       └── test_*.py
├── integration/            # Integration tests (real dependencies)
│   └── api/               # API endpoint tests
│       └── test_*.py
└── performance/           # Performance benchmarks
    └── test_*.py
```

### Frontend Test Structure

```
frontend/src/
├── __tests__/             # Test files mirror source structure
│   ├── components/
│   │   └── *.test.tsx
│   ├── hooks/
│   │   └── *.test.ts
│   └── pages/
│       └── *.test.tsx
└── test-utils/           # Testing utilities and mocks
```

## 🚀 Running Tests

### Backend Tests

```bash
# Run all tests
cd backend
pytest

# Run with coverage
pytest --cov=app --cov-report=term-missing

# Run specific test type
pytest tests/unit/
pytest tests/integration/
pytest tests/performance/ --benchmark-only

# Run tests for specific feature
pytest -k "blog"

# Run with verbose output
pytest -v

# Run and fail if coverage < 90%
pytest --cov=app --cov-fail-under=90
```

### Frontend Tests

```bash
# Run all tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- BlogPost.test.tsx
```

## 📊 Coverage Requirements

### Targets

- **Overall Coverage**: >70% minimum
- **New Feature Coverage**: >90% required
- **Critical Path Coverage**: >95% (auth, data processing, AI services)

### Measuring Coverage

```bash
# Backend coverage report
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser

# Frontend coverage report
npm test -- --coverage --coverageReporters=html
# Open coverage/lcov-report/index.html in browser
```

## 🔧 Testing Tools

### Backend Testing Stack

- **pytest**: Test framework
- **pytest-asyncio**: Async test support
- **pytest-cov**: Coverage reporting
- **pytest-mock**: Mocking utilities
- **pytest-benchmark**: Performance testing
- **locust**: Load testing

### Frontend Testing Stack

- **Vitest/Jest**: Test framework
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright/Cypress**: E2E testing

## 💡 Best Practices

### Writing Good Tests

1. **Descriptive Names**: Test names should explain what they test
   ```python
   # Good
   def test_create_blog_with_empty_title_raises_validation_error()
   
   # Bad
   def test_create_blog_2()
   ```

2. **Arrange-Act-Assert**: Structure tests clearly
   ```python
   def test_example():
       # Arrange: Set up test data
       data = create_test_data()
       
       # Act: Perform the action
       result = service.process(data)
       
       # Assert: Verify the outcome
       assert result.status == "success"
   ```

3. **Independent Tests**: Each test should run independently
4. **Mock External Dependencies**: Unit tests should not call real services
5. **Test One Thing**: Each test should verify a single behavior

### Common Testing Patterns

#### Testing Async Code

```python
@pytest.mark.asyncio
async def test_async_operation():
    result = await async_service.process()
    assert result.success
```

#### Testing API Endpoints

```python
def test_api_endpoint(client):
    response = client.get("/api/blogs")
    assert response.status_code == 200
    assert len(response.json()) > 0
```

#### Testing Error Handling

```python
def test_error_handling():
    with pytest.raises(ValueError) as exc_info:
        service.process(invalid_data)
    assert "specific error message" in str(exc_info.value)
```

## 🔄 Test Maintenance

### When to Update Tests

1. **Bug Fixes**: Write a test that reproduces the bug first
2. **Feature Changes**: Update affected tests before implementation
3. **Refactoring**: Ensure tests still pass after changes
4. **API Changes**: Update integration tests for new contracts

### Test Review Checklist

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

## 📈 Monitoring Test Quality

### Metrics to Track

1. **Code Coverage**: Aim for >90%
2. **Test Execution Time**: Keep under 1 minute for CI
3. **Test Flakiness**: Track and fix flaky tests immediately
4. **Test/Code Ratio**: Aim for 1:1 or higher

### Continuous Improvement

- Regular test review sessions
- Refactor tests alongside code
- Update test documentation
- Share testing best practices

## 🎯 Testing and CleverDocs Mission

Remember: Our mission is to accelerate engineer onboarding. Comprehensive tests:
- Serve as living documentation
- Provide examples of how to use code
- Ensure reliability for new engineers
- Build confidence in the codebase

Every test you write helps a future engineer understand and trust the code better.