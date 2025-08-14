# Pre-PR Verification System - Developer Checklist

**Date:** January 2025  
**Status:** Active Checklist  
**Owner:** Development Team

## Overview

This comprehensive checklist ensures code quality and catches issues before committing and pushing code. Use this checklist systematically to maintain a healthy codebase and prevent CI failures.

## 🚀 Quick Start Checklist

Before committing any code, run through this checklist:

### Essential Pre-Commit Checks

```bash
# 1. Quick verification (2-3 minutes)
npm run verify:quick

# 2. Full verification (5-10 minutes)
npm run verify

# 3. Manual checks (see sections below)
```

## 📋 Comprehensive Pre-Commit Checklist

### Phase 1: Code Quality & Formatting ⚡ (1-2 minutes)

#### ✅ Code Formatting

- [ ] **Prettier Check**: `npm run format:check`
  - If fails: `npm run format` to auto-fix
- [ ] **Manual Review**: Scan for consistent indentation and spacing
- [ ] **Import Organization**: Verify imports are organized (auto-sorted by ESLint)

#### ✅ Linting

- [ ] **ESLint**: `npm run lint`
  - Fix all errors (warnings can be addressed later)
  - Pay attention to React hooks rules
  - Verify no `any` types are introduced
- [ ] **Manual Code Review**:
  - [ ] No commented-out code blocks
  - [ ] No console.log statements (except intentional logging)
  - [ ] No TODO comments without tickets
  - [ ] Meaningful variable and function names

### Phase 2: Type Safety & Compilation ⚡ (1-2 minutes)

#### ✅ TypeScript Compilation

- [ ] **Type Check**: `npx tsc --noEmit`
  - Zero TypeScript errors allowed
  - Address all type mismatches
  - Verify proper interface definitions
- [ ] **Import Verification**:
  - [ ] All imports resolve correctly
  - [ ] No circular dependencies
  - [ ] Proper barrel exports used

### Phase 3: Testing & Coverage 🧪 (3-5 minutes)

#### ✅ Unit Tests

- [ ] **Test Execution**: `npm run test:run`
  - All tests must pass
  - No skipped tests without justification
- [ ] **New Tests**: If adding new functionality:
  - [ ] Unit tests for new functions/components
  - [ ] Integration tests for complex features
  - [ ] Mock external dependencies properly

#### ✅ Test Coverage

- [ ] **Coverage Check**: `npm run test:coverage`
  - Meet minimum thresholds (currently 1%, targeting 80%)
  - Critical components should have higher coverage
- [ ] **Coverage Review**:
  - [ ] New code is covered by tests
  - [ ] Edge cases are tested
  - [ ] Error handling is tested

### Phase 4: Build & Runtime Verification 🏗️ (2-3 minutes)

#### ✅ Build Process

- [ ] **Development Build**: `npm run build`
  - Build completes without errors
  - No build warnings for new code
  - Bundle size hasn't increased significantly
- [ ] **Build Output Review**:
  - [ ] Check console for any warnings
  - [ ] Verify all assets are included
  - [ ] No missing dependencies

#### ✅ Runtime Verification

- [ ] **Development Server**: `npm run dev`
  - [ ] Application starts without errors
  - [ ] No console errors in browser
  - [ ] New features work as expected
  - [ ] Existing functionality still works
- [ ] **Environment Variables**:
  - [ ] Use `import.meta.env` for Vite (not `process.env`)
  - [ ] All required env vars are documented
  - [ ] Feature flags work correctly

### Phase 5: Security & Dependencies 🔒 (1-2 minutes)

#### ✅ Security Audit

- [ ] **Dependency Audit**: `npm audit`
  - Zero high/critical vulnerabilities
  - Address moderate vulnerabilities if possible
- [ ] **Dependency Review**:
  - [ ] No unnecessary dependencies added
  - [ ] Dependencies are up to date
  - [ ] Lock file is committed

#### ✅ Code Security

- [ ] **Manual Security Review**:
  - [ ] No hardcoded secrets or API keys
  - [ ] Input validation for user data
  - [ ] Proper authentication checks
  - [ ] No XSS vulnerabilities

