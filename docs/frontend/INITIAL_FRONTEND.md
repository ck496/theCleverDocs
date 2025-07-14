# Frontend PRP: Expertise Level Slider for BlogDetails Page

## Feature Overview

Implement a minimalist, aesthetically pleasing expertise level slider for the BlogDetails page that allows users to switch between beginner, intermediate, and expert versions of blog content. This enables key feature "5.2 Custom content for each readers level of expertise" from the PRD.

## Current State Analysis

### Issues Identified
1. **Type Structure Mismatch**: Frontend types don't match actual data structure
   - Frontend expects: `content: string` + optional `versions` object
   - Actual data has: `content: { beginner: string, intermediate: string, expert: string }`

2. **Data Flow Problems**: 
   - `useBlogs` hook expects flat content structure
   - `BlogDetails` component renders `blog.content` as string
   - Shared data structure not properly typed in frontend

### Current Architecture
- **BlogDetails**: Uses `useBlogs().getBlogById(id)` to fetch blog data
- **useBlogs**: Fetches from `/blogs` endpoint with fallback to static data
- **Data Types**: Located in `frontend/src/data/blogs.ts`
- **API Client**: Configured in `frontend/src/api/client.ts`

## Implementation Plan

### Phase 1: Fix Type System & Data Flow 
**Goal**: Align frontend types with backend reality

#### 1.1 Update Blog Interface
**File**: `frontend/src/data/blogs.ts`

**Changes**:
```typescript
// Remove incorrect interfaces
// DELETE: BlogVersion interface
// DELETE: versions property from Blog interface

// Update Blog interface
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

#### 1.2 Update BlogDetails Component
**File**: `frontend/src/pages/BlogDetails.tsx`

**Changes**:
- Temporarily update `renderContent()` to use `blog.content.intermediate` 
- This maintains current functionality while we implement the slider

**Code**:
```typescript
// Update line 288 in BlogDetails.tsx
<Box>{renderContent(blog.content.intermediate)}</Box>
```

#### 1.3 Update useBlogs Hook (if needed)
**File**: `frontend/src/hooks/useBlogs.ts`

**Changes**: Ensure the hook properly handles the new content structure from API responses

**Testing Phase 1**:
- [ ] Verify all blogs load correctly in BlogDetails
- [ ] Confirm no TypeScript errors
- [ ] Test both API and fallback data paths
- [ ] Verify content displays properly (intermediate version)

---

### Phase 2: Create ExpertiseSlider Component
**Goal**: Build reusable expertise level slider component

#### 2.1 Create ExpertiseSlider Component
**File**: `frontend/src/components/ExpertiseSlider.tsx`

**Requirements**:
- Use existing Radix UI Slider from `frontend/src/components/ui/slider.tsx`
- Continuous slider with 3 discrete positions (0, 50, 100)
- Visual labels: Beginner, Intermediate, Expert
- Default position: 50 (Intermediate)
- Minimalist design matching current theme
- Callback function for value changes

**Props Interface**:
```typescript
interface ExpertiseSliderProps {
  value: number; // 0, 50, or 100
  onChange: (value: number) => void;
  className?: string;
}
```

**Design Requirements**:
- Match BlogDetails page styling and color scheme
- Responsive design for mobile/desktop
- Smooth transitions and visual feedback
- Clear labels and current selection indicator

#### 2.2 Slider Value Mapping
```typescript
// Helper functions for the component
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
```

**Testing Phase 2**:
- [ ] Slider renders correctly in isolation
- [ ] All three positions work properly
- [ ] Visual feedback is clear and intuitive
- [ ] Responsive design works on different screen sizes
- [ ] Accessibility features work (keyboard navigation, ARIA labels)

---

### Phase 3: Integrate Slider with BlogDetails
**Goal**: Add expertise level switching functionality to BlogDetails page

#### 3.1 Add State Management
**File**: `frontend/src/pages/BlogDetails.tsx`

**Changes**:
```typescript
import { useState } from 'react';
import ExpertiseSlider from '@/components/ExpertiseSlider';

// Add inside BlogDetails component
const [expertiseLevel, setExpertiseLevel] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');

// Helper function to convert slider value to expertise level
const handleExpertiseChange = (sliderValue: number) => {
  const level = sliderValueToExpertise(sliderValue);
  setExpertiseLevel(level);
};

// Update content rendering
const getCurrentContent = () => {
  if (blog && typeof blog.content === 'object') {
    return blog.content[expertiseLevel];
  }
  return blog?.content || '';
};
```

#### 3.2 Add Slider to UI
**Position**: Top of blog content, after header section and before cover image

**Layout**:
```tsx
{/* Add after line 271 (after header section) */}
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

