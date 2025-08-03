# 🎭 React Contexts Documentation

The contexts layer provides app-wide state management using React Context API, connecting services to UI components and managing global application state.

## 📁 Structure

```
src/contexts/
├── AnalyticsContext.tsx      # Analytics tracking state
├── AnnouncementContext.tsx   # Announcement management
├── AttributeContext.tsx      # User attributes and preferences
├── BillingContext.tsx        # Subscription and billing state
├── ContactContext.tsx        # User contact information
├── GeneratedWorkoutContext.tsx # Workout generation state
├── ServiceContext.tsx        # Service dependency injection
├── StripeContext.tsx         # Payment processing state
├── SubscriptionContext.tsx   # Subscription management
├── TrainerPersonaContext.tsx # AI trainer personality
├── UserAccessContext.tsx     # User permissions and access
├── VerificationContext.tsx   # Phone/email verification
├── WorkoutFeedbackContext.tsx # Workout feedback state
└── WorkoutInstancesContext.tsx # Workout session state
```

## 🎯 Purpose

- **State Management**: Centralized state for app-wide data
- **Service Integration**: Connect services to React components
- **Dependency Injection**: Provide services to components
- **Performance**: Optimize re-renders with context splitting
- **Testing**: Easy to mock and test state logic

## 🔄 Context Flow

```
Services → Contexts → Components
    ↓         ↓         ↓
API Calls → State → UI Updates
```

## 📋 Key Contexts

### Core Application State

- **ContactContext** - User profile and authentication state
- **GeneratedWorkoutContext** - Workout generation and history
- **WorkoutInstancesContext** - Active workout sessions
- **SubscriptionContext** - User subscription status

### Feature-Specific State

- **BillingContext** - Payment and billing information
- **TrainerPersonaContext** - AI trainer configuration
- **WorkoutFeedbackContext** - User feedback collection
- **VerificationContext** - Phone/email verification flow

### Utility Contexts

- **ServiceContext** - Service dependency injection
- **AnalyticsContext** - User behavior tracking
- **UserAccessContext** - Permission and access control

## 🧪 Testing Strategy

- **Mock Contexts**: Provide test data for components
- **Context Wrappers**: Easy setup for integration tests
- **State Isolation**: Test individual context logic

## 🔗 Related Documentation

- [Services Documentation](../services/README.md) - Services consumed by contexts
- [Modules Documentation](../modules/README.md) - How contexts are used in features 