# DetailedSelector Toggle API Reference

## Overview

This document provides the complete technical API reference for the DetailedSelector toggle functionality, including all components, interfaces, and usage patterns.

## 📚 **Component APIs**

### **DetailedSelector**

The main component with enhanced variant support.

#### **Interface**

```typescript
export interface DetailedSelectorProps<T> {
  /** Icon shown next to the question */
  icon: ComponentType<{ className?: string }>;
  /** The list of choices */
  options: Array<{
    id: string;
    title: string;
    description?: string;
    tertiary?: React.ReactNode;
  }>;
  /** Current selection: a single T or array of T if multiple */
  selectedValue?: T | T[];
  /** Whether this selector allows multiple picks */
  multiple?: boolean;
  /** Fired when the user picks something */
  onChange: (value: T | T[]) => void;
  /** The question label text */
  question: string;
  /** Optional helper text under the label */
  description?: string;
  /** Disable all inputs */
  disabled?: boolean;
  /** Validation error message */
  error?: string;
  /** How many columns in the grid */
  gridCols?: number;
  /** Color scheme key (matches your themes) */
  colorScheme?: string;
  /** Whether to show required field indicator */
  required?: boolean;
  /** Display variant - controls overall presentation style */
  variant?: 'detailed' | 'simple';
  /** Explicitly control description visibility (overrides variant default) */
  showDescription?: boolean;
  /** Explicitly control tertiary content visibility (overrides variant default) */
  showTertiary?: boolean;
}
```

#### **Variant Logic**

```typescript
const getVariantDefaults = (variant: 'detailed' | 'simple') => ({
  showDescription: variant === 'detailed',
  showTertiary: variant === 'detailed',
});

const defaults = getVariantDefaults(variant);
const showDescription = explicitShowDescription ?? defaults.showDescription;
const showTertiary = explicitShowTertiary ?? defaults.showTertiary;
```

#### **Usage Examples**

```typescript
// Basic usage with detailed variant (default)
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
/>

// Simple variant
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant="simple"
/>

// Custom overrides
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant="simple"
  showDescription={false}
  showTertiary={true}
/>
```

---

### **SimpleSelector**

A convenience wrapper for simple-only usage.

#### **Interface**

```typescript
export interface SimpleSelectorProps<T>
  extends Omit<
    DetailedSelectorProps<T>,
    'variant' | 'showDescription' | 'showTertiary'
  > {
  /** Override to show descriptions in simple mode */
  showDescription?: boolean;
  /** Override to show tertiary content in simple mode */
  showTertiary?: boolean;
}
```

#### **Implementation**

```typescript
export function SimpleSelector<T>(props: SimpleSelectorProps<T>) {
  return (
    <DetailedSelector
      {...props}
      variant="simple"
      showDescription={props.showDescription ?? false}
      showTertiary={props.showTertiary ?? false}
    />
  );
}
```

#### **Usage Examples**

```typescript
// Basic simple selector
<SimpleSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
/>

// With overrides
<SimpleSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  showDescription={true}
  showTertiary={false}
/>
```

---

### **SimpleDetailedViewSelector**

A reusable toggle component for switching between view modes.

#### **Interface**

```typescript
export interface SimpleDetailedViewSelectorProps {
  /** Current view mode */
  value: 'simple' | 'detailed';
  /** Callback when view mode changes */
  onChange: (value: 'simple' | 'detailed') => void;
  /** Custom labels for the toggle options */
  labels?: {
    simple: string;
    detailed: string;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disable the toggle */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}
```

#### **Implementation**

