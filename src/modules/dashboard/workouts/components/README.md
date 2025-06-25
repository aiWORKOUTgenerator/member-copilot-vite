# Workout Customization Components

This directory contains a modular, extensible system for workout customization options that follows DRY principles with an accordion-based UI. The architecture supports multiple customization patterns including simple selections, array selections, single ratings, and **category-rating combinations**.

## Architecture Overview

### Directory Structure
```
components/
├── WorkoutCustomization.tsx          # Main accordion component with rich badge display
├── types.ts                          # Shared interfaces including CategoryRatingData
├── customizations/
│   ├── index.ts                      # Configuration and exports
│   ├── WorkoutDurationCustomization.tsx      # Duration picker (simple selection)
│   ├── FocusAreaCustomization.tsx            # Multi-select checkboxes (array pattern)
│   ├── WorkoutFocusCustomization.tsx         # Single-select buttons (simple pattern)
│   ├── AvailableEquipmentCustomization.tsx   # Multi-select checkboxes (array pattern)
│   ├── SleepQualityCustomization.tsx         # Single rating scale (domain-specific)
│   ├── EnergyLevelCustomization.tsx          # Single rating scale (domain-specific)
│   ├── StressLevelCustomization.tsx          # Category-rating pattern (CategoryRatingData)
│   ├── SorenessCustomization.tsx             # Category-rating pattern (CategoryRatingData)
│   ├── IncludeExercisesCustomization.tsx     # Text input (simple pattern)
│   ├── ExcludeExercisesCustomization.tsx     # Text input (simple pattern)
│   └── ComingSoonCustomization.tsx           # Placeholder component
└── README.md                                 # This file
```

### Key Components

1. **WorkoutCustomization.tsx** - Main accordion container with intelligent badge display
2. **types.ts** - Defines shared interfaces including `PerWorkoutOptions`, `CustomizationComponentProps`, and `CategoryRatingData`
3. **customizations/index.ts** - Central configuration file that defines all available customizations

## Component Patterns

This system supports four distinct architectural patterns for different types of customizations:

### 1. Simple Selection Pattern
For single-value selections (strings, numbers):
```typescript
CustomizationComponentProps<string | number | undefined>
```
**Examples**: `WorkoutFocusCustomization`, `WorkoutDurationCustomization`

### 2. Array Selection Pattern  
For multi-value selections:
```typescript
CustomizationComponentProps<string[] | undefined>
```
**Examples**: `FocusAreaCustomization`, `AvailableEquipmentCustomization`

### 3. Domain-Specific Rating Pattern
For single rating scales with domain-appropriate labels:
```typescript
CustomizationComponentProps<number | undefined>
```
**Examples**: `SleepQualityCustomization` (Very Poor → Excellent), `EnergyLevelCustomization` (Very Low → Very High)

### 4. 🆕 Category-Rating Pattern
For selecting categories and rating each one individually:
```typescript
CustomizationComponentProps<CategoryRatingData | undefined>
```
**Examples**: `SorenessCustomization`, `StressLevelCustomization`

## CategoryRatingData Pattern (Advanced)

### Overview
The `CategoryRatingData` pattern is designed for customizations where users:
1. **Select categories** from a predefined list (e.g., body parts, stress types)
2. **Rate each selected category** on a 1-5 scale
3. **Receive contextual feedback** based on category and rating

### Interface Definition
```typescript
export interface CategoryRatingData {
  [categoryKey: string]: {
    selected: boolean;        // Whether this category is active
    rating?: number;          // 1-5 scale rating (optional until rated)
    label: string;            // Human-readable category name
    description?: string;     // Category description for context
  }
}
```

### Data Flow Example
```typescript
// User selects "Lower Back" and rates it 3/5
{
  "lower_back": {
    selected: true,
    rating: 3,
    label: "Lower Back", 
    description: undefined
  }
}

// Parent displays: "Lower Back (Moderate)"
```

### Implementation Requirements
Components using this pattern must:

1. **Import the interface**:
```typescript
import { CustomizationComponentProps, CategoryRatingData } from "../types";
```

2. **Use correct type signature**:
```typescript
export default function YourCategoryRatingCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<CategoryRatingData | undefined>)
```

3. **Handle data conversion**:
```typescript
const categoryData = value || {};
const selectedCategories = Object.keys(categoryData).filter(key => categoryData[key].selected);
```