{/* Cover Image - existing code */}
<Image src={blog.coverImage} ... />

<Divider />

{/* Updated Content */}
<Box>{renderContent(getCurrentContent())}</Box>
```

**Testing Phase 3**:
- [ ] Slider appears in correct position on BlogDetails page
- [ ] Content changes when slider is moved
- [ ] All three expertise levels display different content
- [ ] No layout issues or visual glitches
- [ ] Slider state persists during component lifecycle
- [ ] Error handling for missing content levels

---

### Phase 4: Performance Optimization & Polish
**Goal**: Optimize performance and add final touches

#### 4.1 Performance Optimizations
```typescript
// Memoize content to prevent unnecessary re-renders
const currentContent = useMemo(() => {
  if (blog && typeof blog.content === 'object') {
    return blog.content[expertiseLevel];
  }
  return blog?.content || '';
}, [blog, expertiseLevel]);

// Memoize rendered content
const renderedContent = useMemo(() => {
  return renderContent(currentContent);
}, [currentContent]);
```

#### 4.2 Enhanced User Experience
- Smooth content transitions (optional CSS transitions)
- Loading states if content switching has any delay
- Visual indicator showing current expertise level

#### 4.3 Error Handling
```typescript
// Fallback for missing content levels
const getCurrentContent = () => {
  if (blog && typeof blog.content === 'object') {
    return blog.content[expertiseLevel] || blog.content.intermediate || blog.content.beginner || '';
  }
  return blog?.content || '';
};
```

**Testing Phase 4**:
- [ ] Performance is smooth with no lag during content switching
- [ ] Error handling works for edge cases
- [ ] Memory usage is reasonable
- [ ] No console errors or warnings

---

## Final Integration Testing

### Comprehensive Test Suite
1. **Functionality Tests**:
   - [ ] Load BlogDetails page for each blog (IDs 1-6)
   - [ ] Switch between all three expertise levels for each blog
   - [ ] Verify content changes are accurate and complete
   - [ ] Test with both API data and fallback static data

2. **UI/UX Tests**:
   - [ ] Slider is visually appealing and matches design system
   - [ ] Responsive design works on mobile, tablet, desktop
   - [ ] Color mode (light/dark) compatibility
   - [ ] Loading states work properly
   - [ ] Error states display correctly

3. **Performance Tests**:
   - [ ] Initial page load time is acceptable
   - [ ] Content switching is instant (<100ms)
   - [ ] No memory leaks during repeated switching
   - [ ] Bundle size impact is minimal

4. **Cross-Browser Tests**:
   - [ ] Chrome, Firefox, Safari compatibility
   - [ ] Mobile browser compatibility

5. **Accessibility Tests**:
   - [ ] Keyboard navigation works
   - [ ] Screen reader compatibility
   - [ ] ARIA labels are proper
   - [ ] Color contrast meets standards

## API Requirements

### Backend Endpoint Usage
- **Endpoint**: `GET /blogs/{id}` (existing)
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
    },
    // ... other blog properties
  }
}
```

### No Backend Changes Required
The existing backend API already provides the correct data structure. The frontend just needs to properly consume and display it.

## File Structure

### New Files
```
frontend/src/components/
   ExpertiseSlider.tsx          # New slider component
   ui/
       slider.tsx               # Existing (will be used as base)

docs/frontend/
   INITIAL_FRONTEND.md          # This file
```

### Modified Files
```
frontend/src/
   data/blogs.ts                # Updated Blog interface
   pages/BlogDetails.tsx        # Added slider integration
   hooks/useBlogs.ts            # Updated if needed for new content structure
```

## Success Criteria

1. **Functional Requirements**:
   - Users can switch between beginner, intermediate, and expert content
   - Content changes are instant and accurate
   - Default to intermediate level
   - Slider is intuitive and responsive

2. **Technical Requirements**:
   - Single API call per blog (optimal performance)
   - Type safety throughout the application
   - No breaking changes to existing functionality
   - Clean, maintainable code

3. **Design Requirements**:
   - Matches existing design system
   - Minimalist and aesthetically pleasing
   - Works across all device sizes
   - Accessible to all users

## Risk Mitigation

1. **Type Safety**: Comprehensive TypeScript interfaces prevent runtime errors
2. **Fallback Content**: Graceful degradation if specific expertise levels are missing
3. **Performance**: Memoization prevents unnecessary re-renders
4. **Backward Compatibility**: Changes don't break existing blog functionality

## Future Enhancements (Out of Scope)

- User preference persistence (localStorage/user account)
- Smooth content transitions with animations
- Analytics tracking for expertise level usage
- A/B testing for slider designs
- Integration with user profiles for automatic expertise detection