# **Frontend-Backend Authentication Troubleshooting Guide**

## **Issue Summary**
Frontend was unable to connect to backend due to **Clerk application mismatch**. The frontend was using the CTO's Clerk application (`easy-caribou-11`) while the backend was configured for a different Clerk application (`eminent-adder-64`).

## **Root Cause**
- **Frontend Clerk Key**: `pk_test_ZWFzeS1jYXJpYm91LTExLmNsZXJrLmFjY291bnRzLmRldiQ` (easy-caribou-11)
- **Backend Clerk Key**: `sk_test_FHEj1mt8Z5mRn2P4m4JqxYxFKhCvDh1a6hGUI3lNI8` (eminent-adder-64)
- **Result**: 401 "Not authenticated with Clerk" errors on all API calls

## **Diagnostic Steps**

### **1. Check Current Configuration**
```bash
# Frontend configuration
cat .env | grep -E "CLERK|API_URL"

# Backend configuration  
cd ../ai-api && cat .env | grep CLERK
```

### **2. Identify Clerk Application Mismatch**
- **Frontend URL**: Check browser Network tab for Clerk requests
- **Expected**: `https://eminent-adder-64.clerk.accounts.dev`
- **Actual**: `https://easy-caribou-11.clerk.accounts.dev`

### **3. Verify Backend API Status**
```bash
# Test backend connectivity
curl -s http://tenant.aitenanttest.test/api/ | head -5

# Test authentication endpoint
curl -v -H "Authorization: Bearer test-token" http://tenant.aitenanttest.test/api/members/trainer-persona/
```

## **Solution: Update Frontend Clerk Configuration**

### **Step 1: Update Clerk Publishable Key**
```bash
# Replace with correct Clerk key for your application
sed -i '' 's|VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZWFzeS1jYXJpYm91LTExLmNsZXJrLmFjY291bnRzLmRldiQ|VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk|' .env
```

### **Step 2: Verify Configuration**
```bash
cat .env | grep -E "CLERK|API_URL"
```

**Expected Output:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=http://tenant.aitenanttest.test/api
```

### **Step 3: Restart Frontend Dev Server**
```bash
pkill -f "vite" && npm run dev
```

## **Configuration Requirements**

### **Frontend (.env)**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=http://tenant.aitenanttest.test/api
VITE_STATIC_ASSET_URL=http://tenant.aitenanttest.test/static
```

### **Backend (.env)**
```env
CLERK_SECRET_KEY=sk_test_FHEj1mt8Z5mRn2P4m4JqxYxFKhCvDh1a6hGUI3lNI8
CLERK_AUTHORIZED_PARTIES=http://localhost:5173
```

### **Docker Services**
```bash
# Ensure all services are running
docker-compose up -d

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

## **Common Issues & Solutions**

### **Issue 1: Still Getting 401 Errors**
**Cause**: User not logged in or token expired
**Solution**: 
- Log out and log back in
- Refresh the page
- Check browser console for Clerk errors

### **Issue 2: CORS Errors**
**Cause**: Backend not accepting frontend origin
**Solution**: 
- Verify `CORS_ALLOW_ALL_ORIGINS = True` in backend
- Check `CLERK_AUTHORIZED_PARTIES` includes `localhost:5173`

### **Issue 3: API Endpoints Not Found**
**Cause**: Backend not running or wrong URL
**Solution**:
- Verify Docker containers are running
- Test backend directly: `curl http://tenant.aitenanttest.test/api/`

### **Issue 4: Wrong Clerk Application**
**Cause**: Frontend using different Clerk app than backend
**Solution**:
- Update `VITE_CLERK_PUBLISHABLE_KEY` to match backend's Clerk app
- Ensure both use same Clerk application domain

## **Prevention**

### **For Future Development:**
1. **Document Clerk Application**: Keep track of which Clerk app is used
2. **Environment Templates**: Create `.env.example` with placeholder values
3. **Configuration Validation**: Add checks to ensure frontend/backend Clerk apps match
4. **Regular Testing**: Test authentication flow after any configuration changes

### **Team Communication:**
- **Share Clerk Application Details**: Ensure team knows which Clerk app to use
- **Document Configuration**: Keep backend `.env` configuration documented
- **Version Control**: Use `.env.example` files for configuration templates

## **Summary**

The key to fixing this issue was **ensuring frontend and backend use the same Clerk application**. The mismatch between `easy-caribou-11` (frontend) and `eminent-adder-64` (backend) caused all authentication to fail. By updating the frontend's Clerk publishable key to match the backend's Clerk application, the authentication flow now works correctly.

**Remember**: Always verify that both frontend and backend are configured for the same Clerk application when troubleshooting authentication issues.

## **Quick Reference Commands**

### **Check Current Status**
```bash
# Frontend Clerk key
cat .env | grep VITE_CLERK_PUBLISHABLE_KEY

# Backend status
curl -s http://tenant.aitenanttest.test/api/ | head -5

# Docker containers
docker ps
```

### **Fix Clerk Mismatch**
```bash
# Update frontend Clerk key
sed -i '' 's|VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZWFzeS1jYXJpYm91LTExLmNsZXJrLmFjY291bnRzLmRldiQ|VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW1pbmVudC1hZGRlci02NC5jbGVyay5hY2NvdW50cy5kZXYk|' .env

# Restart frontend
pkill -f "vite" && npm run dev
```

### **Test Authentication**
```bash
# Test backend API
curl -v -H "Authorization: Bearer test-token" http://tenant.aitenanttest.test/api/members/trainer-persona/

# Check browser network tab for API calls to tenant.aitenanttest.test
``` 