### Phase 6: Performance & Accessibility 🚀 (2-3 minutes)

#### ✅ Performance Checks

- [ ] **Bundle Analysis** (for significant changes):
  - [ ] Bundle size impact assessment
  - [ ] No unnecessary re-renders
  - [ ] Proper memoization where needed
- [ ] **Runtime Performance**:
  - [ ] Fast initial load
  - [ ] Smooth interactions
  - [ ] No memory leaks in tests

#### ✅ Accessibility

- [ ] **Manual A11y Check**:
  - [ ] Proper heading hierarchy
  - [ ] Alt text for images
  - [ ] Keyboard navigation works
  - [ ] Focus management is correct
  - [ ] Color contrast is sufficient

### Phase 7: Feature-Specific Checks 🎯 (varies)

#### ✅ Component Development

- [ ] **Component Checklist**:
  - [ ] Props have proper TypeScript interfaces
  - [ ] Component is properly memoized if needed
  - [ ] Error boundaries handle edge cases
  - [ ] Loading states are implemented
  - [ ] Responsive design works

#### ✅ Hook Development

- [ ] **Hook Checklist**:
  - [ ] Follows React hooks rules
  - [ ] Proper dependency arrays
  - [ ] Cleanup functions for subscriptions
  - [ ] Error handling implemented

#### ✅ API Integration

- [ ] **API Checklist**:
  - [ ] Proper error handling
  - [ ] Loading states
  - [ ] Type safety for responses
  - [ ] Authentication headers included

### Phase 8: Documentation & Communication 📝 (1-2 minutes)

#### ✅ Code Documentation

- [ ] **Inline Documentation**:
  - [ ] JSDoc comments for public APIs
  - [ ] Complex logic is commented
  - [ ] README updates if needed
- [ ] **Change Documentation**:
  - [ ] Update relevant documentation
  - [ ] Note breaking changes
  - [ ] Update migration guides if needed

## 🛠️ Automated Tools & Scripts

### Available npm Scripts

```bash
# Quick checks (essential)
npm run verify:quick          # Lint + TypeCheck + Test + Build
npm run verify               # Full verification including formatting

# Individual checks
npm run lint                 # ESLint check
npm run lint:fix            # ESLint with auto-fix
npm run format              # Prettier format
npm run format:check        # Prettier check only
npm run test:run            # Run all tests
npm run test:coverage       # Test with coverage report
npm run build               # Production build
npm run dev                 # Development server

# Security & dependencies
npm audit                   # Security vulnerability check
npm outdated                # Check for outdated packages
```

### Husky Git Hooks (Automated)

The following checks run automatically:

**Pre-commit Hook:**

- ESLint with auto-fix
- Prettier formatting check
- Staged files only (via lint-staged)

**Pre-push Hook:**

- Full test suite
- TypeScript compilation
- Build verification
- Linting check

### IDE Integration

**VSCode Extensions (Recommended):**

- ESLint
- Prettier
- TypeScript Importer
- Error Lens
- GitLens

