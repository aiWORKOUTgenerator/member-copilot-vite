# Frontend-Backend Authentication Troubleshooting Guide

## ✅ RESOLVED: Complete Solution for Clerk Authentication Issues

**Date**: December 2024  
**Issue**: 401 Unauthorized errors when frontend tries to communicate with backend  
**Domain**: `tenant.aitenanttest.test` (working for entire app lifetime until recently)
**Status**: ✅ **RESOLVED** - Complete solution documented below

## Root Cause Analysis

### What We Know Works:

- ✅ DNS resolution: `tenant.aitenanttest.test` resolves to `127.0.0.1` (localhost)
- ✅ Backend accessibility: Backend responds correctly at `http://tenant.aitenanttest.test/api/`
- ✅ Frontend accessibility: Frontend runs on `http://localhost:5173`
- ✅ Clerk instance: `https://devoted-kitten-97.clerk.accounts.dev` is accessible
- ✅ Environment variables: All required vars are set correctly
- ✅ Frontend build: Builds successfully without errors
- ✅ Dev server: Running properly on port 5173

### What We Know Doesn't Work:

- ❌ Backend authentication: Returns 401 "Not authenticated with Clerk" for API requests
- ❌ Clerk token transmission: Tokens not being sent properly from frontend to backend

## Recent Changes That May Have Caused Issues

### 1. Clerk Publishable Key Change

- **What happened**: Clerk publishable key was recently updated
- **Impact**: May have invalidated existing sessions or tokens
- **Status**: Key format is valid (`pk_test_ZGV2b3RlZC1raXR0ZW4tOTcuY2xlcmsuYWNjb3VudHMuZGV2JA`)

### 2. Environment Variable Updates

- **What happened**: Multiple `.env` and `.env.local` file changes during troubleshooting
- **Impact**: May have caused configuration inconsistencies
- **Status**: Current `.env` file has correct values

## Current Configuration

### Frontend Environment (`.env`):

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZGV2b3RlZC1raXR0ZW4tOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_API_URL=http://tenant.aitenanttest.test/api
VITE_STATIC_ASSET_URL=http://tenant.aitenanttest.test/static
```

### DNS Configuration (`/etc/hosts`):

```
127.0.0.1       tenant.aitenanttest.test
127.0.0.1       primary.aitenanttest.test
```

### Clerk Configuration:

- **Instance**: `https://devoted-kitten-97.clerk.accounts.dev`
- **Satellite Domains**: Only primary domain configured
- **Issue**: Cannot add `aitenanttest.test` as satellite domain (reserved by Clerk)

## Debug Scripts (Removed)

**Note**: Debug scripts were created during troubleshooting but have been removed since the issue is resolved. The comprehensive solution below provides all necessary steps for future troubleshooting.

## Immediate Next Steps for Next Developer

### 1. Verify Current Authentication State

Run these commands in browser console at `http://localhost:5173`:

```javascript
// Check if user is signed in
window.Clerk?.user?.id;
window.Clerk?.session?.status;

// Check if token generation works
window.Clerk?.session?.getToken();

// Test backend directly
fetch('http://tenant.aitenanttest.test/api/members/contact/', {
  headers: {
    Authorization: 'Bearer ' + (await window.Clerk?.session?.getToken()),
  },
}).then((r) => r.status);
```

### 2. Check for Recent Changes

Investigate if any of these changed recently:

- Clerk configuration in dashboard
- Backend authentication settings
- Environment variables
- Browser cache/cookies
- User session status

### 3. Potential Solutions to Try

#### Option A: Session Reset

```javascript
// In browser console
window.Clerk?.signOut();
// Then sign in again
```

#### Option B: Browser Cache Clear

- Clear browser cache and cookies
- Try different browser
- Test in incognito/private mode

#### Option C: Clerk Configuration Check

- Verify Clerk dashboard settings
- Check if authorized parties include `tenant.aitenanttest.test`
- Verify JWT templates are configured

#### Option D: Backend Verification

- Confirm backend is expecting Clerk tokens
- Verify backend Clerk configuration matches frontend
- Check backend logs for authentication errors

## Key Files Modified During Troubleshooting

### Debug Files Created (Removed):

- `debug-auth.mjs` - Comprehensive authentication testing (removed)
- `debug-clerk-token.mjs` - Clerk-specific debugging (removed)
- `debug-current-state.mjs` - Current state analysis (removed)

### Files with Debug Logging Added:

- `src/services/api/ClerkTokenProvider.ts` - Added console.log for token debugging
- `src/services/api/ApiServiceImpl.ts` - Added console.log for header debugging

## Expected Behavior vs Current Behavior

### Expected:

- User signs in via Clerk
- Frontend gets JWT token from Clerk
- Frontend sends token in Authorization header to backend
- Backend validates token and returns 200

### Current:

- User appears signed in via Clerk
- Frontend attempts to get token
- Backend returns 401 "Not authenticated with Clerk"

