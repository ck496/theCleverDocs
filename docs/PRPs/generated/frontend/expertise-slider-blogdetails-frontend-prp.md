---
name: "CleverDocs Frontend PRP: Expertise Level Slider for BlogDetails Page"
description: |
  Frontend implementation for expertise level slider component enabling dynamic content switching 
  between beginner, intermediate, and expert versions on BlogDetails page.
  Implements PRD feature "5.2 Custom content for each readers level of expertise".
generated_from: docs/frontend/INITIAL_FRONTEND.md
created: 2025-07-14
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

**Feature Name**: Expertise Level Slider for BlogDetails Page

**User Value**: Enables personalized content consumption by allowing engineers to switch between beginner, intermediate, and expert versions of technical documentation, dramatically improving onboarding efficiency and knowledge comprehension.

**Component Architecture**: 
- **ExpertiseSlider**: Reusable continuous slider component using Radix UI
- **BlogDetails Enhancement**: State management for expertise level switching
- **Content Adaptation**: Dynamic content rendering based on selected expertise level
- **Data Flow**: Single API call with local state management for instant switching

## Why This Feature

- **User Impact**: Reduces cognitive load for beginners while providing depth for experts, enabling faster knowledge acquisition across all skill levels
- **Technical Value**: Leverages existing backend multi-level content structure with optimal frontend performance (single API call, local switching)
- **Mission Alignment**: Core feature enabling adaptive learning paths for engineer onboarding and knowledge sharing acceleration

## What to Build

**UI Components**: 
- ExpertiseSlider component with continuous slider using existing Radix UI base
- Enhanced BlogDetails page with integrated slider and dynamic content rendering
- Type-safe interfaces matching backend content structure

**User Interactions**: 
- Smooth slider movement between three discrete positions (Beginner, Intermediate, Expert)
- Instant content switching without additional API calls
- Default to intermediate level for optimal user experience

**Data Integration**: 
- Use existing `GET /blogs/{id}` endpoint to fetch complete blog with all expertise levels
- Local state management for expertise level selection
- Optimized content rendering with React.useMemo for performance

**Accessibility Features**: 
- Keyboard navigation support for slider
- ARIA labels for screen readers
- High contrast focus indicators
- Semantic HTML structure

### Success Criteria

- [ ] **Component Architecture**: Clean separation with reusable ExpertiseSlider component
- [ ] **Type Safety**: Full TypeScript coverage with corrected Blog interface structure
- [ ] **User Experience**: Instant content switching (<100ms) with clear visual feedback
- [ ] **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation support
- [ ] **Performance**: Single API call per blog, memoized content rendering
- [ ] **Error Handling**: Graceful fallback for missing expertise levels
- [ ] **Testing**: Component, integration, and accessibility tests pass with >90% coverage
- [ ] **CleverDocs Patterns**: Using Chakra UI exclusively, following established patterns

## Critical Issues to Resolve First

### **Phase 1: Fix Type System & Data Flow Mismatch**

**Problem**: Frontend Blog interface doesn't match backend reality
- Frontend expects: `content: string` + optional `versions` object  
- Backend provides: `content: { beginner: string, intermediate: string, expert: string }`

**Solution**: Update Blog interface in `frontend/src/data/blogs.ts`

```typescript
// REMOVE incorrect interfaces
// DELETE: BlogVersion interface
// DELETE: versions property from Blog interface

// UPDATE Blog interface to match backend
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: {
    beginner: string;
    intermediate: string;
    expert: string;
  };
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  coverImage: string;
  avgRating: number;
  totalRatings: number;
  docType: "official" | "community";
  teamInfo?: {
    teamName: string;
    email: string;
  };
}
```

**Immediate Fix for BlogDetails** (`frontend/src/pages/BlogDetails.tsx`):
```typescript
// Temporarily render intermediate content (line 288)
<Box>{renderContent(blog.content.intermediate)}</Box>
```

