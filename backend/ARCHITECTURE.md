# BloodLink Microservices Architecture

## System Overview

BloodLink is a blood donation management system built with a microservices architecture using Spring Boot, PostgreSQL, and containerized deployment.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React/Vue)                      │
│                      (Port: 3000/5173)                          │
└────────────────────────────┬────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (8080)                          │
│              (Spring Cloud Gateway - Router)                     │
│    • Request Routing  • CORS  • Rate Limiting                   │
└────────┬─────────────┬──────────────┬──────────────┬────────────┘
         │             │              │              │
         │             │              │              │
    ┌────▼──┐   ┌─────▼────┐  ┌────▼────┐  ┌────▼────┐
    │ User  │   │ Donation │  │ Inventory│  │Notification
    │Service│   │ Service  │  │ Service  │  │ Service
    │(8081) │   │ (8082)   │  │ (8083)   │  │ (8084)
    └────┬──┘   └─────┬────┘  └────┬────┘  └────┬────┘
         │            │            │            │
         │            │            │            │
         └────────────┴────────────┴────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │   PostgreSQL Database      │
         │   (Supabase/Local)         │
         │   (Port: 5432)             │
         │                            │
         │ • Users                    │
         │ • Donors                   │
         │ • Patients                 │
         │ • Hospitals                │
         │ • Donations                │
         │ • Blood Units              │
         │ • Inventory                │
         │ • Notifications            │
         └────────────────────────────┘
