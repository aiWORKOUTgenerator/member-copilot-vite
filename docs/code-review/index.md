# Code Review Guidelines - React/Vite Dashboard

This section provides comprehensive guidance for conducting code reviews in our React/Vite TypeScript dashboard application.

## 🎯 Quick Navigation for Reviewers

### By What You're Reviewing
- **[React Components](./by-location/components/index.md)** - Component architecture and patterns
- **[Context API](./by-location/contexts/index.md)** - State management implementation
- **[Custom Hooks](./by-location/hooks/index.md)** - Hook patterns and performance
- **[Services](./by-location/services/index.md)** - API service layer implementation
- **[TypeScript Files](./by-file-type/typescript.md)** - Type safety and consistency

### By Feature Area
- **[Profile Forms](./by-feature/profile-forms/index.md)** - Training profile form implementation
- **[Dashboard Navigation](./by-feature/dashboard-navigation/index.md)** - Routing and navigation patterns
- **[Authentication](./by-feature/authentication/index.md)** - Clerk integration patterns

### By Priority Level
- **[Critical Issues](./critical-issues/index.md)** - Must-fix problems before deployment
- **[Performance Issues](./performance/index.md)** - React performance optimization
- **[Security Review](./security/index.md)** - Authentication and data protection

## 🚨 Current Critical Issues

Based on recent profile module review:

| Issue | Location | Impact | Action Required |
|-------|----------|--------|----------------|
| **No Form Validation** | `AttributeForm.tsx:127-128` | 🚨 Critical | Implement real validation logic |
| **Console Logs in Production** | `AttributeFormContext.tsx:83-99` | 🚨 Critical | Remove all console.log statements |
| **Context Performance** | Multiple contexts | ⚠️ High | Add memoization to prevent re-renders |
| **Unsafe Type Assertions** | `AttributeForm.tsx:64-67` | ⚠️ High | Add proper type validation |

## 📋 Review Checklists

### Quick Pre-Commit Checklist
- [ ] No `console.log` statements in production code
- [ ] All Context values are memoized
- [ ] Form validation is implemented and working
- [ ] TypeScript strict mode passes without errors
- [ ] Components are properly typed
- [ ] Error handling is implemented

### Pull Request Review Checklist
- [ ] **[Component Review](./checklists/component-review.md)** - Architecture and patterns
- [ ] **[Context API Review](./checklists/context-review.md)** - State management quality
- [ ] **[Performance Review](./checklists/performance-review.md)** - React optimization
- [ ] **[TypeScript Review](./checklists/typescript-review.md)** - Type safety compliance
- [ ] **[Security Review](./checklists/security-review.md)** - Auth and data protection

## 🔧 Standards & Patterns

### Approved Patterns
- **[Context API Patterns](./standards/context-patterns.md)** - Memoization and performance
- **[Component Patterns](./standards/component-patterns.md)** - React best practices
- **[Hook Patterns](./standards/hook-patterns.md)** - Custom hook implementation
- **[Service Patterns](./standards/service-patterns.md)** - API service architecture

### Code Quality Metrics
- **Context Performance**: All context values must be memoized
- **Type Safety**: Strict TypeScript with no type assertions without validation
- **Error Handling**: All async operations must have proper error handling
- **Form Validation**: All form inputs must have real validation logic

## 🆘 Common Issues & Solutions

### Frequently Flagged Problems
1. **[Context Re-render Issues](./common-issues/context-performance.md)** - Missing memoization
2. **[Form Validation Problems](./common-issues/form-validation.md)** - Hardcoded validation props
3. **[Development Artifacts](./common-issues/development-artifacts.md)** - Console logs and debug code
4. **[Type Safety Issues](./common-issues/type-safety.md)** - Unsafe assertions and loose typing

### Quick Fix Guides
- **[Remove Development Artifacts](./quick-fixes/development-artifacts.md)** - Clean up console logs
- **[Fix Context Performance](./quick-fixes/context-memoization.md)** - Add proper memoization
- **[Implement Form Validation](./quick-fixes/form-validation.md)** - Replace hardcoded validation

---

*This guide is based on findings from the Profile Module code review and reflects current project standards.* 