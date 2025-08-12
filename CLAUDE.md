# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript frontend application for AI-powered workout generation using Clean Architecture principles with domain-driven design. The application uses Clerk for authentication, Stripe for billing, and follows strict quality assurance standards.

## Development Commands

### Core Development

```bash
npm run dev              # Start development server (Vite)
npm run build            # Build for production (TypeScript + Vite)
npm run preview          # Preview production build
```

### Code Quality

```bash
npm run verify           # Full verification: lint + format + typecheck + tests + build
npm run verify:quick     # Quick verification: lint + typecheck + tests + build
npm run lint             # Run ESLint with accessibility rules
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted correctly
```

### Testing

```bash
npm run test:run         # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Run tests with coverage report
npm run test:fast        # Run only unit tests (hooks, components, services)
npm run test:integration # Run integration tests
npm run test:ci          # Run fast tests + coverage (for CI)
```

## Architecture

### Clean Architecture Structure

```
src/
├── domain/              # Core business logic
│   ├── entities/        # Business entities (User, Workout, etc.)
│   ├── interfaces/      # Service interfaces and contracts
│   └── value-objects/   # Immutable value objects
├── services/            # Service implementations
├── contexts/            # React Context providers for dependency injection
├── modules/             # Feature-based modules
│   ├── home/           # Marketing/landing pages
│   ├── sign-in/        # Authentication flows
│   ├── conversion/     # User onboarding
│   └── dashboard/      # Main application features
├── ui/shared/          # Reusable UI components (Atomic Design)
├── hooks/              # Custom React hooks
└── test/               # Test utilities and setup
```

### Dependency Injection Pattern

The application uses React Context for dependency injection:

- **Service Layer**: Implementations of domain interfaces in `services/`
- **Context Layer**: React providers that inject services into components
- **Hook Layer**: Typed hooks like `useUserService()`, `useApiService()`

### Component Organization (Atomic Design)

- **Atoms** (`ui/shared/atoms/`): Basic elements (Button, Input, Icon)
- **Molecules** (`ui/shared/molecules/`): Composed components (Card, FormField)
- **Organisms** (`ui/shared/organisms/`): Complex compositions (FormContainer, PageHeader)
- **Templates** (`ui/shared/templates/`): Layout components (PageLayout, StackedLayout)

## Technology Stack

### Required Technologies

- **TypeScript**: Strict typing, no `any` types allowed
- **React 19**: Functional components with hooks only
- **Tailwind CSS + DaisyUI**: Only styling system allowed
- **Vite**: Build tool and dev server with `@` alias pointing to `/src`
- **Clerk**: Authentication provider
- **React Router v7**: Client-side routing
- **Vitest**: Testing framework with jsdom environment
- **ESLint**: Linting with accessibility rules (jsx-a11y)

### Key Dependencies

- `@clerk/clerk-react` - Authentication
- `@stripe/react-stripe-js` - Payment processing
- `@heroicons/react` + `lucide-react` - Icons
- `react-markdown` - Markdown rendering
- `pusher-js` - Real-time notifications

## Code Standards

### TypeScript Rules

- **Never use `any`** - use proper interfaces or `unknown`
- Use strict TypeScript configuration
- All components must have typed props interfaces
- Extend HTML element types for component props: `extends ButtonHTMLAttributes<HTMLButtonElement>`

### React Patterns

- Functional components with hooks only (no class components)
- Use `memo()`, `useCallback()`, `useMemo()` for performance
- Context providers should handle loading/error states
- Custom hooks for each service: `useUserService()`, `useApiService()`

### Styling Rules

- **Required**: Only Tailwind CSS utility classes and DaisyUI components
- **Forbidden**: No custom CSS, CSS-in-JS, or inline styles
- Use DaisyUI semantic colors: `primary`, `secondary`, `accent`, etc.
- Mobile-first responsive design with `sm:`, `md:`, `lg:` prefixes

### File Naming Conventions

- Components: PascalCase (`UserCard.tsx`)
- Utilities: camelCase (`userHelpers.ts`)
- Pages: PascalCase with default exports
- Reusable components: Named exports

## Quality Assurance

### Pre-PR Requirements

Always run before committing:

```bash
npm run verify  # This runs: lint + format:check + typecheck + test:run + build
```

### Testing Standards

- Unit tests for hooks, components, services
- Integration tests for complex flows
- Test coverage thresholds enforced via Vitest
- Use React Testing Library patterns
- Mock external dependencies properly

### Current Quality Metrics

- **ESLint**: Must pass with no errors (warnings allowed temporarily for a11y)
- **TypeScript**: Strict mode, no type errors allowed
- **Tests**: 52+ tests passing
- **Build**: Must succeed without errors
- **Formatting**: Prettier must pass

## Authentication Flow

Uses Clerk for authentication with custom wrapper:

- Check `isSignedIn` before authenticated requests
- Use `isLoaded` for loading states
- Wrap protected routes with `<AuthRequired>` component
- Token management handled by `ClerkTokenProvider`

## Module Patterns

### Container Components

Each feature module has a container that wraps routes with required providers:

```typescript
export default function DashboardContainer() {
  return (
    <TitleProvider>
      <ContactProvider>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </ContactProvider>
    </TitleProvider>
  );
}
```

### Context Usage

Contexts provide typed state interfaces with loading/error handling:

```typescript
interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isLoaded: boolean;
}
```

## Common Patterns

### Loading States

Always implement loading states for async operations:

```typescript
if (!isLoaded) return <LoadingState />;
if (isLoading) return <PageLoading />;
```

### Error Boundaries

Wrap feature modules with `<ErrorBoundary>` components for graceful error handling.

### Service Integration

Use dependency injection pattern with typed hooks:

```typescript
const userService = useUserService();
const { users, isLoading, error } = useUsers();
```

## Important Notes

### Cursor Rules

This project has frontend development rules in `.cursor/rules/frontend.mdc` that enforce:

- Clean Architecture patterns
- TypeScript strict typing
- Tailwind CSS + DaisyUI only styling
- Component organization standards
- Domain-driven design principles

### Security

- Never commit secrets or API keys
- All API requests go through authenticated service layer
- Input validation on all forms
- Security audit passing (0 vulnerabilities)

### Performance

- Bundle size: ~1.1MB (307KB gzipped)
- Build time: ~6.6 seconds
- Code splitting implemented where appropriate
