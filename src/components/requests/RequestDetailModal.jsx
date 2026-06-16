import { CheckCircle2, XCircle } from 'lucide-react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { BloodTypeBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { InfoRow } from '../ui/InfoRow';
import LoadingSpinner from '../ui/LoadingSpinner';
import { URGENCY_CONFIG } from '../../utils';

const URGENCY_PILL = {
  CRITICAL: 'bg-red/15 border-red/30 text-red-dark',
  MEDIUM: 'bg-amber-light border-amber/30 text-amber',
  LOW: 'bg-green-light border-cta/30 text-cta-dark',
};

export default function RequestDetailModal({ request, onClose, onAccept, onReject, loading }) {
  if (!request) return null;

  const urgency = URGENCY_CONFIG[request.urgency] || URGENCY_CONFIG.LOW;
  const urgencyPill = URGENCY_PILL[request.urgency] || URGENCY_PILL.LOW;

  return (
    <Modal open onClose={onClose}>
      <ModalHeader
        title="Blood Request Details"
        subtitle="Review before accepting"
        badge={
          <span
            className={`inline-flex shrink-0 items-center rounded border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${urgencyPill}`}
          >
            {urgency.label}
          </span>
        }
        onClose={onClose}
      />

      <ModalBody>
        <InfoRow label="Patient Name" value={request.patientName || request.requester} />
        <InfoRow label="Blood Type" value={<BloodTypeBadge type={request.bloodType} className="w-auto h-auto px-2 py-0.5 text-xs" />} />
        <InfoRow label="Units Needed" value={`${request.units} unit${request.units > 1 ? 's' : ''}`} />
        <InfoRow label="Hospital" value={request.hospital} />
        <InfoRow label="District" value={request.city || request.district} />
        <InfoRow label="Contact" value={request.contactPhone || request.contactInfo || 'Contact hospital directly'} />
        <InfoRow label="Notes" value={request.notes || '—'} />
        <InfoRow label="Posted" value={new Date(request.createdAt).toLocaleString()} />
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onReject} disabled={loading}>
          <XCircle size={16} /> Pass
        </Button>
        <Button variant="cta" onClick={() => onAccept(request.id)} disabled={loading}>
          {loading ? (
            <><LoadingSpinner light /> Processing…</>
          ) : (
            <><CheckCircle2 size={16} /> Accept & Donate</>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
