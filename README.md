# Member Copilot - AI Workout Generator

A React TypeScript frontend application for AI-powered workout generation with comprehensive quality assurance and testing standards.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run quality checks
npm run verify

# Run tests
npm run test:run
```

## 🏗️ Project Architecture

This project follows **Clean Architecture** principles with domain-driven design:

```
src/
├── domain/           # Core business logic (entities, interfaces)
├── services/         # Implementation layer
├── contexts/         # React Context for dependency injection
├── modules/          # Feature-based modules
├── ui/               # Reusable UI components
└── hooks/            # Custom React hooks
```

## 🛠️ Technology Stack

- **TypeScript**: Strict typing with modern patterns
- **React 19**: Functional components with hooks
- **Tailwind CSS + DaisyUI**: Styling system
- **Vite**: Build tool and dev server
- **Clerk**: Authentication provider
- **React Router v7**: Routing
- **Vitest**: Testing framework
- **ESLint**: Code quality and accessibility

## 📋 Quality Assurance

### Pre-PR Verification System

We maintain high code quality through a comprehensive verification system:

```bash
# Full verification (lint + format + type check + tests + build)
npm run verify

# Quick verification (lint + type check + build)
npm run verify:quick

# Individual checks
npm run lint          # ESLint with accessibility rules
npm run format:check  # Prettier formatting check
npm run test:run      # Run tests with coverage
npm run build         # TypeScript + Vite build
```

### Quality Standards

- ✅ **TypeScript**: Strict configuration, no `any` types
- ✅ **ESLint**: 54 accessibility warnings (being addressed)
- ✅ **Prettier**: Consistent code formatting
- ✅ **Test Coverage**: 3.43% (target: 80%+)
- ✅ **Build**: Zero errors, production-ready
- ✅ **Husky Hooks**: Pre-commit and pre-push verification

### Current Status

- **Build**: ✅ Passing (no errors)
- **TypeScript**: ✅ Strict mode enabled
- **Tests**: ✅ 25 tests passing
- **Coverage**: ⚠️ 3.43% (needs improvement)
- **Accessibility**: ⚠️ 54 warnings (being addressed)

## 📚 Documentation

### Quality Assurance Guides

- **[Quality Assurance Overview](./docs/quality-assurance/README.md)** - Complete quality system documentation
- **[Pre-PR Verification System](./docs/quality-assurance/pre-pr-verification-system.md)** - Comprehensive verification guide
- **[Phase 1 Implementation](./docs/quality-assurance/phase-1-implementation-guide.md)** - Quick start (3 hours)
- **[Phase 2 Implementation](./docs/quality-assurance/phase-2-implementation-guide.md)** - Testing foundation (3-4 days)

### Project Documentation

- **[Developer Handoff Memo](./docs/developer-handoff-memo.md)** - Current project status and next steps
- **[Testing Guide](./test/README.md)** - Testing best practices and utilities

## 🎯 Development Workflow

### Before Committing

```bash
# Run full verification
npm run verify

# Fix any issues before committing
npm run format  # Fix formatting
npm run lint    # Check for linting issues
```

### Before Pushing

```bash
# Husky pre-push hook runs automatically
npm run verify:quick
```

### Creating a PR

1. Ensure all tests pass: `npm run test:run`
2. Check coverage: `npm run test:run -- --coverage`
3. Verify build: `npm run build`
4. Run full verification: `npm run verify`

## 🔧 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run test:run         # Run tests
npm run test:watch       # Run tests in watch mode
npm run verify           # Full verification
npm run verify:quick     # Quick verification
```

## 🏛️ Architecture Patterns

### Clean Architecture

- **Domain Layer**: Business entities and interfaces
- **Service Layer**: Implementation of domain interfaces
- **Context Layer**: React Context for dependency injection
- **UI Layer**: Reusable components and pages

### Component Organization

- **Atoms**: Basic UI elements (Button, Input, Icon)
- **Molecules**: Composed components (Card, FormField)
- **Organisms**: Complex compositions (FormContainer, PageHeader)
- **Templates**: Layout components (PageLayout, StackedLayout)

## 🧪 Testing

### Test Structure

```
src/
├── __tests__/          # Test files
├── test/               # Test utilities and setup
└── __mocks__/          # Mock implementations
```

### Running Tests

```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:run -- --coverage

# Watch mode
npm run test:watch
```

### Test Coverage Goals

- **Current**: 3.43%
- **Phase 1 Target**: 80% on critical components
- **Phase 2 Target**: 90% overall
- **Phase 3 Target**: E2E tests for critical flows

## 🚨 Known Issues

### Accessibility Warnings (54 total)

- Click events without keyboard listeners
- Form labels without associated controls
- AutoFocus usage (reduces usability)
- Non-interactive elements with event handlers

**Status**: Being addressed in upcoming sprints

### Test Coverage

- **Current**: 3.43% overall coverage
- **Plan**: Implementing Phase 1 and Phase 2 testing guides
- **Timeline**: 1-2 sprints to reach 80% coverage

## 🤝 Contributing

### Code Standards

1. **TypeScript**: Use strict typing, no `any` types
2. **React**: Functional components with hooks only
3. **Styling**: Tailwind CSS + DaisyUI only
4. **Testing**: Write tests for new features
5. **Documentation**: Update docs for significant changes

### PR Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Run verification: `npm run verify`
4. Ensure coverage meets thresholds
5. Create PR with clear description
6. Address review feedback

## 📊 Project Metrics

- **Lines of Code**: ~15,000+
- **Components**: 50+ reusable components
- **Tests**: 25 passing tests
- **Coverage**: 3.43% (target: 80%+)
- **Build Time**: ~6.6 seconds
- **Bundle Size**: 1.1MB (gzipped: 307KB)

## 🔗 Related Documentation

- [Quality Assurance System](./docs/quality-assurance/README.md)
- [Developer Handoff Memo](./docs/developer-handoff-memo.md)
- [Testing Guide](./test/README.md)
- [UI Component Library](./src/ui/shared/README.md)

---

**Last Updated**: January 2025  
**Maintainer**: Development Team  
**Status**: Active Development
