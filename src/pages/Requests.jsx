import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Droplets, CheckCircle2, Info } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import RequestsHeader from '../components/requests/RequestsHeader';
import RequestFilters from '../components/requests/RequestFilters';
import RequestCard from '../components/requests/RequestCard';
import RequestDetailModal from '../components/requests/RequestDetailModal';
import EmptyState from '../components/ui/EmptyState';
import InfoBanner from '../components/ui/InfoBanner';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { donorService } from '../services/donorService';
import { mockRequests } from '../data/mockData';

export default function Requests() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    bloodType: searchParams.get('type') || '',
    urgency: '',
    district: '',
  });

  const isDonor = user?.role === 'DONOR';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const params = { status: 'PENDING' };
        if (isDonor && user.bloodType) params.bloodType = user.bloodType;
        if (filters.bloodType) params.bloodType = filters.bloodType;
        if (filters.urgency) params.urgency = filters.urgency;
        if (filters.district) params.district = filters.district;

        const data = await requestService.getAll(params);
        setRequests(Array.isArray(data) ? data : data.content || []);
      } catch {
        let data = mockRequests.filter((r) => r.status === 'PENDING');
        if (isDonor && user?.bloodType) data = data.filter((r) => r.bloodType === user.bloodType);
        if (filters.bloodType) data = data.filter((r) => r.bloodType === filters.bloodType);
        if (filters.urgency) data = data.filter((r) => r.urgency === filters.urgency);
        setRequests(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters, isDonor, user]);

  const applyFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    if (key === 'bloodType') setSearchParams(val ? { type: val } : {});
  };

  const handleAccept = async (id) => {
    setActionLoading(true);
    try {
      await donorService.respondToRequest(id, 'ACCEPT');
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
      setSuccessMsg("Thank you! Your response has been recorded. You'll receive details shortly.");
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to accept request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await donorService.respondToRequest(selected.id, 'REJECT');
    } finally {
      setSelected(null);
      setActionLoading(false);
    }
  };

  return (
    <PageLayout flushTop contentClassName="pb-16">
      <RequestsHeader isDonor={isDonor} user={user} bloodType={user?.bloodType} />

      <div className="container max-w-6xl mx-auto px-6 py-8">
        {successMsg && (
          <div className="flex gap-2.5 items-start bg-green-light border border-cta rounded-lg p-4 mb-6 text-cta-dark animate-slideDown">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{successMsg}</span>
          </div>
        )}

        {isDonor && (
          <InfoBanner icon={Info} className="mb-6">
            These requests match your blood type <strong>{user.bloodType}</strong>.
            Accept a request to see full details and get the hospital contact.
          </InfoBanner>
        )}

        <RequestFilters
          filters={filters}
          filtersOpen={filtersOpen}
          isDonor={isDonor}
          isLoading={isLoading}
          count={requests.length}
          onToggle={() => setFiltersOpen((o) => !o)}
          onApply={applyFilter}
        />

        {isLoading && <PageLoader message="Loading requests…" />}

        {!isLoading && requests.length === 0 && (
          <EmptyState
            icon={Droplets}
            title={isDonor ? 'No matching requests right now' : 'No open requests'}
            description={
              isDonor
                ? "There are currently no pending requests matching your blood type. You'll be notified via SMS and email when one comes in."
                : 'No open blood requests at the moment. Check back later.'
            }
            action={
              <Link to="/request/create">
                <Button variant="cta" size="sm">+ Create a Request</Button>
              </Link>
            }
          />
        )}

        {!isLoading && requests.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                isDonor={isDonor}
                onSelect={setSelected}
                onQuickReject={async () => {
                  setActionLoading(true);
                  try {
                    await donorService.respondToRequest(req.id, 'REJECT');
                  } catch { /* ignore */ }
                  setActionLoading(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <RequestDetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onAccept={handleAccept}
          onReject={handleReject}
          loading={actionLoading}
        />
      )}
    </PageLayout>
  );
}
