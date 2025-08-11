# UI Spacing Standards

## Overview

This document defines the semantic spacing system for the member-copilot-vite project, built on top of Tailwind CSS v4 with DaisyUI components.

## Semantic Spacing Tokens

### Core Spacing Scale

| Token               | Value         | Usage                       | Tailwind Class                                 |
| ------------------- | ------------- | --------------------------- | ---------------------------------------------- |
| `spacing-section`   | 32px (2rem)   | Between major page sections | `mb-section`, `mt-section`, `gap-section`      |
| `spacing-component` | 24px (1.5rem) | Between related components  | `mb-component`, `gap-component`, `p-component` |
| `spacing-element`   | 16px (1rem)   | Between form elements       | `mb-element`, `gap-element`, `p-element`       |
| `spacing-tight`     | 8px (0.5rem)  | For compact layouts         | `gap-tight`, `p-tight`                         |

### Component-Specific Tokens

| Token                  | Value         | Usage                       |
| ---------------------- | ------------- | --------------------------- |
| `spacing-form-field`   | 16px (1rem)   | Standard form field spacing |
| `spacing-card-content` | 24px (1.5rem) | Card internal padding       |

## Usage Guidelines

### When to use `spacing-section` (32px)

✅ **Use for:**

- Between WorkoutCustomization steps
- Between major card sections
- Page section separators
- Large content blocks

```tsx
// ✅ Good
<div className="mb-section">
  <WorkoutStep />
</div>
<div className="mb-section">
  <NextWorkoutStep />
</div>

// ❌ Avoid - creates 56px gap
<div className="mb-6">
  <WorkoutStep />
</div>
<div className="mt-8">
  <NextWorkoutStep />
</div>
```

### When to use `spacing-component` (24px)

✅ **Use for:**

- Between related form fields
- Card internal spacing
- Component group separation
- Sidebar sections

```tsx
// ✅ Good
<div className="space-y-component">
  <FormField />
  <FormField />
  <FormField />
</div>
```

### When to use `spacing-element` (16px)

✅ **Use for:**

- Form field margins
- Button groups
- List item spacing
- Related UI elements

```tsx
// ✅ Good
<div className="flex gap-element">
  <Button>Cancel</Button>
  <Button>Submit</Button>
</div>
```

### When to use `spacing-tight` (8px)

✅ **Use for:**

- Badge groups
- Icon + text combinations
- Compact layouts
- Selection summaries

```tsx
// ✅ Good
<div className="flex gap-tight items-center">
  <Icon />
  <span>Label</span>
</div>
```

## Decision Tree

```
Need spacing between elements?
├── Major page sections? → spacing-section (32px)
├── Related components? → spacing-component (24px)
├── Form elements? → spacing-element (16px)
└── Compact layout? → spacing-tight (8px)
```

## Migration Guide

### For New Components

- **Always use semantic tokens** from day one
- Follow the decision tree above
- Test on mobile and desktop
- Document any custom spacing needs

### For Existing Components

- **Only change if fixing specific issues**
- Focus on high-impact components first
- Test visual impact thoroughly
- Document any deviations

### Priority Order

1. **High Priority**: WorkoutCustomization (56px gap issue)
2. **Medium Priority**: PageLayout, SelectionSummary
3. **Low Priority**: Stable shared components

## Examples

### Before/After: WorkoutCustomization

```tsx
// ❌ Before: Inconsistent 56px gap
<div className="mb-6 workout-customization-container">
  <FocusEnergyStep />
</div>
<div className="mt-8">
  <DurationEquipmentStep />
</div>

// ✅ After: Consistent 32px gap
<div className="mb-section workout-customization-container">
  <FocusEnergyStep />
</div>
<div className="mb-section">
  <DurationEquipmentStep />
</div>
```

### Form Layouts

```tsx
// ✅ Good form spacing
<form className="space-y-element">
  <Input label="Name" />
  <Input label="Email" />
  <div className="flex gap-element justify-end mt-component">
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Submit</Button>
  </div>
</form>
```

### Card Layouts

```tsx
// ✅ Good card spacing
<div className="card bg-base-100 shadow-lg">
  <div className="card-body p-card-content">
    <h2 className="card-title mb-element">Title</h2>
    <p className="mb-component">Description content</p>
    <div className="flex gap-tight">
      <Badge>Tag 1</Badge>
      <Badge>Tag 2</Badge>
    </div>
  </div>
</div>
```

## Code Review Checklist

### ✅ Required Checks

- [ ] Uses semantic tokens instead of arbitrary values
- [ ] Consistent spacing within component groups
- [ ] No conflicting margin/padding combinations
- [ ] Responsive spacing considered
- [ ] Visual testing completed on mobile/desktop

### ❌ Red Flags

- [ ] Using `mb-6` + `mt-8` patterns (creates 56px gaps)
- [ ] Arbitrary spacing values without justification
- [ ] Mixing semantic tokens with hardcoded values
- [ ] Overriding DaisyUI component spacing

## Integration with DaisyUI

### Keep Using DaisyUI Classes

- `card-body` - Provides consistent card padding
- `btn` - Button spacing is handled by DaisyUI
- `input`, `label` - Form spacing from DaisyUI
- `divider` - Section separators

### Complement with Semantic Tokens

- Use semantic tokens for **layout spacing**
- Keep DaisyUI for **component spacing**
- Don't override DaisyUI internal spacing

## Browser Support

- All modern browsers (CSS custom properties)
- Tailwind CSS v4 compatible
- No IE11 support required

## Performance

- CSS custom properties are compiled at build time
- No runtime performance impact
- Smaller bundle size than hardcoded values

---

## Quick Reference Card

| Spacing Need    | Token               | Class           | Value |
| --------------- | ------------------- | --------------- | ----- |
| Major sections  | `spacing-section`   | `mb-section`    | 32px  |
| Components      | `spacing-component` | `gap-component` | 24px  |
| Form elements   | `spacing-element`   | `mb-element`    | 16px  |
| Compact layouts | `spacing-tight`     | `gap-tight`     | 8px   |

**Remember**: When in doubt, follow the existing DaisyUI patterns and use semantic tokens only for custom layout spacing.

---

_Last updated: Sprint Implementation_  
_Next: Apply to WorkoutCustomization component_
