import { Link } from 'react-router-dom';
import { LogIn, User } from 'lucide-react';
import DropdownMenu, { DropdownMenuItem } from '../../ui/DropdownMenu';

export default function UserMenu({ user, onLogout, onClose }) {
  return (
    <DropdownMenu className="min-w-[190px]">
      {user.role === 'DONOR' && (
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 border-b border-border-subtle px-4 py-2.5 text-sm text-text-secondary no-underline transition-colors hover:bg-primary-light/40"
        >
          <User size={16} className="text-primary shrink-0" />
          <span className="font-semibold text-text">My Profile</span>
        </Link>
      )}
      <DropdownMenuItem onClick={onLogout} danger>
        <LogIn size={16} className="shrink-0" />
        <span className="font-semibold">Sign Out</span>
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
