# BloodLink - Complete Local Setup Guide

## Project Status Summary

✅ **FULL SITE BUILD COMPLETED**
- Backend: 5 microservices (API Gateway + 4 services)
- Frontend: Complete React app with all pages and components
- Database Schema: Complete with all tables created
- Authentication: JWT-based with role-based access control
- API Integration: All frontend services connected to backend

✅ **DATABASE CONNECTED**
- PostgreSQL running in Docker container
- Database: `bloodlink_db`
- All 11 tables created with relationships
- Automatic migrations on service startup

## Prerequisites

You need to have installed on your machine:

1. **Docker & Docker Compose**
   - Download from: https://www.docker.com/products/docker-desktop
   - Verify installation: `docker --version && docker-compose --version`

2. **Node.js & npm** (for frontend)
   - Download from: https://nodejs.org/ (LTS version recommended)
   - Verify installation: `node --version && npm --version`

3. **Java 17+** (optional - only if building locally without Docker)
   - Download from: https://adoptopenjdk.net/
   - Verify installation: `java --version`

## Step 1: Clone/Download the Project

The project is located at: `/vercel/share/v0-project/`

```bash
cd /path/to/your/projects
# If you have git access:
git clone <repository-url>
cd BloodLink-Frontend
```

## Step 2: Start the Backend Services (Docker)

**Terminal 1 - Backend Services:**

```bash
cd backend
docker-compose up --build
```

This command will:
- Download all required Docker images
- Build the 5 microservices (API Gateway, User, Donation, Inventory, Notification)
- Start PostgreSQL database automatically
- Apply database schema
- Start all services on their respective ports

**Services will be available at:**
- API Gateway: http://localhost:8080
- User Service: http://localhost:8081
- Donation Service: http://localhost:8082
- Inventory Service: http://localhost:8083
- Notification Service: http://localhost:8084
- PostgreSQL: localhost:5432

**Wait for this message:**
```
user-service | 2025-06-21 10:30:45.123 INFO com.bloodlink.user.UserServiceApplication: Started UserServiceApplication
```

Once you see all 5 services started, proceed to Step 3.

## Step 3: Install Frontend Dependencies

**Terminal 2 - Frontend:**

```bash
# Navigate to project root (frontend)
cd /path/to/BloodLink-Frontend

# Install dependencies
npm install

# Verify installation (you should see packages installed)
npm list | head -20
```

## Step 4: Start Frontend Development Server

**Terminal 2 (same as Step 3) - Frontend:**

```bash
npm run dev
```

This will start the Vite development server. You should see:

```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

## Step 5: Access the Application

Open your browser and go to:

```
http://localhost:5173
```

You should see the BloodLink homepage.

## Step 6: Test the Complete Flow

### Test Login/Register Flow:

1. Click "Sign In" or "Register"
2. **Test Demo Login:**
   - Email: `donor@demo.com`
   - Password: `Demo@123` (or click demo button)
3. **Or Register New Account:**
   - Fill in the registration form
   - Click "Register as Donor" or "Register as Hospital"
   - You'll be logged in automatically

### Test Different Dashboards:

- **As Donor**: View upcoming donations, appointment bookings, notifications
- **As Hospital**: View blood inventory, manage stock, view requests
- **As Admin**: View system-wide statistics and alerts

### Verify Backend Communication:

Open browser DevTools (F12) → Network tab:
- You should see API calls to `localhost:8080/api/...`
- Check Response tab to see JSON data from backend
- Check Storage tab to see JWT token in localStorage

## Database Access (Optional)

To directly access the PostgreSQL database:

```bash
# From your terminal (make sure Docker container is running)
psql -h localhost -U postgres -d bloodlink_db

# Enter password: postgres

# List all tables:
\dt

# View users:
SELECT id, email, first_name, last_name, role, created_at FROM "user" LIMIT 5;

# Exit:
\q
```

Or use a GUI tool like **DBeaver**:
- Download: https://dbeaver.io/
- Connection: PostgreSQL
- Host: localhost
- Port: 5432
- Database: bloodlink_db
- Username: postgres
- Password: postgres

## Verify Services are Running

### Check All Services:

```bash
# Terminal 3 (new terminal)
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}

curl http://localhost:8081/actuator/health
# Should return: {"status":"UP"}

# Test an API endpoint:
curl -X GET http://localhost:8080/api/donors
# Should return: [] or JSON array of donors
```

### Check Docker Containers:

```bash
docker ps
```

You should see 6 containers running:
- postgres
- api-gateway
- user-service
- donation-service
- inventory-service
- notification-service

## Stopping Services

### Stop Backend:
```bash
# Terminal 1 (where docker-compose is running)
Ctrl + C
```

### Stop Frontend:
```bash
# Terminal 2 (where npm is running)
Ctrl + C
```

### Remove Docker Containers (optional):
```bash
docker-compose down    # Stops containers
docker-compose down -v # Stops containers AND removes volumes (resets database)
```

## Troubleshooting

### Issue: Docker containers won't start

**Solution:**
```bash
# Make sure Docker is running
docker ps

# If not running, restart Docker Desktop or service

