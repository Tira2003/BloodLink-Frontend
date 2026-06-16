import { Link } from 'react-router-dom';
import { Heart, Calendar, CheckCircle2 } from 'lucide-react';
import Badge, { BloodTypeBadge } from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

export default function DonationHistory({ history, totalDonations }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle font-heading font-bold">
        <span>Donation History</span>
        <Badge variant="primary">{totalDonations} total</Badge>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No donations yet"
          description="Accept a blood request to make your first donation and earn reward points."
          action={
            <Link to="/requests">
              <Button variant="primary" size="sm">View Requests</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-light text-primary-dark text-xs uppercase tracking-wide">
                {['Date', 'Blood Type', 'Hospital', 'Units', 'Points', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((d, i) => (
                <tr key={d.id || i} className="border-t border-border-subtle hover:bg-bg/50 text-sm text-text-secondary">
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-text-muted" />
                      {new Date(d.date || d.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <BloodTypeBadge type={d.bloodType} className="w-auto h-auto px-1.5 py-0.5 text-xs" />
                  </td>
                  <td className="px-4 py-3.5">{d.hospital}</td>
                  <td className="px-4 py-3.5">{d.units}</td>
                  <td className="px-4 py-3.5 font-bold text-amber">+{d.points || 10}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={d.status === 'COMPLETED' ? 'completed' : 'matched'}>
                      <CheckCircle2 size={10} className="mr-1 inline" />
                      {d.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
