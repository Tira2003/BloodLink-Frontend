import { Link } from 'react-router-dom';
import { BLOOD_GROUPS } from '../../constants';
import { BloodTypeBadge } from '../ui/Badge';

export default function BloodGroupsBar() {
  return (
    <section className="bg-surface border-y border-border-subtle py-5">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-widest">
            Blood Groups
          </span>
          {BLOOD_GROUPS.map((bg) => (
            <Link key={bg} to={`/requests?type=${bg}`} className="no-underline hover:opacity-80 transition-opacity">
              <BloodTypeBadge type={bg} />
            </Link>
          ))}
          <span className="text-xs text-text-muted ml-2">
            Click to view matching requests →
          </span>
        </div>
      </div>
    </section>
  );
}