```

## Microservices

### 1. API Gateway (Port: 8080)
**Technology**: Spring Cloud Gateway

**Responsibilities**:
- Single entry point for all client requests
- Request routing based on URL patterns
- CORS handling
- Rate limiting capability
- Load balancing (can be added)
- Cross-cutting concerns

**Routing Rules**:
```
/api/users/**        → User Service (8081)
/api/donors/**       → User Service (8081)
/api/patients/**     → User Service (8081)
/api/hospitals/**    → User Service (8081)
/api/donations/**    → Donation Service (8082)
/api/inventory/**    → Inventory Service (8083)
/api/blood-units/**  → Inventory Service (8083)
/api/notifications/**→ Notification Service (8084)
```

### 2. User Service (Port: 8081)
**Technology**: Spring Boot + JPA + PostgreSQL

**Core Entities**:
- User (base user information)
- Donor (donor-specific data)
- Patient (patient-specific data)
- Hospital (hospital/organization data)

**Key Responsibilities**:
- User authentication and authorization
- User registration and profile management
- Donor information management
- Patient management
- Hospital/organization management
- User verification workflows

**Main Endpoints**:
```
POST   /api/users/register              - Register new user
GET    /api/users/{id}                  - Get user by ID
GET    /api/users/email/{email}         - Get user by email
GET    /api/users/role/{role}           - Get users by role
PUT    /api/users/{id}                  - Update user
DELETE /api/users/{id}                  - Delete user
POST   /api/users/{id}/verify           - Verify user
GET    /api/donors/eligible             - Get eligible donors
POST   /api/donors/{userId}             - Create donor profile
GET    /api/donors/user/{userId}        - Get donor by user ID
POST   /api/donors/{id}/record-donation - Record donation
```

### 3. Donation Service (Port: 8082)
**Technology**: Spring Boot + JPA + PostgreSQL

**Core Entities**:
- Donation (blood donation records)
- DonationAppointment (scheduled appointments)

**Key Responsibilities**:
- Manage blood donations
- Schedule donation appointments
- Track donation history
- Manage donation status

**Planned Endpoints**:
```
POST   /api/donations                       - Create donation
GET    /api/donations/{id}                  - Get donation details
GET    /api/donations/donor/{donorId}       - Get donor donations
PUT    /api/donations/{id}                  - Update donation
GET    /api/donations/appointments          - List appointments
POST   /api/donations/appointments          - Schedule appointment
PUT    /api/donations/appointments/{id}     - Update appointment
DELETE /api/donations/appointments/{id}     - Cancel appointment
```

### 4. Inventory Service (Port: 8083)
**Technology**: Spring Boot + JPA + PostgreSQL

**Core Entities**:
- BloodUnit (individual blood units)
- InventoryTransaction (transfers between hospitals)
- BloodInventorySummary (aggregate view)

**Key Responsibilities**:
- Manage blood unit inventory
- Track blood unit status (available, reserved, expired, etc.)
- Handle inventory transfers between hospitals
- Manage inventory expiration
- Provide real-time inventory views

**Planned Endpoints**:
```
POST   /api/blood-units                          - Add blood unit
GET    /api/blood-units/{id}                     - Get unit details
GET    /api/inventory/hospital/{hospitalId}      - Get hospital inventory
GET    /api/inventory/blood-type/{bloodType}     - Get by blood type
PUT    /api/blood-units/{id}/reserve             - Reserve unit
PUT    /api/blood-units/{id}/transfuse           - Mark as transfused
POST   /api/inventory/transfer                   - Transfer units
GET    /api/inventory/expiring                   - Get expiring units
GET    /api/inventory/summary/{hospitalId}       - Get summary
```

### 5. Notification Service (Port: 8084)
**Technology**: Spring Boot + JPA + PostgreSQL

**Core Entities**:
- Notification (notification records)
- NotificationPreference (user preferences)

**Key Responsibilities**:
- Send notifications to users
- Manage notification channels (email, SMS, push, in-app)
- Track notification delivery status
- Manage user notification preferences
- Queue and batch notifications

**Planned Endpoints**:
```
POST   /api/notifications                           - Send notification
GET    /api/notifications/user/{userId}             - Get user notifications
PUT    /api/notifications/{id}/read                 - Mark as read
GET    /api/notifications/preferences/{userId}      - Get preferences
PUT    /api/notifications/preferences/{userId}      - Update preferences
GET    /api/notifications/pending                   - Get pending notifications
POST   /api/notifications/{id}/retry                - Retry failed notification
```

## Data Models

### User
- Inherits all user information
- Roles: ADMIN, DONOR, PATIENT, HOSPITAL, STAFF
- Status: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION

### Donor
- Links to User
- Tracks donation history and eligibility
- Stores medical information and emergency contacts

### Patient
- Links to User
- Stores blood requirement information
- Tracks hospital admission

### Hospital
- Manages hospital/organization information
- Tracks inventory and coordinates donations

### Donation
- Records blood donation
- Tracks donation status and history
- Links donor, hospital, and blood donation details

### BloodUnit
- Individual blood inventory item
- Status tracking (available, reserved, expired, etc.)
- Batch and location management

### Notification
- Tracks all notifications sent
- Delivery status and channel information
- Multiple recipient options (email, phone, push)

## Service Communication

### Current Architecture
- REST APIs over HTTP
- Direct service-to-service calls (can be optimized)

### Future Enhancements
- **Service Discovery**: Eureka/Consul
- **Load Balancing**: Ribbon/Spring Cloud Load Balancer
- **Circuit Breaker**: Hystrix/Resilience4j
- **Distributed Tracing**: Spring Cloud Sleuth + Zipkin
- **Message Queue**: RabbitMQ/Kafka for async communication
- **API Documentation**: Springdoc-OpenAPI/Swagger

## Database Design

### Schema Organization
- All tables in single Supabase database
- Logical separation by service domain
- Shared tables where needed (e.g., users, hospitals)

### Key Features
- UUID for primary keys (globally unique)
- Timestamps for audit trail
- Soft delete support (deleted_at field)
- Indexes on frequently queried fields
- Foreign key constraints for referential integrity
- Row-level security policies

### Views for Optimization
- active_donors: Available donors for matching
- hospital_blood_levels: Quick inventory lookup
- recent_donations: Recent donation activity

## Security Architecture

### Authentication & Authorization
- JWT tokens (to be implemented)
- BCrypt password hashing
- Role-based access control (RBAC)
- Row-level security policies

### API Security
- CORS configuration per service
- Input validation and sanitization
- Rate limiting support
- HTTPS in production

### Database Security
- RLS policies per table
- Per-user data isolation
- Parameterized queries (prevents SQL injection)
- Encryption at rest and in transit

## Scalability Considerations

### Horizontal Scaling
- Stateless services allow multiple instances
- Load balancer distributes requests
- Database connection pooling
- Shared PostgreSQL database

### Caching Strategy
- Redis for session caching (optional)
- Response caching for frequently accessed data
- Database query caching

### Database Optimization
- Connection pooling (HikariCP)
- Query optimization with indexes
- Pagination for large datasets
- Aggregate views for performance

## Deployment Architecture

### Local Development
- Docker Compose for all services
- PostgreSQL container
- Volume mounting for development

### Production Considerations
- Container orchestration (Kubernetes)
- Auto-scaling policies
- Blue-green deployments
- Health checks and monitoring
- Centralized logging
- Distributed tracing

## Performance Metrics

### Key Metrics to Monitor
- Request latency per service
- Database query performance
- Error rates and types
- CPU and memory usage
- Database connection pool usage
- API response times

### Observability
- Application logs (Spring Boot Actuator)
- Health endpoints
- Metrics collection (Micrometer)
- Distributed tracing (future)

## API Gateway Pattern

### Benefits
- Single entry point
- Consistent API versioning
- Cross-cutting concerns centralized
- Easy to implement rate limiting
- Service abstraction from clients

### Routing Logic
Based on URL path patterns to route to appropriate service

## Future Enhancements

1. **Message Queue Integration**
   - Async notification sending
   - Event-driven architecture
   - RabbitMQ or Kafka

2. **Service Discovery**
   - Dynamic service registration
   - Automatic failover

3. **Advanced Monitoring**
   - ELK Stack for logging
   - Prometheus for metrics
   - Grafana for visualization

4. **API Gateway Enhancements**
   - API versioning
   - Request/response transformation
   - Authentication handling

5. **Cache Layer**
   - Redis for frequently accessed data
   - Distributed session management

6. **Search Optimization**
   - Elasticsearch for complex searches
   - Full-text search capabilities

## Environment Variables

All services use standard Spring Boot configuration:
- `SPRING_DATASOURCE_URL`: Database URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `SERVER_PORT`: Service port
- Service-specific configs via `application.yml`

## Development Workflow

1. **Local Testing**: Run with Docker Compose
2. **Build**: Maven builds each service
3. **Test**: Unit and integration tests
4. **Deploy**: Push Docker images to registry
5. **Orchestrate**: Deploy to Kubernetes or cloud platform

## Dependencies

Core dependencies used across services:
- Spring Boot 3.2.0
- Spring Cloud
- Spring Data JPA
- PostgreSQL Driver
- JWT for security
- Lombok for code generation
- JUnit 5 for testing

## Error Handling

- Centralized exception handling
- Consistent error responses
- Proper HTTP status codes
- Detailed error logging
- User-friendly error messages

## Monitoring & Alerting

- Health checks on all services
- Actuator endpoints for metrics
- Log aggregation (future)
- Alert thresholds (future)

---

This architecture provides a scalable, maintainable foundation for the BloodLink application with clear separation of concerns and room for future growth.
