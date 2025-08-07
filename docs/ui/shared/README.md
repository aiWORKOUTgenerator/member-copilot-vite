# 🎨 UI/Shared Components Documentation

The UI/shared layer implements the Atomic Design system, providing reusable components from basic atoms to complex templates.

## 📁 Structure

```
src/ui/shared/
├── atoms/           # Basic UI components (Button, Input, etc.)
├── molecules/       # Compound components (Forms, Cards, etc.)
├── organisms/       # Complex UI sections (Headers, Forms, etc.)
└── templates/       # Page layouts and structure
```

## 🎯 Purpose

- **Reusability**: Components used across multiple features
- **Consistency**: Unified design system and patterns
- **Maintainability**: Centralized UI logic and styling
- **Accessibility**: Built-in a11y features and standards
- **Performance**: Optimized rendering and bundle splitting

## 🧬 Atomic Design Hierarchy

```
Atoms → Molecules → Organisms → Templates
  ↓         ↓          ↓          ↓
Button → Form → Header → Page Layout
```

## 📋 Component Categories

### 🧪 Atoms (Basic Components)

**Purpose**: Fundamental building blocks

- **Button** - Interactive buttons with variants
- **Input** - Form input fields
- **Icon** - Icon system and components
- **ValidationMessage** - Error and success messages
- **LoadingState** - Loading indicators

### 🧬 Molecules (Compound Components)

**Purpose**: Combinations of atoms with specific functionality

- **InputField** - Input with label and validation
- **RadioGroupOfCards** - Card-based selection groups
- **StepIndicator** - Step navigation component ⭐
- **DetailedSelector** - Generic selector component for various options ⭐

### 🦠 Organisms (Complex Sections)

**Purpose**: Complete UI sections with business logic

- **PageHeader** - Page titles and navigation
- **FormContainer** - Form wrapper with validation
- **PricingComponent** - Subscription pricing display
- **AuthRequired** - Authentication gate

### 📄 Templates (Page Layouts)

**Purpose**: Page structure and layout patterns

- **PageLayout** - Standard page wrapper
- **StackedLayout** - Vertical content layout
- **PromptList** - List-based content layout

## 🎨 Design System

### Design Tokens

- **Spacing Tokens** - Centralized spacing definitions for consistent layouts
- **Component-Level Spacing** - Each component defines its own spacing configuration
- **Override Capability** - Components can accept spacing overrides when needed

### Styling Approach

- **DaisyUI** - Utility-first CSS framework
- **Tailwind CSS** - Custom utility classes
- **CSS Variables** - Theme customization
- **Responsive Design** - Mobile-first approach

### Component Patterns

- **Props Interface** - TypeScript interfaces for all props
- **Default Props** - Sensible defaults for common use cases
- **Variant System** - Multiple visual variants (primary, secondary, etc.)
- **Size System** - Consistent sizing (sm, md, lg, xl)
- **Spacing System** - Configurable spacing (compact, default, spacious)

## 🧪 Testing Strategy

### Component Testing

- **Unit Tests** - Individual component behavior
- **Visual Tests** - Component appearance and variants
- **Accessibility Tests** - A11y compliance
- **Integration Tests** - Component interactions

### Test Files Structure

```
src/ui/shared/molecules/__tests__/
├── StepIndicator.test.tsx
└── DetailedSelector.test.tsx
```

## 📚 Usage Examples

### Basic Component Usage

```tsx
import { Button, InputField } from '@/ui/shared';

function MyForm() {
  return (
    <InputField
      label="Email"
      type="email"
      required
      error="Please enter a valid email"
    />
  );
}
```

### StepIndicator Usage

```tsx
import { StepIndicator } from '@/ui/shared/molecules';

const steps = [
  { id: "step1", label: "Goal & Energy" },
  { id: "step2", label: "Duration & Equipment" }
];

// Default spacing
<StepIndicator
  steps={steps}
  currentStep="step1"
  onStepClick={handleStepClick}
/>

// Compact spacing for tight layouts
<StepIndicator
  steps={steps}
  currentStep="step1"
  spacing="compact"
/>

// Spacious spacing for prominent displays
<StepIndicator
  steps={steps}
  currentStep="step1"
  spacing="spacious"
/>
```

## 🔗 Related Documentation

- [Modules Documentation](../modules/README.md) - How components are used in features
- [Contexts Documentation](../contexts/README.md) - State management for components
