# 🏗️ Domain Layer Documentation

The domain layer contains pure business entities, interfaces, and value objects that represent the core business logic of the Member Copilot application.

## 📁 Structure

```
src/domain/
├── entities/        # Business entities (Contact, Workout, etc.)
├── interfaces/      # Service contracts & API interfaces
└── value-objects/   # Immutable value objects
```

## 🎯 Purpose

- **Business Logic**: Pure domain logic independent of UI or infrastructure
- **Type Safety**: Strong TypeScript interfaces for business concepts
- **Testability**: Easy to unit test without external dependencies
- **Reusability**: Can be used across different parts of the application

## 📋 Key Entities

### Core Business Entities

- **Contact** - User contact information and profile
- **GeneratedWorkout** - AI-generated workout plans
- **WorkoutInstance** - Individual workout sessions
- **WorkoutFeedback** - User feedback on workouts
- **TrainerPersona** - AI trainer personality and style
- **Subscription** - User subscription and billing information

### Value Objects

- **WorkoutParams** - Immutable workout configuration
- **MeteredUsage** - Usage tracking for billing
- **PhoneVerification** - Phone number verification state

## 🔗 Related Documentation

- [Services Documentation](../services/README.md) - How domain entities are used in services
- [Modules Documentation](../modules/README.md) - How domain entities are consumed by features 