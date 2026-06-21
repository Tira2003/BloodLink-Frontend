import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, ShieldCheck, BellRing } from 'lucide-react';
import { authService, persistSession } from '../services/authService';
import { patientService } from '../services/patientService';
import PageLayout from '../components/layout/PageLayout';
import PatientRegisterForm from '../components/register/PatientRegisterForm';
import SuccessCard, { SuccessLink } from '../components/ui/SuccessCard';

// ---------------------------------------------------------
// Maps Frontend blood types to Backend Enums
// ---------------------------------------------------------
const FRONTEND_TO_BACKEND_BLOOD_TYPE = {
  'A+': 'A_POS',
  'A-': 'A_NEG',
  'B+': 'B_POS',
  'B-': 'B_NEG',
  'AB+': 'AB_POS',
  'AB-': 'AB_NEG',
  'O+': 'O_POS',
  'O-': 'O_NEG',
};

export default function RegisterPatient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredRole, setRegisteredRole] = useState('RECIPIENT');
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (form) => {
    setLoading(true);
    setServerError('');
    try {
      const data = await authService.register({
        fullName:         form.fullName,
        email:            form.email,
        phone:            form.phone,
        age:              form.age ? parseInt(form.age) : undefined,
        district:         form.district,
        bloodType:        form.bloodType || undefined,
        password:         form.password,
        role:             form.role,                // 'RECIPIENT' | 'HOSPITAL'
        emergencyContact: form.emergencyContact || undefined,
      });

      // Persist the session to allow immediate authenticated calls
      persistSession(data);

      // Create Patient Profile using the new token
      await patientService.createProfile({
        bloodType: FRONTEND_TO_BACKEND_BLOOD_TYPE[form.bloodType] || 'O_POS', // Fallback
        city: form.district,
        district: form.district,
        emergencyContact: form.emergencyContact || '',
        medicalNotes: '',
      });

      // We clear the persisted session so the user must formally log in
      // or we can leave it and skip login! But to maintain original flow:
      authService.logout();

      setRegisteredRole(form.role);
      setSuccess(true);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessCard
        title="Account Created!"
        description={
          registeredRole === 'HOSPITAL'
            ? 'Your hospital account is ready. Sign in to submit blood requests and manage donation camps.'
            : 'Your patient account is ready. Sign in to submit a blood request and track its status.'
        }
        primaryAction={<SuccessLink to="/login">Go to Login →</SuccessLink>}
      />
    );
  }

  return (
    <PageLayout showFooter={false} flushTop contentClassName="pt-16 md:pt-20 pb-4">
      <section className="container max-w-6xl mx-auto px-6 py-2 md:py-4 animate-slideUp">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start lg:gap-12">
          {/* Left: marketing copy */}
          <div className="md:pt-4">
            <p className="text-xs tracking-[0.14em] uppercase font-semibold text-text-muted mb-3">
              Request Blood With BloodLink
            </p>
            <h1 className="text-4xl font-extrabold font-heading text-text leading-tight mb-4">
              Get the blood you need — fast.
            </h1>
            <p className="text-base text-text-secondary leading-relaxed max-w-md">
              Create a free account as a patient or hospital, then submit a blood
              request. BloodLink instantly notifies matching donors near you.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <BellRing size={16} className="text-primary mt-0.5 shrink-0" />
                <span>Donors are notified by SMS &amp; email within seconds.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <Droplets size={16} className="text-red mt-0.5 shrink-0" />
                <span>Track your request status in real time from your dashboard.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <ShieldCheck size={16} className="text-cta mt-0.5 shrink-0" />
                <span>Your data is protected and shared only with verified donors.</span>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-primary-light border border-border p-5">
              <p className="text-sm font-semibold text-primary-dark mb-2">Already registered?</p>
              <p className="text-xs text-text-secondary">
                If you already have a patient or hospital account,{' '}
                <Link to="/login" className="text-primary font-semibold">sign in here →</Link>
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <PatientRegisterForm
              onSubmit={handleSubmit}
              loading={loading}
              serverError={serverError}
            />

            <p className="text-center text-sm text-text-secondary mt-5">
              Want to donate blood instead?{' '}
              <Link to="/register/donor" className="text-primary font-semibold">
                Become a Donor →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
