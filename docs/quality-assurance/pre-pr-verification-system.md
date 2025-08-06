# Pre-PR Verification System Implementation

**Date:** January 2025  
**Status:** Implementation Plan  
**Owner:** Development Team

## Overview

This document outlines the comprehensive pre-PR verification system designed to catch issues before they reach GitHub, ensuring faster reviews, fewer CI failures, and a consistently healthy codebase.

## Current State Analysis

### Existing Infrastructure

- ✅ **ESLint**: Configured with TypeScript and React rules
- ✅ **TypeScript**: Strict configuration with modern patterns
- ✅ **Husky**: Basic pre-commit and pre-push hooks
- ✅ **Vitest**: Test framework configured but no tests exist
- ⚠️ **Security**: Basic npm audit (3 low-severity vulnerabilities found)
- ❌ **Testing**: No unit, integration, or E2E tests
- ❌ **Formatting**: No Prettier configuration
- ❌ **Coverage**: No test coverage enforcement
- ❌ **Accessibility**: No automated a11y checks
- ❌ **Performance**: No performance monitoring

### Recent Issues That Would Be Caught

- ✅ TypeScript interval type errors (caught by ESLint + TypeScript)
- ✅ Build failures (caught by build verification)
- ❌ Context-to-hooks migration issues (would need tests)
- ❌ Runtime errors (would need E2E tests)

## Implementation Phases

### Phase 1: Critical Foundation (Immediate - 1 Sprint)

#### 1.1 Add Prettier for Code Formatting

```bash
npm install --save-dev prettier
```

**Configuration** (`prettier.config.js`):

```javascript
export default {
  semi: true,
  trailingComma: 'es5',
  singleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};
```

**Package.json Scripts**:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

#### 1.2 Create Basic Unit Tests

**Priority Components to Test**:

- `GeneratingTrainerPage.tsx` - Critical user flow
- `useTrainerPersona.ts` - Core business logic
- `usePhoneVerification.ts` - Authentication flow

**Test Setup** (`src/test/setup.ts`):

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('@/hooks/auth', () => ({
  useAuth: () => ({
    isSignedIn: true,
    isLoaded: true,
  }),
}));

// Mock API services
vi.mock('@/hooks/useApiService', () => ({
  useApiService: () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}));
```

#### 1.3 Implement Coverage Thresholds

**Vitest Configuration Update**:

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

#### 1.4 Create Verify Script

**Package.json Scripts**:

```json
{
  "scripts": {
    "verify": "npm run lint && npm run format:check && tsc --noEmit && npm run test:run && npm run build",
    "verify:quick": "npm run lint && tsc --noEmit && npm run build"
  }
}
```

### Phase 2: Testing Foundation (Next Sprint)

#### 2.1 Unit Test Implementation

**Test File Structure**:

```
src/
├── __tests__/
│   ├── components/
│   │   └── GeneratingTrainerPage.test.tsx
│   ├── hooks/
│   │   ├── useTrainerPersona.test.ts
│   │   └── usePhoneVerification.test.ts
│   └── services/
│       └── TrainerPersonaService.test.ts
```

**Example Test** (`src/__tests__/hooks/useTrainerPersona.test.ts`):

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTrainerPersona } from '@/hooks/useTrainerPersona';

describe('useTrainerPersona', () => {
  it('should fetch trainer persona on mount', async () => {
    const { result } = renderHook(() => useTrainerPersona());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
  });
});
```

#### 2.2 Integration Tests

**Component Testing** (`src/__tests__/components/GeneratingTrainerPage.test.tsx`):

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GeneratingTrainerPage from '@/modules/dashboard/trainer/pages/GeneratingTrainerPage';

describe('GeneratingTrainerPage', () => {
  it('should show loading state initially', () => {
    render(
      <BrowserRouter>
        <GeneratingTrainerPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Generating personality traits/i)).toBeInTheDocument();
  });
});
```

### Phase 3: Advanced Quality Gates (Future Sprints)

#### 3.1 E2E Testing with Playwright

```bash
npm install --save-dev @playwright/test
```

**Configuration** (`playwright.config.ts`):

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### 3.2 Accessibility Testing

```bash
npm install --save-dev @axe-core/react
```

**A11y Test Example**:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### 3.3 Performance Monitoring

```bash
npm install --save-dev lighthouse
```

**Performance Script**:

```json
{
  "scripts": {
    "lighthouse": "lighthouse http://localhost:5173 --output=json --output-path=./lighthouse-report.json"
  }
}
```

## Husky Configuration

### Pre-commit Hook

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint && npm run format:check
```

### Pre-push Hook

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run verify
```

## CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/verify.yml`)

```yaml
name: Pre-PR Verification

on:
  pull_request:
    branches: [main, develop]

jobs:
  verify:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Type check
        run: tsc --noEmit

      - name: Run tests
        run: npm run test:run

      - name: Check coverage
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: Security audit
        run: npm audit --audit-level=moderate
```

## Success Metrics

### Phase 1 Goals

- [ ] 100% of TypeScript errors caught before PR
- [ ] Consistent code formatting across codebase
- [ ] 80% test coverage on critical components
- [ ] Zero build failures in CI

### Phase 2 Goals

- [ ] 90% test coverage overall
- [ ] All critical user flows covered by tests
- [ ] Integration tests for context-to-hooks migration

### Phase 3 Goals

- [ ] E2E tests for critical user journeys
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance budgets met
- [ ] Zero security vulnerabilities

## Maintenance

### Regular Tasks

- **Weekly**: Review and update test coverage
- **Monthly**: Update dependencies and security audit
- **Quarterly**: Review and optimize verification pipeline

### Monitoring

- Track CI/CD pipeline success rates
- Monitor test execution times
- Review coverage trends
- Analyze security vulnerability patterns

## Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**
   - Check environment differences
   - Verify mock implementations

2. **Coverage thresholds not met**
   - Review uncovered code paths
   - Add targeted tests for missing coverage

3. **Performance regressions**
   - Check bundle size changes
   - Review Lighthouse scores

### Getting Help

- Check the [Testing Guide](../testing/README.md)
- Review [CI/CD Documentation](../ci-cd/README.md)
- Contact the development team

---

**Last Updated:** January 2025  
**Next Review:** February 2025