## Testing Requirements

### **Every Component MUST Have Tests**

1. **Component Tests** (src/__tests__/components/):
   - ExpertiseSlider component with all three positions (0, 50, 100)
   - Content switching functionality in BlogDetails
   - Error handling for missing content levels
   - Mock external dependencies and API calls

2. **Integration Tests** (src/__tests__/integration/):
   - Full user workflow: page load → slider interaction → content change
   - Test with all 6 blogs (IDs 1-6) to verify content differences
   - API integration with fallback to static data

3. **Accessibility Tests**:
   - Zero axe-core violations
   - Keyboard navigation for slider (arrow keys, tab navigation)
   - Screen reader compatibility with proper ARIA labels
   - Color contrast compliance for slider labels

4. **Test Maintenance**:
   - Phase-by-phase testing as outlined in implementation plan
   - Performance testing for content switching speed
   - Cross-browser compatibility testing

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
- file: frontend/src/pages/BlogDetails.tsx
  why: Current implementation using blog.content as string (needs updating)

- file: frontend/src/hooks/useBlogs.ts
  why: Current data fetching patterns and API integration

- file: frontend/src/data/blogs.ts  
  why: Current Blog interface (has type mismatch with backend)

- file: frontend/src/components/ui/slider.tsx
  why: Existing Radix UI slider component to be used as base

- file: shared/data/blogs.json
  why: Actual data structure with expertise-level content
```

### **External Documentation & Patterns**

```yaml
# Official React & TypeScript Documentation
- url: https://react.dev/learn/thinking-in-react
  section: Component design and data flow
  why: React best practices for component architecture

- url: https://www.radix-ui.com/docs/primitives/components/slider
  section: Slider component API and accessibility
  why: Foundation for ExpertiseSlider component

- url: https://chakra-ui.com/docs/components
  section: Component library and theming
  why: Chakra UI components and styling patterns for BlogDetails integration

# CleverDocs-Specific UI Patterns
- url: https://accessibility.18f.gov/checklist/
  section: Accessibility compliance checklist
  why: WCAG 2.1 AA compliance requirements
```

## Implementation Architecture Decision

### **Component Strategy**: Component Hierarchy (Option B)

**Rationale**: Feature involves multiple concerns (slider UI, state management, content rendering) requiring clean separation and testability.

```bash
# Component structure for expertise slider feature
src/components/
├── ExpertiseSlider.tsx          # Reusable slider component
└── ui/
    └── slider.tsx               # Existing Radix UI base (unchanged)

src/pages/
└── BlogDetails.tsx              # Enhanced with slider integration

src/__tests__/
├── components/
│   └── ExpertiseSlider.test.tsx # Component tests
└── integration/
    └── BlogDetailsSlider.test.tsx # Integration tests
