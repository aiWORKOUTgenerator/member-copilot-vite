# DetailedSelector, SimpleSelector & SimpleDetailedViewSelector Usage Guidelines

## Overview

The `DetailedSelector` component provides a flexible, card-based selection interface with support for both detailed and simple presentation modes. It's designed to handle various use cases from complex forms to quick selection workflows.

For convenience, we also provide:

- **`SimpleSelector`** - A wrapper component that automatically configures DetailedSelector for simple mode usage
- **`SimpleDetailedViewSelector`** - A modern tab-selector toggle for switching between view modes dynamically

## When to Use Each Variant

### Detailed Variant (Default)

**Use when:**

- First-time users who need context and explanations
- Complex forms with many options that benefit from descriptions
- When descriptions add significant value to the selection process
- Training or onboarding flows where context is important
- Options that are not self-explanatory

**Example use cases:**

- Workout focus selection with intensity indicators
- Equipment selection with availability descriptions
- Feature selection with detailed explanations

### Simple Variant

**Use when:**

- Power users who are familiar with the options
- Mobile or compact layouts where space is limited
- Quick selection workflows where speed is prioritized
- Options that are self-explanatory from their titles
- Repeated interactions where users don't need reminders

**Example use cases:**

- Quick workout setup for experienced users
- Mobile navigation between workout types
- Rapid equipment selection for familiar users

### Custom Control

**Use when:**

- Mixed requirements (e.g., show tertiary but not description)
- A/B testing different presentations
- Gradual migration scenarios
- Specific UX requirements that don't fit the standard variants

### SimpleSelector Wrapper

**Use when:**

- You want simple mode but prefer a more explicit component name
- You want to avoid remembering the `variant="simple"` prop
- You're building a simple-focused interface where most selectors will be simple
- You want to make your code more self-documenting

**Benefits:**

- More explicit intent in code
- Cleaner API (no variant prop needed)
- Easier to search for simple mode usage
- Optional overrides for specific cases

### SimpleDetailedViewSelector Toggle

**Use when:**

- You want to give users control over their view preference
- You're building interfaces that support both simple and detailed modes
- You want to provide a consistent toggle across multiple selectors
- You need a modern, accessible toggle component

**Benefits:**

- **Modern Design**: Tab-selector style with smooth transitions
- **User Control**: Let users choose their preferred view mode
- **Consistent UX**: Same toggle works across all DetailedSelector components
- **Accessible**: Full keyboard navigation and ARIA support
- **Responsive**: Works well on all screen sizes

## Decision Matrix

| Scenario                              | Recommended Component                             | Reasoning                                     |
| ------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| First-time user selection             | `DetailedSelector`                                | Users need context and explanations           |
| Power user quick selection            | `DetailedSelector variant="simple"`               | Users know the options, prioritize speed      |
| Mobile interface                      | `DetailedSelector variant="simple"`               | Space constraints, touch-friendly             |
| Desktop complex form                  | `DetailedSelector`                                | Space available, detailed information helpful |
| Training/onboarding                   | `DetailedSelector`                                | Educational context is important              |
| Repeated daily use                    | `DetailedSelector variant="simple"`               | Users become familiar with options            |
| Mixed content needs                   | `DetailedSelector` with explicit flags            | Use explicit flags for granular control       |
| Simple-focused interface              | `SimpleSelector`                                  | Cleaner API, explicit intent                  |
| User preference toggle                | `SimpleDetailedViewSelector`                      | Let users choose their view mode              |
| Multiple selectors with shared toggle | `SimpleDetailedViewSelector` + `DetailedSelector` | Consistent UX across components               |

## Performance Considerations

### Bundle Size Impact

- **Minimal**: The variant system adds only a few bytes to the bundle
- **No duplication**: Single component handles all variants
- **Tree-shakeable**: Unused variants can be eliminated

### Runtime Performance

