import { Heart, MapPin, Calendar, CheckCircle, Clock, Bell, Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { donationService } from '../../services/donationService';
import { notificationService } from '../../services/notificationService';

const URGENCY_COLORS = { CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' };
const STATUS_COLORS = { PENDING: 'badge-pending', MATCHED: 'badge-matched', IN_PROGRESS: 'badge-in-progress', COMPLETED: 'badge-completed' };

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDonorData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const [donationList, appointmentList, unreadNotifs] = await Promise.all([
            donationService.getDonationsByDonor(user.id).catch(() => []),
            donationService.getAppointmentsByDonor(user.id).catch(() => []),
            notificationService.getUnreadNotifications(user.id).catch(() => []),
          ]);
          setDonations(Array.isArray(donationList) ? donationList : []);
          setAppointments(Array.isArray(appointmentList) ? appointmentList : []);
          setUnreadNotifications(Array.isArray(unreadNotifs) ? unreadNotifs : []);
        }
      } catch (err) {
        console.error('Error loading donor data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDonorData();
  }, [user?.id]);

  const completedDonations = donations.filter(d => d.status === 'COMPLETED').length;
  const upcomingAppointments = appointments.filter(a => new Date(a.appointmentDate) > new Date()).slice(0, 3);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-secondary text-sm">Good evening 👋</p>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span></h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/request/create" className="btn btn-secondary btn-sm">
              <Plus size={16} /> Create Request
            </Link>
            <button className="btn btn-primary btn-sm" id="toggle-availability-btn">
              <Heart size={16} fill="currentColor" /> Mark Unavailable
            </button>
          </div>
        </div>

        {/* Donor Profile Quick Card */}
        <div className="glass-card glass-card-active mb-6" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="avatar avatar-xl">{user?.name?.[0]}</div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-extrabold text-xl text-primary">{user?.name}</h2>
                <div className="blood-badge">{user?.bloodType}</div>
                <span className="badge badge-available">● Available</span>
              </div>
              <div className="flex items-center gap-1 text-secondary text-sm">
                <MapPin size={14} /> {user?.city}
              </div>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'Total Donations', value: '12' },
                { label: 'Lives Saved', value: '12' },
                { label: 'Donor Since', value: '2024' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-gradient">{value}</div>
                  <div className="text-xs text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="glass-card glass-card-error mb-6 flex items-center gap-3">
            <AlertCircle size={20} color="var(--red-400)" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner-dark" />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="dashboard-grid grid-cols-4 mb-6">
              {[
                { label: 'Total Donations', value: completedDonations, icon: Heart, color: 'var(--red-400)', bg: 'rgba(244,63,94,0.1)' },
                { label: 'Upcoming Appointments', value: upcomingAppointments.length, icon: Clock, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
                { label: 'Notifications', value: unreadNotifications.length, icon: Bell, color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
                { label: 'Last Donated', value: donations.length > 0 ? 'Recent' : 'Never', icon: Calendar, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="glass-card stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="font-extrabold text-3xl text-primary mb-1">{value}</div>
                  <div className="text-sm text-muted">{label}</div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid grid-cols-2">
              {/* Upcoming Appointments */}
              <div className="glass-card col-span-2">
                <div className="card-header">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calendar size={18} color="var(--red-400)" /> Upcoming Appointments
                  </h3>
                  <Link to="/appointments" className="btn btn-ghost btn-sm">View All →</Link>
                </div>
                <div className="card-body">
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-secondary text-center py-4">No upcoming appointments.</p>
                  ) : (
                    upcomingAppointments.map(apt => (
                      <div key={apt.id} className="flex items-start gap-3 mb-4 p-3 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                        <div className="blood-badge">{user?.bloodType}</div>
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-primary text-sm">{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                            <span className={`badge ${apt.status === 'CONFIRMED' ? 'badge-completed' : 'badge-pending'}`}>{apt.status}</span>
                          </div>
                          <div className="text-xs text-secondary">{apt.collectionCenter || 'TBD'}</div>
                        </div>
                        <button className="btn btn-primary btn-sm flex-shrink-0" id={`book-${apt.id}`}>
                          Details
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="font-bold flex items-center gap-2">
                    <Bell size={18} color="var(--accent-blue)" /> Notifications
                    {unreadNotifications.length > 0 && <span className="badge badge-critical">{unreadNotifications.length}</span>}
                  </h3>
                </div>
                <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                  {unreadNotifications.length === 0 ? (
                    <p className="text-secondary text-center text-sm py-4">No unread notifications</p>
                  ) : (
                    unreadNotifications.slice(0, 4).map(n => (
                      <div key={n.id} className="notif-item" style={{ borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                        <div className="notif-dot" />
                        <div>
                          <div className="font-semibold text-sm text-primary">{n.title}</div>
                          <div className="text-xs text-secondary" style={{ marginTop: '0.2rem' }}>{n.message}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Donation History */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="font-bold flex items-center gap-2">
                    <CheckCircle size={18} color="var(--accent-emerald)" /> Recent Donations
                  </h3>
                </div>
                <div className="card-body">
                  {donations.length === 0 ? (
                    <p className="text-secondary text-center text-sm py-4">No donation history yet</p>
                  ) : (
                    donations.slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-center gap-3 mb-4">
                        <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={16} color="var(--accent-emerald)" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="text-sm font-semibold text-primary">{d.quantityMl}ml Donation</div>
                          <div className="text-xs text-muted">{new Date(d.donationDate).toLocaleDateString()}</div>
                        </div>
                        <span className={`badge ${d.status === 'COMPLETED' ? 'badge-completed' : 'badge-pending'}`}>{d.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
