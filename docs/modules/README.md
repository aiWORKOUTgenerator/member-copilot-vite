# 🎯 Modules Documentation

The modules layer organizes the application by features and user journeys, providing clear entry points and feature boundaries.

## 📁 Structure

```
src/modules/
├── conversion/        # User onboarding and conversion flow
├── dashboard/         # Main application dashboard
├── home/             # Landing page and marketing
└── sign-in/          # Authentication and login
```

## 🎯 Purpose

- **Feature Organization**: Group related functionality together
- **User Journeys**: Map to specific user workflows
- **Entry Points**: Clear starting points for features
- **Code Splitting**: Enable lazy loading and performance optimization
- **Team Ownership**: Clear boundaries for team responsibilities

## 📋 Module Details

### 🏠 Home Module
**Purpose**: Landing page and marketing content
- **Components**: Hero sections, feature showcases
- **Pages**: HomePage
- **Entry Point**: Public-facing marketing site

### 🔐 Sign-In Module
**Purpose**: Authentication and user onboarding
- **Components**: Login forms, verification flows
- **Pages**: SignInPage, EmailOtpPage, MagicLinkPage
- **Entry Point**: User authentication journey

### 🎯 Conversion Module
**Purpose**: User onboarding and account setup
- **Components**: Sign-up forms, verification
- **Pages**: ConversionPage, SignUpPage, VerifyPage
- **Entry Point**: New user conversion flow

### 📊 Dashboard Module
**Purpose**: Main application functionality
- **Sub-modules**:
  - **Workouts** - Workout generation and management ⭐
  - **Billing** - Subscription and payment management
  - **Profile** - User profile and preferences
  - **Trainer** - AI trainer configuration

## 🎯 Workouts Sub-module (Our Focus)

The workouts module is our primary development area, containing:

### Key Components
- **WorkoutCustomization** - Workout setup interface
- **GeneratePage** - Main workout generation page
- **StepIndicator** - Step-by-step navigation
- **Quick Workout Components** - Focus, energy, duration, equipment selectors

### ⚡ Quick Workout Setup
The Quick Workout Setup is a streamlined, user-friendly interface that gets users from idea to workout generation in under 60 seconds.

#### Key Features
- **Progressive Validation**: User-friendly error handling that only shows errors when needed
- **Two-Step Process**: Focus & Energy → Duration & Equipment
- **Visual Progress**: Clear step indicator with progress tracking
- **Mobile Optimized**: Touch-friendly interface for all devices

#### User Experience
- **Empty State**: Clean interface with no premature errors
- **Partial Selection**: Progressive feedback when user has made partial selections
- **Complete Step**: Positive feedback and clear progression path
- **Smart Defaults**: Intelligent suggestions based on user context

#### Technical Implementation
- **Component**: `WorkoutCustomization` with `mode="quick"`
- **Validation**: Progressive validation with step-based logic
- **State Management**: Tracks step completion and user selections
- **Performance**: < 1 second load time, < 0.1ms validation speed

[📖 Full Quick Workout Setup Documentation](./workouts/quick-workout-setup.md)

### Recent Updates
- ✅ Step-by-step navigation with StepIndicator
- ✅ Quick workout mode with streamlined UI
- ✅ Progressive validation system
- ✅ Comprehensive test coverage
- ✅ Enhanced validation and analytics

## 🔄 Module Communication

```
Modules → Contexts → Services → Domain
   ↓         ↓         ↓         ↓
UI Layer → State → Business → Entities
```

## 🧪 Testing Strategy

- **Module Tests**: Test complete user journeys
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test full user workflows

## 🔗 Related Documentation

- [UI/Shared Documentation](../ui/shared/README.md) - Components used by modules
- [Contexts Documentation](../contexts/README.md) - State management for modules 