import { User, Phone, MapPin, Building2, Droplets, Edit2 } from 'lucide-react';
import { BloodTypeBadge } from '../ui/Badge';
import { InfoRow } from '../ui/InfoRow';
import Button from '../ui/Button';

export default function ProfileInfoCard({ profile, onEdit }) {
  const rows = [
    { label: 'Blood Type', value: <BloodTypeBadge type={profile.bloodType} className="w-auto h-auto px-2 py-0.5 text-xs" />, icon: Droplets },
    { label: 'Age', value: `${profile.age} years`, icon: User },
    { label: 'Phone', value: profile.phone, icon: Phone },
    { label: 'District', value: profile.district || profile.city, icon: MapPin },
    { label: 'Nearest Hospital', value: profile.nearestHospital, icon: Building2 },
  ].filter((r) => r.value);

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle font-heading font-bold">
        <span>Personal Information</span>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit2 size={14} /> Edit
        </Button>
      </div>
      <div className="p-6">
        {rows.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex gap-2.5 py-3 border-b border-border-subtle text-sm last:border-b-0">
            <span className="font-semibold text-text min-w-[160px] shrink-0 flex items-center gap-2">
              <Icon size={14} className="text-primary shrink-0" /> {label}
            </span>
            <span className="text-text-secondary">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
