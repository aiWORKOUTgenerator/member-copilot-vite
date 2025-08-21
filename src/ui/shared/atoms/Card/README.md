# Card Atom

A foundational card component that provides consistent styling and behavior across the application. This atom serves as the building block for all card-based components, ensuring visual consistency and maintainability.

## Components

### Card

The main card component with support for different variants, color schemes, and interaction states.

#### Features

- ✅ **Multiple Variants**: Default, selectable, and path variants
- ✅ **Color Schemes**: Primary, secondary, accent, success, warning, info, error
- ✅ **Interactive States**: Hover effects, selection states, disabled states
- ✅ **Accessibility**: Keyboard navigation, ARIA attributes, screen reader support
- ✅ **TypeScript**: Fully typed with proper interfaces
- ✅ **Consistent Styling**: Unified design system with shared constants

#### Props

```typescript
interface CardProps {
  variant?: 'default' | 'selectable' | 'path';
  colorScheme?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info'
    | 'error';
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  hover?: boolean;
  shadow?: boolean;
}
```

#### Usage Examples

```tsx
import { Card, CardBody } from '@/ui/shared/atoms/Card';

// Default card
<Card>
  <CardBody>
    <h3>Default Card</h3>
    <p>This is a basic card with default styling.</p>
  </CardBody>
</Card>

// Selectable card
<Card
  variant="selectable"
  colorScheme="primary"
  isSelected={true}
  onClick={handleSelect}
>
  <CardBody>
    <h3>Selectable Card</h3>
    <p>This card can be selected and shows selection state.</p>
  </CardBody>
</Card>

// Path card (for navigation/selection)
<Card
  variant="path"
  colorScheme="primary"
  onClick={handlePathSelect}
>
  <CardBody>
    <h3>Path Card</h3>
    <p>This card is designed for path selection scenarios.</p>
  </CardBody>
</Card>

// Disabled card
<Card disabled>
  <CardBody>
    <h3>Disabled Card</h3>
    <p>This card is disabled and cannot be interacted with.</p>
  </CardBody>
</Card>
```

### CardBody

A component for consistent card content layout with standardized padding.

#### Props

```typescript
interface CardBodyProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### Usage

```tsx
<CardBody padding="lg" className="text-center">
  <h3>Card Title</h3>
  <p>Card content with large padding and centered text.</p>
</CardBody>
```

## Variants

### Default

Basic card with clean, minimal styling:

- Background: `bg-base-100`
- Border: `border-base-300`
- Shadow: Subtle shadow

### Selectable

Designed for selection scenarios (like RadioGroupOfCards):

- **Unselected**: Subtle gradient with base colors
- **Selected**: Gradient with color scheme and border highlight
- Interactive hover effects
- Proper ARIA attributes for selection state

### Path

Designed for path selection scenarios (like PathCard):

- Gradient backgrounds with color scheme
- Hover effects with border color changes
- Consistent with existing PathCard design
- Interactive with keyboard support

## Color Schemes

All variants support the following color schemes:

- **primary**: Blue/primary theme
- **secondary**: Purple/secondary theme
- **accent**: Orange/accent theme
- **success**: Green/success theme
- **warning**: Yellow/warning theme
- **info**: Cyan/info theme
- **error**: Red/error theme

## Design System

The Card component uses a centralized design system located in `designSystem.ts`:

```typescript
// Consistent styling constants
export const cardVariants = {
  default: 'bg-base-100 border-base-300 shadow-sm',
  selectable: {
    unselected: 'bg-gradient-to-br from-base-200/20 to-base-200/10',
    selected: (colorScheme) =>
      `bg-gradient-to-br from-${colorScheme}/30 to-${colorScheme}/20`,
  },
  path: {
    primary:
      'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30',
    // ... other color schemes
  },
};
```

## Accessibility

The Card component includes comprehensive accessibility features:

- **Keyboard Navigation**: Enter and Space key activation
- **ARIA Attributes**: Proper labeling and state indication
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Descriptive attributes and roles
- **Selection State**: `aria-pressed` for selectable cards

## Migration Guide

### From RadioGroupOfCards

Replace custom card styling with the Card atom:

```tsx
// Before
<div className={`card cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
  isSelected
    ? `bg-gradient-to-br from-${colorScheme}/30 to-${colorScheme}/20 border-${colorScheme} border-2 shadow-sm`
    : 'bg-gradient-to-br from-base-200/20 to-base-200/10 border-base-300 border hover:border-base-400'
}`}>

// After
<Card
  variant="selectable"
  colorScheme={colorScheme}
  isSelected={isSelected}
  onClick={handleChange}
>
  <CardBody>
    {/* Card content */}
  </CardBody>
</Card>
```

### From PathCard

Replace custom card styling with the Card atom:

```tsx
// Before
<div className={`card shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-2 ${
  currentColors.card
}`}>

// After
<Card
  variant="path"
  colorScheme={variant}
  onClick={onClick}
>
  <CardBody>
    {/* Card content */}
  </CardBody>
</Card>
```

## Best Practices

1. **Use Appropriate Variants**: Choose the variant that matches your use case
2. **Consistent Color Schemes**: Use the same color scheme across related cards
3. **Proper Content Structure**: Use CardBody for consistent padding
4. **Accessibility**: Always provide proper labels and handlers
5. **Performance**: The component is optimized for re-renders

## Testing

The Card component includes comprehensive tests covering:

- All variants and color schemes
- Interaction states (click, keyboard)
- Accessibility attributes
- Disabled states
- Custom styling

Run tests with:

```bash
npm run test src/ui/shared/atoms/Card/__tests__/Card.test.tsx
```

## Future Enhancements

Potential improvements for the Card atom:

1. **Additional Variants**: More specialized card types
2. **Animation Options**: Configurable animations and transitions
3. **Size Variants**: Different card sizes (sm, md, lg, xl)
4. **Header/Footer Components**: Dedicated CardHeader and CardFooter atoms
5. **Image Support**: Built-in image handling for card media
