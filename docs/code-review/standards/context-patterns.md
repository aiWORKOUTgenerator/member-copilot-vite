# Context API Patterns - Performance & Best Practices

This guide establishes patterns for Context API implementation to ensure optimal performance and maintainability in our React/Vite dashboard application.

## 🎯 Performance Goals

- **Zero unnecessary re-renders** from context changes
- **Memoized context values** to prevent object recreation
- **Optimized provider composition** for dependency management
- **Type-safe context consumption** with proper error handling

## 🚨 Current Performance Issues

### Issue: Context Values Not Memoized
**Problem**: Context provider values are recreated on every render, causing all consuming components to re-render unnecessarily.

**Example of Problem**:
```typescript
// ❌ BAD - Creates new object on every render
export function AttributeFormProvider({ children }) {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  // This object is recreated on every render!
  const contextValue: AttributeFormContextType = {
    formValues,
    updateFormValue,
    resetForm,
    isFormDirty,
    isValid,
    errors,
  };

  return (
    <AttributeFormContext.Provider value={contextValue}>
      {children}
    </AttributeFormContext.Provider>
  );
}
```

## ✅ Approved Context Patterns

### 1. Memoized Context Values
**Always memoize context values to prevent unnecessary re-renders**:

```typescript
// ✅ GOOD - Memoized context value
export function AttributeFormProvider({ children }: AttributeFormProviderProps) {
  const [formValues, setFormValues] = useState<AttributeFormValues>({});
  const [initialValues, setInitialValues] = useState<AttributeFormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Memoize callback functions
  const updateFormValue = useCallback(
    (key: string, value: string | number | string[] | null) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [key]: value,
      }));

      // Clear any error for this field when it's updated
      if (errors[key]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const initFormValues = useCallback(
    (contact?: Contact | null, prompts?: Prompt[]) => {
      // Implementation here
    },
    []
  );

  // Calculate derived values
  const isFormDirty = useMemo(() => 
    Object.keys(formValues).some(key => formValues[key] !== initialValues[key]),
    [formValues, initialValues]
  );

  const isValid = useMemo(() => 
    Object.keys(errors).length === 0,
    [errors]
  );

  // Memoize the entire context value
  const contextValue = useMemo<AttributeFormContextType>(() => ({
    formValues,
    updateFormValue,
    resetForm,
    initFormValues,
    isFormDirty,
    isValid,
    errors,
  }), [
    formValues,
    updateFormValue,
    resetForm,
    initFormValues,
    isFormDirty,
    isValid,
    errors,
  ]);

  return (
    <AttributeFormContext.Provider value={contextValue}>
      {children}
    </AttributeFormContext.Provider>
  );
}
```

### 2. Proper Custom Hook Implementation
**Custom hooks should provide proper error handling and type safety**:

```typescript
// ✅ GOOD - Proper custom hook with error handling
export function useAttributeForm(): AttributeFormContextType {
  const context = useContext(AttributeFormContext);

  if (context === undefined) {
    throw new Error(
      'useAttributeForm must be used within an AttributeFormProvider'
    );
  }

  return context;
}

// ✅ GOOD - Convenience hooks for specific values
export function useFormValues(): AttributeFormValues {
  const { formValues } = useAttributeForm();
  return formValues;
}

export function useFormValidation() {
  const { isValid, errors } = useAttributeForm();
  return { isValid, errors };
}
```

### 3. Context Provider Composition
**Organize providers in correct dependency order**:

```typescript
// ✅ GOOD - Proper provider composition with dependencies
export function CombinedProviders({ children }: CombinedProvidersProps) {
  return (
    <ServiceProvider>
      <TitleProvider>
        <ContactProvider>
          <AttributeTypeProvider>
            <PromptProvider>
              <AttributeProvider>
                <GeneratedWorkoutProvider>
                  <WorkoutFeedbackProvider>
                    <SubscriptionProvider>
                      <AnnouncementProvider>
                        {children}
                      </AnnouncementProvider>
                    </SubscriptionProvider>
                  </WorkoutFeedbackProvider>
                </GeneratedWorkoutProvider>
              </AttributeProvider>
            </PromptProvider>
          </AttributeTypeProvider>
        </ContactProvider>
      </TitleProvider>
    </ServiceProvider>
  );
}
```

