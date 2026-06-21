import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Droplets, CheckCircle2, Info, Clock, CheckCircle, XCircle, AlertTriangle, Plus,
} from 'lucide-react';
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
import { patientService } from '../services/patientService';
import { donorService } from '../services/donorService';
import { mockRequests } from '../data/mockData';

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   icon: Clock,        cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  MATCHED:   { label: 'Matched',   icon: CheckCircle,  cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
  FULFILLED: { label: 'Fulfilled', icon: CheckCircle2, cls: 'bg-green-50 text-green-700 border border-green-200' },
  CANCELLED: { label: 'Cancelled', icon: XCircle,      cls: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

const URGENCY_CLS = {
  CRITICAL: 'bg-red-50 text-red-700 border border-red-200',
  MEDIUM:   'bg-amber-50 text-amber-700 border border-amber-200',
  LOW:      'bg-green-50 text-green-700 border border-green-200',
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

// ── My Requests table row ───────────────────────────────────────────────────
function MyRequestRow({ req, onCancel, cancelling }) {
  const urg = req.urgency || req.urgencyLevel || '';
  return (
    <tr>
      <td className="py-3 px-4">
        <div className="font-medium text-sm text-text">{req.hospital || req.hospitalName || '—'}</div>
        <div className="text-xs text-text-muted">{req.city || req.district || ''}</div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 border border-red-200 text-red font-bold text-xs mx-auto">
          {req.bloodType || req.bloodTypeNeeded || '?'}
        </div>
      </td>
      <td className="py-3 px-4 text-center font-bold text-sm text-text">
        {req.units || req.unitsNeeded || 0}
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${URGENCY_CLS[urg] || ''}`}>
          {urg || '—'}
        </span>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={req.status} />
      </td>
      <td className="py-3 px-4 text-xs text-text-muted">
        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}
      </td>
      <td className="py-3 px-4">
        {req.status === 'PENDING' && (
          <button
            onClick={() => onCancel(req.id)}
            disabled={cancelling === req.id}
            className="text-xs font-semibold text-red hover:underline disabled:opacity-50"
          >
            {cancelling === req.id ? 'Cancelling…' : 'Cancel'}
          </button>
        )}
      </td>
    </tr>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Requests() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // active tab: 'all' | 'mine'
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'mine' ? 'mine' : 'all');

  // ── All requests state ──
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

  // ── My requests state ──
  const [myRequests, setMyRequests] = useState([]);
  const [myLoading, setMyLoading] = useState(false);
  const [cancelling, setCancelling] = useState(null);

  const isDonor     = user?.role === 'DONOR';
  const isRequester = user?.role === 'RECIPIENT' || user?.role === 'HOSPITAL';

  // ── Load all requests ────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'all') return;
    const load = async () => {
      setIsLoading(true);
      try {
        const params = { status: 'PENDING' };
        if (isDonor && user.bloodType) params.bloodType = user.bloodType;
        if (filters.bloodType) params.bloodType = filters.bloodType;
        if (filters.urgency)   params.urgency   = filters.urgency;
        if (filters.district)  params.district  = filters.district;
        const data = await requestService.getAll(params);
        setRequests(Array.isArray(data) ? data : data.content || []);
      } catch {
        let data = mockRequests.filter((r) => r.status === 'PENDING');
        if (isDonor && user?.bloodType) data = data.filter((r) => r.bloodType === user.bloodType);
        if (filters.bloodType) data = data.filter((r) => r.bloodType === filters.bloodType);
        if (filters.urgency)   data = data.filter((r) => r.urgency === filters.urgency);
        setRequests(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters, isDonor, user, activeTab]);

  // ── Load my requests ─────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'mine' || !isRequester) return;
    const load = async () => {
      setMyLoading(true);
      try {
        // Try active + history combined
        const [active, history] = await Promise.allSettled([
          patientService.getActiveRequests(),
          patientService.getRequestHistory(),
        ]);
        const activeList  = active.status  === 'fulfilled' ? active.value  : [];
        const historyList = history.status === 'fulfilled' ? history.value : [];
        // Deduplicate by id (active may overlap with history)
        const seen = new Set();
        const merged = [...activeList, ...historyList].filter((r) => {
          if (seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });
        setMyRequests(merged);
      } catch {
        setMyRequests([]);
      } finally {
        setMyLoading(false);
      }
    };
    load();
  }, [activeTab, isRequester]);

  const applyFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    if (key === 'bloodType') setSearchParams(val ? { type: val } : {});
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'mine' ? { tab: 'mine' } : {});
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

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this blood request?')) return;
    setCancelling(id);
    try {
      await patientService.cancelRequest(id);
      setMyRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r))
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel request.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <PageLayout flushTop contentClassName="pb-16">
      <RequestsHeader isDonor={isDonor} user={user} bloodType={user?.bloodType} />

      <div className="container max-w-6xl mx-auto px-6 py-8">
        {/* ── Tabs ── */}
        {isRequester && (
          <div className="flex gap-1 mb-6 border-b border-border-subtle">
            <button
              id="tab-all-requests"
              onClick={() => switchTab('all')}
              className={`px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab === 'all'
                  ? 'border-primary text-primary-dark'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              All Requests
            </button>
            <button
              id="tab-my-requests"
              onClick={() => switchTab('mine')}
              className={`px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab === 'mine'
                  ? 'border-primary text-primary-dark'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              My Requests
              {myRequests.filter((r) => r.status === 'PENDING').length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-white">
                  {myRequests.filter((r) => r.status === 'PENDING').length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* ── ALL REQUESTS TAB ─────────────────────────────────────────────── */}
        {activeTab === 'all' && (
          <>
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
                  isRequester ? (
                    <Link to="/request/create">
                      <Button variant="cta" size="sm">+ Create a Request</Button>
                    </Link>
                  ) : null
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
          </>
        )}

        {/* ── MY REQUESTS TAB ──────────────────────────────────────────────── */}
        {activeTab === 'mine' && isRequester && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-text">My Blood Requests</h2>
                <p className="text-sm text-text-secondary mt-0.5">
                  Track the status of all your submitted requests.
                </p>
              </div>
              <Link to="/request/create">
                <Button variant="cta" size="sm" id="new-request-btn">
                  <Plus size={15} /> New Request
                </Button>
              </Link>
            </div>

            {myLoading && <PageLoader message="Loading your requests…" />}

            {!myLoading && myRequests.length === 0 && (
              <EmptyState
                icon={Droplets}
                title="No requests yet"
                description="You haven't submitted any blood requests. Create one and we'll find matching donors instantly."
                action={
                  <Link to="/request/create">
                    <Button variant="cta" size="sm">+ Create a Request</Button>
                  </Link>
                }
              />
            )}

            {!myLoading && myRequests.length > 0 && (
              <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-bg border-b border-border-subtle">
                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Hospital</th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wide">Blood</th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wide">Units</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Urgency</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Date</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {myRequests.map((req) => (
                        <MyRequestRow
                          key={req.id}
                          req={req}
                          onCancel={handleCancel}
                          cancelling={cancelling}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Status legend */}
                <div className="border-t border-border-subtle px-4 py-3 bg-bg flex flex-wrap gap-3">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <span key={key} className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.cls}`}>
                        <Icon size={10} />{cfg.label}
                      </span>
                    );
                  })}
                  <span className="text-xs text-text-muted ml-auto">
                    {myRequests.length} total request{myRequests.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Info banner: what the statuses mean */}
            {!myLoading && myRequests.length > 0 && (
              <div className="mt-4 rounded-xl bg-primary-light border border-border p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-text-secondary leading-relaxed">
                    <strong className="text-text">Matched</strong> means a donor has accepted your request — you'll be contacted soon.{' '}
                    <strong className="text-text">Fulfilled</strong> means the donation was completed.
                    You can cancel a <strong className="text-text">Pending</strong> request at any time.
                  </div>
                </div>
              </div>
            )}
          </>
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
