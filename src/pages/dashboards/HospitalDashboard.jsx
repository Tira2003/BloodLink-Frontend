import { useState, useEffect } from 'react';
import { Warehouse, Droplets, AlertTriangle, Plus, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { inventoryService } from '../../services/inventoryService';
import { donationService } from '../../services/donationService';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHospitalData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const [inv, appts] = await Promise.all([
            inventoryService.getInventoryByHospital(user.id).catch(() => []),
            donationService.getAppointmentsByHospital(user.id).catch(() => []),
          ]);
          setInventory(Array.isArray(inv) ? inv : []);
          setAppointments(Array.isArray(appts) ? appts : []);
        }
      } catch (err) {
        console.error('Error loading hospital data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHospitalData();
  }, [user?.id]);

  const criticalCount = inventory.filter(i => i.isLowStock).length;
  const totalUnits = inventory.reduce((sum, i) => sum + (i.quantityMl || 0), 0);

  const bloodTypes = new Set(inventory.map(i => i.bloodType)).size;

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

        {error && (
          <div className="glass-card glass-card-error mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner-dark" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="dashboard-grid grid-cols-4 mb-6">
              {[
                { label: 'Total Blood Types', value: bloodTypes, icon: Droplets, color: 'var(--red-400)', bg: 'rgba(244,63,94,0.1)' },
                { label: 'Critical Low Stock', value: criticalCount, icon: AlertTriangle, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' },
                { label: 'Upcoming Appointments', value: appointments.length, icon: Calendar, color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
                { label: 'Total Stock (ml)', value: totalUnits, icon: TrendingUp, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)' },
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
                  {inventory.length === 0 ? (
                    <p className="text-secondary text-center text-sm py-4">No inventory records</p>
                  ) : (
                    inventory.map(({ id, bloodType, quantityMl, minimumThreshold, isLowStock, isExpired }) => (
                      <div key={id} className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-3">
                            <div className="blood-badge" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>{bloodType}</div>
                            <div>
                              <span className="font-bold text-primary">{quantityMl}ml</span>
                              {isLowStock && <span className="badge badge-critical ml-2" style={{ fontSize: '0.65rem' }}>LOW STOCK</span>}
                              {isExpired && <span className="badge badge-critical ml-2" style={{ fontSize: '0.65rem' }}>EXPIRED</span>}
                            </div>
                          </div>
                        </div>
                        <div className="inventory-bar">
                          <div className={`inventory-bar-fill ${isLowStock ? 'fill-red' : 'fill-green'}`}
                            style={{ width: Math.min(100, (quantityMl / (minimumThreshold * 4)) * 100) + '%' }} />
                        </div>
                        <div className="text-xs text-muted mt-1">Min: {minimumThreshold}ml</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calendar size={18} color="var(--red-400)" /> Upcoming Appointments
                  </h3>
                  <Link to="/appointments" className="btn btn-ghost btn-sm">All →</Link>
                </div>
                <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                  {appointments.length === 0 ? (
                    <p className="text-secondary text-center text-sm py-4">No upcoming appointments</p>
                  ) : (
                    appointments.slice(0, 5).map(apt => (
                      <div key={apt.id} className="flex items-center gap-3 mb-4 p-3 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                        <div className="blood-badge" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>
                          {new Date(apt.appointmentDate).toLocaleDateString().split('/')[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-primary text-sm">{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                            <span className={`badge ${apt.status === 'CONFIRMED' ? 'badge-completed' : 'badge-pending'}`}>{apt.status}</span>
                          </div>
                          <div className="text-xs text-secondary">{apt.collectionCenter || 'TBD'}</div>
                        </div>
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
