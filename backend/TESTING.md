# BloodLink Backend - Testing Guide

## Unit Testing

### Running Tests
```bash
# Run all tests
mvn test

# Run specific service tests
mvn test -pl auth-service
mvn test -pl core-service
mvn test -pl notification-service

# Run specific test class
mvn test -Dtest=AuthServiceTest
```

### Test Structure
```
auth-service/src/test/java/com/bloodlink/auth/
├── service/
│   └── AuthServiceTest.java
├── controller/
│   └── AuthControllerTest.java
└── repository/
    └── UserRepositoryTest.java
```

## API Testing with cURL

### 1. User Registration
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "district": "Mumbai",
    "role": "DONOR"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` for subsequent requests.

### 3. Create Donor Profile
```bash
curl -X POST http://localhost:8082/api/core/donors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "userId": "user-uuid",
    "bloodType": "O_POS",
    "gender": "MALE",
    "dateOfBirth": "1990-01-15",
    "latitude": 19.0760,
    "longitude": 72.8777
  }'
```

### 4. Create Blood Request
```bash
curl -X POST http://localhost:8082/api/core/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "userId": "patient-uuid",
    "bloodType": "O_POS",
    "quantityNeeded": 2,
    "urgency": "URGENT",
    "hospitalName": "City Hospital",
    "district": "Mumbai",
    "locationDetails": "Room 101, Ward A",
    "reason": "Emergency surgery"
  }'
```

### 5. Get Active Requests
```bash
curl -X GET http://localhost:8082/api/core/requests \
  -H "Authorization: Bearer <accessToken>"
```

### 6. Donor Response to Request
```bash
curl -X POST "http://localhost:8082/api/core/requests/{requestId}/respond?donorId={donorId}&response=ACCEPT" \
  -H "Authorization: Bearer <accessToken>"
```

### 7. Get Donor Rewards
```bash
curl -X GET http://localhost:8082/api/core/rewards/donors/{donorId} \
  -H "Authorization: Bearer <accessToken>"
```

### 8. Create Donation Camp
```bash
curl -X POST http://localhost:8082/api/core/camps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "name": "World Blood Donor Day Camp",
    "organizerId": "organizer-uuid",
    "locationName": "Central Park",
    "district": "Mumbai",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "startDate": "2024-06-14T08:00:00",
    "endDate": "2024-06-14T18:00:00",
    "targetUnits": 100,
    "description": "Annual blood donation camp"
  }'
```

## Postman Collection

### Setup
1. Import `BloodLink.postman_collection.json` into Postman
2. Set variables:
   - `base_url`: http://localhost:8082
   - `auth_token`: <your-jwt-token>

### Available Endpoints in Collection
- Authentication
- Donor Management
- Blood Requests
- Donation Camps
- Rewards

## Integration Testing

### Test Workflow
1. Register user as DONOR
2. Register user as PATIENT
3. Create donor profile
4. Create blood request (triggers matching)
5. Verify notifications sent
6. Donor accepts request
7. Verify reward points awarded
8. Complete request
9. Verify final reward points

### Sample Integration Test
```java
@SpringBootTest
class BloodDonationIntegrationTest {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private DonorService donorService;
    
    @Autowired
    private RequestService requestService;
    
    @Test
    void testFullDonationWorkflow() {
        // Register donor
        AuthResponse donorAuth = registerUser("donor@test.com", "DONOR");
        
        // Create donor profile
        DonorDTO donorDTO = createDonorProfile(donorAuth.getUserId());
        
        // Register patient
        AuthResponse patientAuth = registerUser("patient@test.com", "PATIENT");
        
        // Create blood request
        BloodRequestDTO requestDTO = createBloodRequest(patientAuth.getUserId());
        
        // Verify matching
        assertNotNull(requestDTO.getId());
        
        // Donor responds
        requestService.donorRespondsToRequest(requestDTO.getId(), donorDTO.getId(), "ACCEPT");
        
        // Verify reward points
        DonorDTO updatedDonor = donorService.getDonorById(donorDTO.getId());
        assertEquals(50, updatedDonor.getRewardPoints());
    }
}
```

## Performance Testing

### Load Testing with JMeter
1. Create test plan for auth service
2. Set thread group (users) and ramp-up time
3. Add HTTP samplers for endpoints
4. Run tests and analyze results

### Stress Testing
- Gradually increase load
- Monitor response times
- Identify breaking point
- Check database performance

## Security Testing

### OWASP Top 10 Testing

1. **Injection Testing**
```bash
# Test SQL Injection
curl -X GET "http://localhost:8082/api/core/requests?district=Mumbai' OR '1'='1"
```

2. **Authentication Testing**
- Test with invalid tokens
- Test expired tokens
- Test token manipulation

3. **Authorization Testing**
- Test access to other users' data
- Test role-based access

### Run Security Scan
```bash
# OWASP Dependency Check
mvn dependency-check:check

# Spotbugs for code analysis
mvn com.github.spotbugs:spotbugs-maven-plugin:spotbugs
```

## Database Testing

### Connection Testing
```bash
# Test database connectivity
mvn test -Dtest=DatabaseConnectionTest
```

### Data Integrity Testing
- Verify foreign key constraints
- Check data validation
- Test cascade operations

## API Contract Testing

### OpenAPI/Swagger
Services include Swagger documentation:
- Auth Service: `http://localhost:8081/swagger-ui.html`
- Core Service: `http://localhost:8082/swagger-ui.html`
- Notification Service: `http://localhost:8083/swagger-ui.html`

## Continuous Integration

### GitHub Actions Setup
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      - name: Run tests
        run: mvn test
      - name: Build
        run: mvn clean package
```

## Test Coverage

### Generate Coverage Report
```bash
# Run tests with coverage
mvn clean test jacoco:report

# View report
open target/site/jacoco/index.html
```

### Coverage Goals
- Minimum 70% code coverage
- 100% coverage for critical paths (auth, payments)
- 80% coverage for business logic

## Regression Testing

### Test Suites to Run
1. **Smoke Tests** - Basic functionality
2. **Sanity Tests** - Core features
3. **Regression Tests** - All features after changes

### Automated Regression
```bash
mvn verify -P regression-tests
```

## End-to-End Testing

### Test Scenarios
1. User Registration to Blood Donation
2. Hospital Creates Request to Fulfillment
3. Donor Profile to Reward Redemption
4. Camp Organization to Collection

### Frontend Integration
- Frontend calls should match API contracts
- Response formats verified
- Error handling tested

## Debugging

### Enable Debug Logging
```yaml
logging:
  level:
    com.bloodlink: DEBUG
    org.hibernate.SQL: DEBUG
```

### Remote Debugging
```bash
# Run with remote debugging
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 \
  -jar auth-service.jar
```

## Performance Benchmarks

### Expected Response Times
- Authentication: < 200ms
- Donor queries: < 500ms
- Request matching: < 1s
- Email sending: < 5s (async)

### Database Query Performance
- Donor search: < 100ms
- Request filtering: < 200ms
- Reward calculation: < 50ms

## Monitoring in Production

### Health Checks
```bash
curl http://service:8080/actuator/health
```

### Metrics
```bash
curl http://service:8080/actuator/metrics
```

## Test Data

### Sample Data Files
- `test-data/users.sql` - Test users
- `test-data/donors.sql` - Test donors
- `test-data/requests.sql` - Test requests

### Load Sample Data
```bash
psql -h localhost -U user -d bloodlink -f test-data/users.sql
```
