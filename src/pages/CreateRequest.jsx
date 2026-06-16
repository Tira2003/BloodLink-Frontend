import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Heart, BellRing, Clock3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
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
        primaryAction={<SuccessLink to="/requests">View All Requests</SuccessLink>}
        secondaryAction={
          <Button variant="secondary" size="lg" className="w-full justify-center" onClick={() => setSuccess(false)}>
            Submit Another Request
          </Button>
        }
      />
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
                <span>No account is required to submit a valid blood request.</span>
              </div>
            </div>
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