# Clean and rebuild:
docker-compose down -v
docker-compose up --build
```

### Issue: Port 8080 already in use

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or change port in docker-compose.yml (line ~20)
```

### Issue: Frontend can't connect to backend

**Solution:**
```bash
# Check backend is running:
curl http://localhost:8080/actuator/health

# If it returns "Connection refused":
# 1. Make sure docker-compose is running
# 2. Wait 30-60 seconds for services to start
# 3. Check logs: docker-compose logs user-service
```

### Issue: Database connection error

**Solution:**
```bash
# Check PostgreSQL container is running:
docker ps | grep postgres

# If not running, restart services:
docker-compose restart postgres

# Wait 10 seconds and try again
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Project Structure

```
BloodLink-Frontend/
├── backend/                          # Backend microservices
│   ├── api-gateway/                 # Spring Cloud Gateway
│   ├── user-service/                # User & Authentication
│   ├── donation-service/            # Donation management
│   ├── inventory-service/           # Blood inventory
│   ├── notification-service/        # Notifications
│   ├── docker-compose.yml           # Docker configuration
│   └── supabase-schema.sql         # Database schema
├── src/                             # Frontend React app
│   ├── pages/                       # Page components
│   │   ├── dashboards/             # User dashboards
│   │   ├── Login.jsx               # Login page
│   │   └── Register.jsx            # Register page
│   ├── components/                 # Reusable components
│   ├── services/                   # API services
│   │   ├── api.js                 # HTTP client
│   │   ├── authService.js         # Authentication
│   │   ├── donationService.js     # Donations API
│   │   ├── inventoryService.js    # Inventory API
│   │   └── notificationService.js # Notifications API
│   ├── context/                    # React context
│   │   └── AuthContext.jsx        # Auth state management
│   └── App.jsx                    # Main app component
├── package.json                    # Frontend dependencies
└── LOCAL_SETUP_GUIDE.md           # This file
```

## Key Features Ready to Use

### Authentication
- User registration with password hashing
- JWT-based login/logout
- Role-based access control (DONOR, HOSPITAL, ADMIN, etc.)
- Token refresh mechanism
- Auto logout on token expiration

### User Management
- User profiles for donors, hospitals, and patients
- Blood type tracking
- User verification workflow
- Profile updates

### Donation Management
- Donation history tracking
- Appointment scheduling
- Donation request matching
- Status tracking (PENDING, COMPLETED, etc.)

### Inventory Management
- Blood stock tracking by blood type
- Low-stock alerts
- Expiry date tracking
- Stock consumption logging

### Notifications
- User notification system
- Notification preferences
- Read/unread status tracking
- Multiple notification types

## Next Steps

### After First Run:

1. **Test Authentication Flow**
   - Register a new account
   - Verify email in inbox (if email enabled)
   - Login and check JWT token in DevTools

2. **Test Dashboard Features**
   - As donor: Book an appointment
   - As hospital: Add blood inventory
   - Check real-time data updates

3. **Review Code**
   - Backend: `backend/user-service/src/main/java/com/bloodlink/`
   - Frontend: `src/`
   - API services: `src/services/`

4. **Run Tests**
   - Backend: `cd backend/user-service && mvn test`
   - Frontend: `npm test`

### Development Commands

```bash
# Frontend - Run with HMR (hot reload)
npm run dev

# Frontend - Build for production
npm run build

# Frontend - Run tests
npm test

# Backend - Run specific service with Maven
cd backend/user-service
mvn clean install
mvn spring-boot:run

# Backend - Check logs
docker-compose logs -f user-service
docker-compose logs -f postgres
```

## Environment Variables

### Backend (.env in docker-compose or application.yml)

```
JWT_SECRET=MyVerySecureSecretKeyForBloodLinkApplicationThatIsAtLeast32CharactersLongForJWTTokenGeneration
JWT_EXPIRATION_MS=86400000
JWT_REFRESH_EXPIRATION_MS=604800000
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_URL=jdbc:postgresql://postgres:5432/bloodlink_db
```

### Frontend (.env.local in project root)

```
VITE_API_URL=http://localhost:8080
```

## Performance Tips

1. **Backend Startup Time**: First run may take 1-2 minutes as Docker builds images
2. **Database Initialization**: Schema creation happens automatically on first startup
3. **Frontend HMR**: Changes to React code will auto-refresh without page reload
4. **Network Requests**: Check DevTools Network tab if pages seem slow

## Security Notes (Development)

- Demo credentials are for testing only
- JWT_SECRET in development is not secure - change for production
- CORS is permissive in development - restrict for production
- Database credentials are default - use strong passwords in production
- Enable HTTPS for production deployment

## Support & Documentation

For detailed information, see:
- `AUTHENTICATION_INTEGRATION_GUIDE.md` - Auth setup details
- `MICROSERVICES_IMPLEMENTATION.md` - Microservices details
- `backend/README.md` - Backend documentation
- `backend/SETUP_GUIDE.md` - Backend setup details

## Summary

Your BloodLink application is now running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

You can now:
✅ Register new users
✅ Login with JWT authentication
✅ Access role-based dashboards
✅ Make API calls from frontend to backend
✅ View real data from PostgreSQL database
✅ Test all microservices

Enjoy building with BloodLink!
