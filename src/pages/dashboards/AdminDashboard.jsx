import { useState, useEffect } from 'react';
import { Users, Droplets, Heart, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Sidebar from '../../components/common/Sidebar';
import { inventoryService } from '../../services/inventoryService';
import { donationService } from '../../services/donationService';
import { mockChartData } from '../../data/mockData';

const COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--dark-600)', border: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
        <p className="text-sm font-bold text-primary mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalDonations: 0, criticalInventory: 0, activeAppointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const expiredInv = await inventoryService.getExpiredInventory().catch(() => []);
        setStats({
          totalDonations: 0,
          criticalInventory: Array.isArray(expiredInv) ? expiredInv.length : 0,
          activeAppointments: 0,
        });
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Admin <span className="text-gradient">Dashboard</span></h1>
          <p className="page-subtitle">System-wide analytics and management overview</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner-dark" />
          </div>
        ) : (
          <>
            {/* Top Stats */}
            <div className="dashboard-grid grid-cols-4 mb-6">
              {[
                { label: 'Total Donors', value: '250+', icon: Users, color: 'var(--red-400)', bg: 'rgba(244,63,94,0.1)', change: '+12%' },
                { label: 'Blood Requests', value: '124', icon: Droplets, color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)', change: '+8%' },
                { label: 'Lives Saved', value: '1800+', icon: Heart, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)', change: '+15%' },
                { label: 'Critical Alerts', value: stats.criticalInventory, icon: Clock, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)', change: stats.criticalInventory > 0 ? '+!' : '✓' },
              ].map(({ label, value, icon: Icon, color, bg, change }) => (
                <div key={label} className="glass-card stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--accent-emerald)' }}>
                      <TrendingUp size={12} style={{ display: 'inline', marginRight: '2px' }} />{change}
                    </span>
                  </div>
                  <div className="font-extrabold text-3xl text-primary mb-1">{value}</div>
                  <div className="text-sm text-muted">{label}</div>
                </div>
              ))}
            </div>

        {/* Charts row */}
        <div className="dashboard-grid grid-cols-2 mb-6">
          {/* Monthly trend */}
          <div className="glass-card col-span-2">
            <div className="card-header">
              <h3 className="font-bold flex items-center gap-2">
                <BarChart3 size={18} color="var(--red-400)" /> Monthly Donation & Request Trends
              </h3>
            </div>
            <div className="card-body" style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData.monthly}>
                  <defs>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{val}</span>} />
                  <Area type="monotone" dataKey="donations" name="Donations" stroke="#f43f5e" fill="url(#colorDonations)" strokeWidth={2} dot={{ fill: '#f43f5e', r: 4 }} />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke="#3b82f6" fill="url(#colorRequests)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Blood type distribution */}
          <div className="glass-card">
            <div className="card-header">
              <h3 className="font-bold">Blood Type Distribution</h3>
            </div>
            <div className="card-body" style={{ height: '260px', paddingTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockChartData.bloodTypeDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {mockChartData.bloodTypeDistribution.map((entry, i) => (
                      <Cell key={entry.type} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val + '%', name]} contentStyle={{ background: 'var(--dark-600)', border: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }} />
                  <Legend formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="glass-card">
            <div className="card-header">
              <h3 className="font-bold">Inventory Status</h3>
              {criticalInventory.length > 0 && (
                <span className="badge badge-critical"><AlertTriangle size={12} /> {criticalInventory.length} critical</span>
              )}
            </div>
            <div className="card-body" style={{ height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockInventory} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="bloodType" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: 'var(--dark-600)', border: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }} />
                  <Bar dataKey="units" name="Units" radius={[0, 4, 4, 0]}>
                    {mockInventory.map((entry, i) => (
                      <Cell key={i} fill={entry.units < entry.lowThreshold ? '#f43f5e' : entry.units < entry.lowThreshold * 2 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent requests table */}
        <div className="glass-card mb-6">
          <div className="card-header">
            <h3 className="font-bold flex items-center gap-2">
              <Droplets size={18} color="var(--red-400)" /> Recent Blood Requests
            </h3>
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
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {mockRequests.map(req => (
                  <tr key={req.id}>
                    <td className="text-primary font-medium">{req.patientName}</td>
                    <td><div className="blood-badge" style={{ width: '36px', height: '36px', fontSize: '0.72rem' }}>{req.bloodType}</div></td>
                    <td className="font-bold text-primary">{req.units}</td>
                    <td><span className={`badge badge-${req.urgency.toLowerCase()}`}>{req.urgency}</span></td>
                    <td><span className={`badge badge-${req.status.toLowerCase().replace('_', '-')}`}>{req.status.replace('_', ' ')}</span></td>
                    <td className="text-secondary text-sm">{req.hospital}</td>
                    <td className="text-secondary text-sm">{req.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent donors */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="font-bold flex items-center gap-2">
              <Users size={18} color="var(--accent-blue)" /> All Donors
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Type</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Donations</th>
                  <th>Last Donated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDonors.map(donor => (
                  <tr key={donor.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>{donor.name[0]}</div>
                        <span className="text-primary font-medium text-sm">{donor.name}</span>
                      </div>
                    </td>
                    <td><div className="blood-badge" style={{ width: '36px', height: '36px', fontSize: '0.72rem' }}>{donor.bloodType}</div></td>
                    <td className="text-secondary text-sm">{donor.city}</td>
                    <td><span className={`badge ${donor.available ? 'badge-available' : 'badge-unavailable'}`}>{donor.available ? 'Available' : 'Unavailable'}</span></td>
                    <td className="font-bold text-primary">{donor.totalDonations}</td>
                    <td className="text-secondary text-sm">{new Date(donor.lastDonated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-secondary btn-sm" id={`admin-view-donor-${donor.id}`}>View</button>
                        <button className="btn btn-danger btn-sm" id={`admin-deact-donor-${donor.id}`}>Deactivate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
