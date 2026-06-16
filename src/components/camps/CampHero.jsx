import { Tent, Plus } from 'lucide-react';
import PageHero from '../layout/PageHero';
import Button from '../ui/Button';

export default function CampHero({ isHospital, onCreateClick }) {
  return (
    <PageHero
      badgeIcon={Tent}
      badgeLabel="Donation Camps"
      title="Blood Donation Camps"
      description="Walk-in donation camps organized by hospitals and blood banks across Sri Lanka. Show up, donate, and save lives."
      actions={
        isHospital ? (
          <Button variant="primary" size="lg" onClick={onCreateClick}>
            <Plus size={18} /> Organize a Camp
          </Button>
        ) : null
      }
    />
  );
}
