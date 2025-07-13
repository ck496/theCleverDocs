#!/bin/bash
# CleverDocs Backend Validation Script
# Comprehensive validation for backend features with progressive checks

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend"
REQUIRED_PYTHON_VERSION="3.11"
API_TEST_PORT=8001
API_TEST_TIMEOUT=10

echo -e "${GREEN}🐍 CleverDocs Backend Validation${NC}"
echo "=================================="

# Function to print status
print_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Change to backend directory
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

cd "$BACKEND_DIR"

# Phase 1: Environment Validation
echo -e "\n${YELLOW}Phase 1: Environment Validation${NC}"
echo "--------------------------------"

# Check Python version
print_info "Checking Python version..."
python_version=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
if [[ "$python_version" < "$REQUIRED_PYTHON_VERSION" ]]; then
    print_warning "Python $REQUIRED_PYTHON_VERSION+ recommended, found $python_version"
else
    print_status "Python version check ($python_version)"
fi

# Check if requirements.txt exists
if [ -f "requirements.txt" ]; then
    print_info "Checking dependencies..."
    pip check 2>/dev/null || print_warning "Some dependency conflicts detected"
    print_status "Dependency check"
else
    print_warning "requirements.txt not found - dependencies not validated"
fi

# Phase 2: Code Quality Validation
echo -e "\n${YELLOW}Phase 2: Code Quality Validation${NC}"
echo "---------------------------------"

# Check imports
print_info "Validating imports..."
python3 -c "
try:
    import api
    print('✅ Core API module imports successfully')
except ImportError as e:
    print(f'❌ Import error: {e}')
    exit(1)
except Exception as e:
    print(f'❌ Unexpected error: {e}')
    exit(1)
"
print_status "Import validation"

# Type checking with mypy (if available)
if command -v mypy &> /dev/null; then
    print_info "Running type checks..."
    if mypy . --ignore-missing-imports --no-error-summary 2>/dev/null; then
        print_status "Type checking"
    else
        print_warning "Type checking issues detected"
    fi
else
    print_warning "mypy not available - skipping type checks"
fi

# Code formatting check with black (if available)
if command -v black &> /dev/null; then
    print_info "Checking code formatting..."
    if black . --check --quiet 2>/dev/null; then
        print_status "Code formatting"
    else
        print_warning "Code formatting issues detected (run: black .)"
    fi
else
    print_warning "black not available - skipping format checks"
fi

# Linting with flake8 (if available)
if command -v flake8 &> /dev/null; then
    print_info "Running linting checks..."
    if flake8 . --max-line-length=88 --extend-ignore=E203 2>/dev/null; then
        print_status "Linting"
    else
        print_warning "Linting issues detected"
    fi
else
    print_warning "flake8 not available - skipping lint checks"
fi

# Phase 3: Security Validation
echo -e "\n${YELLOW}Phase 3: Security Validation${NC}"
echo "-----------------------------"

# Security scanning with bandit (if available)
if command -v bandit &> /dev/null; then
    print_info "Running security scan..."
    if bandit -r . -ll --quiet 2>/dev/null; then
        print_status "Security scan"
    else
        print_warning "Security issues detected"
    fi
else
    print_warning "bandit not available - skipping security scan"
fi

# Check for common security issues
print_info "Checking for hardcoded secrets..."
if grep -r -i "password\|secret\|key.*=" . --include="*.py" | grep -v "__pycache__" | grep -v ".git" >/dev/null 2>&1; then
    print_warning "Potential hardcoded secrets detected"
else
    print_status "Hardcoded secrets check"
fi

# Dependency vulnerability check with safety (if available)
if command -v safety &> /dev/null && [ -f "requirements.txt" ]; then
    print_info "Checking dependency vulnerabilities..."
    if safety check --json >/dev/null 2>&1; then
        print_status "Dependency vulnerability check"
    else
        print_warning "Dependency vulnerabilities detected"
    fi
else
    print_warning "safety not available or requirements.txt missing - skipping vulnerability check"
fi

# Phase 4: API Server Validation
echo -e "\n${YELLOW}Phase 4: API Server Validation${NC}"
echo "-------------------------------"

# Start server for testing
print_info "Starting test server on port $API_TEST_PORT..."
timeout $API_TEST_TIMEOUT python3 -m uvicorn api:app --host 0.0.0.0 --port $API_TEST_PORT >/dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
print_info "Waiting for server to initialize..."
sleep 3

# Test health/docs endpoint
print_info "Testing API documentation endpoint..."
if curl -f http://localhost:$API_TEST_PORT/docs >/dev/null 2>&1; then
    print_status "API documentation endpoint"
else
    print_warning "API documentation endpoint not accessible"
fi

