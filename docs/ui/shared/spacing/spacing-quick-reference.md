# Spacing Quick Reference Card

## 🎯 Semantic Spacing Tokens

| Need               | Token               | Class Example   | Value | Use Case                                  |
| ------------------ | ------------------- | --------------- | ----- | ----------------------------------------- |
| **Major sections** | `spacing-section`   | `mb-section`    | 32px  | WorkoutCustomization steps, page sections |
| **Components**     | `spacing-component` | `gap-component` | 24px  | Related form groups, card spacing         |
| **Elements**       | `spacing-element`   | `mb-element`    | 16px  | Form fields, button groups                |
| **Compact**        | `spacing-tight`     | `gap-tight`     | 8px   | Badges, icon+text, selection summaries    |

## ⚡ Quick Decision Tree

```
Need spacing? Ask yourself:
├── Between major page sections? → spacing-section (32px)
├── Between related components? → spacing-component (24px)
├── Between form elements? → spacing-element (16px)
└── Compact layout? → spacing-tight (8px)
```

## 🔧 Common Patterns

### Section Separation (32px)

```tsx
<div className="mb-section">
  <WorkoutStep />
</div>
<div className="mb-section">
  <NextStep />
</div>
```

### Form Layout (16px + 24px)

```tsx
<form className="space-y-element">
  <Input />
  <Input />
  <div className="flex gap-element justify-end mt-component">
    <Button>Cancel</Button>
    <Button>Submit</Button>
  </div>
</form>
```

### Badge Groups (8px)

```tsx
<div className="flex flex-wrap gap-tight">
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
</div>
```

## ❌ Anti-Patterns to Avoid

```tsx
// ❌ DON'T: Creates 56px gap
<div className="mb-6">Content</div>
<div className="mt-8">Next Content</div>

// ✅ DO: Consistent 32px gap
<div className="mb-section">Content</div>
<div className="mb-section">Next Content</div>

// ❌ DON'T: Override DaisyUI spacing
<div className="btn p-4">Button</div>

// ✅ DO: Use DaisyUI as-is
<div className="btn">Button</div>
```

## 🎨 Integration with DaisyUI

### Keep Using DaisyUI For:

- `card-body` - Card padding ✅
- `btn` - Button spacing ✅
- `input`, `label` - Form controls ✅
- `divider` - Section separators ✅

### Use Semantic Tokens For:

- Layout spacing between components
- Custom component internal spacing
- Multi-step form separation
- Badge and selection groupings

## 📋 Code Review Checklist

- [ ] Uses semantic tokens instead of hardcoded values
- [ ] No `mb-6` + `mt-8` combinations
- [ ] Consistent spacing within component groups
- [ ] DaisyUI component spacing preserved
- [ ] Mobile responsiveness maintained

---

**Remember**: When in doubt, follow existing DaisyUI patterns. Use semantic tokens only for custom layout spacing.

_Quick reference for Sprint: UI Spacing Standardization_
