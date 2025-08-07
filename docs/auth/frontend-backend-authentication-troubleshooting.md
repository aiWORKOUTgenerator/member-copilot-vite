# **Frontend-Backend Authentication Troubleshooting Guide**

## **Issue Summary**

Frontend was unable to connect to backend due to **Clerk application mismatch** or **missing environment configuration**. The frontend needs proper Clerk configuration and API URL setup to authenticate with the backend.

## **Root Cause**

- **Missing Frontend Configuration**: No `.env` file exists, only `.env.example`
- **Backend Clerk Key**: `sk_test_FHEj1mt8Z5mRn2P4m4JqxYxFKhCvDh1a6hGUI3lNI8` (eminent-adder-64)
- **Backend URL**: `http://tenant.aitenanttest.test/api`
- **Result**: 401 "Not authenticated with Clerk" errors on all API calls

## **Diagnostic Steps**

### **1. Check Current Configuration**

```bash
# Frontend configuration
cat .env | grep -E "CLERK|API_URL"

# Backend configuration
cd ../ai-api && cat .env | grep CLERK
```

### **2. Identify Configuration Issues**

- **Frontend**: Missing `.env` file (only `.env.example` exists)
- **Expected Backend URL**: `http://tenant.aitenanttest.test/api`
- **Expected Clerk Domain**: `https://eminent-adder-64.clerk.accounts.dev`

### **3. Verify Backend API Status**

```bash
# Test backend connectivity
curl -s http://tenant.aitenanttest.test/api/ | head -5

# Test authentication endpoint
curl -v -H "Authorization: Bearer test-token" http://tenant.aitenanttest.test/api/members/trainer-persona/
```

## **Solution: Create Frontend Environment Configuration**

### **Step 1: Create .env File from Template**

```bash
# Copy the example file
cp .env.example .env
```

### **Step 2: Update Clerk Publishable Key**

```bash
# Replace with correct Clerk key for your application
sed -i '' 's|VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here|VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk|' .env
```

### **Step 3: Update API URL**

```bash
# Set the correct API URL
sed -i '' 's|VITE_API_URL=your_api_url_here|VITE_API_URL=http://tenant.aitenanttest.test/api|' .env
```

### **Step 4: Update Static Asset URL**

```bash
# Set the static asset URL
sed -i '' 's|VITE_STATIC_ASSET_URL=your_static_asset_url_here|VITE_STATIC_ASSET_URL=http://tenant.aitenanttest.test/static|' .env
```

### **Step 5: Verify Configuration**

```bash
cat .env | grep -E "CLERK|API_URL"
```

**Expected Output:**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=http://tenant.aitenanttest.test/api
VITE_STATIC_ASSET_URL=http://tenant.aitenanttest.test/static
```

### **Step 6: Restart Frontend Dev Server**

```bash
pkill -f "vite" && npm run dev -- --port 5173
```

## **Configuration Requirements**

### **Frontend (.env)**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=http://tenant.aitenanttest.test/api
VITE_STATIC_ASSET_URL=http://tenant.aitenanttest.test/static
VITE_USE_MOCK_WORKOUT_INSTANCE_SERVICE=true
```

### **Backend (.env)**

```env
CLERK_SECRET_KEY=sk_test_FHEj1mt8Z5mRn2P4m4JqxYxFKhCvDh1a6hGUI3lNI8
CLERK_AUTHORIZED_PARTIES=http://localhost:5173
```

### **Docker Services**

```bash
# Ensure all services are running
cd ../ai-api && docker-compose up -d

# Verify containers
docker ps

# Check migrations
docker-compose exec web python manage.py migrate
```

## **Authentication Flow**

### **Correct Flow:**

1. **Frontend** (`localhost:5173`) → **Your Clerk** (`eminent-adder-64`) → Gets JWT token
2. **Frontend** → **Backend** (`tenant.aitenanttest.test`) → Sends JWT token
3. **Backend** → **Clerk API** → Validates token using your JWKS

### **Key Requirements:**