- **Efficient rendering**: Visibility control happens at render time
- **No array manipulation**: Data flows directly to RadioGroupOfCards
- **Optimized re-renders**: Only affected cards re-render on selection

### Memory Usage

- **Low overhead**: No additional state or complex logic
- **Clean data flow**: No intermediate data transformations

## Accessibility Features

### Keyboard Navigation

- Full keyboard support through RadioGroupOfCards
- Tab navigation between cards
- Space/Enter to select cards

### Screen Reader Support

- Proper fieldset/legend structure
- Descriptive labels and error messages
- ARIA attributes for selection state

### Visual Design

- High contrast color schemes
- Clear visual feedback for selection
- Consistent spacing and typography

### Tab-Selector Design

The `SimpleDetailedViewSelector` uses a modern tab-selector design:

- **Container**: Subtle `bg-base-200` background with rounded corners
- **Active Tab**: Elevated `bg-base-100` with `shadow-sm` for depth
- **Inactive Tabs**: Muted `text-base-content/60` with hover effects
- **Transitions**: Smooth 200ms transitions for polished interactions
- **Responsive**: Custom sizing system (`sm`, `md`, `lg`) for different contexts

## Usage Examples

### DetailedSelector Examples

```typescript
// Detailed view (default) - shows descriptions and tertiary content
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant="detailed"
/>

// Simple view - hides descriptions and tertiary content
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant="simple"
/>

// Custom control - show tertiary but not descriptions
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

### SimpleSelector Examples

```typescript
// Basic simple selector - hides descriptions and tertiary content
<SimpleSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
/>

// Simple selector with description override
<SimpleSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  showDescription={true}
/>

// Simple selector with tertiary content override
<SimpleSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  showTertiary={true}
/>

// Simple selector with both overrides
<SimpleSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  showDescription={true}
  showTertiary={true}
/>
```

### SimpleDetailedViewSelector Examples

```typescript
// Basic toggle with default labels
<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
/>

// Custom labels and size
<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
  labels={{ simple: 'Quick', detailed: 'Full' }}
  size="sm"
/>

// Disabled state
<SimpleDetailedViewSelector
  value={viewMode}
  onChange={setViewMode}
  disabled={isLoading}
/>

// Integration with DetailedSelector
const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed');

<div className="mb-4 flex justify-end">
  <SimpleDetailedViewSelector
    value={viewMode}
    onChange={setViewMode}
    size="sm"
  />
</div>

<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant={viewMode}  // Responds to toggle
/>
```

## Migration Guide

### From Previous Versions

If you're using an older version of DetailedSelector:

1. **No breaking changes**: All existing usage continues to work
2. **Default behavior unchanged**: `variant="detailed"` is the default
3. **Gradual adoption**: Add variants incrementally as needed

### Adding Variants to Existing Code

```typescript
// Before (still works)
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
/>

// After - add variant when ready
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant="simple" // New: add when appropriate
/>
```

### Choosing Between DetailedSelector and SimpleSelector

**Use DetailedSelector when:**

- You need both detailed and simple variants in the same codebase
- You want explicit control over the variant prop
- You're building a flexible component that needs to switch between modes
- You prefer the more explicit variant-based approach

**Use SimpleSelector when:**

- You're building a simple-focused interface
- You want more explicit intent in your code
- You prefer a cleaner API without the variant prop
- You want to make it easier to find simple mode usage in your codebase

**Migration from DetailedSelector to SimpleSelector:**

```typescript
// Before
<DetailedSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
  variant="simple"
/>

// After
<SimpleSelector
  icon={Target}
  options={focusOptions}
  selectedValue={selectedFocus}
  onChange={setSelectedFocus}
  question="What's your main goal?"
