# Authentication Implementation - Test Checklist

## Pre-Test Setup

- [ ] Backend services running: `docker-compose up --build`
- [ ] Frontend running: `npm run dev`
- [ ] Browser DevTools open
- [ ] Postman or curl ready for API testing

## Backend Service Tests

### JWT Infrastructure (Port 8081)

#### Token Generation
- [ ] Register user returns JWT tokens
- [ ] Access token contains email, userId, role claims
- [ ] Refresh token marked with "type": "REFRESH"
- [ ] Token expiration times correct (24h access, 7d refresh)
- [ ] Tokens are valid HS512 signed

#### Token Validation
- [ ] Valid token accepted on protected endpoints
- [ ] Invalid signature rejected with 401
- [ ] Expired token rejected with 401
- [ ] Missing token rejected with 401
- [ ] Malformed token rejected with 401

#### Token Claims Extraction
- [ ] Email extracted correctly from token
- [ ] UserId extracted correctly from token
- [ ] Role extracted correctly from token
- [ ] Claims are accurate in all endpoints

### Authentication Endpoints

#### POST /api/auth/login
- [ ] Valid credentials return tokens and user
- [ ] Invalid email returns 401
- [ ] Invalid password returns 401
- [ ] Missing fields returns 400 validation error
- [ ] Response includes correct user info
- [ ] Suspended accounts cannot login

#### POST /api/users/register
- [ ] Valid data creates user and returns tokens
- [ ] Duplicate email rejected with 400
- [ ] Missing required fields rejected with validation errors
- [ ] Password hashed securely (check DB)
- [ ] Response includes access token
- [ ] Response includes refresh token
- [ ] Response includes user object with correct role

#### POST /api/auth/refresh
- [ ] Valid refresh token returns new access token
- [ ] Invalid refresh token returns 401
- [ ] New access token is valid
- [ ] User info unchanged after refresh
- [ ] Old access token still works (until expires)

#### POST /api/auth/logout
- [ ] Logout succeeds with valid token
- [ ] Logout succeeds without token (graceful)
- [ ] Returns success message

#### GET /api/auth/me
- [ ] Returns current user with valid token
- [ ] Returns 401 without token
- [ ] Returns 401 with invalid token
- [ ] User data matches stored user

### Security Configuration

#### CORS
- [ ] Frontend URLs in whitelist
- [ ] Preflight requests return 200
- [ ] Authorization header exposed
- [ ] Credentials allowed
- [ ] Max-age set to 3600

#### CSRF
- [ ] CSRF protection disabled (stateless API)
- [ ] No CSRF token required in requests

#### Session Management
- [ ] Stateless session creation
- [ ] No server sessions created
- [ ] No cookies set for auth

#### Public vs Protected
- [ ] /api/auth/login - Public
- [ ] /api/users/register - Public
- [ ] /api/auth/me - Protected (requires token)
- [ ] /api/donors/{id} - Protected (requires token)
- [ ] /actuator/health - Public

### Role-Based Access Control

#### RBAC Enforcement
- [ ] DONOR can create/update own donor profile
- [ ] DONOR cannot delete any donor
- [ ] ADMIN can delete any donor
- [ ] STAFF can record donations
- [ ] DONOR cannot record donations
- [ ] Invalid role gets 403 Forbidden

#### @PreAuthorize Annotations
- [ ] Method-level security working
- [ ] Multiple roles (or) properly evaluated
- [ ] Role checking case-insensitive
- [ ] Missing role returns 403

### Error Handling

#### Exception Responses
- [ ] 401 errors return "Unauthorized"
- [ ] 403 errors return "Forbidden"
- [ ] 404 errors return "Not Found"
- [ ] 400 errors include validation details
- [ ] 500 errors logged but don't expose details
- [ ] All errors are JSON formatted

#### Error Message Format
- [ ] Includes timestamp
- [ ] Includes status code
- [ ] Includes error type
- [ ] Includes user message
- [ ] Includes request path

### Database Integration

#### User Storage
- [ ] User created in database on registration
- [ ] Email unique constraint enforced
- [ ] Password stored as BCrypt hash
- [ ] Role stored correctly
- [ ] Status set to PENDING_VERIFICATION
- [ ] Timestamps set correctly

#### Query Methods
- [ ] findByEmail() returns correct user
- [ ] existsByEmail() returns true for existing
- [ ] existsByEmail() returns false for non-existing
- [ ] findByRole() returns correct users

## Frontend Service Tests

### Auth Service (API Layer)

#### Login Function
- [ ] POST to /api/auth/login with credentials
- [ ] Returns user and tokens on success
- [ ] Throws error on invalid credentials
- [ ] Stores tokens in localStorage
- [ ] Stores user object in localStorage

#### Register Function
- [ ] POST to /api/users/register with form data
- [ ] Maps frontend form to backend format
- [ ] Returns user and tokens on success
- [ ] Stores tokens and user
- [ ] Handles server errors gracefully

#### Token Management
- [ ] getStoredToken() returns stored token
- [ ] getStoredUser() returns stored user
- [ ] isTokenExpired() correctly detects expiration
- [ ] Tokens persisted to localStorage
- [ ] Refresh token stored separately

#### Refresh Token Function
- [ ] Called when token about to expire
- [ ] Posts to /api/auth/refresh
- [ ] Updates localStorage with new token
- [ ] Returns new AuthResponse

### Auth Context

#### State Management
- [ ] user state tracks current user
- [ ] isAuthenticated state tracks auth status
- [ ] loading state shows while checking
- [ ] error state holds error messages

