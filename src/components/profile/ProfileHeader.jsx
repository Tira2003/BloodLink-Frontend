import { Award, Edit2 } from 'lucide-react';
import { Avatar } from '../ui/InfoRow';
import Button from '../ui/Button';
import { getRewardTier } from '../../utils';

const TIER_STYLES = {
  bronze: 'bg-amber-light text-amber',
  silver: 'bg-slate-100 text-slate-600',
  gold: 'bg-yellow-100 text-yellow-800',
};

export default function ProfileHeader({ profile, onEdit }) {
  const totalDonations = profile.totalDonations || 0;
  const tier = getRewardTier(totalDonations);
  const name = profile.fullName || profile.name;

  return (
    <div className="bg-gradient-to-br from-primary-light to-surface border border-border-subtle rounded-3xl p-8 flex items-center gap-6 flex-wrap mb-6">
      <Avatar name={name} size="lg" />
      <div className="flex-1 min-w-[200px]">
        <h1 className="text-2xl font-extrabold font-heading mb-1">{name}</h1>
        <p className="text-sm text-text-secondary">{profile.email}</p>
        <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs font-bold ${TIER_STYLES[tier.variant]}`}>
          <Award size={14} />
          {tier.label} Donor
          {tier.next && (
            <span className="opacity-70 font-normal">
              · {tier.next - totalDonations} until {tier.label === 'Bronze' ? 'Silver' : 'Gold'}
            </span>
          )}
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onEdit}>
        <Edit2 size={14} /> Edit
      </Button>
    </div>
  );
}
