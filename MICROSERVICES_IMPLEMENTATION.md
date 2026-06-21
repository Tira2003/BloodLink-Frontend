# BloodLink Microservices Implementation

## Overview
This document details the implementation of three complete microservices for the BloodLink platform: Donation Service, Inventory Service, and Notification Service. All services are integrated with the frontend through API clients.

## 1. Donation Service

### Backend Files Created
- **Entities**
  - `Donation.java` - Represents blood donations with status tracking
  - `DonationAppointment.java` - Manages donation appointments
  - `DonationStatus.java` - Enum for donation statuses
  - `AppointmentStatus.java` - Enum for appointment statuses

- **DTOs**
  - `DonationDTO.java` - Data transfer object for donations
  - `CreateDonationRequest.java` - Request DTO with validation
  - `DonationAppointmentDTO.java` - Appointment data transfer
  - `BookAppointmentRequest.java` - Appointment booking request

- **Repositories**
  - `DonationRepository.java` - JPA repository for donations with custom queries
  - `DonationAppointmentRepository.java` - JPA repository for appointments

- **Services**
  - `DonationService.java` - Business logic for donation management
  - `AppointmentService.java` - Business logic for appointment scheduling

- **Controllers**
  - `DonationController.java` - REST API endpoints for donations
  - `AppointmentController.java` - REST API endpoints for appointments

### Key Endpoints
```
POST   /api/donations - Create donation
GET    /api/donations/{id} - Get donation details
GET    /api/donations/donor/{donorId} - Get donor's donations
GET    /api/donations/hospital/{hospitalId} - Get hospital's donations
PUT    /api/donations/{id}/status - Update donation status
GET    /api/donations/stats/donor/{donorId} - Get donation count

POST   /api/donations/appointments - Book appointment
GET    /api/donations/appointments/{id} - Get appointment
GET    /api/donations/appointments/donor/{donorId} - Get donor's appointments
GET    /api/donations/appointments/hospital/{hospitalId} - Get hospital's appointments
GET    /api/donations/appointments/hospital/{hospitalId}/upcoming - Upcoming appointments
PUT    /api/donations/appointments/{id}/confirm - Confirm appointment
PUT    /api/donations/appointments/{id}/cancel - Cancel appointment
```

## 2. Inventory Service

### Backend Files Created
- **Entities**
  - `BloodInventory.java` - Blood inventory tracking per hospital
  - `BloodUnit.java` - Individual blood unit records
  - `BloodUnitStatus.java` - Enum for unit statuses (PENDING_TEST, APPROVED, AVAILABLE, EXPIRED, etc.)

- **DTOs**
  - `BloodInventoryDTO.java` - Inventory data with low stock/expiry flags
  - `BloodUnitDTO.java` - Individual unit data transfer object

- **Repositories**
  - `BloodInventoryRepository.java` - Query blood inventory with alerts
  - `BloodUnitRepository.java` - Query blood units by status, blood type, expiry

- **Services**
  - `InventoryService.java` - Inventory management logic
  - `BloodUnitService.java` - Blood unit lifecycle management

- **Controllers**
  - `InventoryController.java` - REST API for inventory operations
  - `BloodUnitController.java` - REST API for unit operations

### Key Endpoints
```
POST   /api/inventory - Create inventory entry
GET    /api/inventory/{id} - Get inventory
GET    /api/inventory/hospital/{hospitalId} - Get hospital's inventory
GET    /api/inventory/hospital/{hospitalId}/low-stock - Alert low stock
GET    /api/inventory/expired - Get expired units
PUT    /api/inventory/{id}/update-quantity - Update stock quantity

POST   /api/blood-units - Create blood unit
GET    /api/blood-units/{id} - Get unit details
GET    /api/blood-units/hospital/{hospitalId} - Get hospital's units
GET    /api/blood-units/hospital/{hospitalId}/available - Available units
PUT    /api/blood-units/{id}/status - Update unit status
PUT    /api/blood-units/{id}/testing-results - Update test results
GET    /api/blood-units/expiring - Get expiring units
```

## 3. Notification Service

### Backend Files Created
- **Entities**
  - `Notification.java` - User notifications with read status
  - `NotificationPreference.java` - User notification preferences
  - `NotificationType.java` - Enum for notification types

