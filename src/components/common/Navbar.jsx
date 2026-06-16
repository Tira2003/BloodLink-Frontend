import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { Avatar } from '../ui/InfoRow';
import NavLinks from './navbar/NavLinks';
import NotificationDropdown from './navbar/NotificationDropdown';
import UserMenu from './navbar/UserMenu';
import MobileNav from './navbar/MobileNav';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, logout, notifications } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unread = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(id);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-border-subtle bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <nav className="relative mx-auto flex h-16 w-full max-w-7xl items-center px-6 lg:px-10">
        <div className="flex flex-1 items-center">
          <Logo />
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
          <NavLinks />
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-5">
          {user ? (
            <>
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => { setNotifOpen((o) => !o); setUserOpen(false); }}
                  aria-label="Notifications"
                  className="relative flex size-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red text-[0.62rem] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <NotificationDropdown notifications={notifications} unread={unread} />
                )}
              </div>

              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => { setUserOpen((o) => !o); setNotifOpen(false); }}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-text transition-colors hover:bg-primary/10"
                >
                  <Avatar name={user.name} size="sm" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-text-muted" />
                </button>
                {userOpen && (
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setUserOpen(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/register/donor" className="hidden sm:block">
                <Button
                  variant="secondary"
                  size="sm"
                  id="register-btn"
                  className="rounded-full px-6"
                >
                  Register
                </Button>
              </Link>
              <Link to="/login" className="hidden sm:block">
                <Button
                  variant="primary"
                  size="sm"
                  id="login-btn"
                  className="rounded-full px-6 shadow-sm"
                >
                  Login
                </Button>
              </Link>
            </>
          )}

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            id="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <MobileNav open={mobileOpen} user={user} />
    </header>
  );
}
