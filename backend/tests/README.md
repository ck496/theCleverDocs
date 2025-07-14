# CleverDocs Backend Tests

This directory contains all tests for the CleverDocs backend, organized by test type.

## Test Structure

```
tests/
├── unit/               # Unit tests with mocked dependencies
│   ├── services/       # Business logic tests
│   └── models/         # Pydantic model validation tests
├── integration/        # Integration tests with real services
│   └── api/           # Full API endpoint tests
└── performance/       # Performance benchmarks
```

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=term-missing

# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/integration/

# Run performance benchmarks
pytest tests/performance/ --benchmark-only

# Run tests for a specific feature
pytest -k "blog"

# Run with verbose output
pytest -v
```

## Writing Tests

Every new feature must have at least 3 tests:

1. **Expected use case** - Test the happy path
2. **Edge case** - Test boundary conditions
3. **Failure case** - Test error handling

See `tests/unit/services/test_example_service.py` for a complete example.

## Test Requirements

- Minimum 90% code coverage for new features
- All tests must pass before merging
- Update existing tests when modifying code
- Use mocks for external dependencies in unit tests
- Use real test instances for integration tests

## Performance Targets

- Simple operations: < 200ms
- Complex AI operations: < 2s
- Health checks: < 50ms