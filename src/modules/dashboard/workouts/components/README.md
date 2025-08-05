# Workout Customization Components

This directory contains a modular, extensible system for workout customization options that follows DRY principles with an accordion-based UI. All customizations use the `customization_` prefix and are converted to string format for backend submission.

## Architecture

### Directory Structure

```
components/
├── WorkoutCustomization.tsx          # Main accordion component
├── types.ts                          # Shared interfaces and types
├── customizations/
│   ├── index.ts                      # Configuration and exports
│   ├── WorkoutDurationCustomization.tsx  # Duration picker component
│   ├── FocusAreaCustomization.tsx    # Focus areas checkbox component
│   ├── WorkoutFocusCustomization.tsx # Workout focus button component
│   ├── AvailableEquipmentCustomization.tsx # Equipment checkbox component
│   ├── SleepQualityCustomization.tsx # Sleep quality rating component
│   ├── EnergyLevelCustomization.tsx  # Energy level rating component
│   ├── StressLevelCustomization.tsx  # Stress level rating component
│   ├── SorenessCustomization.tsx     # Current soreness checkbox component
│   └── ComingSoonCustomization.tsx   # Placeholder for future options
└── README.md                         # This file
```

### Key Components

1. **WorkoutCustomization.tsx** - Main accordion container that dynamically renders all customization options
2. **types.ts** - Defines shared interfaces including `PerWorkoutOptions` and `CustomizationComponentProps`
3. **customizations/index.ts** - Central configuration file that defines all available customizations

## Customization IDs and Backend Format

All customization options use the `customization_` prefix for consistent identification:

### Customization Keys

- `customization_duration` - Workout duration in minutes
- `customization_areas` - Focus areas for workout targeting
- `customization_focus` - Main workout goal/type
- `customization_equipment` - Available equipment
- `customization_sleep` - Sleep quality rating (1-5)
- `customization_energy` - Energy level rating (1-5)
- `customization_stress` - Stress level rating (1-5)
- `customization_soreness` - Current sore body parts

### Backend String Format

When submitted to the backend, all values are converted to strings:

```typescript
// Example backend payload
{
  "customization_duration": "45",
  "customization_areas": "Upper Body, Core",
  "customization_focus": "Strength Training",
  "customization_equipment": "Dumbbells, Bench, Pull-up Bar",
  "customization_sleep": "4",
  "customization_energy": "3",
  "customization_stress": "2",
  "customization_soreness": "Lower Back, Shoulders"
}
```

### Array to String Conversion

- **Single values**: Converted directly to strings
- **Arrays**: Joined with `", "` (comma + space)
- **Numbers**: Converted to string representation
- **Empty arrays**: Omitted from submission

## User Interface Design

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
{
  config.key === "customization_new_option" &&
    "Describe what this new option does";
}
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
