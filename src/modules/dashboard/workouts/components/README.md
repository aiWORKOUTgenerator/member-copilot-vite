# Workout Customization Components

This directory contains a modular, extensible system for workout customization options that follows DRY principles with an accordion-based UI. The architecture supports multiple customization patterns including simple selections, array selections, single ratings, **category-rating combinations**, and **🆕 enhanced duration configurations with progressive disclosure**.

## Architecture

### Directory Structure
```
components/
├── WorkoutCustomization.tsx          # Main accordion component with rich badge display
├── types.ts                          # Shared interfaces including all data patterns
├── customizations/
│   ├── index.ts                      # Centralized exports
│   ├── FocusAreaCustomization.tsx    # ⭐ Flagship hierarchical selection (3-tier)
│   ├── WorkoutDurationCustomization.tsx  # 🆕 ⭐ Enhanced duration with progressive disclosure
│   ├── SorenessCustomization.tsx     # Category-rating pattern
│   ├── StressLevelCustomization.tsx  # Single rating pattern
│   ├── EnergyLevelCustomization.tsx  # Single rating pattern
│   └── [other customizations...]     # Various patterns
└── README.md                         # This documentation
```

## 🏗️ **Data Architecture Patterns**

The system supports **six sophisticated data patterns** that handle different types of user input:

### **Pattern 1: Simple Selection** (`SimpleSelectionData`)
Single-choice selections with labels and values:
```typescript
{ selected: boolean, label: string, value: string | number, description?: string }
```

### **Pattern 2: Array Selection** (`string[]`)
Multiple-choice selections stored as arrays:
```typescript
["option1", "option2", "option3"]
```

### **Pattern 3: Single Rating** (`number`)
Numeric ratings (1-10 scales):
```typescript
7  // Simple numeric value
```

### **Pattern 4: Category Rating** (`CategoryRatingData`)
Complex rating systems with multiple categories:
```typescript
{
  [categoryKey: string]: {
    selected: boolean;
    rating: number;
    label: string;
    description?: string;
  }
}
```

### **Pattern 5: Hierarchical Selection** (`HierarchicalSelectionData`)
3-tier progressive disclosure for complex selections:
```typescript
{
  [categoryKey: string]: {
    selected: boolean;
    label: string;
    level: 'primary' | 'secondary' | 'tertiary';
    parentKey?: string;
    children?: string[];
    description?: string;
  }
}
```

### **🆕 Pattern 6: Enhanced Duration Configuration** (`DurationConfigurationData`)
Sophisticated session planning with nested structure:
```typescript
{
  selected: boolean;
  totalDuration: number;           // Total workout time
  label: string;                   // Smart label generation
  value: number;                   // Backend compatibility
  description?: string;            // Rich descriptions
  
  // Nested session structure
  warmUp: {
    included: boolean;
    duration: number;
    percentage?: number;
  };
  
  coolDown: {
    included: boolean;
    duration: number;
    percentage?: number;
  };
  
  workingTime: number;             // Auto-calculated active time
  configuration: 'duration-only' | 'with-warmup' | 'with-cooldown' | 'full-structure';
  
  validation?: {
    isValid: boolean;
    warnings?: string[];           // Non-blocking suggestions
    errors?: string[];             // Blocking validation issues
  };
}
```

## 🎯 **Progressive Disclosure Implementation**

### **Flagship Implementation: FocusAreaCustomization**
The original 3-tier hierarchical selection system:
- **Primary Regions** (6 categories): Upper Body, Lower Body, Core, etc.
- **Secondary Muscles** (30+ categories): Chest, Back, Shoulders, etc.
- **Tertiary Areas** (60+ specific targets): Upper Chest, VMO, etc.

### **🆕 Enhanced Implementation: WorkoutDurationCustomization**
The sophisticated duration configuration system with **Phase 3 Intelligence**:

#### **Phase 1: Enhanced Data Structure** ✅
- Rich `DurationConfigurationData` interface
- Smart preset suggestions with categorization
- Backward compatibility with `SimpleSelectionData`

#### **Phase 2: Progressive Disclosure UI** ✅
- **Primary Level**: Duration selection with categorized presets
- **Secondary Level**: Session structure configuration (warm-up/cool-down toggles)
- **Tertiary Level**: Time allocation selection (specific duration options)

#### **🚀 Phase 3: Enhanced Integration & Intelligence** ✅
- **Smart Label Generation**: Context-aware display names
- **Enhanced Validation**: Warnings and errors with helpful suggestions
- **Intelligent Session Analysis**: Real-time efficiency feedback
- **Professional Badge Integration**: Rich parent communication