4. **Implement category toggle**:
```typescript
const handleCategoryToggle = (categoryValue: string) => {
  const category = CATEGORIES.find(c => c.value === categoryValue);
  const isSelected = categoryData[categoryValue]?.selected || false;

  if (isSelected) {
    // Remove category
    const newCategoryData = { ...categoryData };
    delete newCategoryData[categoryValue];
    onChange(Object.keys(newCategoryData).length > 0 ? newCategoryData : undefined);
  } else {
    // Add category
    const newCategoryData = {
      ...categoryData,
      [categoryValue]: {
        selected: true,
        label: category?.label || categoryValue,
        description: category?.description
      }
    };
    onChange(newCategoryData);
  }
};
```

5. **Implement rating updates**:
```typescript
const handleRatingChange = (categoryKey: string, rating: number) => {
  const newCategoryData = {
    ...categoryData,
    [categoryKey]: {
      ...categoryData[categoryKey],
      rating: rating
    }
  };
  onChange(newCategoryData);
};
```

### Standardized Rating Scale
All category-rating components use the unified 5-point scale:

1. **Mild** - Minimal impact, barely noticeable
2. **Low-Moderate** - Noticeable but manageable  
3. **Moderate** - Clear impact affecting some activities
4. **High** - Significant impact limiting performance
5. **Severe** - Intense impact severely restricting function

### UI Pattern Requirements
Category-rating components should follow this structure:

1. **Category Selection Phase**: Grid of pill buttons for category selection
2. **Rating Phase**: 1-5 scale radio buttons for each selected category  
3. **Feedback Phase**: Rich context cards showing rating descriptions
4. **Summary Display**: Badge list showing "Category (Rating Level)"

### Parent Integration
The parent component automatically handles `CategoryRatingData` with rich badge displays:

```typescript
// Parent receives structured data and displays intelligently
case "customization_soreness": 
case "customization_stress": {
  const categoryData = value as CategoryRatingData;
  if (!categoryData) return null;
  const selectedEntries = Object.entries(categoryData).filter(([_, info]) => info.selected);
  if (selectedEntries.length === 0) return null;
  if (selectedEntries.length === 1) {
    const [_, info] = selectedEntries[0];
    return `${info.label}${info.rating ? ` (${getRatingLabel(info.rating)})` : ''}`;
  }
  return `${selectedEntries.length} ${customizationType === 'soreness' ? 'areas' : 'categories'}`;
}
```

## Data Types and Backend Format

### PerWorkoutOptions Interface
```typescript
export interface PerWorkoutOptions {
  // Simple selections
  customization_duration?: number;
  customization_focus?: string;
  customization_include?: string;
  customization_exclude?: string;
  
  // Array selections  
  customization_equipment?: string[];
  customization_areas?: string[];
  
  // Domain-specific ratings
  customization_energy?: number;
  customization_sleep?: number;
  
  // Category-rating patterns
  customization_soreness?: CategoryRatingData;
  customization_stress?: CategoryRatingData;
}
```

### Backend Conversion
When submitted to the backend, values are converted based on type:

```typescript
// Simple values: direct conversion
"customization_duration": "45"
"customization_focus": "strength_training"

// Arrays: comma-separated strings  
"customization_equipment": "dumbbells, bench, pull_up_bar"
"customization_areas": "upper_body, core"

// Ratings: string numbers
"customization_energy": "4"
"customization_sleep": "3" 

// CategoryRatingData: serialized format (TBD based on backend requirements)
"customization_soreness": "{\"lower_back\":{\"selected\":true,\"rating\":3,\"label\":\"Lower Back\"}}"
```

## User Interface Design

### Accordion Pattern
- **Collapsed State**: Shows customization name with current selection in a badge
- **Expanded State**: Reveals the customization controls  
- **Intelligent Badge Display**: Context-aware formatting for different data types
- **Mobile Optimized**: Accordion pattern works excellently on mobile devices

### Badge Display Examples
- **Duration**: "45 min", "1 hour", "1h 30m"
- **Simple Selections**: "Strength Training", "Fat Loss"  
- **Array Selections**: "Upper Body" (single), "3 areas" (multiple)
- **Ratings**: "Good (4/5)", "High (4/5)"
- **Category-Rating**: "Lower Back (Moderate)" (single), "3 areas" (multiple)

### Visual Design Principles
- **Enhanced Visibility**: Bold, larger text with high-contrast colors
- **Color Coding**: Each component type uses different DaisyUI theme colors
- **Interactive Feedback**: Clear visual states for all interactions
- **Accessibility**: Proper ARIA labels, contrast ratios, and keyboard navigation
- **Responsive Design**: Mobile-first with adaptive layouts

## Adding New Customization Options

### For Simple/Array Customizations

Follow the traditional pattern documented in the previous sections of this README.

### 🆕 For Category-Rating Customizations

