# Spacing Code Review Checklist

## 🔍 Pre-Review Setup

- [ ] **Baseline established**: Screenshots of component before changes
- [ ] **Tests passing**: All component tests pass
- [ ] **Build successful**: `npm run build` completes without errors

## ✅ Spacing Standards Compliance

### Semantic Token Usage

- [ ] **Uses semantic tokens**: `mb-section`, `gap-component`, etc. instead of hardcoded values
- [ ] **Correct token selection**: Follows decision tree (section → component → element → tight)
- [ ] **No anti-patterns**: No `mb-6` + `mt-8` combinations creating 56px gaps
- [ ] **Consistent within component**: Same spacing type used throughout component

### DaisyUI Integration

- [ ] **Preserves DaisyUI spacing**: No overrides to `btn`, `card-body`, `input` spacing
- [ ] **Complements framework**: Semantic tokens used for layout, DaisyUI for components
- [ ] **No conflicts**: Custom spacing doesn't break DaisyUI component behavior

## 📱 Visual & Responsive Testing

### Desktop Testing (1920x1080+)

- [ ] **Section separation**: Clear visual hierarchy between major sections
- [ ] **Component grouping**: Related components visually grouped appropriately
- [ ] **No cramped layouts**: Adequate breathing room between elements
- [ ] **No excessive whitespace**: Spacing feels balanced, not wasteful

### Mobile Testing (375px - 768px)

- [ ] **Maintains hierarchy**: Spacing relationships preserved on small screens
- [ ] **Touch targets**: Adequate spacing between interactive elements (44px min)
- [ ] **Readable content**: Text blocks have appropriate line spacing
- [ ] **No horizontal overflow**: Content fits within viewport

### Tablet Testing (768px - 1024px)

- [ ] **Responsive breakpoints**: Spacing adapts appropriately at md: breakpoint
- [ ] **Layout stability**: No jarring spacing changes between breakpoints

## 🧪 Functional Testing

### Form Interactions

- [ ] **Focus management**: Focus rings not obscured by spacing
- [ ] **Error states**: Error messages have adequate spacing from inputs
- [ ] **Validation feedback**: Success/error states don't break layout

### Animation & Transitions

- [ ] **Smooth animations**: Spacing changes animate smoothly if animated
- [ ] **No layout shift**: Dynamic content doesn't cause jarring spacing changes
- [ ] **Loading states**: Skeleton/loading states maintain spacing consistency

## 🔧 Technical Implementation

### CSS Quality

- [ ] **Valid syntax**: All semantic token classes compile correctly
- [ ] **No hardcoded values**: Spacing values use tokens or standard Tailwind classes
- [ ] **Consistent units**: No mixing of px, rem, em values arbitrarily
- [ ] **Performance**: No excessive CSS specificity or redundant classes

### Accessibility

- [ ] **Focus indicators**: Adequate spacing around focus rings
- [ ] **Screen readers**: Spacing doesn't interfere with screen reader navigation
- [ ] **Color contrast**: Spacing doesn't affect color contrast ratios
- [ ] **Zoom compatibility**: Layout remains usable at 200% zoom

## 🚫 Red Flags (Immediate Rejection)

### Critical Issues

- [ ] **56px gaps**: Any `mb-6` + `mt-8` combinations
- [ ] **DaisyUI overrides**: Custom padding on `btn`, `card-body`, etc.
- [ ] **Broken tests**: Any failing component tests
- [ ] **Build failures**: TypeScript errors or build issues

### Major Concerns

- [ ] **Inconsistent patterns**: Mixing semantic tokens with hardcoded values
- [ ] **Mobile breaks**: Layout issues on mobile viewports
- [ ] **Accessibility violations**: Focus management or contrast issues
- [ ] **Performance regression**: Significantly increased CSS bundle size

## ✨ Excellence Indicators (Bonus Points)

### Code Quality

- [ ] **Clean implementation**: Minimal, focused changes
- [ ] **Good documentation**: Comments explaining spacing decisions
- [ ] **Future-friendly**: Easy to extend and maintain
- [ ] **Team consistency**: Follows established patterns

### User Experience

- [ ] **Improved hierarchy**: Better visual organization than before
- [ ] **Responsive design**: Excellent mobile experience
- [ ] **Accessibility enhanced**: Better focus management or screen reader experience
- [ ] **Performance optimized**: Smaller CSS footprint

## 📝 Review Comments Template

### Approval Template

```
✅ **APPROVED** - Spacing Standards Compliant

**Tested:**
- [ ] Desktop (Chrome, Safari)
- [ ] Mobile (iPhone viewport)
- [ ] All component tests pass

**Highlights:**
- Consistent 32px section gaps
- Proper semantic token usage
- No DaisyUI conflicts
- Good mobile responsiveness

**Notes:** [Any specific observations]
```

### Revision Request Template

```
🔄 **NEEDS REVISION** - Spacing Issues Found

**Issues to Address:**
- [ ] Issue 1: [Specific problem and location]
- [ ] Issue 2: [Specific problem and location]

**Testing Requirements:**
- [ ] Mobile responsiveness check
- [ ] Component tests must pass
- [ ] Visual regression comparison

**Resources:**
- [Link to spacing standards]
- [Link to specific guideline]
```

## 🎯 Success Metrics

### Quantitative Goals

- [ ] **Zero failing tests** after spacing changes
- [ ] **Build time unchanged** (±5% tolerance)
- [ ] **Bundle size stable** (±1% tolerance)
- [ ] **No accessibility violations** in automated testing

### Qualitative Goals

- [ ] **Visual hierarchy improved** compared to baseline
- [ ] **Developer experience enhanced** with semantic tokens
- [ ] **Maintenance burden reduced** through consistency
- [ ] **User experience maintained** or improved

---

## 🔗 Related Resources

- [Spacing Standards Guide](./spacing-standards.md)
- [Migration Guide](./spacing-migration-guide.md)
- [Quick Reference](./spacing-quick-reference.md)
- [Component Testing Guide](../testing/README.md)

---

_Use this checklist for all PRs involving spacing changes_  
_Updated for Sprint: UI Spacing Standardization_