### **Phase 3 Intelligence Features**

#### **Smart Label Generation**
```typescript
// Examples of generated labels:
"Standard Session"                                    // Duration only
"Standard Session + 5min warm-up"                   // With warm-up
"Full Workout + 8min warm-up + 7min cool-down"     // Full structure
```

#### **Enhanced Validation System**
```typescript
// Warning examples:
"Consider reducing warm-up or cool-down for more working time"
"Long preparation phases for short sessions may reduce exercise time"
"Consider longer warm-up for extended sessions"

// Error examples:
"Warm-up and cool-down times are too long for selected duration"
```

#### **Intelligent Session Analysis**
```typescript
// Efficiency ratings with recommendations:
'excellent' → "Optimal balance for focused training"
'good'      → "Good structure with adequate preparation time"
'moderate'  → "Consider reducing preparation time for more active training"
'poor'      → "Too much preparation time - consider shorter warm-up/cool-down"
```

#### **Professional Badge Display**
```typescript
// Parent integration examples:
"Standard Session"                                    // Simple case
"Standard Session + 5min warm-up (83% active)"      // Complex case with efficiency
"Full Workout + 8min warm-up + 7min cool-down (75% active)"  // Full structure
```

## 🎨 **UI Design Patterns**

### **Accordion-Based Layout**
All customizations use consistent accordion sections with:
- **Header**: Customization name with rich badge display
- **Content**: Progressive disclosure interface
- **State Management**: Controlled expansion/collapse

### **Badge Display Logic**
The parent component (`WorkoutCustomization.tsx`) displays intelligent badges:

```typescript
const getBadgeContent = (key: string, value: any) => {
  switch (key) {
    case "customization_areas": {
      const hierarchicalData = value as HierarchicalSelectionData;
      // Complex hierarchical analysis and display
      return analyzeAndDisplayHierarchicalSelection(hierarchicalData);
    }
    
    case "customization_duration": {
      const durationData = value as DurationConfigurationData;
      
      if (durationData.configuration === 'duration-only') {
        return durationData.label;
      }
      
      const workingPercent = Math.round((durationData.workingTime / durationData.totalDuration) * 100);
      return `${durationData.label} (${workingPercent}% active)`;
    }
    
    case "customization_soreness": {
      const categoryData = value as CategoryRatingData;
      // Category-rating analysis and display
      return analyzeCategoryRatings(categoryData);
    }
    
    // ... other patterns
  }
};
```

### **Responsive Design Standards**
All components follow mobile-first responsive patterns:
- **Primary Level**: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
- **Secondary Level**: Flexible layouts with proper touch targets
- **Tertiary Level**: Single column on mobile, multi-column on desktop

## 🔧 **Development Guidelines**

### **For Adding New Customization Components**

1. **Choose the appropriate data pattern** from the six established types
2. **Implement the corresponding interface** with proper TypeScript contracts
3. **Follow UI consistency** with established visual patterns
4. **Add parent integration** with meaningful badge display logic
5. **Test responsive behavior** across all device sizes

### **For Progressive Disclosure Components**

1. **Define the disclosure structure** (Primary → Secondary → Tertiary)
2. **Implement smart state management** with contextual expansion logic
3. **Add validation and feedback** where appropriate
4. **Include intelligent recommendations** for enhanced user experience
5. **Ensure badge integration** provides meaningful context

### **For Extending Existing Components**

1. **Maintain data structure consistency** when adding new options
2. **Follow established naming conventions** for domain accuracy
3. **Test all interaction patterns** thoroughly
4. **Update parent analysis functions** if needed
5. **Preserve backward compatibility** with existing implementations

## 🚀 **Architecture Benefits**

### **User Experience Excellence**
- **Progressive Disclosure**: Complex options remain approachable
- **Intelligent Feedback**: Real-time validation and recommendations
- **Contextual Badges**: Rich summaries without overwhelming detail
- **Professional Polish**: Consistent visual design across all patterns

### **Developer Experience Quality**
- **Type Safety**: Complete TypeScript coverage across all patterns
- **Extensible Architecture**: Clear patterns for new customization types
- **Maintainable Code**: Clean separation of concerns and predictable data flow
- **Rich Integration**: Structured data communication with parent components

### **System Architecture**
- **Scalable Design**: Supports arbitrary complexity across different domains
- **Performance Optimized**: Efficient rendering regardless of selection complexity
- **Mobile Responsive**: Professional appearance across all device sizes
- **Accessibility Ready**: Proper ARIA hierarchy and keyboard navigation

## 🎯 **Pattern Adoption Success**

This system has successfully demonstrated **architectural consistency** across:

