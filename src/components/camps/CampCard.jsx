import { MapPin, Calendar, Clock, Phone, Building2 } from 'lucide-react';
import Badge from '../ui/Badge';

export default function CampCard({ camp }) {
  const isPast = new Date(camp.date) < new Date();
  const pct = camp.targetUnits
    ? Math.min(100, Math.round((camp.registeredDonors / camp.targetUnits) * 100))
    : null;

  const details = [
    {
      key: 'date',
      show: true,
      content: (
        <DetailRow icon={Calendar} iconClass="text-primary">
          {new Date(camp.date).toLocaleDateString('en-LK', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </DetailRow>
      ),
    },
    {
      key: 'time',
      show: camp.startTime || camp.endTime,
      content: (
        <DetailRow icon={Clock} iconClass="text-primary">
          {camp.startTime}{camp.endTime ? ` – ${camp.endTime}` : ''}
        </DetailRow>
      ),
    },
    {
      key: 'location',
      show: true,
      content: (
        <DetailRow icon={MapPin} iconClass="text-cta">
          {camp.location} · {camp.district}
        </DetailRow>
      ),
    },
    {
      key: 'phone',
      show: camp.contactPhone,
      content: (
        <DetailRow icon={Phone} iconClass="text-amber">
          <a href={`tel:${camp.contactPhone}`} className="font-semibold text-primary">
            {camp.contactPhone}
          </a>
        </DetailRow>
      ),
    },
    {
      key: 'bloodTypes',
      show: camp.bloodTypesNeeded?.length > 0,
      content: (
        <div>
          <p className="mb-2 text-xs text-text-muted">Blood types needed</p>
          <div className="flex flex-wrap gap-1">
            {camp.bloodTypesNeeded.map((t) => (
              <Badge key={t} variant="critical" className="text-[0.72rem]">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'progress',
      show: pct !== null,
      content: (
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-text-muted">
              {camp.registeredDonors} of {camp.targetUnits} donors
            </span>
            <span className="font-semibold text-primary">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border-subtle">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-cta' : 'bg-primary'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ),
    },
  ].filter((item) => item.show);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-border-subtle bg-gradient-to-br from-primary-light to-green-50 px-6 py-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-snug">{camp.name}</h3>
          <Badge variant={isPast ? 'completed' : 'primary'}>
            {isPast ? 'Past' : 'Upcoming'}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-primary-dark">
          <Building2 size={13} /> {camp.organizer}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-6">
        {details.map((item, index) => (
          <div key={item.key}>
            {item.content}
            {index < details.length - 1 && <Divider />}
          </div>
        ))}

        {camp.notes && (
          <>
            {details.length > 0 && <Divider />}
            <p className="text-xs italic text-text-secondary">{camp.notes}</p>
          </>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, iconClass, children }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-text-secondary">
      <Icon size={14} className={`mt-0.5 shrink-0 ${iconClass}`} />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

function Divider() {
  return <div className="mt-3 h-px w-full bg-border-subtle" />;
}
