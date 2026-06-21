# BloodLink Backend - Project Index

## Quick Navigation

### Getting Started
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions (READ THIS FIRST!)
- **[README.md](README.md)** - Project overview and API reference
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and architecture details

### Docker & Deployment
- **docker-compose.yml** - Complete Docker Compose configuration
- **docker-compose-up.sh** - Quick start script
- **Dockerfile** files - Build configurations for each service

### Database
- **supabase-schema.sql** - Complete database schema with migrations

---

## Project Structure

```
backend/
│
├── 📄 Configuration Files
│   ├── docker-compose.yml          # Docker Compose orchestration
│   ├── docker-compose-up.sh        # Quick start script
│   ├── SETUP_GUIDE.md              # Complete setup instructions
│   ├── README.md                   # Project overview
│   ├── ARCHITECTURE.md             # System architecture
│   └── PROJECT_INDEX.md            # This file
│
├── 🗄️ Database
│   └── supabase-schema.sql         # Database schema and migrations
│
├── 🚪 api-gateway/
│   ├── pom.xml                     # Maven configuration
│   ├── Dockerfile                  # Build configuration
│   ├── src/main/java/com/bloodlink/gateway/
│   │   ├── ApiGatewayApplication.java   # Main application class
│   │   └── config/
│   │       └── GatewayConfig.java       # Route configuration
│   └── src/main/resources/
│       └── application.yml         # Service configuration
│
├── 👤 user-service/
│   ├── pom.xml                     # Maven configuration
│   ├── Dockerfile                  # Build configuration
│   ├── src/main/java/com/bloodlink/user/
│   │   ├── UserServiceApplication.java  # Main application class
│   │   ├── entity/                      # JPA entities
│   │   │   ├── User.java
│   │   │   ├── Donor.java
│   │   │   ├── Hospital.java
│   │   │   ├── UserRole.java
│   │   │   ├── UserStatus.java
│   │   │   └── BloodType.java
│   │   ├── dto/                         # Data Transfer Objects
│   │   │   ├── UserDTO.java
│   │   │   ├── DonorDTO.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── [other DTOs]
│   │   ├── repository/                  # Spring Data JPA repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── DonorRepository.java
│   │   │   └── HospitalRepository.java
│   │   ├── service/                     # Business logic
│   │   │   ├── UserService.java
│   │   │   ├── DonorService.java
│   │   │   └── HospitalService.java
│   │   ├── controller/                  # REST endpoints
│   │   │   ├── UserController.java
│   │   │   ├── DonorController.java
│   │   │   └── HospitalController.java
│   │   └── config/
│   │       └── SecurityConfig.java      # Security & CORS config
│   └── src/main/resources/
│       └── application.yml         # Service configuration
│
├── 💉 donation-service/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── src/main/java/com/bloodlink/donation/
│   │   └── DonationServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── 📦 inventory-service/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── src/main/java/com/bloodlink/inventory/
│   │   └── InventoryServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── 📢 notification-service/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── src/main/java/com/bloodlink/notification/
│   │   └── NotificationServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
└── 🔧 common/
    └── [Shared libraries and utilities - to be added]
```

---

## Service Ports

| Service | Port | Health Check |
|---------|------|--------------|
| API Gateway | 8080 | http://localhost:8080/actuator/health |
| User Service | 8081 | http://localhost:8081/actuator/health |
| Donation Service | 8082 | http://localhost:8082/actuator/health |
| Inventory Service | 8083 | http://localhost:8083/actuator/health |
| Notification Service | 8084 | http://localhost:8084/actuator/health |
| PostgreSQL | 5432 | psql -h localhost -U postgres |

---

## Key Files by Purpose

### Database Schema & Migrations
- `supabase-schema.sql` - Complete database schema including:
  - User and user role tables
  - Donor, Patient, Hospital tables
  - Blood donation tracking
  - Inventory management
  - Notification system
  - Indexes and views
  - Row-level security policies

### Configuration & Deployment
- `docker-compose.yml` - All services and dependencies
- `Dockerfile` files - Individual service build configs
- `application.yml` files - Spring Boot configurations
- `pom.xml` files - Maven dependencies and build settings

### User Service Implementation
- `user-service/src/main/java/com/bloodlink/user/controller/UserController.java`
  - User registration and authentication endpoints
  - User CRUD operations
  - User verification workflow

- `user-service/src/main/java/com/bloodlink/user/controller/DonorController.java`
  - Donor profile management
  - Donation recording
  - Eligible donor queries

- `user-service/src/main/java/com/bloodlink/user/service/UserService.java`
  - User business logic and validation
  - User lifecycle management

- `user-service/src/main/java/com/bloodlink/user/service/DonorService.java`
  - Donor-specific operations
  - Donation tracking logic

- `user-service/src/main/java/com/bloodlink/user/entity/User.java`
  - Core user entity with all roles
  - Authentication data

- `user-service/src/main/java/com/bloodlink/user/entity/Donor.java`
  - Donor-specific information
  - Medical history and contacts

- `user-service/src/main/java/com/bloodlink/user/repository/UserRepository.java`
  - User database queries
  - Custom finder methods

### API Gateway
- `api-gateway/src/main/java/com/bloodlink/gateway/config/GatewayConfig.java`
  - Route definitions for all services
  - Request path-to-service mapping

---

## Development Workflows

### Starting Development
```bash
# From project root
cd backend

# Start all services
docker-compose up --build

# Or use quick start script
chmod +x docker-compose-up.sh
./docker-compose-up.sh
```

### Adding a New Endpoint

