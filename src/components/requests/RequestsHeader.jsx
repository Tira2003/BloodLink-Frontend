import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import PageHero from '../layout/PageHero';
import Button from '../ui/Button';

export default function RequestsHeader({ isDonor, user, bloodType }) {
  return (
    <PageHero
      badgeIcon={Droplets}
      badgeLabel="Blood Requests"
      title={isDonor ? 'Matching Blood Requests' : 'Blood Requests'}
      description={
        isDonor
          ? `Showing requests matching your blood type (${bloodType})`
          : 'Open blood requests from patients and hospitals across Sri Lanka'
      }
      actions={
        <div className="flex flex-wrap items-center gap-3">
          {!user && (
            <Link to="/register/donor">
              <Button variant="primary" size="lg">
                <Droplets size={18} /> Become a Donor
              </Button>
            </Link>
          )}
          <Link to="/request/create">
            <Button variant="cta" size="lg">+ New Request</Button>
          </Link>
        </div>
      }
    />
  );
}
