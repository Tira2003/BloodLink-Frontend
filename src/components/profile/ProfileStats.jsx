import { Heart, Award } from 'lucide-react';

export default function ProfileStats({ totalDonations, rewardPoints }) {
  const stats = [
    { label: 'Total Donations', value: totalDonations, icon: Heart, color: 'text-red', bg: 'bg-red-light' },
    { label: 'Reward Points', value: rewardPoints, icon: Award, color: 'text-amber', bg: 'bg-amber-light' },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-5 mb-6">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-surface border border-border-subtle rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className={`w-12 h-12 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>
            <Icon size={22} />
          </div>
          <div>
            <div className="text-3xl font-extrabold font-heading">{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