1. **Identify target service** (user-service, donation-service, etc.)
2. **Create Entity** → `entity/EntityName.java`
3. **Create DTO** → `dto/EntityDTO.java`
4. **Create Repository** → `repository/EntityRepository.java`
5. **Create Service** → `service/EntityService.java`
6. **Create Controller** → `controller/EntityController.java`
7. **Update Database** → Add migration to `supabase-schema.sql`
8. **Test endpoint** → Use curl or Postman

### Running Tests
```bash
cd user-service
mvn test
```

### Building Single Service
```bash
cd user-service
mvn clean package
```

---

## API Endpoints Overview

### User Service (Port 8081)
```
POST   /api/users/register              - Register new user
GET    /api/users/{id}                  - Get user by ID
GET    /api/users/email/{email}         - Get user by email
GET    /api/users/role/{role}           - Get users by role
PUT    /api/users/{id}                  - Update user profile
DELETE /api/users/{id}                  - Delete user
POST   /api/users/{id}/verify           - Verify/activate user

POST   /api/donors/{userId}             - Create donor profile
GET    /api/donors/{id}                 - Get donor by ID
GET    /api/donors/user/{userId}        - Get donor for user
GET    /api/donors/eligible             - Get all eligible donors
PUT    /api/donors/{id}                 - Update donor profile
POST   /api/donors/{id}/record-donation - Record a donation
DELETE /api/donors/{id}                 - Delete donor profile
```

### Donation Service (Port 8082)
```
POST   /api/donations                   - Create donation record
GET    /api/donations/{id}              - Get donation details
GET    /api/donations/donor/{donorId}   - Get donor donations
PUT    /api/donations/{id}              - Update donation status
DELETE /api/donations/{id}              - Cancel donation

POST   /api/donations/appointments      - Schedule appointment
GET    /api/donations/appointments      - List appointments
PUT    /api/donations/appointments/{id} - Update appointment
DELETE /api/donations/appointments/{id} - Cancel appointment
```

### Inventory Service (Port 8083)
```
POST   /api/blood-units                 - Add blood unit
GET    /api/blood-units/{id}            - Get unit details
GET    /api/inventory/hospital/{hospitalId} - Get hospital inventory
GET    /api/inventory/blood-type/{type} - Filter by blood type
PUT    /api/blood-units/{id}/reserve    - Reserve unit
PUT    /api/blood-units/{id}/transfuse  - Mark as transfused
POST   /api/inventory/transfer          - Transfer between hospitals
GET    /api/inventory/expiring          - Get expiring units
```

### Notification Service (Port 8084)
```
POST   /api/notifications               - Send notification
GET    /api/notifications/user/{userId} - Get user notifications
PUT    /api/notifications/{id}/read     - Mark as read
GET    /api/notifications/preferences/{userId} - Get preferences
PUT    /api/notifications/preferences/{userId} - Update preferences
POST   /api/notifications/{id}/retry    - Retry failed notification
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Spring Boot | 3.2.0 |
| API Gateway | Spring Cloud Gateway | 2023.0.0 |
| Language | Java | 17 LTS |
| Database | PostgreSQL | 15+ |
| ORM | Hibernate/JPA | 6.x |
| Security | Spring Security | Latest |
| JWT | jjwt | 0.12.3 |
| Build | Maven | 3.9+ |
| Containerization | Docker | 20.10+ |
| Orchestration | Docker Compose | 1.29+ |

---

## Development Standards

### Code Organization
- One entity per file
- One service per file
- One controller per logical resource
- DTOs for API contracts

### Naming Conventions
- Classes: PascalCase (UserService)
- Methods: camelCase (getUserById)
- Constants: UPPER_SNAKE_CASE
- Database tables: snake_case (blood_units)
- Database columns: snake_case (blood_type)

### Dependencies
- Use Spring Data JPA for database access
- Use DTOs for API responses
- Use BCrypt for password hashing
- Use Lombok to reduce boilerplate

---

## Common Commands Reference

### Docker Compose
```bash
docker-compose up --build           # Start with rebuild
docker-compose down                 # Stop all services
docker-compose down -v              # Stop and clean volumes
docker-compose ps                   # List running services
docker-compose logs -f user-service # View service logs
docker-compose exec <service> bash  # Access container shell
```

### Maven
```bash
mvn clean install                   # Build all services
mvn clean package                   # Build only (skip tests)
mvn spring-boot:run                 # Run service locally
mvn test                            # Run unit tests
mvn dependency:tree                 # View dependency tree
```

### PostgreSQL
```bash
psql -h localhost -U postgres       # Connect to database
\dt                                 # List tables
\ds                                 # List sequences
SELECT * FROM users;                # Query users
\q                                  # Exit
```

### Curl API Testing
```bash
# GET request
curl http://localhost:8080/api/users/{id}

# POST request
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# PUT request
curl -X PUT http://localhost:8080/api/users/{id} \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John"}'

# DELETE request
curl -X DELETE http://localhost:8080/api/users/{id}
```

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Ports in use | Kill processes using ports 8080-8084, 5432 |
| DB connection failed | Ensure PostgreSQL is running |
| Docker build fails | `docker system prune` and retry |
| Services won't start | Check logs: `docker-compose logs -f` |
| Schema not applied | Restart with `docker-compose down -v` |

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.

---

## Next Steps

1. **Read Setup Guide** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. **Review Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Start Services** → `docker-compose up --build`
4. **Test Endpoints** → Use provided curl examples
5. **Extend Services** → Add new entities and endpoints
6. **Implement Features** → Add authentication, integrate Supabase
7. **Deploy** → Push to cloud platform

---

## Additional Resources

### Documentation Files
- API Documentation (to be generated with Swagger)
- Service-specific READMEs (to be created)
- Database migration guide (to be created)

### External Resources
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Support & Questions

For issues or questions:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Check service logs: `docker-compose logs -f service-name`
4. Refer to [README.md](README.md) for API reference

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Status**: Complete & Ready for Development
