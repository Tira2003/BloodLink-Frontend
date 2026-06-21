# BloodLink Backend - Microservices Architecture

This is the backend of the BloodLink application built using Java Spring Boot microservices architecture with Supabase as the database.

## Architecture Overview

The backend is composed of the following microservices:

### 1. **API Gateway** (Port: 8080)
- Entry point for all client requests
- Routes requests to appropriate microservices
- Handles cross-cutting concerns like authentication, rate limiting

### 2. **User Service** (Port: 8081)
- Manages user accounts (Donors, Patients, Hospitals, Staff, Admin)
- User registration and authentication
- User profile management
- Donor and Hospital specific operations

### 3. **Blood Donation Service** (Port: 8082)
- Manages blood donation records
- Donation appointment scheduling
- Tracks donation history

### 4. **Inventory Service** (Port: 8083)
- Manages blood unit inventory
- Tracks blood unit status and location
- Handles inventory transfers between hospitals
- Expiration management

### 5. **Notification Service** (Port: 8084)
- Sends notifications to users (email, SMS, push)
- Manages notification preferences
- Tracks notification delivery status

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL (via Supabase)
- **API Gateway**: Spring Cloud Gateway
- **Security**: Spring Security with JWT
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose
- **ORM**: Spring Data JPA (Hibernate)

## Project Structure

```
backend/
├── api-gateway/          # Spring Cloud Gateway
├── user-service/         # User management service
├── donation-service/     # Blood donation service
├── inventory-service/    # Blood inventory service
├── notification-service/ # Notification service
├── common/              # Shared libraries and utilities
├── supabase-schema.sql  # Database schema
├── docker-compose.yml   # Docker Compose configuration
└── README.md           # This file
```

## Prerequisites

- Docker & Docker Compose
- Java 17 JDK (for local development without Docker)
- Maven 3.9+ (for local development without Docker)
- PostgreSQL 15+ (only if running without Docker)
- Supabase account (for cloud database integration)

## Getting Started

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start PostgreSQL database
   - Build all microservices
   - Start the API Gateway and all services
   - Apply database schema automatically

3. **Verify services are running**:
   ```bash
   # Check logs
   docker-compose logs -f

   # Check specific service
   docker-compose logs -f user-service

   # Health check
   curl http://localhost:8080/actuator/health
   ```

4. **Stop services**:
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup

#### Step 1: Set up PostgreSQL

```bash
# Using Docker (fastest)
docker run --name bloodlink-postgres \
  -e POSTGRES_DB=bloodlink_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Or install PostgreSQL locally and create the database
createdb -U postgres bloodlink_db
```

#### Step 2: Apply Database Schema

```bash
# Using PostgreSQL client
psql -U postgres -d bloodlink_db -f supabase-schema.sql
```

#### Step 3: Build and Run Each Service

**Build all services**:
```bash
mvn clean install
```

**Run API Gateway**:
```bash
cd api-gateway
mvn spring-boot:run
```

**Run User Service** (in another terminal):
```bash
cd user-service
mvn spring-boot:run
```

Repeat for other services in separate terminals:
```bash
cd donation-service && mvn spring-boot:run
cd inventory-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
```

## API Gateway Routes

The API Gateway routes requests as follows:

```
GET/POST  /api/users/**         → User Service (8081)
GET/POST  /api/donors/**        → User Service (8081)
GET/POST  /api/patients/**      → User Service (8081)
GET/POST  /api/hospitals/**     → User Service (8081)
GET/POST  /api/donations/**     → Donation Service (8082)
GET/POST  /api/inventory/**     → Inventory Service (8083)
GET/POST  /api/blood-units/**   → Inventory Service (8083)
GET/POST  /api/notifications/** → Notification Service (8084)
```

## API Endpoints

### User Service

#### Register a User
```bash
POST /api/users/register
Content-Type: application/json

{
  "email": "donor@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "bloodType": "O_POSITIVE",
  "role": "DONOR",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "postalCode": "10001"
}
```

#### Get User by ID
```bash
GET /api/users/{userId}
```

#### Get User by Email
```bash
GET /api/users/email/{email}
```

#### Update User
```bash
PUT /api/users/{userId}
```

#### Verify User
```bash
POST /api/users/{userId}/verify
```

### Donor Service

#### Create Donor Profile
```bash
POST /api/donors/{userId}
Content-Type: application/json

{
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567891",
  "medicalConditions": "None",
  "medications": "None",
  "allergies": "Penicillin"
}
```

#### Get Eligible Donors
```bash
GET /api/donors/eligible
```

#### Record Donation
```bash
POST /api/donors/{donorId}/record-donation
```

## Database Schema

The database schema includes:

- **Users Table**: Core user information with role-based access
- **Donors Table**: Donor-specific information and donation history
- **Patients Table**: Patient-specific information
- **Hospitals Table**: Hospital/organization information
- **Donations Table**: Blood donation records
- **Blood Units Table**: Inventory of blood units
- **Notifications Table**: Notification records
- **View & Indexes**: For optimized queries

See `supabase-schema.sql` for the complete schema.

## Environment Variables

### API Gateway
```
SPRING_APPLICATION_NAME=api-gateway
```

### User Service
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bloodlink_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Repeat similar environment variables for other services.

## Security

- **Authentication**: JWT tokens (to be implemented)
- **Password Encoding**: BCrypt
- **CORS**: Configured for local development (http://localhost:3000, http://localhost:5173)
- **Database**: Row-level security policies in place

## Logging

Logging is configured at `application.yml` level. Adjust log levels:

```yaml
logging:
  level:
    com.bloodlink: DEBUG
    org.springframework: INFO
```

## Health Checks

Each service exposes health endpoints:

```bash
# API Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:8081/actuator/health

# Other services
curl http://localhost:808x/actuator/health
```

## Common Issues & Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

### Database Connection Errors
- Ensure PostgreSQL is running and accessible
- Verify credentials in `application.yml`
- Check firewall/network settings

### Docker Compose Issues
```bash
# Clean up
docker-compose down -v

# Rebuild
docker-compose up --build

# Check logs
docker-compose logs --tail=100 service-name
```

## Development Guidelines

### Adding a New Microservice

1. **Create service directory** and pom.xml
2. **Define entities** for database tables
3. **Create repositories** using Spring Data JPA
4. **Implement services** with business logic
5. **Create REST controllers** for API endpoints
6. **Add application.yml** configuration
7. **Create Dockerfile** for containerization
8. **Update docker-compose.yml** with new service
9. **Update API Gateway** routing configuration

### Database Migrations

Use Flyway or Liquibase for schema changes:

1. Create migration file in `db/migration/`
2. Name format: `V{version}__{description}.sql`
3. Migration runs automatically on service startup

## Testing

To run tests for a specific service:

```bash
cd service-name
mvn test
```

## Performance Considerations

- Database indexes are created for frequently queried fields
- Connection pooling is configured
- Services are stateless for horizontal scaling
- Caching can be added using Redis for frequently accessed data

## Next Steps

1. Implement JWT authentication and authorization
2. Add inter-service communication (Feign Client)
3. Implement comprehensive error handling
4. Add API documentation (Swagger/SpringDoc)
5. Set up distributed tracing (Spring Cloud Sleuth)
6. Implement circuit breaker pattern (Resilience4j)
7. Add comprehensive logging and monitoring
8. Implement message queues for async communication

## Support

For issues or questions, please refer to the main project README or create an issue in the repository.

## License

This project is part of the BloodLink application. See the main project for license details.