**Settings for VSCode (`.vscode/settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🚨 Common Issues & Quick Fixes

### TypeScript Errors

```bash
# Issue: Type errors
# Fix: Run type check and fix issues
npx tsc --noEmit

# Issue: Missing types for packages
# Fix: Install type definitions
npm install --save-dev @types/package-name
```

### ESLint Errors

```bash
# Issue: Linting errors
# Fix: Auto-fix what's possible
npm run lint:fix

# Issue: React hooks rules violation
# Fix: Move hooks to top level, avoid conditional calls
```

### Test Failures

```bash
# Issue: Tests failing
# Fix: Run tests in watch mode for debugging
npm run test

# Issue: Outdated snapshots
# Fix: Update snapshots
npm run test -- --update-snapshots
```

### Build Failures

```bash
# Issue: Build fails
# Fix: Check for missing dependencies or type errors
npm run build 2>&1 | grep -i error

# Issue: Environment variables not found
# Fix: Use import.meta.env instead of process.env
```

### Git Hook Failures

```bash
# Issue: Pre-commit hook failing
# Fix: Run checks manually and fix issues
npm run lint:fix && npm run format

# Issue: Pre-push hook failing
# Fix: Run full verification
npm run verify
```

## 📊 Quality Metrics & Thresholds

### Current Standards

| Metric                   | Current         | Target | Critical               |
| ------------------------ | --------------- | ------ | ---------------------- |
| Test Coverage            | 1%              | 80%    | 90% for critical paths |
| TypeScript Errors        | 0               | 0      | 0                      |
| ESLint Errors            | 0               | 0      | 0                      |
| Build Time               | <30s            | <20s   | <60s                   |
| Bundle Size              | ~1.15MB         | <1.5MB | <2MB                   |
| Security Vulnerabilities | 0 high/critical | 0      | 0                      |

### Performance Budgets

```javascript
// Performance thresholds
const PERFORMANCE_BUDGETS = {
  // Bundle size limits
  maxBundleSize: '1.5MB',
  maxChunkSize: '500KB',

  // Runtime performance
  maxInitialLoad: '3s',
  maxInteractionDelay: '100ms',

  // Memory usage
  maxMemoryIncrease: '5MB',
};
```

## 🎯 Project-Specific Checklist Items

### Member Copilot Specific Checks

#### ✅ Feature Flag Implementation

- [ ] **Environment Variables**: Use `VITE_` prefix for Vite compatibility
- [ ] **Fallback Components**: Legacy components available for rollback
- [ ] **Feature Flag Logic**: Proper boolean checks (`=== 'true'`)

#### ✅ Component Architecture

- [ ] **Clean Architecture**: Follow domain/services/contexts pattern
- [ ] **Atomic Design**: Components in correct atoms/molecules/organisms structure
- [ ] **Feature First**: Components organized by feature, not by type

#### ✅ Styling Standards

- [ ] **Tailwind + DaisyUI**: Only approved styling system
- [ ] **No Custom CSS**: Use utility classes only
- [ ] **Responsive Design**: Mobile-first approach with breakpoints

#### ✅ Analytics Integration

- [ ] **Event Tracking**: User interactions tracked with meaningful names
- [ ] **Analytics Hooks**: Use `useAnalytics()` hook pattern
- [ ] **Data Privacy**: No sensitive data in analytics events

#### ✅ Authentication (Clerk)

- [ ] **Auth Checks**: Use `useAuth()` hook wrapper
- [ ] **Protected Routes**: `<AuthRequired>` component for protected pages
- [ ] **Loading States**: Handle `isLoaded` state properly

## 📋 Commit Message Standards

### Format

```
type(scope): description

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(workouts): add enhanced current state step with analytics

- Implement EnhancedEnergyLevelCustomization component
- Add progressive validation with validateDetailedStep
- Integrate analytics tracking with useWorkoutAnalytics
- Support feature flag for safe rollout

Resolves: #123
```

## 🔄 Continuous Improvement

### Weekly Reviews

- [ ] Review failed CI builds and add preventive checks
- [ ] Update performance budgets based on metrics
- [ ] Review and update test coverage targets
- [ ] Assess new tools and integrate beneficial ones

### Monthly Audits

- [ ] Dependency security audit and updates
- [ ] Performance metrics review
- [ ] Documentation accuracy check
- [ ] Team feedback on checklist effectiveness

## 📚 Additional Resources

### Documentation Links

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

### Team Resources

- [Component Development Guide](../ui/shared/README.md)
- [Testing Best Practices](../testing/README.md)
- [Architecture Guidelines](../README.md)

---

## 🎯 Quick Reference Commands

```bash
# Essential pre-commit workflow
npm run lint:fix && npm run format && npx tsc --noEmit && npm run test:run && npm run build

# Quick verification
npm run verify:quick

# Full verification
npm run verify

# Fix common issues
npm run lint:fix && npm run format

# Security check
npm audit --audit-level=moderate
```

**Remember:** This checklist is a living document. Update it as the project evolves and new patterns emerge.

---

**Last Updated:** January 2025  
**Next Review:** February 2025
