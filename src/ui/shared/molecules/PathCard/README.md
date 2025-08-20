# PathCard

A generic selectable card component for path selection with full accessibility support and loading states. Can be used for workouts, nutrition, services, and any other path selection scenarios.

## Components

### PathCard

A visually appealing, accessible card interface for selecting between different paths.

#### Features

- ✅ **Full Accessibility**: ARIA labels, keyboard navigation, focus management
- ✅ **Visual Design**: Beautiful gradients, icons, and visual hierarchy
- ✅ **Interactive States**: Hover effects, selection states, keyboard support
- ✅ **TypeScript**: Fully typed with proper interfaces
- ✅ **Responsive**: Uses Tailwind CSS with responsive design
- ✅ **Generic**: Works for any path selection (workouts, nutrition, services, etc.)

#### Props

```typescript
interface PathCardProps {
  title: string; // Card title
  description: string; // Card description
  features: string[]; // List of features
  badge?: string; // Optional badge text
  icon: React.ComponentType<{ className?: string }>; // Icon component
  variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info'; // Color theme
  onClick: () => void; // Click handler
  isSelected?: boolean; // Selection state
}
```

#### Usage

```tsx
import { PathCard } from '@/ui/shared/molecules/PathCard';
import { Zap } from 'lucide-react';

// Workout Path Example
<PathCard
  title="Quick Workout Setup"
  description="Get a personalized workout in minutes with our streamlined setup process."
  features={[
    'Fast and efficient setup',
    'AI-powered recommendations',
    'Quick customization options',
    'Perfect for busy schedules'
  ]}
  badge="Beginner"
  icon={Zap}
  variant="primary"
  onClick={() => handlePathSelect('quick')}
  isSelected={false}
/>

// Nutrition Path Example
<PathCard
  title="Custom Meal Plan"
  description="Get a personalized nutrition plan tailored to your goals."
  features={[
    'Personalized macros',
    'Recipe suggestions',
    'Shopping lists',
    'Progress tracking'
  ]}
  badge="Advanced"
  icon={Utensils}
  variant="success"
  onClick={() => handlePathSelect('custom')}
/>

// Services Path Example
<PathCard
  title="Premium Coaching"
  description="One-on-one coaching with certified fitness professionals."
  features={[
    'Personal trainer',
    'Weekly check-ins',
    'Custom programs',
    '24/7 support'
  ]}
  badge="Premium"
  icon={Star}
  variant="accent"
  onClick={() => handlePathSelect('coaching')}
/>
```

### PathCardSkeleton

A skeleton loading state component that matches the structure and layout of the PathCard.

#### Features

- ✅ **Loading Animation**: Uses Tailwind's `animate-pulse`
- ✅ **Visual Consistency**: Matches actual card structure
- ✅ **Performance**: Lightweight and efficient
- ✅ **Accessibility**: Non-interactive, purely visual

#### Usage

```tsx
import { PathCardSkeleton } from '@/ui/shared/molecules/PathCard';

<PathCardSkeleton />;
```

## Accessibility

The PathCard component includes comprehensive accessibility features:

- **Keyboard Navigation**: Supports Enter and Space key activation
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Uses `role="button"` and proper tabIndex
- **Screen Reader Support**: Descriptive ARIA attributes

## Variants

The component supports six color variants:

### Primary (Blue/Green)

- Primary colors: Blue to green gradient
- Badge: Primary blue
- Bullets: Blue
- Action indicator: Blue theme

### Secondary (Purple/Pink)

- Primary colors: Purple to pink gradient
- Badge: Secondary purple
- Bullets: Purple
- Action indicator: Purple theme

### Accent (Orange/Red)

- Primary colors: Orange to red gradient
- Badge: Accent orange
- Bullets: Orange
- Action indicator: Orange theme

### Success (Green/Emerald)

- Primary colors: Green to emerald gradient
- Badge: Success green
- Bullets: Green
- Action indicator: Green theme

### Warning (Yellow/Amber)

- Primary colors: Yellow to amber gradient
- Badge: Warning yellow
- Bullets: Yellow
- Action indicator: Yellow theme

### Info (Cyan/Blue)

- Primary colors: Cyan to blue gradient
- Badge: Info cyan
- Bullets: Cyan
- Action indicator: Cyan theme

## Examples

### Workout Path Selection

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <PathCard
    title="Quick Workout Setup"
    description="Get started in minutes"
    features={['Fast setup', 'AI recommendations']}
    badge="Beginner"
    icon={Zap}
    variant="primary"
    onClick={handleQuickPath}
  />
  <PathCard
    title="Detailed Workout Setup"
    description="Customize every aspect"
    features={['Full customization', 'Advanced options']}
    badge="Advanced"
    icon={Target}
    variant="secondary"
    onClick={handleDetailedPath}
  />
</div>
```

### Nutrition Path Selection

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <PathCard
    title="Basic Meal Plan"
    description="Simple, effective nutrition"
    features={['Macro tracking', 'Basic recipes']}
    badge="Starter"
    icon={Apple}
    variant="success"
    onClick={handleBasicNutrition}
  />
  <PathCard
    title="Custom Meal Plan"
    description="Tailored to your needs"
    features={['Personalized macros', 'Custom recipes']}
    badge="Advanced"
    icon={Utensils}
    variant="accent"
    onClick={handleCustomNutrition}
  />
  <PathCard
    title="Premium Coaching"
    description="Expert guidance"
    features={['1-on-1 coaching', 'Weekly check-ins']}
    badge="Premium"
    icon={Star}
    variant="warning"
    onClick={handleCoaching}
  />
</div>
```

### With Loading State

```tsx
{
  isLoading ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <PathCardSkeleton />
      <PathCardSkeleton />
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <PathCard {...quickCardProps} />
      <PathCard {...detailedCardProps} />
    </div>
  );
}
```

## Best Practices

1. **Choose appropriate variants** for your use case (primary for main options, success for positive outcomes, etc.)
2. **Use descriptive titles and descriptions** that clearly explain the path
3. **Keep feature lists concise** but informative
4. **Use meaningful badges** to indicate difficulty, level, or category
5. **Select appropriate icons** that represent the path concept
6. **Implement proper loading states** using the skeleton component
7. **Test keyboard navigation** to ensure accessibility
8. **Use consistent variants** across related cards

## Migration from WorkoutPathCard

If migrating from the workout-specific implementation:

```tsx
// Old import
import { WorkoutPathCard } from '@/ui/shared/molecules/WorkoutPathCard';

// New import
import { PathCard } from '@/ui/shared/molecules/PathCard';

// Old usage
<WorkoutPathCard
  title="Quick Workout Setup"
  description="..."
  features={[...]}
  difficulty="Beginner"
  icon={Zap}
  colorScheme="quick"
  onClick={handleClick}
/>

// New usage
<PathCard
  title="Quick Workout Setup"
  description="..."
  features={[...]}
  badge="Beginner"
  icon={Zap}
  variant="primary"
  onClick={handleClick}
/>
```

The main changes are:

- `difficulty` → `badge` (optional)
- `colorScheme` → `variant` (with more options)
- More generic naming for broader use cases