### Accordion Pattern
- **Collapsed State**: Shows option name with current selection in a badge
- **Expanded State**: Reveals the customization controls (dropdown, checkboxes, ratings, etc.)
- **Current Selection Display**: Smart formatting shows human-readable selections
- **Mobile Optimized**: Accordion pattern works excellently on mobile devices

### Selection Display Examples
- **Workout Duration**: "45 min", "1 hour", "1h 30m"
- **Focus Areas**: "Upper Body" (single), "3 areas" (multiple)
- **Workout Focus**: "Strength Training", "Fat Loss", "HIIT"
- **Available Equipment**: "Dumbbells" (single), "5 items" (multiple)
- **Current Soreness**: "Lower Back" (single), "3 areas" (multiple)
- **Sleep Quality**: "Good (4/5)", "Excellent (5/5)"
- **Energy Level**: "High (4/5)", "Moderate (3/5)"
- **Stress Level**: "Low (2/5)", "High (4/5)"
- **Coming Soon**: "Coming Soon" badge for placeholder options

### Rating Components Design
- **Enhanced Visibility**: Bold, larger text with high-contrast colors
- **Color Coding**: Each rating type uses different DaisyUI theme colors
  - Sleep Quality: Primary (blue)
  - Energy Level: Secondary (purple/pink)
  - Stress Level: Accent (orange/yellow)
- **Interactive Feedback**: Clear visual states for selected/unselected ratings
- **Accessibility**: Proper contrast ratios and hover tooltips

## Adding New Customization Options

To add a new customization option, follow these simple steps:

### 1. Update the Types
Add your new option to the `PerWorkoutOptions` interface in `types.ts`:

```typescript
export interface PerWorkoutOptions {
  customization_duration?: number;
  customization_areas?: string[];
  customization_focus?: string;
  customization_equipment?: string[];
  customization_soreness?: string[];
  customization_sleep?: number;
  customization_energy?: number;
  customization_stress?: number;
  // Add your new option here with customization_ prefix
  customization_new_option?: string;
}
```

### 2. Create the Component
Create a new component in `customizations/` that implements `CustomizationComponentProps`:

```typescript
// customizations/NewOptionCustomization.tsx
import { CustomizationComponentProps } from "../types";

export default function NewOptionCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<string | undefined>) {
  const options = [
    { label: "Option 1", value: "option_1" },
    { label: "Option 2", value: "option_2" },
    { label: "Option 3", value: "option_3" },
  ];

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`btn btn-sm ${value === option.value ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onChange(option.value)}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
      {error && <p className="validator-hint">{error}</p>}
    </div>
  );
}
```

### 3. Update the Configuration
Add your new customization to the `CUSTOMIZATION_CONFIG` array in `customizations/index.ts`:

```typescript
import { Settings } from "lucide-react";
import NewOptionCustomization from "./NewOptionCustomization";

