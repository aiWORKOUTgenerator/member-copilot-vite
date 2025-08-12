# Spacing Migration Strategy

## Migration Approach

Incremental, risk-based migration focusing on high-impact issues while preserving system stability.

## Component Priority Matrix

### 🔴 High Priority (Day 2)

**Immediate fixes required**

| Component                  | Issue                  | Risk Level | Effort  |
| -------------------------- | ---------------------- | ---------- | ------- |
| `WorkoutCustomization.tsx` | 56px gap (mb-6 + mt-8) | Medium     | 4 hours |

### 🟡 Medium Priority (Future Sprint)

**Visible improvements, lower risk**

| Component              | Opportunity                   | Risk Level | Effort  |
| ---------------------- | ----------------------------- | ---------- | ------- |
| `PageLayout.tsx`       | Standardize container spacing | Low        | 2 hours |
| `SelectionSummary.tsx` | Use semantic gap tokens       | Low        | 1 hour  |
| `StackedLayout.tsx`    | Template spacing consistency  | Medium     | 3 hours |

### 🟢 Low Priority (As Needed)

**Stable components - only change if issues arise**

| Component           | Status                         | Action        |
| ------------------- | ------------------------------ | ------------- |
| `StepIndicator.tsx` | Already uses custom properties | ✅ Keep as-is |
| `Button.tsx`        | DaisyUI handles spacing        | ✅ Keep as-is |
| `Input.tsx`         | DaisyUI form spacing           | ✅ Keep as-is |

## Migration Checklist

### Pre-Migration (Required for each component)

- [ ] **Visual baseline**: Screenshot current appearance
- [ ] **Code review**: Identify all spacing classes
- [ ] **Test coverage**: Ensure component tests exist
- [ ] **Dependencies**: Check what components use this one

### During Migration

- [ ] **Semantic mapping**: Map current spacing to semantic tokens
- [ ] **Incremental changes**: One spacing type at a time
- [ ] **Visual verification**: Compare against baseline
- [ ] **Responsive testing**: Mobile, tablet, desktop

### Post-Migration

- [ ] **Regression testing**: Run component tests
- [ ] **Visual review**: Compare final vs baseline
- [ ] **Documentation**: Update component docs if needed
- [ ] **Code review**: Get team approval

## Rollback Procedures

### If Visual Regression Detected

1. **Immediate**: Revert the specific spacing change
2. **Analyze**: Understand why the token doesn't work
3. **Document**: Record the exception and reasoning
4. **Alternative**: Use hardcoded value with comment

### If Build Breaks

1. **Check syntax**: Ensure token names are correct
2. **Verify tokens**: Confirm they exist in @theme
3. **Fallback**: Use standard Tailwind classes temporarily

### If Tests Fail

1. **Snapshot updates**: Update if visual changes are intentional
2. **Logic issues**: Check if spacing affects component behavior
3. **Accessibility**: Ensure spacing doesn't break a11y

## Component-Specific Migration Plans

### WorkoutCustomization.tsx (Day 2 - 4 hours)

**Current Issues**:

```tsx
// Lines 478, 680, 683 - Creates 56px gaps
<div className="mb-6 workout-customization-container">
<div className="mt-8">
```

**Migration Steps**:

1. **Replace mb-6 with mb-section** (1 hour)
   - Lines 478, 680, 683, 822
   - Test each change individually

2. **Remove conflicting mt-8** (1 hour)
   - Line 739, 769
   - Verify section separation maintained

3. **Visual testing** (1.5 hours)
   - Mobile: iPhone 12/13 viewport
   - Desktop: 1920x1080 viewport
   - Compare against baseline screenshots

4. **Component testing** (0.5 hours)
   - Run WorkoutCustomization tests
   - Update snapshots if needed

**Expected Outcome**: 56px → 32px consistent section gaps

### PageLayout.tsx (Future Sprint - 2 hours)

**Current Patterns**:

```tsx
<div className="min-h-screen py-8 ${bgColor} ${className}">
  <div className="container mx-auto px-4">
```

**Migration Plan**:

1. Replace `py-8` with `py-section`
2. Consider `px-4` → `px-element` for consistency
3. Test with different content types

### SelectionSummary.tsx (Future Sprint - 1 hour)

**Current Pattern**:

```tsx
<div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
```

**Migration Plan**:

1. Replace `gap-2` with `gap-tight`
2. Verify badge spacing remains appropriate
3. Test with different selection counts

## Risk Mitigation Strategies

### High-Risk Components

- **Large components** (>500 lines): Break changes into smaller commits
- **Core layouts**: Test extensively across all page types
- **Form components**: Verify accessibility isn't affected

### Medium-Risk Components

- **Shared molecules**: Test in multiple contexts
- **Template components**: Check all usage locations
- **Complex layouts**: Mobile responsiveness priority

### Low-Risk Components

- **Atoms**: Usually safe, minimal dependencies
- **Display components**: Visual-only changes
- **Utility components**: Limited scope

## Testing Strategy

### Visual Regression Testing

```bash
# Manual testing checklist
1. npm run dev
2. Navigate to component in Storybook/app
3. Compare mobile/desktop views
4. Check edge cases (long text, many items)
5. Verify animations still work
```

### Automated Testing

```bash
# Run component tests
npm run test -- WorkoutCustomization

# Run integration tests
npm run test:integration

# Check for TypeScript errors
npm run type-check
```

### Cross-Browser Testing

- **Chrome**: Primary development browser
- **Safari**: iOS compatibility
- **Firefox**: Alternative engine validation

## Success Metrics

### Quantitative Goals

- [ ] WorkoutCustomization gap: 56px → 32px ✅
- [ ] Zero failing tests after migration ✅
- [ ] Build time unchanged (±5%) ✅
- [ ] Bundle size unchanged (±1%) ✅

### Qualitative Goals

- [ ] Consistent visual rhythm ✅
- [ ] Improved developer experience ✅
- [ ] Clear documentation for future use ✅
- [ ] Team confidence in spacing decisions ✅

## Lessons Learned (Post-Implementation)

### What Worked Well

- [ ] Incremental approach reduced risk
- [ ] Semantic tokens improved code clarity
- [ ] Documentation prevented confusion

### What Could Improve

- [ ] Earlier visual testing would have caught X
- [ ] More automated testing for spacing changes
- [ ] Better communication about breaking changes

### Future Recommendations

- [ ] Consider spacing linting rules
- [ ] Automated visual regression testing
- [ ] Regular spacing audits (quarterly)

---

## Emergency Contacts

**If you encounter issues during migration:**

- Check this guide first
- Review component tests
- Compare against baseline screenshots
- Document any exceptions with reasoning

**Remember**: It's better to leave working code alone than to introduce regressions. When in doubt, don't migrate.

---

_Migration strategy prepared for Sprint Implementation_  
_Risk Level: LOW - Surgical changes only_
