# Authentication Quick Start

## Start Everything (5 minutes)

### 1. Start Backend Services
```bash
cd backend
docker-compose up --build
```

Wait for all services to be healthy (2-3 minutes). You'll see:
```
user-service      | Started UserServiceApplication
api-gateway       | Started ApiGatewayApplication
```

### 2. Start Frontend
In a new terminal:
```bash
npm run dev
```

### 3. Test Authentication

Open http://localhost:5173 and:
1. Click "Sign In"
2. Try demo login buttons (Donor, Hospital, Patient)
3. Login with test credentials

OR register a new account:
1. Click "Register here"
2. Fill the form
3. Click "Create Donor Account"
4. Redirects to login automatically

## API Testing (curl)

### Register User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@1234",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DONOR"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DONOR",
    "status": "PENDING_VERIFICATION"
  }
}
```

### Login User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@1234"
  }'
```

### Get Current User (Protected)
```bash
# Replace TOKEN with the accessToken from response above
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "REFRESH_TOKEN_HERE"
  }'
```

## Browser DevTools Verification

1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Check these keys:
   - `bl_token` - Access token
   - `bl_refresh_token` - Refresh token
   - `bl_user` - User object
   - `bl_token_expires` - Expiration timestamp

4. View network requests:
   - Check Authorization header in requests
   - Should be: `Authorization: Bearer eyJ...`

## Verify Protected Routes

1. Login successfully
2. Try accessing protected routes:
   - http://localhost:5173/profile
   - http://localhost:5173/dashboard/donor

3. Try accessing without authentication:
   - Refresh page (tokens stay, should still work)
   - Clear localStorage tokens
   - Try accessing protected route (should redirect to login)

## Common Issues & Fixes

### Backend won't start
```bash
# Clean and rebuild
docker-compose down -v
docker-compose up --build
```

### "Cannot connect to backend" error
- Verify backend is running: `docker ps`
- Check API_URL in frontend: Should be http://localhost:8080
- Check CORS in backend logs: `docker-compose logs -f user-service`

### "Invalid token" on protected routes
- Clear localStorage and login again
- Check token expiration in DevTools
- Verify JWT_SECRET is set

### CORS errors
- Check browser console for blocked requests
- Verify frontend URL is in CORS whitelist
- Restart backend after config changes

## File Locations

**Backend JWT Code:**
- `backend/user-service/src/main/java/com/bloodlink/user/security/` - JWT logic
- `backend/user-service/src/main/java/com/bloodlink/user/controller/AuthController.java` - Endpoints

**Frontend Auth Code:**
- `src/services/authService.js` - API calls
- `src/context/AuthContext.jsx` - State management
- `src/components/login/LoginForm.jsx` - Login UI
- `src/components/register/DonorRegisterForm.jsx` - Register UI

## Next: Integration Testing

1. **Test registration flow**
   - Register new user
   - Verify tokens in localStorage
   - Verify user object saved
   - Check database for user record

2. **Test login flow**
   - Login with registered user
   - Verify tokens refreshed
   - Verify role-based redirect

3. **Test protected endpoints**
   - Access protected routes with token
   - Try accessing without token (should fail)
   - Try with invalid token (should fail)

4. **Test token refresh**
   - Wait for access token to expire (manual test)
   - Or modify expiration time for testing
   - Verify refresh token generates new access token

5. **Test role-based access**
   - Register as DONOR
   - Try STAFF-only endpoints (should fail)
   - Verify RBAC working correctly

## Documentation

- **Full Guide:** Read `AUTHENTICATION_INTEGRATION_GUIDE.md`
- **Implementation Details:** Read `AUTH_IMPLEMENTATION_SUMMARY.md`
- **Backend Architecture:** Read `backend/ARCHITECTURE.md`

## Production Checklist

Before deploying to production:
- [ ] Change JWT_SECRET to a secure value
- [ ] Increase token expiration appropriately
- [ ] Update CORS whitelist with production URLs
- [ ] Enable HTTPS/SSL
- [ ] Use environment variables for secrets
- [ ] Set up token blacklist for logout
- [ ] Enable audit logging
- [ ] Test with production database
- [ ] Set up monitoring/alerts
- [ ] Document deployment process

## Support

For detailed troubleshooting, see AUTHENTICATION_INTEGRATION_GUIDE.md

Common endpoints to test:
- http://localhost:8080/actuator/health - Backend health
- http://localhost:8080/api/auth/login - Login endpoint
- http://localhost:8080/api/users/register - Register endpoint