- **DTOs**
  - `NotificationDTO.java` - Notification data transfer
  - `NotificationPreferenceDTO.java` - Preference data transfer
  - `CreateNotificationRequest.java` - Request DTO with validation

- **Repositories**
  - `NotificationRepository.java` - Query notifications with unread filtering
  - `NotificationPreferenceRepository.java` - User preference queries

- **Services**
  - `NotificationService.java` - Notification management
  - `NotificationPreferenceService.java` - Preference management

- **Controllers**
  - `NotificationController.java` - REST API for notifications
  - `NotificationPreferenceController.java` - REST API for preferences

### Key Endpoints
```
POST   /api/notifications - Create notification
GET    /api/notifications/{id} - Get notification
GET    /api/notifications/user/{userId} - Get user's notifications
GET    /api/notifications/user/{userId}/unread - Get unread
PUT    /api/notifications/{id}/read - Mark as read
PUT    /api/notifications/user/{userId}/read-all - Mark all read
DELETE /api/notifications/{id} - Delete notification

POST   /api/notifications/preferences - Create preferences
GET    /api/notifications/preferences/user/{userId} - Get preferences
PUT    /api/notifications/preferences/user/{userId} - Update preferences
```

## Frontend Integration

### API Services Created
- **`src/services/donationService.js`** - Client for Donation Service
- **`src/services/inventoryService.js`** - Client for Inventory Service
- **`src/services/notificationService.js`** - Client for Notification Service

### Updated Dashboards
- **DonorDashboard** - Displays:
  - Total donations completed
  - Upcoming appointments
  - Unread notifications
  - Recent donation history
  - Real-time data from Donation & Notification services

- **HospitalDashboard** - Displays:
  - Blood inventory by type
  - Critical low-stock alerts
  - Upcoming appointments
  - Total stock in ml
  - Real-time data from Inventory & Donation services

- **AdminDashboard** - Displays:
  - System-wide statistics
  - Critical inventory alerts
  - Monthly donation trends
  - Blood request analytics
  - Recent blood requests and donors

## Authentication & Authorization

All endpoints include role-based access control:
- `@PreAuthorize("hasRole('DONOR')")` - Donor-only operations
- `@PreAuthorize("hasRole('HOSPITAL')")` - Hospital-only operations
- `@PreAuthorize("hasRole('ADMIN')")` - Admin-only operations
- Public endpoints for retrieving data (with role restrictions)

## Database Schema

The backend uses the existing Supabase schema with the following key tables:
- `donations` - Donation records
- `donation_appointments` - Appointment bookings
- `blood_inventory` - Hospital blood stock
- `blood_units` - Individual unit records
- `notifications` - User notifications
- `notification_preferences` - User preferences

## Running the Services

### Build & Run
```bash
# Each service runs on its own port
# Donation Service: 8082
# Inventory Service: 8083
# Notification Service: 8084
```

### Configuration
Each service has `application.yml` with:
- Database connection settings
- Server port configuration
- Management endpoints (health, info, prometheus)
- JPA/Hibernate configuration

## Testing the Integration

1. **Create Donation**
   - POST to `/api/donations` with donor/hospital IDs and blood type
   - Service creates donation record and returns DTO

2. **Book Appointment**
   - POST to `/api/donations/appointments` with appointment details
   - Service confirms appointment booking

3. **Manage Inventory**
   - POST to `/api/inventory` to create stock entries
   - PUT to update quantities when donations arrive
   - GET endpoints track low stock and expiry

4. **Send Notifications**
   - POST to `/api/notifications` when important events occur
   - Frontend fetches via `getUnreadNotifications(userId)`
   - Users manage preferences via preference endpoints

## Error Handling

All services implement:
- Validation using Jakarta validation annotations
- Exception handling with meaningful error messages
- Transaction management with `@Transactional`
- Logging at service and controller levels

## Performance Optimizations

- Custom JPA queries for specific use cases
- UUID primary keys for distributed systems
- Audit fields (createdAt, updatedAt) on all entities
- Efficient filtering and pagination in repositories

## Future Enhancements

- WebSocket support for real-time notifications
- Advanced analytics and reporting
- Donor eligibility checking service
- Blood bank analytics and forecasting
- Bulk import/export capabilities
- Message queue integration (RabbitMQ, Kafka)
