import { Heart, MapPin, Calendar, CheckCircle, Clock, Bell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { mockRequests, mockNotifications, mockDonors } from '../../data/mockData';

const URGENCY_COLORS = { CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' };
const STATUS_COLORS = { PENDING: 'badge-pending', MATCHED: 'badge-matched', IN_PROGRESS: 'badge-in-progress', COMPLETED: 'badge-completed' };

export default function DonorDashboard() {
  const { user } = useAuth();
  const pendingRequests = mockRequests.filter(r => r.status === 'PENDING').slice(0, 3);
  const unreadNotifs = mockNotifications.filter(n => !n.isRead);

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

        {/* Stats Row */}
        <div className="dashboard-grid grid-cols-4 mb-6">
          {[
            { label: 'Total Donations', value: '12', icon: Heart, color: 'var(--red-400)', bg: 'rgba(244,63,94,0.1)' },
            { label: 'Pending Matches', value: pendingRequests.length, icon: Clock, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Notifications', value: unreadNotifs.length, icon: Bell, color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Last Donated', value: 'Mar 2025', icon: Calendar, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)' },
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
          {/* Matching Requests */}
          <div className="glass-card col-span-2">
            <div className="card-header">
              <h3 className="font-bold flex items-center gap-2">
                <Heart size={18} color="var(--red-400)" /> Requests Matching Your Blood Type ({user?.bloodType})
              </h3>
              <Link to="/requests" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            <div className="card-body">
              {pendingRequests.length === 0 ? (
                <p className="text-secondary text-center py-4">No matching requests right now.</p>
              ) : (
                pendingRequests.map(req => (
                  <div key={req.id} className="flex items-start gap-3 mb-4 p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                    <div className="blood-badge">{req.bloodType}</div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-primary text-sm">{req.patientName}</span>
                        <span className={`badge ${URGENCY_COLORS[req.urgency]}`}>{req.urgency}</span>
                      </div>
                      <div className="text-xs text-secondary">{req.hospital} · {req.city}</div>
                    </div>
                    <button className="btn btn-primary btn-sm flex-shrink-0" id={`volunteer-${req.id}`}>
                      Volunteer
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
                {unreadNotifs.length > 0 && <span className="badge badge-critical">{unreadNotifs.length}</span>}
              </h3>
            </div>
            <div className="card-body" style={{ paddingTop: '0.5rem' }}>
              {mockNotifications.slice(0, 4).map(n => (
                <div key={n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`} style={{ borderRadius: 'var(--radius-md)' }}>
                  {!n.isRead && <div className="notif-dot" />}
                  <div>
                    <div className="font-semibold text-sm text-primary">{n.title}</div>
                    <div className="text-xs text-secondary" style={{ marginTop: '0.2rem' }}>{n.message}</div>
                  </div>
                </div>
              ))}
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
              {[
                { hospital: 'National Hospital Colombo', date: 'Mar 10, 2025', units: 1, verified: true },
                { hospital: 'Kandy Teaching Hospital', date: 'Dec 1, 2024', units: 1, verified: true },
                { hospital: 'Galle General Hospital', date: 'Sep 5, 2024', units: 1, verified: true },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={16} color="var(--accent-emerald)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-sm font-semibold text-primary">{d.hospital}</div>
                    <div className="text-xs text-muted">{d.date}</div>
                  </div>
                  <span className="badge badge-completed">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
