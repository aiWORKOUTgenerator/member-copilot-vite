# 🚀 Workout Path Selection Page - Phase 1 Implementation Plan

## Overview

**Phase**: 1 - Foundation & Structure
**Duration**: 1 week
**Goal**: Create the basic structure and core components for the workout path selection page

## 🎯 Phase 1 Objectives

1. **Set up directory structure** for the new feature
2. **Create the basic card component** for path selection
3. **Implement the main selection page** with simple navigation
4. **Test the basic functionality** works end-to-end

## 📁 Directory Structure

```
src/modules/dashboard/workouts/
├── pages/
│   └── WorkoutPathSelectionPage.tsx        # NEW: Main selection page
├── components/
│   └── WorkoutPathSelection/               # NEW: Feature components
│       ├── WorkoutPathCard.tsx
│       ├── WorkoutPathSelectionContainer.tsx
│       └── types.ts
└── hooks/
    └── useWorkoutPathSelection.ts          # NEW: Selection logic
```

## 📋 Implementation Tasks

### Task 1: Create Directory Structure

- [ ] Create `src/modules/dashboard/workouts/pages/` directory
- [ ] Create `src/modules/dashboard/workouts/components/WorkoutPathSelection/` directory
- [ ] Create `src/modules/dashboard/workouts/hooks/` directory

### Task 2: Create Basic Types

**File**: `src/modules/dashboard/workouts/components/WorkoutPathSelection/types.ts`

```typescript
export interface WorkoutPathCardProps {
  title: string;
  description: string;
  features: string[];
  difficulty: 'Beginner' | 'Advanced';
  icon: React.ComponentType<{ className?: string }>;
  colorScheme: 'quick' | 'detailed';
  onClick: () => void;
}

export interface WorkoutPathSelectionProps {
  onPathSelect: (path: 'quick' | 'detailed') => void;
}
```

### Task 3: Create WorkoutPathCard Component

**File**: `src/modules/dashboard/workouts/components/WorkoutPathSelection/WorkoutPathCard.tsx`

```typescript
import React from 'react';
import { WorkoutPathCardProps } from './types';

export function WorkoutPathCard({
  title,
  description,
  features,
  difficulty,
  icon: Icon,
  colorScheme,
  onClick
}: WorkoutPathCardProps) {
  return (
    <div
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="card-body">
        {/* Card content */}
      </div>
    </div>
  );
}
```

### Task 4: Create Selection Container

**File**: `src/modules/dashboard/workouts/components/WorkoutPathSelection/WorkoutPathSelectionContainer.tsx`

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutPathCard } from './WorkoutPathCard';
import { useWorkoutPathSelection } from '../../hooks/useWorkoutPathSelection';

export function WorkoutPathSelectionContainer() {
  const navigate = useNavigate();
  const { selectPath } = useWorkoutPathSelection();

  const handlePathSelect = (path: 'quick' | 'detailed') => {
    selectPath(path);
    navigate(`/dashboard/workouts/generate/${path}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Quick Path Card */}
      {/* Detailed Path Card */}
    </div>
  );
}
```

### Task 5: Create Selection Hook

**File**: `src/modules/dashboard/workouts/hooks/useWorkoutPathSelection.ts`

```typescript
import { useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function useWorkoutPathSelection() {
  const analytics = useAnalytics();

  const selectPath = useCallback(
    (path: 'quick' | 'detailed') => {
      analytics.track('workout_path_selected', { path });
    },
    [analytics]
  );

  return { selectPath };
}
```

### Task 6: Create Main Page

**File**: `src/modules/dashboard/workouts/pages/WorkoutPathSelectionPage.tsx`

```typescript
import React from 'react';
import { WorkoutPathSelectionContainer } from '../components/WorkoutPathSelection/WorkoutPathSelectionContainer';

export default function WorkoutPathSelectionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Workout Path</h1>
        <p className="text-lg text-base-content/70">
          Select how you'd like to create your workout routine
        </p>
      </div>

      <WorkoutPathSelectionContainer />
    </div>
  );
}
```

### Task 7: Update Routing

**File**: `src/modules/dashboard/workouts/WorkoutContainer.tsx` (or main router)

```typescript
// Add new route
{
  path: '/dashboard/workouts/generate',
  element: <WorkoutPathSelectionPage />
}
```

## 🎨 Design Requirements

### Card Design

- **Simple card layout** with hover effects
- **Two color schemes**: Blue/green for Quick, Purple/pink for Detailed
- **Clear visual hierarchy** with title, description, and features
- **Responsive design** that works on mobile and desktop

### Content for Cards

**Quick Workout Setup Card:**

- Title: "Quick Workout Setup"
- Description: "Get a personalized workout in minutes with our streamlined setup process."
- Features: ["Fast and efficient setup", "AI-powered recommendations", "Basic customization options"]
- Difficulty: "Beginner Friendly"

**Detailed Workout Focus Card:**

- Title: "Detailed Workout Focus"
- Description: "Fine-tune every aspect of your workout with comprehensive customization options for the perfect routine."
- Features: ["Complete workout customization", "Equipment and exercise preferences", "Advanced targeting options"]
- Difficulty: "Advanced"

## ✅ Success Criteria

- [ ] Directory structure is created and organized
- [ ] WorkoutPathCard component renders correctly with props
- [ ] Selection container handles navigation to generation pages
- [ ] Analytics tracking works for path selection
- [ ] Page is accessible via `/dashboard/workouts/generate` route
- [ ] Cards display the correct content and styling
- [ ] Responsive design works on mobile and desktop

## 🧪 Testing Requirements

### Manual Testing

- [ ] Navigate to `/dashboard/workouts/generate`
- [ ] Verify both cards display correctly
- [ ] Click Quick path card → should navigate to generation page
- [ ] Click Detailed path card → should navigate to generation page
- [ ] Test on mobile device for responsive design

### Code Quality

- [ ] TypeScript compilation passes
- [ ] No console errors or warnings
- [ ] Components follow project naming conventions
- [ ] Code is properly formatted

## 🚫 What We're NOT Doing in Phase 1

- Complex animations or transitions
- Advanced analytics tracking
- Integration with existing generation forms
- Performance optimization
- Comprehensive testing suite
- Accessibility features (beyond basic)

## 📝 Notes

- Keep it simple - focus on getting the basic functionality working
- Use existing design system components where possible
- Don't over-engineer - we can add complexity in later phases
- Test the navigation flow early to ensure it works end-to-end

This phase establishes the foundation that we can build upon in subsequent phases.