/>
```

## Best Practices

### 1. Choose the Right Variant

- Start with `detailed` for new features
- Move to `simple` after user research shows familiarity
- Use `custom` only when standard variants don't fit

### 2. Provide Meaningful Content

- Write clear, concise descriptions
- Use tertiary content (like progress indicators) sparingly
- Ensure titles are self-explanatory when possible

### 3. Test User Experience

- A/B test different variants with real users
- Measure completion rates and time to selection
- Gather feedback on clarity and ease of use

### 4. Consider Context

- Match variant to user expertise level
- Adapt to device and screen size
- Align with overall application design patterns

## Common Patterns

### Quick Setup Flow

```typescript
// Step 1: Detailed for first-time users
<DetailedSelector
  variant="detailed"
  question="What's your fitness goal?"
  // ... other props
/>

// Step 2: Simple for subsequent selections
<DetailedSelector
  variant="simple"
  question="How long do you have?"
  // ... other props
/>
```

### Responsive Design

```typescript
// Desktop: Show all content
<DetailedSelector
  variant="detailed"
  gridCols={3}
  // ... other props
/>

// Mobile: Hide descriptions for space
<DetailedSelector
  variant="simple"
  gridCols={2}
  // ... other props
/>
```

### Progressive Disclosure

```typescript
// Initial view: Simple
<DetailedSelector
  variant="simple"
  question="Choose your workout type"
  // ... other props
/>

// Expanded view: Detailed with custom control
<DetailedSelector
  variant="detailed"
  showDescription={true}
  showTertiary={false} // Hide tertiary for this context
  // ... other props
/>
```

## Troubleshooting

### Common Issues

**Q: My descriptions aren't showing in simple mode**
A: This is expected behavior. Use `showDescription={true}` to override the variant default.

**Q: How do I show tertiary content but hide descriptions?**
A: Use `variant="simple"` with `showTertiary={true}` and `showDescription={false}`, or use `SimpleSelector` with `showTertiary={true}`.

**Q: The component feels too cluttered**
A: Try `variant="simple"` or use explicit flags to hide specific content.

**Q: Performance seems slow with many options**
A: The component is optimized for performance. Check if you're passing unnecessary props or causing unnecessary re-renders.

**Q: Should I use DetailedSelector or SimpleSelector?**
A: Use `DetailedSelector` when you need flexibility between variants. Use `SimpleSelector` when you want a cleaner API for simple mode.

**Q: Can I use SimpleSelector with overrides to show everything?**
A: Yes! `SimpleSelector` with `showDescription={true}` and `showTertiary={true}` will show all content, but the component name still indicates your intent for simple mode.

**Q: How do I integrate the toggle with multiple DetailedSelector components?**
A: Use a single `viewMode` state and pass `variant={viewMode}` to all DetailedSelector components. The toggle will control all of them simultaneously.

**Q: What's the difference between the old button group and new tab-selector style?**
A: The tab-selector provides a more modern, polished appearance with better visual hierarchy, smooth transitions, and improved accessibility while maintaining the same functionality.

**Q: Can I customize the toggle appearance?**
A: The toggle uses Tailwind CSS classes, so you can override styles with the `className` prop or modify the component's internal styling.

### Debug Tips

1. **Check variant defaults**: Use browser dev tools to verify which content is being shown/hidden
2. **Verify prop passing**: Ensure visibility flags are being passed correctly
3. **Test edge cases**: Try with empty descriptions or missing tertiary content
4. **Monitor performance**: Use React DevTools to check for unnecessary re-renders

## Future Enhancements

### Planned Features

- Animation support for variant transitions
- More granular content control options
- Enhanced mobile touch interactions
- Additional variant types (compact, list, etc.)
- Additional wrapper components (CompactSelector, ListSelector, etc.)
- Enhanced accessibility features
- Additional toggle themes (outlined, filled, etc.)
- Toggle state persistence (localStorage)
- Toggle analytics tracking

### Contributing

When adding new features:

- Maintain backward compatibility
- Add comprehensive tests
- Update documentation
- Consider performance implications
- Follow the established patterns