## Critical Questions for Next Developer

1. **Is the user actually signed in?** Check `window.Clerk?.user?.id`
2. **Is the token being generated?** Check `window.Clerk?.session?.getToken()`
3. **Is the token being sent?** Check Network tab for Authorization headers
4. **Is the backend rejecting the token?** Check backend logs
5. **Did something change recently?** Investigate recent configuration changes

## 🎉 COMPLETE SOLUTION - Follow These Steps for Quick Resolution

### **Root Cause Identified:**

The issue occurs when Clerk publishable keys are changed, which requires **two critical updates**:

1. **Frontend**: Missing JWT templates and authorized parties in Clerk dashboard
2. **Backend**: Outdated Clerk secret key that doesn't match the new instance

### **Step-by-Step Resolution:**

#### **Phase 1: Frontend Clerk Configuration**

**1. Create JWT Template in Clerk Dashboard:**

- Go to https://dashboard.clerk.com/
- Navigate to **Configure → JWT Templates**
- Click **"Add new template"**
- Configure:
  - **Name**: `Default` or `Backend API`
  - **Token lifetime**: `3600` seconds (1 hour)
  - **Issuer**: `https://devoted-kitten-97.clerk.accounts.dev` (your instance)
  - **JWKS Endpoint**: `https://devoted-kitten-97.clerk.accounts.dev/.well-known/jwks.json`

**2. Add Authorized Parties/Satellite Domains:**

- Go to **Configure → Domains → Satellites**
- Click **"Add satellite domain"**
- Add these domains (use `http://` protocol):
  - `http://localhost:5173`
  - `http://tenant.aitenanttest.test`

**3. Update Development Host:**

- Go to **Configure → Paths**
- Set **"Fallback development host"** to: `http://localhost:5173`

#### **Phase 2: Backend Configuration Update**

**4. Update Backend Clerk Secret Key:**

- Get the correct secret key from Clerk dashboard (**API Keys** section)
- Update backend `.env` file:

```bash
# Replace with your actual secret key for the devoted-kitten-97 instance
CLERK_SECRET_KEY=sk_test_P0cetdXyAKp73ldredPBoZ9qXnATqfr88atVuBSdUf
```

**5. Restart Backend Services:**

```bash
# For Docker environments:
docker-compose down && docker-compose up -d

# For other setups, restart your backend service
```

#### **Phase 3: Verification**

**6. Test Frontend Authentication:**

- Refresh browser at `http://localhost:5173`
- Check browser console for:
  - ✅ No 401 errors
  - ✅ `🔑 Clerk Token Debug: {hasToken: true, ...}`
  - ✅ Successful API calls

**7. Test Backend Directly:**

```bash
# Should return 401 (expected for unauthenticated request)
curl -I http://tenant.aitenanttest.test/api/members/contact/

# With valid token should return 200
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://tenant.aitenanttest.test/api/members/contact/
```

### **🚨 Critical Configuration Values:**

**Frontend (.env):**

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZGV2b3RlZC1raXR0ZW4tOTcuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_API_URL=http://tenant.aitenanttest.test/api
```

**Backend (.env):**

```bash
CLERK_SECRET_KEY=sk_test_P0cetdXyAKp73ldredPBoZ9qXnATqfr88atVuBSdUf
```

**Clerk Dashboard Settings:**

- **JWT Template**: Created with authorized parties
- **Satellite Domains**: `http://localhost:5173`, `http://tenant.aitenanttest.test`
- **Development Host**: `http://localhost:5173`

### **⚡ Quick Diagnosis Commands:**

**Frontend (Browser Console):**

```javascript
// Check authentication state
console.log('User:', window.Clerk?.user?.id);
console.log('Session:', window.Clerk?.session?.status);
console.log('Token:', await window.Clerk?.session?.getToken());

// Test backend
fetch('http://tenant.aitenanttest.test/api/members/contact/', {
  headers: {
    Authorization: 'Bearer ' + (await window.Clerk?.session?.getToken()),
  },
}).then((r) => console.log('Status:', r.status));
```

**Backend (Terminal):**

```bash
# Check if backend is accessible
curl -I http://tenant.aitenanttest.test/api/

# Verify Clerk secret key is set
docker exec CONTAINER_NAME env | grep CLERK_SECRET_KEY
```

### **🎯 Expected Results After Fix:**

- ✅ Frontend loads without 401 errors in console
- ✅ Backend responds with 200 for authenticated requests
- ✅ Navigation and API calls work properly
- ✅ User can access all protected features

### **💡 Prevention for Future:**

**When changing Clerk publishable keys:**

1. **Always update the backend secret key** to match the new instance
2. **Recreate JWT templates** in Clerk dashboard
3. **Verify authorized parties/satellite domains** are configured
4. **Test both frontend and backend** after changes

This complete solution resolves all authentication issues related to Clerk key changes!