### 4. Async Data Context Pattern
**Handle loading states and error handling consistently**:

```typescript
// ✅ GOOD - Async data context with proper states
export function ContactProvider({ children }: ContactProviderProps) {
  const contactService = useContactService();
  const { isSignedIn } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await contactService.getOrCreateContact();
      setContact(data);
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contact");
      console.error("Error fetching contact:", err);
    } finally {
      setIsLoading(false);
    }
  }, [contactService]);

  // Auth-based data management
  useEffect(() => {
    if (!isSignedIn && contact) {
      setContact(null);
      setIsLoaded(false);
    }
    if (isSignedIn && !contact) {
      fetchContact();
    }
  }, [isSignedIn, contact, fetchContact]);

  // Memoized context value with phone verification utilities
  const contextValue = useMemo<ContactState>(() => ({
    contact,
    isLoading,
    error,
    isLoaded,
    refetch: fetchContact,
    // Derived values
    isPhoneVerified: contact?.phone_verified_at !== null && 
                     contact?.phone_verified_at !== undefined,
    phoneVerificationDate: contact?.phone_verified_at
      ? new Date(contact.phone_verified_at)
      : null,
    hasPhoneNumber: Boolean(contact?.phone_number),
  }), [contact, isLoading, error, isLoaded, fetchContact]);

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
}
```

## 📋 Context Review Checklist

### Context Provider Implementation
- [ ] Context value is memoized with `useMemo`
- [ ] All callback functions are memoized with `useCallback`
- [ ] Dependencies array is complete and accurate
- [ ] Loading and error states are properly managed
- [ ] Auth-based data cleanup is implemented where needed

### Custom Hook Implementation  
- [ ] Hook throws error when used outside provider
- [ ] Error message clearly identifies the required provider
- [ ] Hook is properly typed with TypeScript
- [ ] Convenience hooks are provided for common use cases

### Performance Optimization
- [ ] Context value object is not recreated on every render
- [ ] Derived values are memoized when expensive to calculate
- [ ] Provider dependencies are correctly ordered
- [ ] No unnecessary context subscriptions

### Type Safety
- [ ] Context type is properly defined with TypeScript interface
- [ ] Context default value is `undefined` to force proper usage
- [ ] All context consuming components are properly typed

## 🚧 Common Anti-Patterns to Avoid

### ❌ Context Value Object Recreation
```typescript
// DON'T - Creates new object every render
const value = {
  data,
  isLoading,
  fetchData,
};
```

### ❌ Missing Dependency Arrays
```typescript
// DON'T - Missing dependencies
const contextValue = useMemo(() => ({
  formValues,
  updateFormValue,
})); // Missing dependency array!
```

### ❌ Putting Everything in One Context
```typescript
// DON'T - Monolithic context
interface AppContextType {
  user: User;
  contacts: Contact[];
  workouts: Workout[];
  billing: BillingInfo;
  // ... too many concerns in one context
}
```

### ❌ Not Memoizing Callbacks
```typescript
// DON'T - Function recreated every render
const updateValue = (key: string, value: any) => {
  setFormValues(prev => ({ ...prev, [key]: value }));
};
```

## 📊 Performance Monitoring

### React DevTools Profiler
Use React DevTools to monitor context performance:

1. **Profile context providers** - Look for unnecessary re-renders
2. **Check component update frequency** - Should only update when data changes
3. **Monitor render duration** - Context changes should be fast
4. **Verify memoization** - Components should not re-render when context value is stable

### Performance Metrics
- **Context provider re-renders**: Should only occur when actual data changes
- **Consumer component updates**: Should be minimal and purposeful
- **Memory usage**: Context values should not cause memory leaks

## 📚 Related Patterns

- **[Component Patterns](./component-patterns.md)** - Component memoization with React.memo
- **[Hook Patterns](./hook-patterns.md)** - Custom hook optimization
- **[Service Patterns](./service-patterns.md)** - Service integration with contexts

---

*These patterns are based on performance issues identified in the profile module code review and React best practices for Context API usage.* 