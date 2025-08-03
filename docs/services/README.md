# 🔧 Services Layer Documentation

The services layer contains API implementations, business logic services, and external integrations that handle data operations and business processes.

## 📁 Structure

```
src/services/
├── analytics/           # Analytics and tracking services
├── api/                 # Core API service and token management
├── announcements/       # Announcement management
├── generated-workouts/  # Workout generation logic
├── member/             # User/member management
├── workout-feedback/   # Workout feedback processing
├── workout-instances/  # Workout session management
└── [other-services]/   # Additional business services
```

## 🎯 Purpose

- **API Integration**: Handle external API calls and data fetching
- **Business Logic**: Implement complex business processes
- **Data Transformation**: Convert between API and domain formats
- **Error Handling**: Centralized error management and retry logic
- **Mocking**: Provide mock implementations for testing

## 🔧 Key Services

### Core Services

- **ApiService** - Base API client with authentication
- **MemberService** - User profile and account management
- **GeneratedWorkoutService** - AI workout generation
- **WorkoutInstanceService** - Workout session tracking
- **WorkoutFeedbackService** - User feedback collection

### Integration Services

- **AnalyticsService** - User behavior tracking
- **PusherService** - Real-time notifications
- **StripeService** - Payment processing
- **VerificationService** - Phone/email verification

## 🧪 Testing Strategy

Each service has:
- **Implementation** - Production service logic
- **Mock Implementation** - Test-friendly mock version
- **Interface** - Contract defined in domain layer

## 🔗 Related Documentation

- [Domain Documentation](../domain/README.md) - Business entities used by services
- [Contexts Documentation](../contexts/README.md) - How services are consumed by React contexts 