#### Login/Register Methods
- [ ] login() calls authService.login()
- [ ] login() updates user state
- [ ] login() sets isAuthenticated
- [ ] register() calls authService.register()
- [ ] register() sets user state
- [ ] Both handle errors properly

#### Logout Method
- [ ] logout() calls authService.logout()
- [ ] logout() clears user state
- [ ] logout() sets isAuthenticated false
- [ ] logout() clears localStorage
- [ ] logout() clears error messages

#### Role Checking
- [ ] hasRole(role) returns true/false
- [ ] hasRole() works with single role
- [ ] hasRole() works with role array
- [ ] hasRole() returns false when not authenticated

#### Token Auto-Refresh
- [ ] On init, checks token expiration
- [ ] Calls refresh if token expired
- [ ] Updates user from refresh response
- [ ] Falls back to logout if refresh fails

### Authentication Pages

#### Login Page
- [ ] Renders login form
- [ ] Collects email and password
- [ ] Shows password visibility toggle
- [ ] Demo login buttons work
- [ ] Submit button disabled while loading
- [ ] Error messages display

#### Login Form Behavior
- [ ] Validates required fields
- [ ] Calls login() on submit
- [ ] Shows loading spinner
- [ ] Displays error messages
- [ ] Redirects to requests page after login
- [ ] Redirects based on user role
- [ ] Links to register page

#### Register Page
- [ ] Renders register form
- [ ] Collects all required fields
- [ ] Validates form locally
- [ ] Submits to register endpoint
- [ ] Shows loading state
- [ ] Displays server errors
- [ ] Shows success page after registration
- [ ] Links to login from success

### Protected Routes

#### ProtectedRoute Component
- [ ] Renders children when authenticated
- [ ] Redirects to login when not authenticated
- [ ] Shows loading state while checking
- [ ] Checks user role if required
- [ ] Redirects to home if wrong role
- [ ] Uses location.pathname for fallback

#### Route Protection
- [ ] /profile requires DONOR role
- [ ] /dashboard/* requires authentication
- [ ] Unauthenticated access redirects to login
- [ ] Wrong role access redirects to home

## Integration Tests

### Registration to Login Flow
- [ ] Register new user
- [ ] Verify tokens in localStorage
- [ ] Verify user object stored
- [ ] Logout
- [ ] Verify localStorage cleared
- [ ] Login with same credentials
- [ ] Verify authentication successful

### Protected Route Access
- [ ] Login as DONOR
- [ ] Access /profile (should work)
- [ ] Access /dashboard/hospital (should redirect)
- [ ] Logout
- [ ] Try accessing /profile (redirect to login)
- [ ] Login as ADMIN
- [ ] Verify different dashboard access

### Token Expiration Handling
- [ ] Login successfully
- [ ] Note access token expiration
- [ ] Wait for manual expiration (or modify time)
- [ ] Try accessing protected route
- [ ] Should refresh token automatically
- [ ] Should work after refresh
- [ ] No manual login required

### API Request/Response
- [ ] Authorization header included in requests
- [ ] Token format: "Bearer TOKEN"
- [ ] Responses include CORS headers
- [ ] Error responses properly formatted
- [ ] Status codes appropriate

## Performance Tests

- [ ] Login completes in < 2 seconds
- [ ] Token refresh in < 1 second
- [ ] Protected route access in < 1 second
- [ ] No memory leaks in auth context
- [ ] No unnecessary re-renders

## Security Tests

### Password Security
- [ ] Passwords not logged anywhere
- [ ] Passwords not sent in responses
- [ ] Passwords hashed before storage
- [ ] BCrypt hash verification works

### Token Security
- [ ] Tokens not logged to client console
- [ ] Tokens not exposed in URLs
- [ ] Tokens stored securely (localStorage)
- [ ] Bearer scheme used correctly
- [ ] HTTPS ready (in production)

### CORS Security
- [ ] Only whitelisted origins accepted
- [ ] Credentials properly configured
- [ ] Headers properly exposed
- [ ] Methods properly restricted

### Role Security
- [ ] Cannot access endpoints with wrong role
- [ ] Cannot escalate privileges
- [ ] Admin-only endpoints protected
- [ ] Role modifications require new login

## Deployment Tests

- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] Docker image builds
- [ ] Docker containers start
- [ ] All services accessible
- [ ] Health checks pass
- [ ] Database migrations run
- [ ] No hardcoded secrets in code

## Regression Tests

- [ ] Existing login functionality works
- [ ] Existing register functionality works
- [ ] Existing protected routes work
- [ ] Existing navigation works
- [ ] Existing data fetching works
- [ ] No breaking changes to API

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## Edge Cases

- [ ] Simultaneous requests with expired token
- [ ] Network error during login
- [ ] Invalid JWT secret returns 401
- [ ] Token tampering detected
- [ ] Empty refresh token handled
- [ ] Very long tokens handled
- [ ] Special characters in email
- [ ] Rapid token refresh calls
- [ ] Logout while token refreshing

## Documentation Tests

- [ ] AUTHENTICATION_INTEGRATION_GUIDE.md accurate
- [ ] AUTH_IMPLEMENTATION_SUMMARY.md complete
- [ ] AUTH_QUICK_START.md works as written
- [ ] All code comments clear
- [ ] Error messages helpful
- [ ] README updated with auth info

## Sign-Off

- [ ] All tests passed
- [ ] No security issues found
- [ ] Performance acceptable
- [ ] Code reviewed
- [ ] Documentation complete
- [ ] Ready for production

## Notes

Document any issues found and their resolutions:

```
Issue: _______________
Status: [ ] Found [ ] Resolved
Fix: _______________
```