```

**Component Size Rule**: ExpertiseSlider ~100 lines, BlogDetails additions ~50 lines - well within 200 line limit.

## CleverDocs-Specific Implementation Patterns

### **ExpertiseSlider Component Pattern**

```tsx
// File: src/components/ExpertiseSlider.tsx
import React from 'react'
import {
  Box,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { Slider } from '@/components/ui/slider'

interface ExpertiseSliderProps {
  value: number; // 0, 50, or 100
  onChange: (value: number) => void;
  className?: string;
}

// Helper functions
const sliderValueToExpertise = (value: number): 'beginner' | 'intermediate' | 'expert' => {
  if (value <= 25) return 'beginner';
  if (value <= 75) return 'intermediate';
  return 'expert';
};

const expertiseToSliderValue = (expertise: 'beginner' | 'intermediate' | 'expert'): number => {
  switch (expertise) {
    case 'beginner': return 0;
    case 'intermediate': return 50;
    case 'expert': return 100;
  }
};

export const ExpertiseSlider: React.FC<ExpertiseSliderProps> = ({ 
  value, 
  onChange, 
  className 
}) => {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const currentLevel = sliderValueToExpertise(value);

  return (
    <Box className={className} px={2}>
      <HStack justify="space-between" mb={2}>
        <Text 
          fontSize="xs" 
          color={currentLevel === 'beginner' ? 'blue.500' : labelColor}
          fontWeight={currentLevel === 'beginner' ? 'bold' : 'normal'}
        >
          Beginner
        </Text>
        <Text 
          fontSize="xs" 
          color={currentLevel === 'intermediate' ? 'blue.500' : labelColor}
          fontWeight={currentLevel === 'intermediate' ? 'bold' : 'normal'}
        >
          Intermediate
        </Text>
        <Text 
          fontSize="xs" 
          color={currentLevel === 'expert' ? 'blue.500' : labelColor}
          fontWeight={currentLevel === 'expert' ? 'bold' : 'normal'}
        >
          Expert
        </Text>
      </HStack>
      
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0}
        max={100}
        step={50}
        aria-label="Content expertise level"
        aria-describedby="expertise-description"
      />
      
      <Text 
        id="expertise-description" 
        fontSize="xs" 
        color={labelColor} 
        textAlign="center" 
        mt={1}
      >
        Current: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
      </Text>
    </Box>
  )
}

export { sliderValueToExpertise, expertiseToSliderValue }
```

### **BlogDetails Integration Pattern**

```tsx
// File: src/pages/BlogDetails.tsx (additions)
import { useState, useMemo } from 'react';
import ExpertiseSlider, { sliderValueToExpertise, expertiseToSliderValue } from '@/components/ExpertiseSlider';

// Add inside BlogDetails component
const [expertiseLevel, setExpertiseLevel] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');

// Helper function with fallback handling
const getCurrentContent = useMemo(() => {
  if (blog && typeof blog.content === 'object') {
    return blog.content[expertiseLevel] || 
           blog.content.intermediate || 
           blog.content.beginner || 
           '';
  }
  return blog?.content || '';
}, [blog, expertiseLevel]);

// Slider change handler
const handleExpertiseChange = (sliderValue: number) => {
  const level = sliderValueToExpertise(sliderValue);
  setExpertiseLevel(level);
};

// UI Integration (after header section, before cover image)
{/* Expertise Level Slider */}
<Box mb={6} px={4}>
  <Text 
    fontSize="sm" 
    fontWeight="medium" 
    color={textColor} 
    mb={3}
    textAlign="center"
  >
    Content Level
  </Text>
  <ExpertiseSlider
    value={expertiseToSliderValue(expertiseLevel)}
    onChange={handleExpertiseChange}
  />
</Box>

{/* Updated Content Rendering */}
<Box>{renderContent(getCurrentContent)}</Box>
```

### **Required Testing Pattern**

```tsx
// File: src/__tests__/components/ExpertiseSlider.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { ExpertiseSlider } from '@/components/ExpertiseSlider'

const renderWithProviders = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>)
}

