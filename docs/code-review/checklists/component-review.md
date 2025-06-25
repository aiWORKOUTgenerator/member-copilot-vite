# Component Review Checklist

Use this checklist when reviewing React components in the dashboard application. This checklist is based on common issues found in code reviews and React best practices.

## 📋 Pre-Review Setup

- [ ] **Component file location** - Verify component is in correct directory
- [ ] **Naming convention** - Component name matches file name and export
- [ ] **File structure** - Related files (types, styles, tests) are co-located
- [ ] **Import organization** - Imports are organized and unused imports removed

## 🔧 Component Architecture

### Component Structure
- [ ] **Single responsibility** - Component has one clear purpose
- [ ] **Proper component function** - Uses function declaration or const with arrow function consistently
- [ ] **Props interface** - TypeScript interface defined for props
- [ ] **Export pattern** - Consistent export pattern (default vs named)

### Component Naming
- [ ] **Component name matches file** - `ProfileContainer.tsx` exports `ProfileContainer` 
- [ ] **Descriptive naming** - Component name clearly describes its purpose
- [ ] **PascalCase** - Component name follows PascalCase convention
- [ ] **Consistent naming** - Naming pattern matches project conventions

**Example Issues to Fix**:
```typescript
// ❌ BAD - Component name doesn't match export
export default function TrainingProfileLayout() // File: ProfileContainer.tsx

// ✅ GOOD - Component name matches file
export default function ProfileContainer() // File: ProfileContainer.tsx
```

## ⚡ Performance Optimization

### Memoization
- [ ] **React.memo** - Component wrapped with React.memo if it receives stable props
- [ ] **useMemo** - Expensive calculations are memoized
- [ ] **useCallback** - Functions passed to children are memoized
- [ ] **Dependency arrays** - All dependency arrays are complete and accurate

### Re-render Prevention
- [ ] **Stable props** - Props that don't change frequently are stable
- [ ] **Context optimization** - Context consumption is optimized
- [ ] **State updates** - State updates don't cause unnecessary re-renders
- [ ] **Child component optimization** - Child components are optimized for re-renders

## 🎣 Hooks Usage

### Hook Patterns
- [ ] **Custom hooks** - Business logic extracted to custom hooks where appropriate
- [ ] **Hook rules** - Hooks are only called at the top level
- [ ] **Effect dependencies** - useEffect dependencies are complete and correct
- [ ] **Cleanup functions** - useEffect cleanup functions are implemented where needed

### State Management
- [ ] **State initialization** - Initial state is properly set
- [ ] **State updates** - State updates are immutable
- [ ] **State structure** - State is normalized and well-structured
- [ ] **Context usage** - Context is used appropriately (not overused)

## 🔒 TypeScript Implementation

### Type Safety
- [ ] **Props typing** - All props are properly typed
- [ ] **State typing** - All state variables are properly typed
- [ ] **Function typing** - Functions have proper parameter and return types
- [ ] **Event handling** - Event handlers are properly typed

### Type Quality
- [ ] **No any types** - No usage of `any` type without justification
- [ ] **Type assertions** - Type assertions are validated and safe
- [ ] **Interface definitions** - Interfaces are well-defined and reusable
- [ ] **Generic usage** - Generics are used appropriately for reusability

**Example Issues to Fix**:
```typescript
// ❌ BAD - Unsafe type assertion
value: Array.isArray(value) ? value.join("::") : (value as string | number),

// ✅ GOOD - Safe type checking
value: Array.isArray(value) 
  ? value.join("::") 
  : typeof value === 'string' || typeof value === 'number' 
    ? value 
    : '',
```

## 🎨 User Interface & Styling

### DaisyUI/Tailwind Usage
- [ ] **Consistent styling** - Uses DaisyUI components consistently
- [ ] **Responsive design** - Responsive classes applied appropriately
- [ ] **Accessibility** - ARIA labels and semantic HTML used
- [ ] **Theme consistency** - Follows project theme and design system

### Loading States
- [ ] **Loading indicators** - Proper loading states for async operations
- [ ] **Loading consistency** - Loading spinner implementations are consistent
- [ ] **Loading placement** - Loading indicators are well-positioned
- [ ] **Loading accessibility** - Loading states are accessible