1. **Define your categories**:
```typescript
const YOUR_CATEGORIES = [
  { 
    label: "Category 1", 
    value: "category_1",
    description: "Description of what this category represents"
  },
  // ... more categories
];
```

2. **Use the CategoryRatingData pattern**:
```typescript
import { CustomizationComponentProps, CategoryRatingData } from "../types";

export default function YourCategoryRatingCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<CategoryRatingData | undefined>) {
  const categoryData = value || {};
  // ... implement following the pattern examples above
}
```

3. **Add to PerWorkoutOptions**:
```typescript
export interface PerWorkoutOptions {
  // ... existing options
  customization_your_new_option?: CategoryRatingData;
}
```

4. **Configure in index.ts**:
```typescript
{
  key: "customization_your_new_option",
  component: YourCategoryRatingCustomization,
  label: "Your New Option",
  icon: YourIcon,
  category: "Current State & Wellness", // or appropriate category
}
```

The parent component will automatically handle the rich badge display for `CategoryRatingData` types.

## Current Customizations

### Workout Goals & Structure
- ✅ **customization_duration** - Duration picker with presets (15 min - 2.5 hours)
- ✅ **customization_areas** - Multi-select focus areas (10 options)
- ✅ **customization_focus** - Single-select workout types (10 options)

### Physical Focus & Equipment  
- ✅ **customization_equipment** - Multi-select equipment (22 options)
- ✅ **customization_include** - Text input for required exercises
- ✅ **customization_exclude** - Text input for exercises to avoid

### Current State & Wellness
- ✅ **customization_sleep** - Domain-specific rating: Very Poor → Poor → Fair → Good → Excellent
- ✅ **customization_energy** - Domain-specific rating: Very Low → Low → Moderate → High → Very High  
- ✅ **customization_stress** - **CategoryRatingData**: Physical, Mental/Emotional, Environmental, Systemic stress categories
- ✅ **customization_soreness** - **CategoryRatingData**: 16 body parts with standardized rating scale

## Rating Scales Reference

### Standardized Category-Rating Scale
Used by `SorenessCustomization` and `StressLevelCustomization`:
1. **Mild** - Minimal impact, barely noticeable
2. **Low-Moderate** - Noticeable but manageable  
3. **Moderate** - Clear impact affecting some activities
4. **High** - Significant impact limiting performance
5. **Severe** - Intense impact severely restricting function

### Domain-Specific Scales

**Sleep Quality** (Pittsburgh Sleep Quality Index):
1. Very Poor → 2. Poor → 3. Fair → 4. Good → 5. Excellent

**Energy Level** (Rate of Perceived Exertion):  
1. Very Low → 2. Low → 3. Moderate → 4. High → 5. Very High

## Architecture Benefits

### Before CategoryRatingData Pattern
❌ **Type Contract Violations**: Components used inconsistent data structures  
❌ **Data Loss**: Rating information lost in parent communication
❌ **Badge Display Issues**: Parent could only show generic counts like "2 areas"
❌ **Maintenance Debt**: Each category-rating component needed custom integration

### After CategoryRatingData Pattern  
✅ **Type Safety**: Unified interface eliminates contract violations
✅ **Rich Data Flow**: Parent receives labels, ratings, AND descriptions
✅ **Intelligent Badges**: Displays "Lower Back (Moderate)" instead of "2 areas" 
✅ **Extensible Design**: New category-rating components follow established pattern
✅ **Consistent UX**: Users learn one predictable rating scale across components

## Development Guidelines

### Component Requirements
Each customization component must:

1. **Implement `CustomizationComponentProps<T>`** with appropriate type
2. **Handle the `value` prop** and call `onChange(newValue)` appropriately
3. **Respect the `disabled` prop** and display the `error` prop
4. **Follow responsive design principles** for mobile compatibility
5. **Use semantic HTML and ARIA labels** for accessibility
6. **Follow established visual patterns** for consistency

### Testing Considerations
- **Type Safety**: Ensure TypeScript compilation passes
- **Data Flow**: Verify parent receives expected data structure
- **Badge Display**: Test both single and multiple selection scenarios
- **Error Handling**: Validate error display and disabled states
- **Accessibility**: Test keyboard navigation and screen reader compatibility

### Performance Notes
- CategoryRatingData components convert data structures for internal use but maintain the unified interface for parent communication
- Badge display logic is optimized for common cases (single selection) with fallbacks for multiple selections
- Component re-renders are minimized through proper state management patterns

This architecture successfully balances **simplicity for common cases** with **powerful extensibility for complex patterns**, providing a solid foundation for current and future workout customization needs. 