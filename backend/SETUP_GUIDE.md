# BloodLink Backend - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (Recommended)](#quick-start-recommended)
3. [Local Development Setup](#local-development-setup)
4. [Troubleshooting](#troubleshooting)
5. [Next Steps](#next-steps)

## Prerequisites

### Required Software
- **Docker** (version 20.10+) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (version 1.29+) - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git** - for version control

### For Local Development (without Docker)
- **Java 17 JDK** - [Download Java 17](https://adoptium.net/)
- **Maven 3.9+** - [Download Maven](https://maven.apache.org/download.cgi)
- **PostgreSQL 15** - [Download PostgreSQL](https://www.postgresql.org/download/)

### System Requirements
- RAM: Minimum 8GB (4GB Docker + 4GB application)
- Disk Space: At least 10GB free
- CPU: Dual-core minimum

## Quick Start (Recommended)

### Step 1: Clone the Repository
```bash
cd backend
```

### Step 2: Start Services with Docker Compose

**Option A: Using bash script (Linux/Mac)**
```bash
chmod +x docker-compose-up.sh
./docker-compose-up.sh
```

**Option B: Direct Docker Compose command**
```bash
docker-compose up --build
```

This command will:
- Build all 5 microservices
- Start PostgreSQL database
- Initialize database schema
- Start all services

### Step 3: Verify Services

Once you see "All services started successfully" or similar messages:

```bash
# Check API Gateway health
curl http://localhost:8080/actuator/health

# Check User Service health
curl http://localhost:8081/actuator/health

# Check other services (8082, 8083, 8084)
curl http://localhost:808x/actuator/health
```

### Step 4: Test API Endpoint

Register a new user:
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "bloodType": "O_POSITIVE",
    "role": "DONOR"
  }'
```

### Step 5: Access Database

Connect to PostgreSQL:
```bash
# Using psql
psql -h localhost -U postgres -d bloodlink_db

# Using Docker
docker-compose exec postgres psql -U postgres -d bloodlink_db
```

## Local Development Setup

### Prerequisites for Local Development
- Java 17 JDK installed
- Maven 3.9+ installed
- PostgreSQL 15 running locally

### Step 1: Setup PostgreSQL Database

**Using Docker (easier)**:
```bash
docker run --name bloodlink-postgres \
  -e POSTGRES_DB=bloodlink_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**Or use existing PostgreSQL installation**:
```bash
# Create database and user
createdb -U postgres bloodlink_db

# (Optional) Create dedicated user
createuser -U postgres bloodlink_user
```

### Step 2: Apply Database Schema

```bash
# Navigate to backend directory
cd backend

# Apply schema using psql
psql -h localhost -U postgres -d bloodlink_db -f supabase-schema.sql

# Or using Docker
docker-compose exec postgres psql -U postgres -d bloodlink_db -f /docker-entrypoint-initdb.d/schema.sql
```

### Step 3: Build All Services

```bash
# From backend directory
mvn clean install -DskipTests

# Or build specific service
cd user-service && mvn clean install
```

### Step 4: Run Services Locally

**Open 5 terminal windows, one for each service:**

**Terminal 1 - API Gateway:**
```bash
cd api-gateway
mvn spring-boot:run
```

**Terminal 2 - User Service:**
```bash
cd user-service
mvn spring-boot:run
```

**Terminal 3 - Donation Service:**
```bash
cd donation-service
mvn spring-boot:run
```

**Terminal 4 - Inventory Service:**
```bash
cd inventory-service
mvn spring-boot:run
```

**Terminal 5 - Notification Service:**
```bash
cd notification-service
mvn spring-boot:run
```

### Step 5: Verify All Services

```bash
# Check each service is running
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8082/actuator/health  # Donation Service
curl http://localhost:8083/actuator/health  # Inventory Service
curl http://localhost:8084/actuator/health  # Notification Service
```

## Configuration Files

### Docker Compose Environment

Edit `docker-compose.yml` to customize:
- Database credentials
- Service ports
- Java memory settings
- Volume mounts

### Application Configuration

Each service has `application.yml`:
- `api-gateway/src/main/resources/application.yml`
- `user-service/src/main/resources/application.yml`
- etc.

Key settings:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bloodlink_db
    username: postgres
    password: postgres
```

## Stopping Services

### Using Docker Compose
```bash
# Stop services but keep data
docker-compose stop

# Stop and remove containers (keep volumes)
docker-compose down

# Stop, remove containers and volumes (clean slate)
docker-compose down -v
```

### Stop Local Services
- Press `Ctrl+C` in each terminal window

## Database Management

### View Database Contents
```bash
# Connect to database
psql -h localhost -U postgres -d bloodlink_db

# List all tables
\dt

# Query users
SELECT id, email, role, status FROM users;

# Query donors
SELECT * FROM donors;
```

### Reset Database
```bash
# Drop and recreate (using Docker Compose)
docker-compose down -v
docker-compose up --build

# Or manually
psql -U postgres -d bloodlink_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Backup Database
```bash
# Backup PostgreSQL database
pg_dump -h localhost -U postgres -d bloodlink_db > bloodlink_backup.sql

# Restore from backup
psql -h localhost -U postgres -d bloodlink_db < bloodlink_backup.sql
```

## Monitoring & Logs

### View Logs

**Docker Compose:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service

# Last 100 lines
docker-compose logs --tail=100
```

**Local Development:**
- Logs appear directly in the terminal where you ran `mvn spring-boot:run`

### Health Monitoring

Each service exposes actuator endpoints:

```bash
# Health check
curl http://localhost:808x/actuator/health

# Application info
curl http://localhost:808x/actuator/info

# Metrics
curl http://localhost:808x/actuator/prometheus
```

## Testing the APIs

### User Registration
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User",
    "role": "DONOR",
    "bloodType": "O_POSITIVE"
  }'
```

### Get User
```bash
curl http://localhost:8080/api/users/{userId}
```

### Create Donor Profile
```bash
curl -X POST http://localhost:8080/api/donors/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1234567891",
    "allergies": "Penicillin"
  }'
```

## Troubleshooting

### Services Won't Start

**Check ports are available:**
```bash
# Linux/Mac
lsof -i :8080
lsof -i :5432

# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :5432
```

**Kill process using port:**
```bash
# Linux/Mac
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

### Database Connection Errors

```
ERROR: could not connect to server: Connection refused
```

**Solutions:**
1. Ensure PostgreSQL is running
2. Check connection string in `application.yml`
3. Verify credentials are correct
4. Test connection: `psql -h localhost -U postgres`

### Port Already in Use

```bash
# Clean Docker resources
docker-compose down -v
docker system prune

# Restart Docker Compose
docker-compose up --build
```

### OutOfMemory Errors

**Increase Java memory in `docker-compose.yml`:**
```yaml
environment:
  JAVA_OPTS: "-Xmx1024m -Xms512m"
```

### Service Startup Timeout

**Increase healthcheck timeout in `docker-compose.yml`:**
```yaml
healthcheck:
  start_period: 60s
```

## Performance Tips

1. **Use Docker Compose**: Better than running 5 services locally
2. **Set appropriate memory**: Use `-Xmx` based on available RAM
3. **Enable database indexes**: Already included in schema
4. **Connection pooling**: Automatically configured
5. **Cache frequently accessed data**: Use Redis (future enhancement)

## Security Notes

### Development vs Production

**Development (Current)**:
- Default credentials: postgres/postgres
- CORS allows localhost
- No JWT validation (to be added)

**Production**:
- Strong database credentials
- Restricted CORS origins
- JWT authentication required
- HTTPS enforcement
- Environment-specific configs

### Securing Database Credentials

```bash
# Use environment variables in production
export DB_USERNAME=secure_user
export DB_PASSWORD=secure_password

# Or use .env file (never commit to git)
# docker-compose.env
DB_USERNAME=prod_user
DB_PASSWORD=prod_password
```

## Next Steps

1. **Implement Authentication**
   - Add JWT token generation
   - Implement token validation
   - Add role-based access control

2. **Add API Documentation**
   - Integrate Swagger/Springdoc
   - Document all endpoints

3. **Implement Service Communication**
   - Add Feign clients for inter-service calls
   - Implement circuit breaker pattern

4. **Set Up Monitoring**
   - Add Prometheus metrics
   - Configure Grafana dashboards
   - Set up ELK stack for logging

5. **Deploy to Cloud**
   - Docker image registry (Docker Hub, ECR)
   - Kubernetes deployment
   - CI/CD pipeline (GitHub Actions, Jenkins)

6. **Optimize Performance**
   - Add Redis caching
   - Implement pagination
   - Optimize database queries

7. **Add Integration Tests**
   - Test service endpoints
   - Test database interactions
   - Test inter-service communication

## Getting Help

### Documentation
- See `README.md` for general information
- See `ARCHITECTURE.md` for system design
- See individual service README files (to be created)

### Common Commands

```bash
# Docker Compose
docker-compose up --build           # Start services
docker-compose down                 # Stop services
docker-compose logs -f              # View logs
docker-compose ps                   # List services
docker-compose exec <service> bash  # Access container

# Maven
mvn clean install                   # Build all services
mvn spring-boot:run                 # Run single service
mvn test                            # Run tests

# PostgreSQL
psql -h localhost -U postgres       # Connect to database
\dt                                 # List tables
\q                                  # Exit
```

### Support Resources
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Docker Documentation: https://docs.docker.com/
- Spring Cloud Gateway: https://spring.io/projects/spring-cloud-gateway

---

## Summary

You now have a complete Java Spring Boot microservices backend for BloodLink with:
- 5 independent microservices (User, Donation, Inventory, Notification)
- 1 API Gateway for routing
- PostgreSQL database with comprehensive schema
- Docker containerization for easy deployment
- Local development setup for testing

Start with Docker Compose for the easiest setup, then transition to local development as needed!