export const CUSTOMIZATION_CONFIG: CustomizationConfig[] = [
  // ... existing configurations
  {
    key: "customization_new_option",
    component: NewOptionCustomization,
    label: "New Option",
    icon: Settings,
  },
];
```

### 4. Export the Component
Add the export to `customizations/index.ts`:

```typescript
export { default as NewOptionCustomization } from "./NewOptionCustomization";
```

### 5. Update Selection Display (Optional)
If you want custom formatting for the selection display, update the `formatCurrentSelection` function in `WorkoutCustomization.tsx`:

```typescript
case "customization_new_option": {
  const option = value as string;
  return option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
```

### 6. Update Context Description (Optional)
Add context description in `WorkoutCustomization.tsx`:

```typescript
{config.key === "customization_new_option" && "Describe what this new option does"}
```

That's it! Your new customization option will automatically:
- Appear in the accordion UI
- Be converted to string format for backend submission  
- Follow the `customization_` naming convention
- Include proper validation and state management

## Component Requirements

Each customization component must:

1. **Implement `CustomizationComponentProps<T>`** where `T` is the type of the value
2. **Handle the `value` prop** - current selected value
3. **Call `onChange(newValue)`** when the user makes a selection
4. **Respect the `disabled` prop** when the form is submitting
5. **Display the `error` prop** if validation fails
6. **Be mobile-friendly** with responsive design
7. **Work well in accordion context** - compact and focused
8. **Use proper visual styling** - high contrast, clear typography

## Validation

Validation logic should be handled in the parent `GeneratePage` component. The customization components receive errors as props and display them, but don't perform validation themselves.

## Current Customizations

- ✅ **customization_duration** - Dropdown with presets (15 min - 2.5 hours)
- ✅ **customization_areas** - Multi-select checkboxes (upper body, lower body, core, back, shoulders, chest, arms, mobility/flexibility, cardio, recovery/stretching)
- ✅ **customization_focus** - Single-select buttons (strength training, muscle building, fat loss, cardio endurance, HIIT, flexibility & mobility, recovery & stretching, powerlifting, bodyweight training, functional fitness)
- ✅ **customization_equipment** - Multi-select checkboxes (22 equipment options including bodyweight only, dumbbells, kettlebells, barbell, bench, pull-up bar, resistance bands, TRX, yoga mat, medicine ball, jump rope, stability ball, foam roller, cardio machines, and more)
- ✅ **customization_soreness** - Multi-select checkboxes (16 common body parts using everyday terminology: neck, shoulders, upper back, lower back, chest, arms, wrists, elbows, abs/core, hips, glutes, thighs, hamstrings, knees, calves, ankles)
- ✅ **customization_sleep** - 5-point rating scale based on Pittsburgh Sleep Quality Index (Very Poor to Excellent)
- ✅ **customization_energy** - 5-point rating scale based on RPE assessments (Very Low to Very High)
- ✅ **customization_stress** - 5-point rating scale based on sports psychology assessments (Very Low to Very High)

## Professional Medical/Fitness Standards

### Sleep Quality Scale
Based on the Pittsburgh Sleep Quality Index and clinical sleep assessments:
- **1 - Very Poor**: Severely disrupted sleep, frequent awakenings, feeling exhausted
- **2 - Poor**: Difficulty falling asleep, restless night, waking up tired
- **3 - Fair**: Some sleep interruptions, moderately rested upon waking
- **4 - Good**: Mostly uninterrupted sleep, feeling refreshed in the morning
- **5 - Excellent**: Deep, restorative sleep, waking up fully energized and alert

### Energy Level Scale
Based on Rate of Perceived Exertion (RPE) and clinical energy assessments:
- **1 - Very Low**: Extremely fatigued, struggling to stay awake, need rest
- **2 - Low**: Tired and sluggish, low motivation, minimal energy reserves
- **3 - Moderate**: Average energy, can perform daily activities comfortably
- **4 - High**: Feeling energetic and motivated, ready for challenging activities
- **5 - Very High**: Peak energy, feeling powerful and ready for intense workouts

### Stress Level Scale
Based on sports psychology assessments and POMS (Profile of Mood States):
- **1 - Very Low**: Feeling calm, relaxed, and mentally clear with optimal focus
- **2 - Low**: Minimal stress, composed mindset, ready for performance
- **3 - Moderate**: Some tension but manageable, maintaining competitive readiness
- **4 - High**: Elevated stress affecting focus, feeling overwhelmed or anxious
- **5 - Very High**: Severe stress impacting performance, need stress management techniques

### Available Equipment Options
Comprehensive list of home gym equipment options:
- **Bodyweight**: None/Bodyweight Only
- **Free Weights**: Dumbbells, Adjustable Dumbbells, Kettlebells, Barbell
- **Resistance Training**: Resistance Bands, Resistance Loops/Mini Bands, TRX/Suspension Trainer, Gymnastic Rings
- **Cardio Equipment**: Jump Rope, Exercise/Stationary Bike, Treadmill, Rowing Machine, Battle Ropes
- **Accessories**: Yoga Mat, Medicine Ball, Stability Ball, Foam Roller, Ab Wheel
- **Furniture**: Bench, Pull-up Bar
- **Machines**: Cable Machine

### Current Soreness Body Parts
Common body parts using everyday terminology:
- **Upper Body**: Neck, Shoulders, Upper Back, Lower Back, Chest, Arms
- **Extremities**: Wrists, Elbows
- **Core**: Abs/Core
- **Lower Body**: Hips, Glutes, Thighs, Hamstrings, Knees, Calves, Ankles

## Benefits of This Architecture

1. **DRY Principle** - No code duplication between customizations
2. **Easy to Extend** - Add new options in 5-6 simple steps
3. **Consistent UI** - All options follow the same accordion pattern
4. **Type Safety** - Full TypeScript support with proper typing
5. **Mobile Optimized** - Accordion design is perfect for mobile
6. **Maintainable** - Clear separation of concerns
7. **User-Friendly** - Shows current selections without overwhelming the user
8. **Scalable** - Can easily add many more options without cluttering the UI
9. **Professional Standards** - Uses medically/scientifically validated rating scales
10. **Enhanced Visibility** - Improved contrast and typography for better usability
11. **Complete Coverage** - All 8 customization options fully implemented
12. **Backend Ready** - Automatic string conversion with consistent naming