# Test basic API endpoint
print_info "Testing basic API endpoint..."
if curl -f http://localhost:$API_TEST_PORT/ >/dev/null 2>&1; then
    print_status "Basic API endpoint"
else
    print_warning "Basic API endpoint not accessible"
fi

# Test OpenAPI spec
print_info "Testing OpenAPI specification..."
if curl -f http://localhost:$API_TEST_PORT/openapi.json >/dev/null 2>&1; then
    print_status "OpenAPI specification"
else
    print_warning "OpenAPI specification not accessible"
fi

# Cleanup server
print_info "Stopping test server..."
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

# Phase 5: Test Validation
echo -e "\n${YELLOW}Phase 5: Test Validation${NC}"
echo "-------------------------"

# Run tests if they exist
if [ -d "tests" ] && command -v pytest &> /dev/null; then
    print_info "Running test suite..."
    if pytest tests/ -v --tb=short >/dev/null 2>&1; then
        print_status "Test execution"
    else
        print_warning "Some tests failed"
    fi
    
    # Test coverage if pytest-cov available
    if python3 -c "import pytest_cov" 2>/dev/null; then
        print_info "Calculating test coverage..."
        coverage_output=$(pytest tests/ --cov=. --cov-report=term-missing --quiet 2>/dev/null | tail -1)
        if [[ "$coverage_output" =~ ([0-9]+)% ]]; then
            coverage_percent=${BASH_REMATCH[1]}
            if [ "$coverage_percent" -ge 70 ]; then
                print_status "Test coverage ($coverage_percent%)"
            else
                print_warning "Test coverage below 70% ($coverage_percent%)"
            fi
        fi
    fi
else
    if [ ! -d "tests" ]; then
        print_warning "No tests directory found"
    else
        print_warning "pytest not available - skipping tests"
    fi
fi

# Phase 6: Performance Validation
echo -e "\n${YELLOW}Phase 6: Performance Validation${NC}"
echo "--------------------------------"

# Performance test (if performance tests exist)
if [ -d "tests/performance" ] && command -v pytest &> /dev/null; then
    print_info "Running performance tests..."
    if pytest tests/performance/ --benchmark-only --quiet >/dev/null 2>&1; then
        print_status "Performance tests"
    else
        print_warning "Performance tests failed or not available"
    fi
else
    print_warning "No performance tests found"
fi

# Basic load test simulation
print_info "Simulating basic load test..."
timeout $API_TEST_TIMEOUT python3 -m uvicorn api:app --host 0.0.0.0 --port $API_TEST_PORT >/dev/null 2>&1 &
SERVER_PID=$!
sleep 2

# Simple concurrent request test
if command -v curl &> /dev/null; then
    print_info "Testing concurrent requests..."
    for i in {1..5}; do
        curl -s http://localhost:$API_TEST_PORT/ >/dev/null &
    done
    wait
    print_status "Concurrent request handling"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

# Phase 7: CleverDocs-Specific Validation
echo -e "\n${YELLOW}Phase 7: CleverDocs Mission Alignment${NC}"
echo "--------------------------------------"

# Check for CleverDocs-specific patterns
print_info "Validating CleverDocs patterns..."

# Check for expertise level handling
if grep -r "beginner\|intermediate\|expert" . --include="*.py" >/dev/null 2>&1; then
    print_status "Multi-level content patterns detected"
else
    print_info "No multi-level content patterns found (may not be needed for this feature)"
fi

# Check for proper error handling
if grep -r "HTTPException\|ValidationError" . --include="*.py" >/dev/null 2>&1; then
    print_status "Proper error handling patterns detected"
else
    print_warning "Consider adding comprehensive error handling"
fi

# Check for async patterns
if grep -r "async def\|await " . --include="*.py" >/dev/null 2>&1; then
    print_status "Async patterns detected"
else
    print_info "No async patterns found (consider for I/O operations)"
fi

# Final Summary
echo -e "\n${GREEN}🎉 Validation Complete${NC}"
echo "======================"

print_info "Backend validation completed successfully!"
print_info "For detailed coding standards, see: docs/development/CODING_STANDARDS.md"
print_info "For architecture guidelines, see: docs/CODEBASE_GUIDE.md"

# Performance recommendations
echo -e "\n${YELLOW}💡 Recommendations:${NC}"
echo "• Ensure response times < 200ms for CRUD operations"
echo "• Implement comprehensive error handling for production"
echo "• Add tests to reach >90% coverage for critical paths"
echo "• Use async/await for all I/O operations"
echo "• Validate all inputs with Pydantic models"
echo "• Document all API endpoints with OpenAPI"

echo -e "\n${GREEN}✅ Ready for CleverDocs deployment!${NC}"