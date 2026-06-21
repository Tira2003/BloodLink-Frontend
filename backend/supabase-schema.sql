-- BloodLink Microservices Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USER SERVICE SCHEMA ====================

-- Enum types for user roles and statuses
CREATE TYPE user_role AS ENUM ('ADMIN', 'DONOR', 'PATIENT', 'HOSPITAL', 'STAFF');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');
CREATE TYPE blood_type AS ENUM ('O_POSITIVE', 'O_NEGATIVE', 'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE');

-- Users table - Base user information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    role user_role NOT NULL DEFAULT 'DONOR',
    status user_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    profile_picture_url VARCHAR(500),
    blood_type blood_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Donors table - Specific donor information
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    last_donation_date DATE,
    total_donations INTEGER DEFAULT 0,
    is_eligible_to_donate BOOLEAN DEFAULT TRUE,
    medical_conditions TEXT,
    medications TEXT,
    allergies TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patients table - Specific patient information
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    blood_type_needed blood_type,
    medical_condition TEXT,
    hospital_id UUID,
    admitted_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals table - Hospital/Organization information
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    hospital_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== BLOOD DONATION SERVICE SCHEMA ====================

CREATE TYPE donation_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED');
CREATE TYPE donation_type AS ENUM ('WHOLE_BLOOD', 'PLASMA', 'PLATELETS', 'RED_CELLS');

-- Donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE RESTRICT,
    donation_type donation_type NOT NULL DEFAULT 'WHOLE_BLOOD',
    blood_type blood_type NOT NULL,
    quantity_ml INTEGER NOT NULL,
    status donation_status NOT NULL DEFAULT 'SCHEDULED',
    donation_date TIMESTAMP WITH TIME ZONE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Donation appointments
CREATE TABLE donation_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INVENTORY SERVICE SCHEMA ====================

CREATE TYPE blood_unit_status AS ENUM ('AVAILABLE', 'RESERVED', 'EXPIRED', 'DISCARDED', 'TRANSFUSED');

-- Blood Units table
CREATE TABLE blood_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blood_type blood_type NOT NULL,
    donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    quantity_ml INTEGER NOT NULL,
    status blood_unit_status NOT NULL DEFAULT 'AVAILABLE',
    collection_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    storage_location VARCHAR(100),
    batch_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory transactions (transfers between hospitals)
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blood_unit_id UUID NOT NULL REFERENCES blood_units(id) ON DELETE RESTRICT,
    from_hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    to_hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    quantity_ml INTEGER NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blood inventory summary (for quick lookups)
CREATE TABLE blood_inventory_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL UNIQUE REFERENCES hospitals(id) ON DELETE CASCADE,
    blood_type blood_type NOT NULL,
    total_units INTEGER DEFAULT 0,
    total_quantity_ml INTEGER DEFAULT 0,
    available_quantity_ml INTEGER DEFAULT 0,
    reserved_quantity_ml INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== NOTIFICATION SERVICE SCHEMA ====================

CREATE TYPE notification_type AS ENUM ('DONATION_REMINDER', 'APPOINTMENT_CONFIRMATION', 'BLOOD_AVAILABLE', 'URGENT_REQUEST', 'SYSTEM_ALERT', 'USER_MESSAGE');
CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status notification_status NOT NULL DEFAULT 'PENDING',
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(255),
    notification_channel VARCHAR(50), -- SMS, EMAIL, PUSH, IN_APP
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    donation_reminders BOOLEAN DEFAULT TRUE,
    blood_availability_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES ====================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_blood_type ON users(blood_type);

-- Donor indexes
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_donors_is_eligible ON donors(is_eligible_to_donate);

-- Patient indexes
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_hospital_id ON patients(hospital_id);

-- Hospital indexes
CREATE INDEX idx_hospitals_user_id ON hospitals(user_id);
CREATE INDEX idx_hospitals_is_verified ON hospitals(is_verified);

-- Donation indexes
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_hospital_id ON donations(hospital_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_blood_type ON donations(blood_type);
CREATE INDEX idx_donations_donation_date ON donations(donation_date);

-- Blood Unit indexes
CREATE INDEX idx_blood_units_hospital_id ON blood_units(hospital_id);
CREATE INDEX idx_blood_units_blood_type ON blood_units(blood_type);
CREATE INDEX idx_blood_units_status ON blood_units(status);
CREATE INDEX idx_blood_units_expiry_date ON blood_units(expiry_date);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ==================== VIEWS ====================

-- Active donors view
CREATE OR REPLACE VIEW active_donors AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone_number,
    u.blood_type,
    d.last_donation_date,
    d.total_donations,
    d.is_eligible_to_donate
FROM users u
JOIN donors d ON u.id = d.user_id
WHERE u.status = 'ACTIVE' AND d.is_eligible_to_donate = TRUE;

-- Hospital blood inventory view
CREATE OR REPLACE VIEW hospital_blood_levels AS
SELECT 
    h.id,
    h.hospital_name,
    h.city,
    bis.blood_type,
    bis.total_units,
    bis.available_quantity_ml
FROM hospitals h
JOIN blood_inventory_summary bis ON h.id = bis.hospital_id
WHERE bis.available_quantity_ml > 0;

-- Recent donations view
CREATE OR REPLACE VIEW recent_donations AS
SELECT 
    d.id,
    u.email,
    u.first_name,
    u.last_name,
    d.blood_type,
    d.quantity_ml,
    d.donation_date,
    h.hospital_name,
    d.status
FROM donations d
JOIN donors dr ON d.donor_id = dr.id
JOIN users u ON dr.user_id = u.id
LEFT JOIN hospitals h ON d.hospital_id = h.id
ORDER BY d.donation_date DESC;

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for users table (users can see their own profile, hospitals can see public info)
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid()::text = id::text OR role = 'ADMIN');

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Policies for donors (can view own info, hospitals can view registered donors)
CREATE POLICY "Donors can view own record"
    ON donors FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Policies for notifications (users can only see their own)
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Policies for blood units (hospitals can see their own inventory)
CREATE POLICY "Hospitals can view own blood units"
    ON blood_units FOR SELECT
    USING (auth.uid()::text IN (
        SELECT user_id FROM hospitals WHERE id = hospital_id
    ));

-- ==================== TRIGGERS ====================

-- Function to update user updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER trigger_update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();

-- Trigger for all other tables with updated_at
CREATE TRIGGER trigger_update_donor_timestamp
BEFORE UPDATE ON donors
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();

CREATE TRIGGER trigger_update_donation_timestamp
BEFORE UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();

CREATE TRIGGER trigger_update_blood_unit_timestamp
BEFORE UPDATE ON blood_units
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();
