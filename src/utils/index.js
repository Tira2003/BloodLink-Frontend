import { AlertTriangle, Clock, Info } from 'lucide-react';

export const URGENCY_CONFIG = {
  CRITICAL: { label: 'Critical', variant: 'critical', icon: AlertTriangle, color: 'text-red' },
  MEDIUM: { label: 'Medium', variant: 'medium', icon: Clock, color: 'text-amber' },
  LOW: { label: 'Low', variant: 'low', icon: Info, color: 'text-cta' },
};

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

export function getRewardTier(totalDonations) {
  if (totalDonations >= 20) {
    return { label: 'Gold', variant: 'gold', min: 20, next: null };
  }
  if (totalDonations >= 10) {
    return { label: 'Silver', variant: 'silver', min: 10, next: 20 };
  }
  return { label: 'Bronze', variant: 'bronze', min: 0, next: 10 };
}
