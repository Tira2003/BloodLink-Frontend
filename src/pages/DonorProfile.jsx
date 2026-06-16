import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import DonationHistory from '../components/profile/DonationHistory';
import EditProfileModal from '../components/profile/EditProfileModal';
import { PageLoader } from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { donorService } from '../services/donorService';

export default function DonorProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, h] = await Promise.all([
          donorService.getProfile(),
          donorService.getDonationHistory(),
        ]);
        setProfile(p);
        setHistory(Array.isArray(h) ? h : h.content || []);
      } catch {
        setProfile(user ? {
          ...user,
          totalDonations: user.totalDonations || 0,
          rewardPoints: user.rewardPoints || 0,
        } : null);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSave = async (updated) => {
    const saved = await donorService.updateProfile(updated);
    setProfile(saved);
  };

  if (loading) {
    return (
      <PageLayout>
        <PageLoader />
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <EmptyState
          title="Could not load profile"
          description={<Link to="/login" className="text-primary font-semibold">Sign in again</Link>}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout contentClassName="pb-16">
      <div className="container max-w-3xl mx-auto px-6">
        <ProfileHeader profile={profile} onEdit={() => setEditOpen(true)} />
        <ProfileStats
          totalDonations={profile.totalDonations || 0}
          rewardPoints={profile.rewardPoints || 0}
        />
        <ProfileInfoCard profile={profile} onEdit={() => setEditOpen(true)} />
        <DonationHistory history={history} totalDonations={profile.totalDonations || 0} />
      </div>

      <EditProfileModal
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </PageLayout>
  );
}
