import { useState } from 'react';
import {
  Warehouse, Droplets, AlertTriangle, Plus, TrendingUp,
  Activity, Clock, CheckCircle2, ChevronRight, RefreshCw,
  ArrowUpRight, Minus, Hospital, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { mockInventory, mockRequests } from '../../data/mockData';

/* ── helpers ─────────────────────────────────────────────────── */
const getBarColor = (units, threshold) => {
  const ratio = units / (threshold * 3);
  if (ratio < 0.4) return 'hd-fill-red';
  if (ratio < 0.7) return 'hd-fill-amber';
  return 'hd-fill-green';
};

const getBarWidth = (units, threshold) =>
  Math.min(100, (units / (threshold * 4)) * 100) + '%';

const getStatusStyle = (status) => {
  const map = {
    PENDING:     { bg: 'rgba(245,158,11,0.12)',  color: '#b45309', label: 'Pending' },
    MATCHED:     { bg: 'rgba(16,185,129,0.12)',  color: '#047857', label: 'Matched' },
    IN_PROGRESS: { bg: 'rgba(59,130,246,0.12)',  color: '#1d4ed8', label: 'In Progress' },
    COMPLETED:   { bg: 'rgba(100,116,139,0.12)', color: '#475569', label: 'Completed' },
  };
  return map[status] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b', label: status };
};

const getUrgencyStyle = (urgency) => {
  const map = {
    CRITICAL: { bg: 'rgba(220,38,38,0.12)',  color: '#b91c1c' },
    HIGH:     { bg: 'rgba(234,88,12,0.12)',  color: '#c2410c' },
    MEDIUM:   { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
    LOW:      { bg: 'rgba(16,185,129,0.12)', color: '#047857' },
  };
  return map[urgency] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b' };
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/* ── component ───────────────────────────────────────────────── */
export default function HospitalDashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState(mockInventory);
  const [adjusting, setAdjusting] = useState(null);

  const recentRequests = mockRequests.slice(0, 5);
  const criticalCount = inventory.filter(i => i.units < i.lowThreshold).length;
  const totalUnits   = inventory.reduce((s, i) => s + i.units, 0);
  const pendingCount = recentRequests.filter(r => r.status === 'PENDING').length;
  const criticalRequests = recentRequests.filter(r => r.urgency === 'CRITICAL').length;

  const adjustUnit = (type, delta) => {
    setAdjusting(type);
    setInventory(prev =>
      prev.map(i => i.bloodType === type
        ? { ...i, units: Math.max(0, i.units + delta) }
        : i)
    );
    setTimeout(() => setAdjusting(null), 600);
  };

  const stats = [
    {
      label: 'Total Units in Stock',
      value: totalUnits,
      sub: 'across all blood types',
      icon: Droplets,
      accent: '#0891b2',
      bg: 'rgba(8,145,178,0.10)',
      trend: '+5 today',
      trendUp: true,
    },
    {
      label: 'Critical Low Types',
      value: criticalCount,
      sub: 'need immediate replenishment',
      icon: AlertTriangle,
      accent: '#dc2626',
      bg: 'rgba(220,38,38,0.10)',
      trend: criticalCount > 0 ? 'Action required' : 'All good',
      trendUp: criticalCount === 0,
    },
    {
      label: 'Active Requests',
      value: pendingCount,
      sub: 'awaiting blood supply',
      icon: Clock,
      accent: '#d97706',
      bg: 'rgba(217,119,6,0.10)',
      trend: `${criticalRequests} critical`,
      trendUp: false,
    },
    {
      label: 'Fulfilled Today',
      value: recentRequests.filter(r => r.status === 'COMPLETED').length,
      sub: 'requests completed',
      icon: CheckCircle2,
      accent: '#059669',
      bg: 'rgba(5,150,105,0.10)',
      trend: 'On track',
      trendUp: true,
    },
  ];

  return (
    <>
      <style>{`
        /* ── Hospital Dashboard Scoped Styles ────────────────── */
        .hd-wrapper {
          display: flex;
          min-height: 100vh;
          background:
            radial-gradient(ellipse 60% 40% at 10% 0%,  rgba(8,145,178,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 90% 100%, rgba(5,150,105,0.05) 0%, transparent 60%),
            #f0f9ff;
        }
        .hd-main {
          flex: 1;
          padding: 2rem 2.25rem;
          overflow-y: auto;
          min-width: 0;
        }

        /* ── Header ── */
        .hd-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .hd-header-left {}
        .hd-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #0891b2;
          margin-bottom: 0.35rem;
        }
        .hd-eyebrow-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #0891b2;
          box-shadow: 0 0 0 3px rgba(8,145,178,0.2);
          animation: hd-pulse 2s ease-in-out infinite;
        }
        @keyframes hd-pulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(8,145,178,0.2); }
          50%      { box-shadow: 0 0 0 6px rgba(8,145,178,0.06); }
        }
        .hd-title {
          font-family: var(--font-heading, 'Figtree', sans-serif);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #164e63;
          line-height: 1.15;
          margin: 0 0 0.25rem;
        }
        .hd-title-gradient {
          background: linear-gradient(120deg, #0891b2 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hd-subtitle {
          font-size: 0.875rem;
          color: #475569;
          margin: 0;
        }
        .hd-header-actions {
          display: flex;
          gap: 0.625rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .hd-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-heading, 'Figtree', sans-serif);
          font-size: 0.825rem;
          font-weight: 700;
          padding: 0.5rem 1.125rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 220ms cubic-bezier(0.4,0,0.2,1);
          white-space: nowrap;
        }
        .hd-btn-primary {
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(8,145,178,0.25);
        }
        .hd-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(8,145,178,0.35);
        }
        .hd-btn-ghost {
          background: rgba(255,255,255,0.7);
          color: #164e63;
          border: 1.5px solid rgba(186,230,253,0.9);
          backdrop-filter: blur(8px);
        }
        .hd-btn-ghost:hover {
          background: rgba(255,255,255,0.95);
          border-color: #0891b2;
          color: #0891b2;
        }

        /* ── Stat Cards ── */
        .hd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }
        @media (max-width: 1100px) { .hd-stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 640px)  { .hd-stats-grid { grid-template-columns: 1fr; } }

        .hd-stat {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 18px;
          padding: 1.375rem 1.5rem;
          box-shadow: 0 4px 24px rgba(8,145,178,0.05), inset 0 0 0 1px rgba(255,255,255,0.6);
          transition: all 280ms cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          overflow: hidden;
        }
        .hd-stat::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 0 18px 0 80px;
          background: var(--hd-accent-bg);
          opacity: 0.5;
          transition: all 280ms ease;
        }
        .hd-stat:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(8,145,178,0.12), inset 0 0 0 1px rgba(255,255,255,0.9);
        }
        .hd-stat:hover::before { opacity: 0.9; width: 100px; height: 100px; }

        .hd-stat-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .hd-stat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--hd-accent-bg);
          color: var(--hd-accent);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
          transition: transform 300ms ease;
          flex-shrink: 0;
          z-index: 1;
        }
        .hd-stat:hover .hd-stat-icon { transform: scale(1.12) rotate(5deg); }

        .hd-stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          z-index: 1;
        }
        .hd-trend-up   { background: rgba(5,150,105,0.12); color: #047857; }
        .hd-trend-down { background: rgba(220,38,38,0.12); color: #b91c1c; }

        .hd-stat-value {
          font-family: var(--font-heading, 'Figtree', sans-serif);
          font-size: 2.25rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #164e63;
          line-height: 1;
          z-index: 1;
        }
        .hd-stat-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #164e63;
          z-index: 1;
        }
        .hd-stat-sub {
          font-size: 0.73rem;
          color: #64748b;
          z-index: 1;
        }

        /* ── Main content grid ── */
        .hd-content-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 960px) { .hd-content-grid { grid-template-columns: 1fr; } }

        /* ── Glass Card ── */
        .hd-card {
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.72);
          border-radius: 20px;
          box-shadow: 0 6px 30px rgba(8,145,178,0.05), inset 0 0 0 1px rgba(255,255,255,0.55);
          overflow: hidden;
        }

        .hd-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.375rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(186,230,253,0.35);
        }
        .hd-card-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-heading, 'Figtree', sans-serif);
          font-size: 0.975rem;
          font-weight: 800;
          color: #164e63;
          margin: 0;
        }
        .hd-card-title-icon {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hd-card-body {
          padding: 1.25rem 1.5rem 1.5rem;
        }

        /* ── Badge ── */
        .hd-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.22rem 0.6rem;
          border-radius: 9999px;
          letter-spacing: 0.01em;
        }

        /* ── Inventory row ── */
        .hd-inv-row {
          margin-bottom: 1.125rem;
          padding-bottom: 1.125rem;
          border-bottom: 1px solid rgba(186,230,253,0.25);
        }
        .hd-inv-row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }

        .hd-inv-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .hd-inv-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hd-blood-badge {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(5,150,105,0.1);
          color: #047857;
          font-family: var(--font-heading, 'Figtree', sans-serif);
          font-size: 0.75rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(5,150,105,0.25);
          flex-shrink: 0;
          transition: transform 220ms ease;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.08);
        }
        .hd-blood-badge.critical {
          background: rgba(220,38,38,0.1);
          border-color: rgba(220,38,38,0.3);
          color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.07);
          animation: hd-shake 0.5s ease;
        }
        @keyframes hd-shake {
          0%,100%{ transform:translateX(0) }
          25%{ transform:translateX(-2px) }
          75%{ transform:translateX(2px) }
        }
        .hd-inv-units {
          font-family: var(--font-heading, 'Figtree', sans-serif);
          font-size: 0.875rem;
          font-weight: 800;
          color: #164e63;
        }
        .hd-inv-threshold {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.1rem;
        }
        .hd-inv-controls {
          display: flex;
          gap: 0.375rem;
          align-items: center;
        }
        .hd-ctrl-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: 1.5px solid rgba(186,230,253,0.8);
          background: rgba(255,255,255,0.8);
          color: #164e63;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 180ms ease;
          line-height: 1;
        }
        .hd-ctrl-btn:hover { background: #0891b2; color: #fff; border-color: #0891b2; }
        .hd-ctrl-btn.plus { background: rgba(5,150,105,0.1); color: #047857; border-color: rgba(5,150,105,0.3); }
        .hd-ctrl-btn.plus:hover { background: #059669; color: #fff; border-color: #059669; }

        /* ── Progress bar ── */
        .hd-bar-track {
          height: 7px;
          background: rgba(186,230,253,0.5);
          border-radius: 9999px;
          overflow: hidden;
        }
        .hd-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 500ms cubic-bezier(0.4,0,0.2,1);
        }
        .hd-fill-red   { background: linear-gradient(90deg, #ef4444 0%, #f87171 100%); }
        .hd-fill-amber { background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%); }
        .hd-fill-green { background: linear-gradient(90deg, #059669 0%, #34d399 100%); }

        /* ── Request Card ── */
        .hd-req-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 0.875rem 0;
          border-bottom: 1px solid rgba(186,230,253,0.25);
          transition: all 200ms ease;
        }
        .hd-req-item:last-child { border-bottom: none; padding-bottom: 0; }
        .hd-req-item:hover { background: rgba(224,242,254,0.2); margin: 0 -1.5rem; padding: 0.875rem 1.5rem; border-radius: 10px; }

        .hd-req-info { flex: 1; min-width: 0; }
        .hd-req-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #164e63;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.2rem;
        }
        .hd-req-meta {
          font-size: 0.72rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .hd-req-meta-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #94a3b8;
          flex-shrink: 0;
        }
        .hd-req-badges {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.35rem;
          flex-shrink: 0;
        }
        .hd-req-time {
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* ── Link btn ── */
        .hd-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #0891b2;
          text-decoration: none;
          transition: gap 180ms ease;
          padding: 0.25rem 0;
        }
        .hd-link-btn:hover { gap: 0.5rem; color: #0e7490; }

        /* ── Adjusting animation ── */
        .hd-adjusted {
          animation: hd-pop 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes hd-pop {
          0% { transform: scale(1); }
          50%{ transform: scale(1.18); color: #0891b2; }
          100%{ transform: scale(1); }
        }

        /* ── Section header row ── */
        .hd-section-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .hd-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(186,230,253,0.5);
        }

        /* ── Alert banner ── */
        .hd-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(220,38,38,0.08);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.375rem;
          animation: slideUp 0.4s ease;
        }
        .hd-alert-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(220,38,38,0.15);
          color: #b91c1c;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hd-alert-text {
          flex: 1;
        }
        .hd-alert-title {
          font-size: 0.825rem;
          font-weight: 800;
          color: #991b1b;
          margin-bottom: 0.1rem;
        }
        .hd-alert-sub {
          font-size: 0.72rem;
          color: #b91c1c;
        }
      `}</style>

      <div className="hd-wrapper">
        <Sidebar />
        <main className="hd-main">

          {/* ── Header ────────────────────────────────────── */}
          <header className="hd-header">
            <div className="hd-header-left">
              <div className="hd-eyebrow">
                <span className="hd-eyebrow-dot" />
                Hospital Staff Portal
              </div>
              <h1 className="hd-title">
                <span className="hd-title-gradient">
                  {user?.hospitalName || 'National Hospital Colombo'}
                </span>
              </h1>
              <p className="hd-subtitle">Blood inventory & request management dashboard</p>
            </div>
            <div className="hd-header-actions">
              <Link to="/request/create" id="hd-new-request-btn" className="hd-btn hd-btn-ghost">
                <Plus size={15} /> New Request
              </Link>
              <Link to="/requests" id="hd-view-requests-btn" className="hd-btn hd-btn-primary">
                View All Requests <ChevronRight size={15} />
              </Link>
            </div>
          </header>

          {/* ── Critical Alert Banner ─────────────────────── */}
          {criticalCount > 0 && (
            <div className="hd-alert" role="alert" aria-live="polite">
              <div className="hd-alert-icon">
                <Zap size={16} />
              </div>
              <div className="hd-alert-text">
                <div className="hd-alert-title">
                  {criticalCount} blood type{criticalCount > 1 ? 's' : ''} critically low
                </div>
                <div className="hd-alert-sub">
                  Immediate replenishment required · Contact blood bank coordinator
                </div>
              </div>
              <Link to="/request/create" className="hd-btn hd-btn-ghost" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}>
                Request Now
              </Link>
            </div>
          )}

          {/* ── Stats Grid ────────────────────────────────── */}
          <div className="hd-stats-grid">
            {stats.map(({ label, value, sub, icon: Icon, accent, bg, trend, trendUp }) => (
              <div
                key={label}
                className="hd-stat"
                style={{ '--hd-accent': accent, '--hd-accent-bg': bg }}
              >
                <div className="hd-stat-top">
                  <div className="hd-stat-icon">
                    <Icon size={20} />
                  </div>
                  <span className={`hd-stat-trend ${trendUp ? 'hd-trend-up' : 'hd-trend-down'}`}>
                    {trendUp ? <ArrowUpRight size={11} /> : <AlertTriangle size={11} />}
                    {trend}
                  </span>
                </div>
                <div>
                  <div className="hd-stat-value">{value}</div>
                  <div className="hd-stat-label">{label}</div>
                  <div className="hd-stat-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Main Content ──────────────────────────────── */}
          <div className="hd-content-grid">

            {/* ── Blood Inventory Card ──────────────────── */}
            <div className="hd-card">
              <div className="hd-card-header">
                <h2 className="hd-card-title">
                  <div
                    className="hd-card-title-icon"
                    style={{ background: 'rgba(8,145,178,0.12)', color: '#0891b2' }}
                  >
                    <Warehouse size={16} />
                  </div>
                  Blood Inventory
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {criticalCount > 0 && (
                    <span
                      className="hd-badge"
                      style={{ background: 'rgba(220,38,38,0.12)', color: '#b91c1c' }}
                    >
                      <AlertTriangle size={10} /> {criticalCount} Critical
                    </span>
                  )}
                  <button
                    className="hd-ctrl-btn"
                    aria-label="Refresh inventory"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => {}}
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              <div className="hd-card-body">
                <div className="hd-section-label">All Blood Types</div>
                {inventory.map(({ bloodType, units, lowThreshold }) => {
                  const isCritical = units < lowThreshold;
                  const safeBt = bloodType.replace('+', 'pos').replace('-', 'neg');
                  return (
                    <div key={bloodType} className="hd-inv-row">
                      <div className="hd-inv-top">
                        <div className="hd-inv-left">
                          <div className={`hd-blood-badge ${isCritical ? 'critical' : ''}`}>
                            {bloodType}
                          </div>
                          <div>
                            <div
                              className={`hd-inv-units ${adjusting === bloodType ? 'hd-adjusted' : ''}`}
                              id={`inv-units-${safeBt}`}
                            >
                              {units} <span style={{ fontWeight: 500, fontSize: '0.78rem', color: '#64748b' }}>units</span>
                              {isCritical && (
                                <span
                                  className="hd-badge"
                                  style={{ background: 'rgba(220,38,38,0.12)', color: '#b91c1c', marginLeft: '0.4rem', fontSize: '0.62rem' }}
                                >
                                  LOW
                                </span>
                              )}
                            </div>
                            <div className="hd-inv-threshold">Min: {lowThreshold} units</div>
                          </div>
                        </div>
                        <div className="hd-inv-controls">
                          <button
                            className="hd-ctrl-btn"
                            onClick={() => adjustUnit(bloodType, -1)}
                            id={`dec-${safeBt}`}
                            aria-label={`Decrease ${bloodType} by 1`}
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            className="hd-ctrl-btn plus"
                            onClick={() => adjustUnit(bloodType, 5)}
                            id={`inc-${safeBt}`}
                            aria-label={`Increase ${bloodType} by 5`}
                          >
                            +5
                          </button>
                        </div>
                      </div>
                      <div className="hd-bar-track" role="progressbar" aria-valuenow={units} aria-valuemin={0} aria-valuemax={lowThreshold * 4}>
                        <div
                          className={`hd-bar-fill ${getBarColor(units, lowThreshold)}`}
                          style={{ width: getBarWidth(units, lowThreshold) }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Recent Requests Card ──────────────────── */}
            <div className="hd-card">
              <div className="hd-card-header">
                <h2 className="hd-card-title">
                  <div
                    className="hd-card-title-icon"
                    style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}
                  >
                    <Activity size={16} />
                  </div>
                  Recent Requests
                </h2>
                <Link to="/requests" className="hd-link-btn" id="hd-view-all-requests">
                  View All <ChevronRight size={13} />
                </Link>
              </div>

              <div className="hd-card-body">
                <div className="hd-section-label">Latest Activity</div>
                {recentRequests.map(req => {
                  const statusStyle  = getStatusStyle(req.status);
                  const urgencyStyle = getUrgencyStyle(req.urgency);
                  return (
                    <div key={req.id} className="hd-req-item">
                      <div className="hd-blood-badge" style={{ flexShrink: 0 }}>
                        {req.bloodType}
                      </div>
                      <div className="hd-req-info">
                        <div className="hd-req-name">{req.patientName}</div>
                        <div className="hd-req-meta">
                          <span>{req.units} unit{req.units > 1 ? 's' : ''}</span>
                          <span className="hd-req-meta-dot" />
                          <span>{req.city}</span>
                          <span className="hd-req-meta-dot" />
                          <span>{timeAgo(req.createdAt)}</span>
                        </div>
                      </div>
                      <div className="hd-req-badges">
                        <span
                          className="hd-badge"
                          style={{ background: urgencyStyle.bg, color: urgencyStyle.color }}
                        >
                          {req.urgency}
                        </span>
                        <span
                          className="hd-badge"
                          style={{ background: statusStyle.bg, color: statusStyle.color }}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <Link to="/request/create" id="hd-create-request-bottom" className="hd-btn hd-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Plus size={15} /> Create New Request
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
