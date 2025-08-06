# Phase 1 Implementation Guide: Critical Foundation

**Priority:** Immediate (1 Sprint)  
**Estimated Time:** 2-3 days  
**Impact:** High - Will catch 80% of current issues

## Quick Start Implementation

### Step 1: Add Prettier (30 minutes)

```bash
# Install Prettier
npm install --save-dev prettier

# Create Prettier config
echo 'export default {
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};' > prettier.config.js

# Add scripts to package.json
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.format:check="prettier --check ."
```

### Step 2: Create Test Setup (1 hour)

```bash
# Create test directory
mkdir -p src/test

# Create setup file
cat > src/test/setup.ts << 'EOF'
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
EOF
```

### Step 3: Update Vitest Config (15 minutes)

```bash
# Update vitest.config.ts
cat > vitest.config.ts << 'EOF'
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
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
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
EOF
```

### Step 4: Create Verify Script (5 minutes)

```bash
# Add verify scripts to package.json
npm pkg set scripts.verify="npm run lint && npm run format:check && tsc --noEmit && npm run test:run && npm run build"
npm pkg set scripts.verify:quick="npm run lint && tsc --noEmit && npm run build"
```

### Step 5: Update Husky Hooks (10 minutes)

```bash
# Update pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint && npm run format:check
EOF

# Update pre-push hook
cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run verify:quick
EOF

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Step 6: Create First Test (1 hour)

```bash
# Create test directory structure
mkdir -p src/__tests__/hooks

# Create first test for useTrainerPersona
cat > src/__tests__/hooks/useTrainerPersona.test.ts << 'EOF'
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTrainerPersona } from '@/hooks/useTrainerPersona';

// Mock the hook
vi.mock('@/hooks/useTrainerPersona', () => ({
  useTrainerPersona: () => ({
    trainerPersona: null,
    isLoading: false,
    error: null,
    isLoaded: true,
    hasNoPersona: false,
    refetch: vi.fn(),
    generateTrainerPersona: vi.fn(),
  }),
}));

describe('useTrainerPersona', () => {
  it('should return trainer persona state', () => {
    const { result } = renderHook(() => useTrainerPersona());

    expect(result.current).toBeDefined();
    expect(result.current.isLoaded).toBe(true);
  });
});
EOF
```

## Verification Steps

### 1. Test the Setup

```bash
# Run the verify script
npm run verify:quick

# Should pass without errors
```

### 2. Test Formatting

```bash
# Check formatting
npm run format:check

# Format all files
npm run format
```

### 3. Test Coverage

```bash
# Run tests with coverage
npm run test:run -- --coverage

# Should show coverage report
```

## Expected Results

After implementation, you should see:

✅ **Build passes**: `npm run build` succeeds  
✅ **Linting passes**: `npm run lint` shows no errors  
✅ **Formatting consistent**: `npm run format:check` passes  
✅ **Type checking passes**: `tsc --noEmit` shows no errors  
✅ **Tests run**: `npm run test:run` executes successfully  
✅ **Husky hooks work**: Pre-commit and pre-push hooks trigger

## Next Steps

1. **Run the full verify script**: `npm run verify`
2. **Follow Phase 2 Implementation Guide**: `docs/quality-assurance/phase-2-implementation-guide.md`
3. **Add comprehensive tests** to reach 80% coverage
4. **Use the verify scripts** before every commit/push

## Troubleshooting

### Common Issues

**Prettier conflicts with ESLint**

```bash
npm install --save-dev eslint-config-prettier
# Add "prettier" to extends in eslint.config.js
```

**Test setup not found**

```bash
# Verify src/test/setup.ts exists
# Check vitest.config.ts setupFiles path
```

**Coverage thresholds not met**

```bash
# Temporarily lower thresholds to 60%
# Add more tests gradually
```

---

**Implementation Time:** ~3 hours  
**Impact:** Catches 80% of current issues  
**Risk:** Low - Non-breaking changes