- ✅ **Same Clerk Application**: Frontend and backend use same Clerk app
- ✅ **Correct Secret Key**: Backend has matching secret key
- ✅ **Proper Authorization**: Backend accepts tokens from `localhost:5173`
- ✅ **API Endpoints**: Frontend calls `tenant.aitenanttest.test/api`

## **Testing the Fix**

### **1. Browser Testing**

1. **Open**: `http://localhost:5173`
2. **Log in** with your Clerk account
3. **Navigate** to `/dashboard/profile` or any API-heavy page
4. **Check Network tab** - API calls should return 200 status

### **2. Expected API Calls**

- `/api/members/attributes/` - Profile attributes
- `/api/members/workouts/` - Workout data
- `/api/members/subscriptions/` - Billing information
- `/api/members/meter-event-summaries/` - Usage data

### **3. Authentication Headers**

- **Expected**: `Authorization: Bearer <clerk_jwt_token>`
- **Token Source**: Your Clerk application (`eminent-adder-64`)

## **API Endpoint Troubleshooting**

### **Issue: 404 Not Found on Generated Workouts**

**Symptoms:**

```
tenant.aitenanttest.test/api/members/generated-workouts/:1 Failed to load resource: the server responded with a status of 404 (Not Found)
Error in createGeneratedWorkout: Error: API error: 404 Not Found
```

**Diagnostic Steps:**

1. **Verify Endpoint Exists:**

```bash
# Test without authentication (should return auth error, not 404)
curl -s http://tenant.aitenanttest.test/api/members/generated-workouts/
# Expected: {"detail":"Not authenticated with Clerk"}
# If 404: Endpoint doesn't exist
```

2. **Check URL Construction:**

```bash
# Frontend service uses: /members/generated-workouts/
# API service prepends: VITE_API_URL (http://tenant.aitenanttest.test/api)
# Final URL: http://tenant.aitenanttest.test/api/members/generated-workouts/
```

3. **Verify Backend Routes:**

```bash
cd ../ai-api
cat members/urls.py | grep generated-workouts
cat api/urls.py | grep members
```

**Solutions:**

1. **Authentication Issue**: User not logged in or token expired
   - Log out and log back in
   - Check browser console for Clerk errors
   - Verify JWT token is being sent in Authorization header

2. **Backend Not Running**: Docker containers stopped

   ```bash
   cd ../ai-api && docker-compose up -d
   docker ps  # Verify all containers running
   ```

3. **Wrong API URL**: Check VITE_API_URL in .env
   ```bash
   cat .env | grep VITE_API_URL
   # Should be: VITE_API_URL=http://tenant.aitenanttest.test/api
   ```

### **Issue: Configuration ID Mismatch (Common Root Cause)**

**Symptoms:**

- 404 errors on API calls that should work
- Endpoint exists and authentication is working
- Error occurs when creating resources (POST requests)

**Root Cause:**
Configuration IDs in `.env` file don't match backend expectations.

**Common Configuration Issues:**

1. **Workout Configuration ID:**

```bash
# Check current value
cat .env | grep VITE_GENERATED_WORKOUT_CONFIGURATION_ID

# Should match a valid configuration ID from backend
# Example: VITE_GENERATED_WORKOUT_CONFIGURATION_ID=01JSHGHV0V6RZC3TN7T2W09P2M
```

2. **Stripe Price IDs:**

```bash
# Check Stripe configuration
cat .env | grep VITE_STRIPE_PRICE
# Should match valid Stripe price IDs
```

**Diagnostic Steps:**

1. **Verify Configuration Values:**

```bash
# Check all configuration IDs
cat .env | grep -E "CONFIGURATION_ID|PRICE_ID|KEY_ID"
```

2. **Test with Valid Configuration:**

```bash
# If you know the correct configuration ID, update it
sed -i '' 's|VITE_GENERATED_WORKOUT_CONFIGURATION_ID=wrong_id|VITE_GENERATED_WORKOUT_CONFIGURATION_ID=correct_id|' .env
```

