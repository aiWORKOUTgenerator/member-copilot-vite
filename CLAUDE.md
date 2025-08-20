# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
# Development
npm run dev              # Start development server (Vite)
npm run build            # TypeScript compilation + Vite build
npm run preview          # Preview production build

# Quality Assurance
npm run verify           # Full verification: lint + format + type check + tests + build
npm run verify:quick     # Quick verification: lint + type check + tests + build
npm run lint             # ESLint with accessibility rules
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without fixing

# Testing
npm run test:run         # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:fast        # Run unit tests only (hooks, components, services)
npm run test:integration # Run integration tests only
```

### Pre-commit Requirements

Always run `npm run verify` before committing. The project has Husky hooks that enforce this.

## Architecture Overview

This is a React TypeScript frontend application using **Clean Architecture** with domain-driven design principles.

### Core Architecture Layers

```
src/
├── domain/           # Business entities, interfaces, value objects
├── services/         # Implementation layer for domain interfaces
├── contexts/         # React Context for dependency injection
├── modules/          # Feature-based modules (dashboard, workouts, etc.)
├── ui/               # Atomic design component library
└── hooks/            # Custom React hooks
```

### Key Architectural Patterns

1. **Domain-Driven Design**: Business logic isolated in `domain/` layer
2. **Dependency Injection**: Via React Context providers
3. **Atomic Design**: UI components organized as atoms/molecules/organisms/templates
4. **Module-Based Features**: Self-contained feature modules with their own containers

### Service Layer Pattern

- Domain interfaces defined in `domain/interfaces/services/`
- Implementations in `services/` folders
- Accessed via typed hooks: `useAttributeService()`, `useApiService()`

## Technology Stack

### Required Technologies

- **TypeScript**: Strict typing, no `any` types allowed
- **React 19**: Functional components with hooks only
- **Tailwind CSS + DaisyUI**: Only styling system (no custom CSS)
- **Clerk**: Authentication provider
- **React Router v7**: Routing
- **Vitest**: Testing framework
- **Vite**: Build tool

### Important Constraints

- No Node.js server code in frontend files
- No class components (functional only)
- No CSS-in-JS or custom CSS files
- Use DaisyUI semantic classes: `btn`, `card`, `input`, etc.

## Component Organization

### UI Component Structure

```
src/ui/shared/
├── atoms/          # Button, Input, Icon, LoadingState
├── molecules/      # Card, FormField, DetailedSelector
├── organisms/      # FormContainer, PageHeader, ErrorBoundary
└── templates/      # PageLayout, StackedLayout
```

### Component Standards

- Use named exports for reusable components
- Use default exports only for page components
- Extend HTML element types for props
- Include JSDoc comments for props

## Module Structure

Each feature module follows this pattern:

```
modules/feature/
├── FeatureContainer.tsx    # Provider wrapper
├── pages/                  # Page components (default exports)
├── components/             # Feature-specific components (named exports)
└── utils/                  # Feature utilities
```

## Testing Strategy

### Current Status

- Test Coverage: 3.43% (target: 80%+)
- 25 passing tests
- Testing framework: Vitest + React Testing Library

### Testing Commands

```bash
npm run test:run             # All tests
npm run test:fast            # Unit tests only
npm run test:integration     # Integration tests only
npm run test:coverage        # With coverage report
```

### Test Organization

```
src/
├── __tests__/          # Test files
├── test/               # Test utilities and setup
└── __mocks__/          # Mock implementations
```

## Authentication (Clerk)

Use the auth service wrapper:

```typescript
const { isSignedIn, isLoaded } = useAuth();

if (!isLoaded) return <LoadingState />;
if (!isSignedIn) return <Navigate to="/sign-in" />;
```

## Quality Standards

### Pre-PR Checklist

1. Run `npm run verify` (must pass)
2. Ensure TypeScript strict mode compliance
3. No ESLint accessibility warnings in new code
4. Test coverage for new features
5. Follow existing component patterns

### Known Issues

- 54 accessibility warnings (being addressed)
- Test coverage at 3.43% (improvement in progress)

## Key Development Patterns

### Context Provider Pattern

```typescript
export function FeatureProvider({ children }: { children: ReactNode }) {
  const service = useFeatureService();
  const [data, setData] = useState<FeatureData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FeatureContext.Provider value={{ data, isLoading, refetch }}>
      {children}
    </FeatureContext.Provider>
  );
}
```

### Component Props Pattern

```typescript
interface ComponentProps extends HTMLAttributes<HTMLDivElement> {
  /** Description of prop */
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const Component: React.FC<ComponentProps> = ({
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <div className={`base-classes ${variant} ${className}`} {...props}>
      {children}
    </div>
  );
};
```

## Important Notes

- Always check existing patterns before implementing new features
- Follow the domain-service-context-UI layer separation
- Use TypeScript strictly - no `any` types
- Prefer DaisyUI components over custom implementations
- Write tests for new functionality
