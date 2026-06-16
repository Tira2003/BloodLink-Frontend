import { useState, useEffect } from 'react';
import { Tent, Info } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import CampHero from '../components/camps/CampHero';
import CampFilters from '../components/camps/CampFilters';
import CampCard from '../components/camps/CampCard';
import CreateCampModal from '../components/camps/CreateCampModal';
import EmptyState from '../components/ui/EmptyState';
import InfoBanner from '../components/ui/InfoBanner';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { campService } from '../services/campService';
import { MOCK_CAMPS } from '../data/campData';

export default function DonationCamp() {
  const { user } = useAuth();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [district, setDistrict] = useState('');
  const [upcoming, setUpcoming] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isHospital = user?.role === 'HOSPITAL';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await campService.getAll({ district, upcoming });
        setCamps(Array.isArray(data) ? data : data.content || []);
      } catch {
        let data = [...MOCK_CAMPS];
        if (district) data = data.filter((c) => c.district === district);
        if (upcoming) data = data.filter((c) => new Date(c.date) >= new Date());
        setCamps(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [district, upcoming]);

  return (
    <PageLayout flushTop>
      <CampHero isHospital={isHospital} onCreateClick={() => setCreateOpen(true)} />

      <div className="container max-w-6xl mx-auto px-6 py-8 pb-16">
        <CampFilters
          district={district}
          upcoming={upcoming}
          filtersOpen={filtersOpen}
          isLoading={loading}
          count={camps.length}
          onDistrictChange={setDistrict}
          onUpcomingToggle={() => setUpcoming((u) => !u)}
          onToggleFilters={() => setFiltersOpen((o) => !o)}
        />

        {user?.role === 'DONOR' && (
          <InfoBanner icon={Info} className="mb-6">
            Donation camps are walk-in events. Just show up with your NIC at the venue.
          </InfoBanner>
        )}

        {loading && <PageLoader message="Loading camps…" />}

        {!loading && camps.length === 0 && (
          <EmptyState
            icon={Tent}
            title="No camps found"
            description={
              upcoming
                ? 'No upcoming camps in this district.'
                : 'No camps found.'
            }
            action={
              isHospital ? (
                <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
                  Organize a Camp
                </Button>
              ) : null
            }
          />
        )}

        {!loading && camps.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {camps.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>
        )}
      </div>

      <CreateCampModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(newCamp) => setCamps((prev) => [newCamp, ...prev])}
      />
    </PageLayout>
  );
}
