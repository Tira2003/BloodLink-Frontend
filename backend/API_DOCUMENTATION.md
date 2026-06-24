# BloodLink Backend - API Documentation

## Base URLs
- **Auth Service**: `http://localhost:8081`
- **Core Service**: `http://localhost:8082`
- **Notification Service**: `http://localhost:8083`

## Authentication
All endpoints (except auth endpoints) require JWT Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Service API

### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91234567890",
  "district": "Mumbai",
  "role": "DONOR"
}
```

**Roles:** `DONOR`, `PATIENT`, `HOSPITAL`

**Response (201):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DONOR",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Email already registered"
}
```

---

### POST /api/auth/login
Login with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DONOR",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### POST /api/auth/refresh
Refresh access token

**Request Header:**
```
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "Token refreshed successfully"
}
```

---

## Core Service API

### Donors

#### POST /api/core/donors
Create donor profile

**Request Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "bloodType": "O_POS",
  "gender": "MALE",
  "dateOfBirth": "1990-01-15",
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

**Response (201):**
```json
{
  "id": "donor-uuid",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "bloodType": "O_POS",
  "gender": "MALE",
  "dateOfBirth": "1990-01-15",
  "isActive": true,
  "totalDonations": 0,
  "rewardPoints": 0,
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

#### GET /api/core/donors/user/{userId}
Get donor profile by user ID

**Response (200):**
```json
{
  "id": "donor-uuid",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "bloodType": "O_POS",
  "gender": "MALE",
  "isActive": true,
  "totalDonations": 5,
  "rewardPoints": 500,
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

#### GET /api/core/donors/{donorId}
Get donor by ID

#### PUT /api/core/donors/{donorId}
Update donor profile

**Request Body:**
```json
{
  "latitude": 19.1760,
  "longitude": 72.9777
}
```

#### GET /api/core/donors/blood-type/{bloodType}
Get all donors by blood type

**Response (200):**
```json
[
  {
    "id": "donor-uuid-1",
    "bloodType": "O_POS",
    "isActive": true,
    "rewardPoints": 500
  },
  {
    "id": "donor-uuid-2",
    "bloodType": "O_POS",
    "isActive": true,
    "rewardPoints": 250
  }
]
```

#### POST /api/core/donors/{donorId}/activate
Activate donor account

#### POST /api/core/donors/{donorId}/deactivate
Deactivate donor account

---

### Blood Requests

#### POST /api/core/requests
Create blood request (triggers matching)

**Request Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "bloodType": "O_POS",
  "quantityNeeded": 2,
  "urgency": "URGENT",
  "hospitalName": "City Hospital",
  "district": "Mumbai",
  "locationDetails": "Room 101, Ward A",
  "reason": "Emergency surgery"
}
```

**Response (201):**
```json
{
  "id": "request-uuid",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "bloodType": "O_POS",
  "quantityNeeded": 2,
  "status": "ACTIVE",
  "urgency": "URGENT",
  "hospitalName": "City Hospital",
  "district": "Mumbai",
  "createdAt": "2024-06-14T10:30:00",
  "fulfilledDate": null
}
```

#### GET /api/core/requests
Get all active blood requests

**Response (200):**
```json
[
  {
    "id": "request-uuid-1",
    "bloodType": "O_POS",
    "status": "ACTIVE",
    "urgency": "URGENT",
    "hospitalName": "City Hospital",
    "district": "Mumbai",
    "createdAt": "2024-06-14T10:30:00"
  }
]
```

#### GET /api/core/requests/{requestId}
Get specific blood request

#### GET /api/core/requests/blood-type/{bloodType}
Get requests by blood type

#### GET /api/core/requests/district/{district}
Get requests by district

#### PUT /api/core/requests/{requestId}
Update blood request

**Request Body:**
```json
{
  "quantityNeeded": 3,
  "urgency": "CRITICAL"
}
```

#### POST /api/core/requests/{requestId}/respond
Donor response to request

**Query Parameters:**
- `donorId`: UUID of donor
- `response`: `ACCEPT` or `REJECT`

**Response (200):**
```json
{
  "message": "Response recorded successfully"
}
```

#### POST /api/core/requests/{requestId}/fulfill
Mark request as fulfilled (awards points to donors)

**Response (200):**
```json
{
  "id": "request-uuid",
  "status": "FULFILLED",
  "fulfilledDate": "2024-06-14T15:45:00"
}
```

#### GET /api/core/requests/user/{userId}
Get user's blood requests

---

### Donation Camps

#### POST /api/core/camps
Create donation camp

**Request Body:**
```json
{
  "name": "World Blood Donor Day Camp",
  "organizerId": "123e4567-e89b-12d3-a456-426614174000",
  "locationName": "Central Park",
  "district": "Mumbai",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "startDate": "2024-06-14T08:00:00",
  "endDate": "2024-06-14T18:00:00",
  "targetUnits": 100,
  "description": "Annual blood donation camp"
}
```

**Response (201):**
```json
{
  "id": "camp-uuid",
  "name": "World Blood Donor Day Camp",
  "organizerId": "123e4567-e89b-12d3-a456-426614174000",
  "locationName": "Central Park",
  "district": "Mumbai",
  "startDate": "2024-06-14T08:00:00",
  "endDate": "2024-06-14T18:00:00",
  "targetUnits": 100,
  "collectedUnits": 0,
  "isActive": true
}
```

#### GET /api/core/camps
Get all active camps

#### GET /api/core/camps/{campId}
Get camp details

#### GET /api/core/camps/district/{district}
Get camps by district

#### GET /api/core/camps/organizer/{organizerId}
Get camps by organizer

#### PUT /api/core/camps/{campId}
Update camp details

**Request Body:**
```json
{
  "name": "Updated Camp Name",
  "targetUnits": 150
}
```

#### POST /api/core/camps/{campId}/deactivate
Deactivate camp

#### POST /api/core/camps/{campId}/update-units
Update collected units

**Query Parameters:**
- `units`: Number of units collected

**Response (200):**
```json
{
  "message": "Units updated successfully"
}
```

---

### Rewards

#### GET /api/core/rewards/donors/{donorId}
Get donor reward points

**Response (200):**
```json
500
```

---

## Blood Type Compatibility

**Can Receive From:**
- O-: Universal donor
- O+: O+, O-
- A+: A+, A-, O+, O-
- A-: A-, O-
- B+: B+, B-, O+, O-
- B-: B-, O-
- AB+: All types (Universal recipient)
- AB-: A-, B-, O-, AB-

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid request parameters",
  "details": {
    "field": "email",
    "message": "Email should be valid"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **Auth Endpoints**: 5 requests per minute per IP
- **Core Endpoints**: 100 requests per minute per user
- **Notification Endpoints**: 10 requests per minute per user

---

## Pagination

Endpoints support pagination with query parameters:
```
GET /api/core/requests?page=1&size=20&sort=createdAt,desc
```

---

## Filtering

Blood requests can be filtered by multiple criteria:
```
GET /api/core/requests?bloodType=O_POS&district=Mumbai&status=ACTIVE
```

---

## Webhooks (Future)

Webhook events will be sent to configured endpoints:
- `donation.matched`
- `donation.accepted`
- `donation.completed`
- `camp.created`
- `camp.closed`

---

## Version History

- **v1.0.0** (Current): Initial release with core features
- v2.0.0 (Planned): WebSocket for real-time notifications
- v3.0.0 (Planned): Advanced matching algorithm

---

## Support

For API issues or questions:
- Email: api-support@bloodlink.com
- Slack: #api-support
- Documentation: https://docs.bloodlink.com
