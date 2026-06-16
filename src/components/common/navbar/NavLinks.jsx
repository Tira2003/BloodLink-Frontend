import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../../constants';
import { cn } from '@/lib/utils';

export default function NavLinks({ className = '', onNavigate }) {
  const location = useLocation();
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <ul className={cn('flex items-center gap-8', className)}>
      {NAV_LINKS.map(({ to, label }) => (
        <li key={to} className={cn(className?.includes('flex-col') && 'w-full')}>
          <Link
            to={to}
            onClick={onNavigate}
            className={cn(
              'text-sm no-underline transition-colors duration-200',
              className?.includes('flex-col') && 'block py-2.5',
              isActive(to)
                ? 'font-bold text-black'
                : 'font-medium text-text-secondary hover:text-primary',
            )}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