```typescript
export function SimpleDetailedViewSelector({
  value,
  onChange,
  labels = { simple: 'Simple', detailed: 'Detailed' },
  size = 'md',
  disabled = false,
  className = '',
}: SimpleDetailedViewSelectorProps) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <div
      className={`inline-flex bg-base-200 rounded-lg p-1 ${disabled ? 'opacity-50' : ''} ${className}`}
      role="group"
      aria-label="View mode selector"
    >
      <button
        type="button"
        className={`${sizeClasses[size]} font-medium rounded-md transition-all duration-200 ${
          value === 'simple'
            ? 'bg-base-100 text-base-content shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
        onClick={() => onChange('simple')}
        disabled={disabled}
        aria-pressed={value === 'simple'}
      >
        {labels.simple}
      </button>
      <button
        type="button"
        className={`${sizeClasses[size]} font-medium rounded-md transition-all duration-200 ${
          value === 'detailed'
            ? 'bg-base-100 text-base-content shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
        onClick={() => onChange('detailed')}
        disabled={disabled}
        aria-pressed={value === 'detailed'}
      >
        {labels.detailed}
      </button>
    </div>
  );
}
```

#### **Usage Examples**

```typescript
// Basic toggle
const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
/>

// Customized toggle
<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
  size="sm"
  labels={{ simple: 'Compact', detailed: 'Full' }}
  className="mb-4"
/>
```

---

### **RadioGroupOfCards**

Enhanced card rendering component with visibility control.

#### **Interface**

```typescript
interface RadioGroupOfCardsProps<T extends SelectableItem> {
  items: T[];
  onChange: (selected: T | T[]) => void;
  defaultSelected?: T | T[];
  selected?: T | T[];
  legend?: string;
  multiple?: boolean;
  gridCols?: number;
  colorScheme?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info'
    | 'error';
  /** Control description visibility in cards */
  showDescription?: boolean;
  /** Control tertiary content visibility in cards */
  showTertiary?: boolean;
}
```

#### **SelectableItem Interface**

```typescript
export interface SelectableItem {
  id: string | number;
  title: string;
  description: string;
  tertiary?: string | React.ReactNode;
}
```

#### **Usage Examples**

```typescript
// Basic usage
<RadioGroupOfCards
  items={items}
  onChange={handleSelection}
  legend="Choose an option"
/>

// With visibility control
<RadioGroupOfCards
  items={items}
  onChange={handleSelection}
  showDescription={false}
  showTertiary={true}
  gridCols={2}
  colorScheme="accent"
/>
```

## 🎯 **Integration Patterns**

### **State Management Pattern**

```typescript
// Component state
const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

// Toggle component
<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
  size="sm"
  labels={{ simple: 'Simple', detailed: 'Detailed' }}
/>

// DetailedSelector usage
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant={viewMode}
/>
```

### **Conditional Rendering Pattern**

```typescript
// Only show toggle in specific modes
{mode === 'quick' && (
  <div className="mb-4 flex justify-end">
    <SimpleDetailedViewSelector
      value={viewMode}
      onChange={setViewMode}
      size="sm"
    />
  </div>
)}
```

### **Multiple Selector Pattern**

```typescript
// Apply same view mode to multiple selectors
const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant={viewMode}
/>

<DetailedSelector
  icon={Zap}
  options={energyOptions}
  selectedValue={selectedEnergy}
  onChange={setSelectedEnergy}
  question="What's your energy level?"
  variant={viewMode}
/>
```

## 🔧 **Type Safety**

### **Generic Type Support**

```typescript
// DetailedSelector supports any data type
<DetailedSelector<string>
  icon={Target}
  options={stringOptions}
  selectedValue={selectedString}
  onChange={setSelectedString}
  question="Choose a string"
/>

<DetailedSelector<number>
  icon={Target}
  options={numberOptions}
  selectedValue={selectedNumber}
  onChange={setSelectedNumber}
  question="Choose a number"
/>
```

### **Interface Segregation**

```typescript
// Clear separation of concerns
interface DetailedSelectorProps<T> {
  // Core functionality
  options: Array<{
    id: string;
    title: string;
    description?: string;
    tertiary?: React.ReactNode;
  }>;
  selectedValue?: T | T[];
  onChange: (value: T | T[]) => void;

  // Presentation control
  variant?: 'detailed' | 'simple';
  showDescription?: boolean;
  showTertiary?: boolean;

  // UI customization
  icon: ComponentType<{ className?: string }>;
  question: string;
  gridCols?: number;
  colorScheme?: string;
}
```

## 📊 **Testing Patterns**

### **Unit Test Structure**

```typescript
describe('DetailedSelector Variant Integration', () => {
  const defaultProps = {
    icon: MockIcon,
    options: mockOptions,
    selectedValue: null,
    onChange: vi.fn(),
    question: 'Test Selection',
  };

  describe('Variant Behavior', () => {
    it('shows description and tertiary content in detailed mode', () => {
      render(<DetailedSelector {...defaultProps} variant="detailed" />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });
});
```

### **Mock Data Pattern**

```typescript
const mockOptions = [
  {
    id: '1',
    title: 'Option 1',
    description: 'This is a detailed description for option 1',
    tertiary: 'Additional info 1',
  },
  {
    id: '2',
    title: 'Option 2',
    description: 'This is a detailed description for option 2',
    tertiary: 'Additional info 2',
  },
];

const MockIcon = ({ className }: { className?: string }) => (
  <div data-testid="mock-icon" className={className}>📋</div>
);
```

## 🎨 **Styling Reference**

### **Tab-Selector Classes**

```css
/* Container */
.inline-flex.bg-base-200.rounded-lg.p-1

/* Active button */
.bg-base-100.text-base-content.shadow-sm

/* Inactive button */
.text-base-content/60.hover:text-base-content

/* Size variants */
.text-xs.px-3.py-1.5  /* sm */
.text-sm.px-4.py-2.5  /* md */
.text-base.px-6.py-3  /* lg */
```

### **Card Styling**

```css
/* Selected card */
.bg-primary-50.border-primary.border-2

/* Unselected card */
.bg-base-100.border-base-300.border

/* Description text */
.text-sm.text-base-content/70

/* Tertiary content */
.mt-3.text-sm.font-medium
```

## 🚀 **Performance Considerations**

### **Conditional Rendering**

```typescript
// Efficient rendering - only renders what's needed
{showDescription && item.description && (
  <p className="text-sm text-base-content/70">
    {item.description}
  </p>
)}

{showTertiary && item.tertiary && (
  <div className="mt-3 text-sm font-medium">
    {item.tertiary}
  </div>
)}
```

### **State Management**

```typescript
// Efficient state updates
const handleChange = (item: T) => {
  if (multiple) {
    const currentSelected = (selected as T[]) || [];
    const isItemSelected = currentSelected.some((i) => i.id === item.id);

    const newSelected = isItemSelected
      ? currentSelected.filter((i) => i.id !== item.id)
      : [...currentSelected, item];

    onChange(newSelected);
  } else {
    onChange(item);
  }
};
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Toggle Not Visible**

```typescript
// Ensure toggle is rendered conditionally
{mode === 'quick' && (
  <SimpleDetailedViewSelector
    value={viewMode}
    onChange={setViewMode}
  />
)}
```

#### **Variant Not Working**

```typescript
// Ensure variant prop is passed correctly
<DetailedSelector
  // ... other props
  variant={viewMode} // Make sure this is set
/>
```

#### **TypeScript Errors**

```typescript
// Ensure proper prop names
<DetailedSelector
  selectedValue={selectedValue} // Not 'selected'
  question="Question" // Not 'legend'
  // ... other props
/>
```

### **Debug Patterns**

```typescript
// Add console logging for debugging
const handleViewModeChange = (newMode: 'simple' | 'detailed') => {
  console.log('View mode changed:', newMode);
  setViewMode(newMode);
};

// Check component state
console.log('Current view mode:', viewMode);
console.log('Current selection:', selectedValue);
```

## 📝 **Migration Guide**

### **From Existing DetailedSelector**

```typescript
// Before (existing usage)
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
/>

// After (with toggle)
const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
/>

<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant={viewMode}
/>
```

### **Adding Toggle to New Components**

```typescript
// 1. Import components
import { DetailedSelector, SimpleDetailedViewSelector } from '@/ui/shared/molecules';

// 2. Add state
const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

// 3. Add toggle UI
<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
  size="sm"
/>

// 4. Update selectors
<DetailedSelector
  // ... existing props
  variant={viewMode}
/>
```

This API reference provides complete technical documentation for implementing and using the DetailedSelector toggle functionality in your React applications.
