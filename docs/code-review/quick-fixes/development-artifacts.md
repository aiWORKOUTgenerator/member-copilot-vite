# Quick Fix: Remove Development Artifacts

Development artifacts like console.log statements, debug code, and temporary comments should never make it to production. This guide provides a systematic approach to cleaning them up.

## 🚨 Immediate Action Required

**Estimated Time**: 30 minutes  
**Priority**: 🚨 Critical - Must fix before deployment

## 📍 Console.log Statements Found

Based on code review, these files contain console.log statements that must be removed:

### Primary Locations (Must Fix)
```typescript
// src/contexts/AttributeFormContext.tsx:83-99
console.log("prompts", prompts);           // REMOVE
console.log("prompt", prompt);             // REMOVE  
console.log("contact", contact);           // REMOVE
console.log("key", key);                   // REMOVE
console.log("attrValue", attrValue);       // REMOVE
console.log("prompt.variableName", prompt.variableName); // REMOVE
```

### Additional Locations
```typescript
// src/services/api/ApiServiceImpl.ts:57
console.log("getHeaders", this.tokenProvider); // REMOVE

// src/contexts/AttributeContext.tsx:67
console.log("isSignedIn", isSignedIn); // REMOVE

// src/hooks/useSubscriptionService.ts:13
console.log("useSubscriptionService", apiService); // REMOVE
```

## 🔧 Automated Cleanup Script

Create this script to find and remove console.log statements:

```bash
#!/bin/bash
# cleanup-console-logs.sh

echo "🔍 Searching for console.log statements..."

# Find all console.log statements in TypeScript/JavaScript files
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -n

echo "📋 Found console.log statements above. Remove them manually."
echo "⚠️  Do not use automated replacement - review each one individually."

# Optional: Show count
echo "📊 Total console.log statements found: $(grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | wc -l)"
```

## ✅ Manual Removal Process

### Step 1: Review Each Statement
Before removing, verify the console.log isn't part of legitimate error handling:

```typescript
// ❌ REMOVE - Debug statement
console.log("prompts", prompts);

// ❌ REMOVE - Development debugging  
console.log("User data:", userData);

// ✅ KEEP - Legitimate error logging (but consider proper logging service)
console.error("Failed to save user data:", error);

// ✅ KEEP - Intentional user-facing logging
console.warn("Feature is deprecated, please use newFeature() instead");
```

### Step 2: Clean Up Each File

**AttributeFormContext.tsx**:
```typescript
// BEFORE (lines 83-99) - REMOVE ALL OF THESE
console.log("prompts", prompts);
console.log("prompt", prompt);
console.log("contact", contact);
console.log("key", key);
console.log("attrValue", attrValue);
console.log("prompt.variableName", prompt.variableName);

// AFTER - Clean code with no debug statements
// Just remove the lines entirely
```

**ApiServiceImpl.ts**:
```typescript
// BEFORE (line 57)
console.log("getHeaders", this.tokenProvider);

// AFTER - Remove the line entirely
// No replacement needed
```

### Step 3: Handle Legitimate Logging

If you need to keep some logging for debugging, use proper logging levels:

```typescript
// Instead of console.log, use proper logging
if (process.env.NODE_ENV === 'development') {
  console.debug("Development debug info:", data);
}

// Or use a proper logging service
// logger.debug("Debug info", { data });
```

## 🔍 Verification Steps

### 1. Code Search Verification
```bash
# Search for any remaining console statements
grep -r "console\." src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"

# Should only show legitimate console.error, console.warn, etc.
```

### 2. Build Verification
```bash
# Ensure build still works after cleanup
npm run build

# Check for any build warnings about console statements
```

### 3. Runtime Verification
```bash
# Start development server
npm run dev

# Open browser console - should see no debug output
# Navigate through profile forms - no console.log output should appear
```

## 🚧 Prevention Strategies

### 1. ESLint Rule
Add to `.eslintrc.js`:
```javascript
{
  "rules": {
    "no-console": ["error", { 
      "allow": ["warn", "error", "info"] 
    }]
  }
}
```

### 2. Pre-commit Hook
Add to `.husky/pre-commit`:
```bash
#!/bin/sh
# Check for console.log statements
if grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -q; then
  echo "❌ console.log statements found. Please remove them before committing."
  grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -n
  exit 1
fi
```

### 3. VS Code Snippet
Add to VS Code settings for temporary debugging:
```json
{
  "typescript.preferences.snippets": {
    "console-debug": {
      "prefix": "cld",
      "body": [
        "// TODO: Remove debug log before commit",
        "console.log('🐛 DEBUG:', $1);"
      ],
      "description": "Temporary debug console.log"
    }
  }
}
```

## 📋 Cleanup Checklist

- [ ] **AttributeFormContext.tsx** - Remove 6 console.log statements (lines 83-99)
- [ ] **ApiServiceImpl.ts** - Remove console.log statement (line 57)  
- [ ] **AttributeContext.tsx** - Remove console.log statement (line 67)
- [ ] **useSubscriptionService.ts** - Remove console.log statement (line 13)
- [ ] **Search entire codebase** - Verify no additional console.log statements
- [ ] **Test build** - Ensure application builds without errors
- [ ] **Test runtime** - Verify no console output during normal operation
- [ ] **Add ESLint rule** - Prevent future console.log statements
- [ ] **Add pre-commit hook** - Automatically catch console.log in commits

## 🎯 Success Criteria

✅ **Complete** when:
- No `console.log` statements remain in production code
- Application builds and runs without errors  
- Browser console shows no debug output during normal usage
- ESLint rule prevents future console.log statements
- Pre-commit hook catches any missed console.log statements

---

**⚠️ This fix is required before next deployment. The presence of console.log statements in production is a security and performance concern.** 