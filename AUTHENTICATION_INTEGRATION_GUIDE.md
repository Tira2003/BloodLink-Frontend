# Authentication & Security Integration Guide

## Overview

This guide covers the complete JWT-based authentication and security implementation for BloodLink, including backend JWT infrastructure, frontend authentication context, and role-based access control.

## Backend Components

### 1. JWT Infrastructure (User Service)

**Files:**
- `backend/user-service/src/main/java/com/bloodlink/user/security/JwtTokenProvider.java` - Token generation and validation
- `backend/user-service/src/main/java/com/bloodlink/user/security/JwtAuthenticationFilter.java` - JWT filter for all requests
- `backend/user-service/src/main/java/com/bloodlink/user/security/JwtAuthenticationEntryPoint.java` - Unauthorized response handler

**Key Features:**
- HS512 algorithm for JWT signing
- Access token expiration: 24 hours (configurable)
- Refresh token expiration: 7 days (configurable)
- Token claims: email, userId, role

### 2. Auth Service

**File:** `backend/user-service/src/main/java/com/bloodlink/user/service/AuthService.java`

**Endpoints:**
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (clears session)
- `GET /api/auth/me` - Get current authenticated user

**Response Format:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DONOR",
    "status": "ACTIVE"
  }
}
```

### 3. Role-Based Access Control (RBAC)

**Files:**
- `backend/user-service/src/main/java/com/bloodlink/user/security/RequireRole.java` - Custom annotation
- `backend/user-service/src/main/java/com/bloodlink/user/security/RoleBasedAccessControlAspect.java` - AOP aspect for RBAC enforcement

**Supported Roles:**
- `ADMIN` - Full system access
- `DONOR` - Can donate blood
- `PATIENT` - Can request blood
- `HOSPITAL` - Hospital/organization access
- `STAFF` - Hospital staff access

**Usage in Controllers:**
```java
@PostMapping("/{id}")
@PreAuthorize("hasRole('DONOR') or hasRole('ADMIN')")
public ResponseEntity<DonorDTO> updateDonor(@PathVariable UUID id) {
    // Method implementation
}
```

### 4. Security Configuration

**File:** `backend/user-service/src/main/java/com/bloodlink/user/config/SecurityConfig.java`

**Features:**
- CORS configured for frontend URLs (localhost:3000, localhost:5173, etc.)
- CSRF protection disabled for stateless API
- Stateless session management
- Public endpoints: `/api/auth/**`, `/api/users/register`, `/actuator/**`
- Protected endpoints: require valid JWT token

### 5. Exception Handling

**Files:**
- `backend/user-service/src/main/java/com/bloodlink/user/exception/GlobalExceptionHandler.java`
- `backend/user-service/src/main/java/com/bloodlink/user/exception/UnauthorizedException.java`
- `backend/user-service/src/main/java/com/bloodlink/user/exception/ResourceNotFoundException.java`

**Error Response Format:**
```json
{
  "timestamp": "2024-06-21T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "path": "/api/auth/login"
}
```

## Frontend Components

### 1. Auth Service

**File:** `src/services/authService.js`

**Methods:**
- `login(email, password)` - Authenticate user
- `register(payload)` - Register new user
- `refreshToken()` - Refresh access token
- `logout()` - Clear session
- `getStoredUser()` - Get user from localStorage
- `getStoredToken()` - Get JWT token
- `isTokenExpired()` - Check token expiration
- `getMe()` - Fetch current user info

**Token Storage:**
- Access token: `bl_token`
- Refresh token: `bl_refresh_token`
- User info: `bl_user`
- Token type: `bl_token_type`
- Expiration time: `bl_token_expires`

### 2. Auth Context

**File:** `src/context/AuthContext.jsx`

**Provides:**
- `user` - Current user object
- `isAuthenticated` - Authentication status
- `loading` - Loading state
- `error` - Error message
- `login(email, password)` - Login function
- `register(payload)` - Register function
- `logout()` - Logout function
- `hasRole(role)` - Check user role
- `setError(message)` - Set error message

**Usage:**
```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### 3. Protected Route

**File:** `src/App.jsx`

**Component:** `ProtectedRoute`

**Features:**
- Redirects unauthenticated users to login
- Checks required roles
- Shows loading state while checking auth
- Redirects unauthorized users to home

**Usage:**
```jsx
<Route
  path="/profile"
  element={
    <ProtectedRoute requiredRole="DONOR">
      <DonorProfile />
    </ProtectedRoute>
  }
/>
```

### 4. Auth Pages

**Login Page** (`src/pages/Login.jsx`):
- Email/password input
- Demo login buttons
- Error handling
- Redirect based on user role

**Register Page** (`src/pages/Register.jsx`):
- User registration form
- Donor-specific fields
- Server-side validation feedback
- Success page with login redirect

## API Gateway Configuration

**File:** `backend/api-gateway/src/main/resources/application.yml`

**Features:**
- CORS enabled for all routes
- Routes all auth requests to user service
- Adds authentication header to all requests
- Default port: 8080

## Environment Variables

### Backend
```env
# JWT Configuration
JWT_SECRET=MyVerySecureSecretKeyForBloodLinkApplicationThatIsAtLeast32CharactersLongForJWTTokenGeneration
JWT_EXPIRATION_MS=86400000  # 24 hours
JWT_REFRESH_EXPIRATION_MS=604800000  # 7 days

# Database
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### Frontend
```env
# API Configuration
VITE_API_URL=http://localhost:8080
```

## Testing the Authentication Flow

### 1. Start Backend Services
```bash
cd backend
docker-compose up --build
```

### 2. Test Login Endpoint
```bash
# Register a new user first
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DONOR"
  }'

# Expected response:
# {
#   "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
#   "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
#   "tokenType": "Bearer",
#   "expiresIn": 86400,
#   "user": {...}
# }
```

### 3. Test Login with Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### 4. Test Protected Endpoint
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Test Token Refresh
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
VITE_API_URL=http://localhost:8080
```

### 3. Start Frontend
```bash
npm run dev
```

### 4. Test Authentication
1. Navigate to http://localhost:5173/login
2. Try demo login buttons or register new account
3. Verify token storage in browser DevTools
4. Test protected routes like /profile

## Security Best Practices Implemented

1. **Password Security**
   - BCrypt hashing with strength 10
   - Minimum 8 characters required
   - Compared securely on login

2. **Token Management**
   - Short-lived access tokens (24 hours)
   - Longer refresh tokens (7 days)
   - Tokens never exposed in URLs
   - Stored in localStorage on frontend

3. **CORS Configuration**
   - Whitelist specific origins
   - Allow necessary HTTP methods
   - Expose required headers

4. **RBAC**
   - Method-level access control with @PreAuthorize
   - Role-based endpoint filtering
   - Automatic unauthorized response

5. **Error Handling**
   - Consistent error format
   - No sensitive information in errors
   - Proper HTTP status codes

6. **API Gateway**
   - Single entry point for all services
   - Authentication filtering
   - Request/response logging

## Troubleshooting

### Frontend Can't Connect to Backend
**Solution:**
- Check API_URL environment variable
- Verify backend is running on port 8080
- Check CORS settings in backend

### Token Always Expires
**Solution:**
- Check JWT_EXPIRATION_MS value
- Verify system clock synchronization
- Check token validation logic

### CORS Errors
**Solution:**
- Add frontend URL to CORS whitelist in SecurityConfig
- Ensure Authorization header is exposed
- Check preflight requests are allowed

### Invalid Token Error
**Solution:**
- Verify JWT_SECRET matches frontend and backend
- Check token hasn't been modified
- Ensure token is not expired
- Verify Authorization header format: "Bearer TOKEN"

## Next Steps

1. Add email verification during registration
2. Implement password reset functionality
3. Add refresh token rotation
4. Implement token blacklist for logout
5. Add multi-factor authentication
6. Implement session management
7. Add audit logging for auth events

## Support

For issues or questions:
1. Check logs in backend: `docker-compose logs -f user-service`
2. Check browser console for frontend errors
3. Review backend exception stack traces
4. Verify environment variables are set correctly
