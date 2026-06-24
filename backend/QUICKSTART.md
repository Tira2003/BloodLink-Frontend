# BloodLink Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
```bash
# Verify Java 17+ is installed
java -version

# Verify Maven is installed
mvn -version

# Verify Docker is installed (optional, for containerized setup)
docker --version
```

### Step 2: Set Environment Variables
Create a `.env` file in the backend directory:
```bash
cd backend
cat > .env << EOF
POSTGRES_URL=jdbc:postgresql://localhost:5432/bloodlink
POSTGRES_USER=bloodlink_user
POSTGRES_PASSWORD=bloodlink_password
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
EOF
```

### Step 3: Quick Build & Run (Choose One)

#### Option A: Using Docker Compose (Easiest)
```bash
# Build and start all services with database
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option B: Local Java Development
```bash
# Build all services
mvn clean package -DskipTests

# Terminal 1: Start Auth Service
cd auth-service
mvn spring-boot:run

# Terminal 2: Start Core Service
cd core-service
mvn spring-boot:run

# Terminal 3: Start Notification Service
cd notification-service
mvn spring-boot:run
```

### Step 4: Verify Services Are Running
```bash
# Check Auth Service (should return 404, but confirms service is up)
curl http://localhost:8081/api/auth/register

# Check Core Service
curl http://localhost:8082/api/core/donors

# Check Notification Service
curl http://localhost:8083
```

### Step 5: Test the API

#### Register a Donor
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@test.com",
    "password": "TestPass123",
    "firstName": "John",
    "lastName": "Donor",
    "phone": "9876543210",
    "district": "Mumbai",
    "role": "DONOR"
  }'
```

**Save the `accessToken` from response**

#### Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@test.com",
    "password": "TestPass123"
  }'
```

#### Create Donor Profile
```bash
curl -X POST http://localhost:8082/api/core/donors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
    "userId": "<USER_ID_FROM_REGISTER>",
    "bloodType": "O_POS",
    "gender": "MALE",
    "latitude": 19.0760,
    "longitude": 72.8777
  }'
```

#### Create Blood Request
```bash
curl -X POST http://localhost:8082/api/core/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
    "userId": "<PATIENT_USER_ID>",
    "bloodType": "O_POS",
    "quantityNeeded": 2,
    "urgency": "URGENT",
    "hospitalName": "City Hospital",
    "district": "Mumbai",
    "locationDetails": "Room 101",
    "reason": "Emergency Surgery"
  }'
```

---

## 📁 Project Structure

```
backend/
├── auth-service/              # JWT authentication
│   ├── src/main/java/...
│   └── pom.xml
├── core-service/              # Main business logic
│   ├── src/main/java/...
│   └── pom.xml
├── notification-service/      # Email & notifications
│   ├── src/main/java/...
│   └── pom.xml
├── db/
│   └── schema.sql            # Database schema
├── pom.xml                   # Parent POM
├── docker-compose.yml        # Docker configuration
├── README.md                 # Full documentation
├── DEPLOYMENT.md             # Deployment guide
├── TESTING.md                # Testing guide
├── API_DOCUMENTATION.md      # API reference
└── QUICKSTART.md            # This file
```

---

## 🔑 Key Features

### Authentication (Port 8081)
- User registration with role (DONOR, PATIENT, HOSPITAL)
- JWT-based login
- Token refresh mechanism
- Password hashing with BCrypt

### Donor Management (Port 8082)
- Create and manage donor profiles
- Blood type management
- Location tracking
- Reward points system

### Blood Requests (Port 8082)
- Create urgent blood requests
- Smart donor matching (blood type + location)
- Automatic notifications
- Request fulfillment tracking

### Donation Camps (Port 8082)
- Organize blood donation camps
- Track collection targets
- Manage donors by location

### Notifications (Port 8083)
- Email notifications
- In-app notifications
- Event-driven architecture
- Async processing

---

## 🗄️ Database

### Tables
- `users` - User accounts
- `donors` - Donor profiles
- `blood_requests` - Blood requests
- `request_responses` - Donor responses
- `donation_camps` - Camps
- `rewards` - Reward history
- `notifications` - Notifications

### Initialize Database (if not using Docker)
```bash
# Connect to Supabase or local PostgreSQL
psql -h localhost -U bloodlink_user -d bloodlink -f db/schema.sql
```

---

## 🧪 Quick Testing

### Run Unit Tests
```bash
mvn test
```

### Run Integration Tests
```bash
mvn verify
```

### Test Coverage
```bash
mvn clean test jacoco:report
# Open target/site/jacoco/index.html
```

---

## 🐛 Troubleshooting

### Services not starting?
```bash
# Check logs
docker-compose logs auth-service

# Check if ports are in use
lsof -i :8081
lsof -i :8082
lsof -i :8083

# Kill process on port (example: 8081)
kill -9 $(lsof -t -i :8081)
```

### Database connection error?
```bash
# Test database connection
psql -h localhost -U bloodlink_user -d bloodlink

# If using Docker, check if postgres container is running
docker-compose ps postgres
```

### JWT token issues?
```bash
# Ensure JWT_SECRET is set and matches across services
echo $JWT_SECRET

# Regenerate token by logging in again
```

### Email not sending?
```bash
# Verify SMTP credentials in .env
# Check Gmail app password (if using Gmail)
# Ensure "Less secure app access" is enabled (if needed)
```

---

## 📝 Common Commands

```bash
# Build specific service
mvn clean package -pl auth-service

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Skip tests during build
mvn package -DskipTests

# Clean all build artifacts
mvn clean

# Check dependency tree
mvn dependency:tree

# View service logs (Docker)
docker-compose logs -f core-service

# Stop all services
docker-compose down -v
```

---

## 🚢 Next Steps

1. **Frontend Integration**: Update frontend API URLs to `http://localhost:8082`
2. **Database**: Connect to Supabase instance
3. **Email Setup**: Configure SMTP provider
4. **Testing**: Run test suite with `mvn test`
5. **Deployment**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📚 Documentation

- **Full Guide**: See [README.md](README.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Testing**: See [TESTING.md](TESTING.md)
- **API Reference**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 💡 Tips

- Use Postman collection for API testing
- Enable debug logs: Set `logging.level.com.bloodlink=DEBUG`
- Monitor database: Use pgAdmin or Supabase dashboard
- Check email delivery: Monitor SMTP server logs
- Performance tuning: Enable connection pooling and query optimization

---

## 🤝 Need Help?

- Check logs: `docker-compose logs`
- Review documentation: See docs folder
- Run tests: `mvn test`
- Contact: api-support@bloodlink.com

---

**Happy coding! 🎉**
