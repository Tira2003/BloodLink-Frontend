import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Clock3 } from 'lucide-react';
import { authService } from '../services/authService';
import PageLayout from '../components/layout/PageLayout';
import DonorRegisterForm from '../components/register/DonorRegisterForm';
import SuccessCard, { SuccessLink } from '../components/ui/SuccessCard';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (form) => {
    setLoading(true);
    setServerError('');
    try {
      // Register returns auth response with access/refresh tokens and user info
      await authService.register(form);
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
        title="Registration Successful!"
        description="Welcome to BloodLink! You can now log in and check blood requests matching your blood type."
        primaryAction={<SuccessLink to="/login">Go to Login →</SuccessLink>}
      />
    );
  }

  return (
    <PageLayout showFooter={false} flushTop contentClassName="pt-16 md:pt-20 pb-4">
      <section className="container max-w-6xl mx-auto px-6 py-2 md:py-4 animate-slideUp">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start lg:gap-12">
          <div className="md:pt-4">
            <p className="text-xs tracking-[0.14em] uppercase font-semibold text-text-muted mb-3">
              Save Lives With BloodLink
            </p>
            <h1 className="text-4xl font-extrabold font-heading text-text leading-tight mb-4">
              Become the reason someone gets another chance.
            </h1>
            <p className="text-base text-text-secondary leading-relaxed max-w-md">
              Your one donation can support surgeries, emergencies, and critical care.
              Join a trusted donor network and help hospitals find life-saving blood faster.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <Heart size={16} className="text-red mt-0.5 shrink-0" />
                <span>Every donation can directly impact a patient in urgent need.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <Clock3 size={16} className="text-primary mt-0.5 shrink-0" />
                <span>Quick registration, smart matching, and timely district-based alerts.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <ShieldCheck size={16} className="text-cta mt-0.5 shrink-0" />
                <span>Your profile is secure and shared only for verified blood requests.</span>
              </div>
            </div>
          </div>

          <div>
            <DonorRegisterForm onSubmit={handleSubmit} loading={loading} serverError={serverError} />

            <p className="text-center text-sm text-text-secondary mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold">Sign in →</Link>
            </p>
            <p className="text-center text-sm text-text-secondary mt-2">
              Need blood instead?{' '}
              <Link to="/request/create" className="text-cta font-semibold">Submit a request →</Link>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
