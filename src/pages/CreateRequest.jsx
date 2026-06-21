import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Heart, BellRing, Clock3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { patientService } from '../services/patientService';
import PageLayout from '../components/layout/PageLayout';
import CreateRequestForm from '../components/createRequest/CreateRequestForm';
import SuccessCard, { SuccessLink } from '../components/ui/SuccessCard';
import Button from '../components/ui/Button';

export default function CreateRequest() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submittedDistrict, setSubmittedDistrict] = useState('');

  const handleSubmit = async (form) => {
    setLoading(true);
    setServerError('');
    try {
      await requestService.create(form);
      setSubmittedDistrict(form.district);
      setSuccess(true);
    } catch (err) {
      const errMessage = err.message ? err.message.toLowerCase() : '';
      if (errMessage.includes('patient profile not found') || errMessage === 'failed to fetch') {
        try {
          const FRONTEND_TO_BACKEND_BLOOD_TYPE = {
            'A+': 'A_POS', 'A-': 'A_NEG', 'B+': 'B_POS', 'B-': 'B_NEG',
            'AB+': 'AB_POS', 'AB-': 'AB_NEG', 'O+': 'O_POS', 'O-': 'O_NEG',
          };
          
          try {
            await patientService.createProfile({
              bloodType: FRONTEND_TO_BACKEND_BLOOD_TYPE[form.bloodType] || 'O_POS',
              city: form.district,
              district: form.district,
              emergencyContact: form.contactPhone,
              medicalNotes: '',
            });
          } catch (profileErr) {
            // Ignore errors here. If the profile already exists (409 Conflict),
            // or we hit a CORS error on the 409, we should just proceed to retry the request.
          }
          
          // Retry request creation
          await requestService.create(form);
          setSubmittedDistrict(form.district);
          setSuccess(true);
          return;
        } catch (retryErr) {
          setServerError(retryErr.message || 'Failed to submit request. Please try again.');
          return;
        } finally {
          setLoading(false);
        }
      }
      setServerError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessCard
        title="Request Submitted!"
        description={`Your blood request has been sent. Compatible donors in ${submittedDistrict} will be notified via SMS and email. You'll be contacted shortly.`}
        primaryAction={<SuccessLink to="/requests?tab=mine">View My Requests</SuccessLink>}
        secondaryAction={
          <Button variant="secondary" size="lg" className="w-full justify-center" onClick={() => setSuccess(false)}>
            Submit Another Request
          </Button>
        }
      />
    );
  }

  // ── Guest guard ──────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <PageLayout showFooter={false} contentClassName="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center animate-slideUp">
          <div className="text-5xl mb-5">🩸</div>
          <h1 className="text-3xl font-extrabold font-heading text-text mb-3">
            Sign in to request blood
          </h1>
          <p className="text-base text-text-secondary mb-8 leading-relaxed">
            You need a patient or hospital account to submit a blood request.
            Create a free account in under a minute.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/login" state={{ from: { pathname: '/request/create' } }}>
              <Button variant="primary" size="lg" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link to="/register/patient">
              <Button variant="secondary" size="lg" className="w-full justify-center">
                Create Patient / Hospital Account
              </Button>
            </Link>
            <p className="text-sm text-text-muted mt-2">
              Want to donate instead?{' '}
              <Link to="/register/donor" className="text-primary font-semibold">
                Become a Donor →
              </Link>
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showFooter={false} flushTop contentClassName="pt-16 md:pt-20 pb-4">
      <section className="container max-w-6xl mx-auto px-6 py-2 md:py-4 animate-slideUp">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start lg:gap-12">
          <div className="md:pt-4">
            <p className="text-xs tracking-[0.14em] uppercase font-semibold text-text-muted mb-3">
              Request Blood Support
            </p>
            <h1 className="text-4xl font-extrabold font-heading text-text leading-tight mb-4">
              Help us reach the right donors faster.
            </h1>
            <p className="text-base text-text-secondary leading-relaxed max-w-md">
              Share the request details clearly and BloodLink will instantly notify compatible donors
              in your district. In emergencies, every minute matters.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <BellRing size={16} className="text-primary mt-0.5 shrink-0" />
                <span>Donors receive SMS and email alerts as soon as you submit.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <Clock3 size={16} className="text-amber mt-0.5 shrink-0" />
                <span>Clear urgency and unit details improve response speed.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <Droplets size={16} className="text-red mt-0.5 shrink-0" />
                <span>Track your request status from the My Requests tab.</span>
              </div>
            </div>

            {/* Donor info banner */}
            {user.role === 'DONOR' && (
              <div className="mt-6 rounded-xl bg-amber-light border border-amber p-4">
                <p className="text-sm font-semibold text-amber-dark mb-1">
                  You're signed in as a Donor
                </p>
                <p className="text-xs text-text-secondary">
                  Donors help by responding to requests — not by submitting them.
                  If you genuinely need blood, please{' '}
                  <Link to="/register/patient" className="text-primary font-semibold">
                    create a patient account
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>

          <div>
            <CreateRequestForm
              initialData={user || {}}
              onSubmit={handleSubmit}
              loading={loading}
              serverError={serverError}
            />

            <p className="text-center text-sm text-text-secondary mt-5">
              Want to help others?{' '}
              <Link to="/register/donor" className="text-primary font-semibold inline-flex items-center gap-1">
                <Heart size={13} /> Become a Donor
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
