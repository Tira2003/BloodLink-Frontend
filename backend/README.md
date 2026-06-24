# BloodLink Backend - Microservices Architecture

## Overview
BloodLink Backend is a Java Spring Boot microservices architecture designed to manage blood donation requests, donor matching, and reward systems. It integrates with Supabase PostgreSQL for data persistence.

## Architecture

### Services
1. **Auth Service** (Port 8081) - Authentication and JWT token management
2. **Core Service** (Port 8082) - Donors, Blood Requests, Camps, Matching, Rewards
3. **Notification Service** (Port 8083) - Email notifications and event handling

### Database
- **Supabase PostgreSQL** with the following tables:
  - `users` - User accounts with roles (DONOR, PATIENT, HOSPITAL)
  - `donors` - Donor profiles with blood type and reward points
  - `blood_requests` - Blood donation requests
  - `request_responses` - Donor responses to requests
  - `donation_camps` - Blood donation camps
  - `rewards` - Reward points history
  - `notifications` - In-app notifications

## Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL (via Supabase)

## Environment Variables
```bash
# Database Configuration
POSTGRES_URL=jdbc:postgresql://host:5432/database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password

# Auth Service
JWT_SECRET=your-secret-key-min-32-chars

# Notification Service
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Building the Project

### Build All Services
```bash
cd backend
mvn clean package
```

### Build Individual Service
```bash
mvn clean package -pl auth-service
mvn clean package -pl core-service
mvn clean package -pl notification-service
```

## Running the Services

### Auth Service
```bash
cd auth-service
mvn spring-boot:run
```

### Core Service
```bash
cd core-service
mvn spring-boot:run
```

### Notification Service
```bash
cd notification-service
mvn spring-boot:run
```

## API Endpoints

### Auth Service (`/api/auth`)
- `POST /register` - Register new user (DONOR, PATIENT, HOSPITAL)
- `POST /login` - Login with email and password
- `POST /refresh` - Refresh JWT access token

### Core Service

#### Donors (`/api/core/donors`)
- `POST /` - Create donor profile
- `GET /user/{userId}` - Get donor by user ID
- `GET /{donorId}` - Get donor by donor ID
- `PUT /{donorId}` - Update donor profile
- `GET /blood-type/{bloodType}` - Get donors by blood type
- `POST /{donorId}/activate` - Activate donor
- `POST /{donorId}/deactivate` - Deactivate donor

#### Blood Requests (`/api/core/requests`)
- `POST /` - Create blood request (triggers matching)
- `GET /` - Get all active requests
- `GET /{requestId}` - Get specific request
- `GET /blood-type/{bloodType}` - Filter by blood type
- `GET /district/{district}` - Filter by district
- `PUT /{requestId}` - Update request
- `POST /{requestId}/fulfill` - Mark as fulfilled (awards points)
- `POST /{requestId}/respond` - Donor response (accept/reject)
- `GET /user/{userId}` - Get user's requests

#### Camps (`/api/core/camps`)
- `POST /` - Create donation camp
- `GET /` - Get all active camps
- `GET /{campId}` - Get camp details
- `GET /district/{district}` - Get camps by district
- `GET /organizer/{organizerId}` - Get camps by organizer
- `PUT /{campId}` - Update camp
- `POST /{campId}/deactivate` - Deactivate camp
- `POST /{campId}/update-units` - Update collected units

#### Rewards (`/api/core/rewards`)
- `GET /donors/{donorId}` - Get donor reward points

## Key Features

### Smart Donor Matching
- Blood type compatibility matching
- Geographic proximity filtering (district-based)
- Limited notifications (top 5 matches per request)

### Reward System
- 50 points for accepting a donation request
- 100 points for completing a donation
- Points accumulated in donor profile

### Event-Driven Architecture
- Donation matched events trigger notifications
- Asynchronous email notifications
- In-app notification support

## Database Schema

### Blood Types
`O_NEG`, `O_POS`, `A_NEG`, `A_POS`, `B_NEG`, `B_POS`, `AB_NEG`, `AB_POS`

### User Roles
`DONOR`, `PATIENT`, `HOSPITAL`

### Request Status
`ACTIVE`, `FULFILLED`, `CANCELLED`

### Response Status
`ACCEPTED`, `REJECTED`, `COMPLETED`

## Testing
Run tests with:
```bash
mvn test
```

## Deployment
1. Build all services: `mvn clean package`
2. Deploy each service to your server/cloud platform
3. Ensure environment variables are configured
4. Services will automatically initialize database connections

## Future Enhancements
- OAuth2 integration
- Real-time notifications (WebSocket)
- Advanced blood type compatibility matrix
- Analytics and reporting dashboard
- Mobile app integration

## Support
For issues or questions, please contact the development team.
