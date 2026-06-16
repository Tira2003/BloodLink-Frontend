import { useState } from 'react';
import { Warehouse, Droplets, AlertTriangle, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { mockInventory, mockRequests } from '../../data/mockData';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState(mockInventory);
  const recentRequests = mockRequests.slice(0, 4);

  const criticalCount = inventory.filter(i => i.units < i.lowThreshold).length;

  const getFillClass = (units, threshold) => {
    const ratio = units / (threshold * 3);
    if (ratio < 0.4) return 'fill-red';
    if (ratio < 0.7) return 'fill-amber';
    return 'fill-green';
  };

  const getFillWidth = (units, threshold) => {
    return Math.min(100, (units / (threshold * 4)) * 100) + '%';
  };

  const adjustUnit = (type, delta) => {
    setInventory(prev => prev.map(i =>
      i.bloodType === type ? { ...i, units: Math.max(0, i.units + delta) } : i
    ));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-secondary text-sm">Hospital Staff</p>
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              <span className="text-gradient">{user?.hospitalName || 'National Hospital Colombo'}</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <Link to="/request/create" className="btn btn-secondary btn-sm">
              <Plus size={16} /> New Request
            </Link>
            <Link to="/requests" className="btn btn-primary btn-sm">
              View All Requests
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-grid grid-cols-4 mb-6">
          {[
            { label: 'Total Blood Types', value: '8', icon: Droplets, color: 'var(--red-400)', bg: 'rgba(244,63,94,0.1)' },
            { label: 'Critical Low Types', value: criticalCount, icon: AlertTriangle, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Active Requests', value: recentRequests.filter(r => r.status === 'PENDING').length, icon: Warehouse, color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Total Units in Stock', value: inventory.reduce((s, i) => s + i.units, 0), icon: TrendingUp, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)' },
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

        <div className="dashboard-grid grid-cols-2">
          {/* Blood Inventory */}
          <div className="glass-card">
            <div className="card-header">
              <h3 className="font-bold flex items-center gap-2">
                <Warehouse size={18} color="var(--accent-blue)" /> Blood Inventory
              </h3>
              {criticalCount > 0 && (
                <span className="badge badge-critical">
                  <AlertTriangle size={12} /> {criticalCount} critical
                </span>
              )}
            </div>
            <div className="card-body">
              {inventory.map(({ bloodType, units, lowThreshold }) => {
                const isCritical = units < lowThreshold;
                return (
                  <div key={bloodType} className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <div className="blood-badge" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>{bloodType}</div>
                        <div>
                          <span className="font-bold text-primary">{units} units</span>
                          {isCritical && <span className="badge badge-critical ml-2" style={{ fontSize: '0.65rem' }}>LOW</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="btn btn-secondary btn-sm" onClick={() => adjustUnit(bloodType, -1)}
                          id={`dec-${bloodType.replace('+', 'pos').replace('-', 'neg')}`} style={{ padding: '0.25rem 0.6rem' }}>−</button>
                        <button className="btn btn-success btn-sm" onClick={() => adjustUnit(bloodType, 5)}
                          id={`inc-${bloodType.replace('+', 'pos').replace('-', 'neg')}`} style={{ padding: '0.25rem 0.6rem' }}>+5</button>
                      </div>
                    </div>
                    <div className="inventory-bar">
                      <div className={`inventory-bar-fill ${getFillClass(units, lowThreshold)}`}
                        style={{ width: getFillWidth(units, lowThreshold) }} />
                    </div>
                    <div className="text-xs text-muted mt-1">Min: {lowThreshold} units</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="glass-card">
            <div className="card-header">
              <h3 className="font-bold flex items-center gap-2">
                <Droplets size={18} color="var(--red-400)" /> Recent Requests
              </h3>
              <Link to="/requests" className="btn btn-ghost btn-sm">All →</Link>
            </div>
            <div className="card-body" style={{ paddingTop: '0.5rem' }}>
              {recentRequests.map(req => (
                <div key={req.id} className="flex items-center gap-3 mb-4 p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div className="blood-badge" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>{req.bloodType}</div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-primary text-sm">{req.patientName}</span>
                      <span className={`badge badge-${req.urgency.toLowerCase()}`}>{req.urgency}</span>
                    </div>
                    <div className="text-xs text-secondary">{req.units} units · {req.city}</div>
                  </div>
                  <span className={`badge badge-${req.status.toLowerCase().replace('_', '-')}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