3. **Restart Frontend After Changes:**

```bash
# Configuration changes require restart
pkill -f "vite" && npm run dev -- --port 5173
```

**Prevention:**

- Keep a reference of valid configuration IDs
- Document which configuration IDs are used for which environments
- Test configuration changes in isolation before deploying

### **Testing API Endpoints**

```bash
# Test base API
curl -s http://tenant.aitenanttest.test/api/

# Test members endpoint (should return auth error, not 404)
curl -s http://tenant.aitenanttest.test/api/members/generated-workouts/

# Test with valid token (if you have one)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://tenant.aitenanttest.test/api/members/generated-workouts/
```

## **Common Issues & Solutions**

### **Issue 1: Missing .env File**

**Cause**: Frontend has no environment configuration
**Solution**:

```bash
cp .env.example .env
# Then update the values as shown above
```

### **Issue 2: Still Getting 401 Errors**

**Cause**: User not logged in or token expired
**Solution**:

- Log out and log back in
- Refresh the page
- Check browser console for Clerk errors

### **Issue 3: CORS Errors**

**Cause**: Backend not accepting frontend origin
**Solution**:

- Verify `CORS_ALLOW_ALL_ORIGINS = True` in backend
- Check `CLERK_AUTHORIZED_PARTIES` includes `localhost:5173`

### **Issue 4: API Endpoints Not Found (404)**

**Cause**: Backend not running or wrong URL
**Solution**:

- Verify Docker containers are running: `docker ps`
- Test backend directly: `curl http://tenant.aitenanttest.test/api/`
- Check URL construction in frontend services

### **Issue 5: Wrong Clerk Application**

**Cause**: Frontend using different Clerk app than backend
**Solution**:

- Update `VITE_CLERK_PUBLISHABLE_KEY` to match backend's Clerk app
- Ensure both use same Clerk application domain

## **Prevention**

### **For Future Development:**

1. **Document Clerk Application**: Keep track of which Clerk app is used
2. **Environment Templates**: Use `.env.example` with placeholder values
3. **Configuration Validation**: Add checks to ensure frontend/backend Clerk apps match
4. **Regular Testing**: Test authentication flow after any configuration changes

### **Team Communication:**

- **Share Clerk Application Details**: Ensure team knows which Clerk app to use
- **Document Configuration**: Keep backend `.env` configuration documented
- **Version Control**: Use `.env.example` files for configuration templates

## **Summary**

The key to fixing this issue was **creating the missing `.env` file and ensuring frontend and backend use the same Clerk application**. The missing environment configuration prevented the frontend from connecting to the backend properly. By creating the `.env` file with the correct Clerk publishable key and API URL, the authentication flow now works correctly.

**Remember**: Always ensure that both frontend and backend are configured for the same Clerk application when troubleshooting authentication issues.

## **Quick Reference Commands**

### **Check Current Status**

```bash
# Frontend configuration
cat .env | grep -E "CLERK|API_URL"

# Backend status
curl -s http://tenant.aitenanttest.test/api/ | head -5

# Docker containers
docker ps
```

### **Fix Missing Configuration**

```bash
# Create .env file
cp .env.example .env

# Update Clerk key
sed -i '' 's|VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here|VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk|' .env

# Update API URL
sed -i '' 's|VITE_API_URL=your_api_url_here|VITE_API_URL=http://tenant.aitenanttest.test/api|' .env

# Restart frontend
pkill -f "vite" && npm run dev -- --port 5173
```

### **Test Authentication**

```bash
# Test backend API
curl -v -H "Authorization: Bearer test-token" http://tenant.aitenanttest.test/api/members/trainer-persona/

# Check browser network tab for API calls to tenant.aitenanttest.test
```

### **Debug API Endpoints**

```bash
# Test specific endpoint
curl -s http://tenant.aitenanttest.test/api/members/generated-workouts/

# Check backend routes
cd ../ai-api && cat members/urls.py | grep generated-workouts
```