**Example Issues to Fix**:
```jsx
// ❌ BAD - Inconsistent loading spinner
<span className="loading loading-spinner loading-lg"></span>
<span className="loading loading-spinner loading-xs"></span>

// ✅ GOOD - Consistent loading component
<LoadingSpinner size="lg" />
<LoadingSpinner size="xs" />
```

## 🚨 Error Handling

### Error States
- [ ] **Error boundaries** - Error boundaries implemented where appropriate
- [ ] **Error display** - Errors are displayed to users appropriately
- [ ] **Error recovery** - Users can recover from error states
- [ ] **Error logging** - Errors are properly logged (not with console.log)

### Form Validation
- [ ] **Validation implementation** - Real validation logic is implemented
- [ ] **Validation feedback** - Users receive clear validation feedback
- [ ] **Validation timing** - Validation occurs at appropriate times
- [ ] **Validation accessibility** - Validation messages are accessible

**Critical Issues to Fix**:
```typescript
// ❌ CRITICAL - No real validation
validationMessage={""}
isValid={true}

// ✅ GOOD - Real validation
validationMessage={errors[field] || ""}
isValid={!errors[field]}
```

## 🔧 Data Handling

### Props and Data Flow
- [ ] **Props validation** - Props are validated and have defaults where appropriate
- [ ] **Data transformation** - Data is transformed safely
- [ ] **Prop drilling** - Props are not drilled through multiple levels unnecessarily
- [ ] **Data normalization** - Data is normalized and well-structured

### API Integration
- [ ] **Loading states** - API calls have proper loading states
- [ ] **Error handling** - API errors are handled gracefully
- [ ] **Data caching** - Data is cached appropriately
- [ ] **Optimistic updates** - Optimistic updates are implemented where appropriate

## 🧪 Testing Considerations

### Testability
- [ ] **Pure functions** - Functions are pure and easily testable
- [ ] **Mocking points** - External dependencies can be mocked
- [ ] **Test data** - Component works with various data scenarios
- [ ] **Edge cases** - Component handles edge cases gracefully

### Test Coverage
- [ ] **Unit tests** - Component has unit tests
- [ ] **Integration tests** - Component integration is tested
- [ ] **Accessibility tests** - Accessibility features are tested
- [ ] **Visual tests** - Visual regression tests are considered

## 🚧 Development Quality

### Code Cleanliness
- [ ] **No console.log** - No console.log statements in production code
- [ ] **No commented code** - No commented-out code blocks
- [ ] **No TODO comments** - No unresolved TODO comments
- [ ] **No debug code** - No debug code or temporary hacks

**Critical Issues to Fix**:
```typescript
// ❌ CRITICAL - Remove before deployment
console.log("Debug info:", data);
// TODO: Fix this later
// const oldImplementation = () => {};
```

### Documentation
- [ ] **Component documentation** - Component purpose and usage documented
- [ ] **Props documentation** - Props are documented with JSDoc
- [ ] **Complex logic** - Complex logic has explanatory comments
- [ ] **Type documentation** - Complex types are documented

## 📊 Review Scoring

Rate each section (1-5 scale):
- **Architecture**: ___/5
- **Performance**: ___/5  
- **TypeScript**: ___/5
- **UI/Styling**: ___/5
- **Error Handling**: ___/5
- **Data Handling**: ___/5
- **Code Quality**: ___/5

**Overall Score**: ___/35

### Scoring Guide
- **5**: Excellent - Follows all best practices
- **4**: Good - Minor improvements needed
- **3**: Average - Some issues to address
- **2**: Below Average - Major improvements needed
- **1**: Poor - Significant rework required

## 🚨 Blocking Issues

**Do not approve if any of these critical issues exist:**
- [ ] Console.log statements in production code
- [ ] Hardcoded validation props (isValid={true})
- [ ] Unsafe type assertions without validation
- [ ] Missing error handling for async operations
- [ ] Context values not memoized (performance issue)

---

*This checklist is based on common issues found in the profile module code review and React best practices.* 