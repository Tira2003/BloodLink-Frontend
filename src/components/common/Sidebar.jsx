import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart, LayoutDashboard, Users, Droplets, Bell, ClipboardList,
  BarChart3, LogOut, Warehouse, Plus, Settings, ChevronRight
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData';

const navMap = {
  [ROLES.DONOR]: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/donor' },
    { label: 'My Profile', icon: Users, path: '/dashboard/donor/profile' },
    { label: 'Requests Near Me', icon: Droplets, path: '/requests' },
    { label: 'Donation History', icon: ClipboardList, path: '/dashboard/donor/history' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/donor/notifications' },
  ],
  [ROLES.RECIPIENT]: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/recipient' },
    { label: 'Create Request', icon: Plus, path: '/request/create' },
    { label: 'My Requests', icon: ClipboardList, path: '/dashboard/recipient/requests' },
    { label: 'Find Donors', icon: Users, path: '/donors' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/recipient/notifications' },
  ],
  [ROLES.HOSPITAL]: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hospital' },
    { label: 'Blood Inventory', icon: Warehouse, path: '/dashboard/hospital/inventory' },
    { label: 'All Requests', icon: ClipboardList, path: '/requests' },
    { label: 'Create Request', icon: Plus, path: '/request/create' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/hospital/notifications' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { label: 'All Donors', icon: Users, path: '/donors' },
    { label: 'All Requests', icon: ClipboardList, path: '/requests' },
    { label: 'Inventory', icon: Warehouse, path: '/dashboard/hospital/inventory' },
    { label: 'Analytics', icon: BarChart3, path: '/dashboard/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/dashboard/admin/settings' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = navMap[user?.role] || [];
  const unread = mockNotifications.filter(n => !n.isRead).length;

  const roleLabel = {
    [ROLES.DONOR]: 'Donor',
    [ROLES.RECIPIENT]: 'Recipient',
    [ROLES.HOSPITAL]: 'Hospital Staff',
    [ROLES.ADMIN]: 'Administrator',
  };

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        <div className="logo-icon">
          <Heart size={16} fill="white" color="white" />
        </div>
        <span><span className="text-gradient">Blood</span>Link</span>
      </Link>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Navigation</div>
        {links.map(({ label, icon: Icon, path }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            id={`sidebar-${label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'Notifications' && unread > 0 && (
              <span className="badge-count">{unread}</span>
            )}
          </Link>
        ))}
      </div>

      <div className="sidebar-user">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar">{user?.name?.[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-semibold text-sm text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div className="text-xs text-muted">{roleLabel[user?.role]}</div>
          </div>
        </div>
        <button
          className="btn btn-danger btn-sm w-full"
          id="sidebar-logout"
          onClick={() => { logout(); navigate('/'); }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