describe('ExpertiseSlider', () => {
  // Test 1: Expected use case
  test('renders with default intermediate position', () => {
    const mockOnChange = jest.fn()
    renderWithProviders(<ExpertiseSlider value={50} onChange={mockOnChange} />)
    
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
    expect(screen.getByText('Expert')).toBeInTheDocument()
    expect(screen.getByText('Current: Intermediate')).toBeInTheDocument()
  })
  
  // Test 2: Edge case - boundary values
  test('handles boundary values correctly', async () => {
    const user = userEvent.setup()
    const mockOnChange = jest.fn()
    
    renderWithProviders(<ExpertiseSlider value={0} onChange={mockOnChange} />)
    expect(screen.getByText('Current: Beginner')).toBeInTheDocument()
  })
  
  // Test 3: Accessibility
  test('is accessible with keyboard navigation', async () => {
    const user = userEvent.setup()
    const mockOnChange = jest.fn()
    
    renderWithProviders(<ExpertiseSlider value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-label', 'Content expertise level')
    
    // Test keyboard navigation
    slider.focus()
    await user.keyboard('{ArrowRight}')
    expect(mockOnChange).toHaveBeenCalledWith(100)
  })
}
```

## Phase-by-Phase Implementation Plan

### **Phase 1: Fix Type System & Data Flow**
**Duration**: 1-2 hours

**Tasks**:
1. Update `frontend/src/data/blogs.ts` - Remove incorrect interfaces, update Blog interface
2. Fix `frontend/src/pages/BlogDetails.tsx` - Use `blog.content.intermediate` temporarily  
3. Update `frontend/src/hooks/useBlogs.ts` if needed for new content structure
4. Run tests and fix TypeScript errors

**Testing Phase 1**:
- [ ] All blogs load correctly in BlogDetails
- [ ] No TypeScript errors
- [ ] Both API and fallback data paths work
- [ ] Content displays properly (intermediate version)

### **Phase 2: Create ExpertiseSlider Component**  
**Duration**: 2-3 hours

**Tasks**:
1. Create `frontend/src/components/ExpertiseSlider.tsx`
2. Implement slider with Radix UI base and Chakra UI styling
3. Add helper functions for value mapping
4. Create component tests
5. Test accessibility features

**Testing Phase 2**:
- [ ] Slider renders correctly in isolation
- [ ] All three positions work (0, 50, 100)
- [ ] Visual feedback is clear
- [ ] Responsive design works
- [ ] Accessibility features (keyboard navigation, ARIA labels)

### **Phase 3: Integrate Slider with BlogDetails**
**Duration**: 2-3 hours

**Tasks**:
1. Add state management to BlogDetails
2. Integrate ExpertiseSlider component
3. Update content rendering logic
4. Add error handling for missing content levels
5. Create integration tests

**Testing Phase 3**:
- [ ] Slider appears in correct position
- [ ] Content changes when slider moves
- [ ] All three expertise levels display different content
- [ ] No layout issues
- [ ] Error handling works

### **Phase 4: Performance Optimization & Polish**
**Duration**: 1-2 hours

**Tasks**:
1. Add React.useMemo for content optimization
2. Implement smooth UX enhancements
3. Add comprehensive error handling
4. Performance testing
5. Final accessibility review

**Testing Phase 4**:
- [ ] Performance is smooth (<100ms switching)
- [ ] Error handling works for edge cases
- [ ] No memory leaks
- [ ] No console errors

## API Requirements & Backend Integration

### **Backend Endpoint Usage**
- **Endpoint**: `GET /blogs/{id}` (existing, no changes needed)
- **Response Structure**: 
```json
{
  "status": "success",
  "data": {
    "id": "1",
    "title": "Blog Title",
    "content": {
      "beginner": "Beginner content...",
      "intermediate": "Intermediate content...", 
      "expert": "Expert content..."
    }
    // ... other blog properties
  }
}
```

### **No Backend Changes Required**
The existing backend API already provides the correct data structure. Frontend changes only involve:
1. Fixing type interfaces to match backend reality
2. Proper consumption and display of expertise-level content

## Risk Mitigation

1. **Type Safety**: Comprehensive TypeScript interfaces prevent runtime errors
2. **Fallback Content**: Graceful degradation if specific expertise levels are missing
3. **Performance**: Memoization prevents unnecessary re-renders during content switching
4. **Backward Compatibility**: Changes don't break existing blog functionality
5. **Error Boundaries**: Component-level error handling for robust user experience

## Future Enhancements (Out of Scope)

- User preference persistence (localStorage/user account)
- Smooth content transitions with animations
- Analytics tracking for expertise level usage
- A/B testing for slider designs
- Integration with user profiles for automatic expertise detection

---

**Note**: This PRP provides a complete implementation guide with phase-by-phase testing, ensuring the expertise level slider feature enhances CleverDocs' mission of accelerating engineer onboarding through adaptive content delivery.