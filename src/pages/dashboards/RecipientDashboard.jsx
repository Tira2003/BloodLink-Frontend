import { Droplets, Clock, CheckCircle, AlertTriangle, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { mockRequests } from '../../data/mockData';

const STATUS_COLORS = { PENDING: 'badge-pending', MATCHED: 'badge-matched', IN_PROGRESS: 'badge-in-progress', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled' };
const URGENCY_COLORS = { CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' };

export default function RecipientDashboard() {
  const { user } = useAuth();
  const myRequests = mockRequests.slice(0, 4);
  const activeCount = myRequests.filter(r => ['PENDING', 'MATCHED', 'IN_PROGRESS'].includes(r.status)).length;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-secondary text-sm">Welcome back 👋</p>
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              Hello, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
            </h1>
          </div>
          <Link to="/request/create" className="btn btn-primary" id="create-req-btn">
            <Plus size={18} /> New Blood Request
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-grid grid-cols-4 mb-6">
          {[
            { label: 'Total Requests', value: myRequests.length, icon: Droplets, color: 'var(--red-400)', bg: 'rgba(244,63,94,0.1)' },
            { label: 'Active Requests', value: activeCount, icon: Clock, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Matched', value: myRequests.filter(r => r.status === 'MATCHED').length, icon: Users, color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Completed', value: myRequests.filter(r => r.status === 'COMPLETED').length, icon: CheckCircle, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass-card stat-card">
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: '0.75rem' }}>
                <Icon size={20} />
              </div>
              <div className="font-extrabold text-3xl text-primary mb-1">{value}</div>
              <div className="text-sm text-muted">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick create CTA */}
        <div className="glass-card glass-card-active mb-6" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div style={{ width: '48px', height: '48px', background: 'rgba(244,63,94,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="var(--red-400)" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Need blood urgently?</h3>
                <p className="text-secondary text-sm">Post a critical request and our system will find matching donors immediately.</p>
              </div>
            </div>
            <Link to="/request/create" className="btn btn-primary flex-shrink-0" id="urgent-req-btn">
              🆘 Emergency Request
            </Link>
          </div>
        </div>

        {/* My Requests */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="font-bold flex items-center gap-2">
              <Droplets size={18} color="var(--red-400)" /> My Blood Requests
            </h3>
            <Link to="/requests" className="btn btn-ghost btn-sm">View All →</Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Blood Type</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Hospital</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map(req => (
                  <tr key={req.id}>
                    <td className="text-primary font-medium">{req.patientName}</td>
                    <td><div className="blood-badge" style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>{req.bloodType}</div></td>
                    <td className="font-bold text-primary">{req.units}</td>
                    <td><span className={`badge ${URGENCY_COLORS[req.urgency]}`}>{req.urgency}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[req.status]}`}>{req.status.replace('_', ' ')}</span></td>
                    <td className="text-secondary text-sm">{req.hospital}</td>
                    <td>
                      <div className="flex gap-2">
                        {req.status === 'PENDING' && (
                          <button className="btn btn-danger btn-sm" id={`cancel-req-${req.id}`}>Cancel</button>
                        )}
                        <button className="btn btn-secondary btn-sm" id={`view-req-${req.id}`}>View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
