import { CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { URGENCY_CONFIG, timeAgo } from '../../utils';

const URGENCY_HEADER = {
  CRITICAL: 'bg-red-light/80 border-red/20',
  MEDIUM: 'bg-amber-light/80 border-amber/20',
  LOW: 'bg-primary-light/80 border-border',
};

const URGENCY_PILL = {
  CRITICAL: 'bg-red/15 border-red/30 text-red-dark',
  MEDIUM: 'bg-amber-light border-amber/30 text-amber',
  LOW: 'bg-green-light border-cta/30 text-cta-dark',
};

export default function RequestCard({ request, isDonor, onSelect, onQuickReject }) {
  const urgency = URGENCY_CONFIG[request.urgency] || URGENCY_CONFIG.LOW;
  const isPending = request.status === 'PENDING';
  const headerBg = URGENCY_HEADER[request.urgency] || URGENCY_HEADER.LOW;
  const urgencyPill = URGENCY_PILL[request.urgency] || URGENCY_PILL.LOW;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-primary/5 text-sm text-text-secondary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Top: blood type + patient + urgency */}
      <div className={`flex w-full items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 ${headerBg}`}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded border border-border bg-surface p-1.5">
            <span className="flex h-9 w-9 items-center justify-center text-sm font-extrabold text-red-dark">
              {request.bloodType}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-text">
              {request.patientName || 'Patient'}
            </p>
            <p className="flex items-center gap-1 text-xs text-text-muted">
              <Clock size={11} />
              {timeAgo(request.createdAt)}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${urgencyPill}`}
        >
          {urgency.label}
        </span>
      </div>

      {/* Bottom: key-value rows */}
      <div className="flex w-full flex-col gap-2 rounded-b-xl bg-surface p-4 pb-3">
        {request.notes && (
          <>
            <p className="mb-4 text-sm font-semibold leading-snug text-text md:text-base">
              {request.notes}
            </p>
            <Divider />
          </>
        )}
        <DetailRow label="Hospital" value={request.hospital} />
        <Divider />
        <DetailRow label="Location" value={request.city || request.district} />
        <Divider />
        <DetailRow
          label="Units needed"
          value={`${request.units} unit${request.units > 1 ? 's' : ''}`}
        />

        <Divider />

        {isDonor && isPending ? (
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={onQuickReject}>
              Pass
            </Button>
            <Button variant="cta" size="sm" onClick={() => onSelect(request)}>
              <CheckCircle2 size={15} /> Accept
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelect(request)}
            className="flex w-full items-center justify-center gap-1 py-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            View details <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <p className="shrink-0">{label}</p>
      <p className="truncate text-right font-medium text-text">{value}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border-subtle" />;
}
