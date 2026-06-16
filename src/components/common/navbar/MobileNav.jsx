import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../../constants';
import Button from '../../ui/Button';
import NavLinks from './NavLinks';

export default function MobileNav({ open, user }) {
  if (!open) return null;

  return (
    <div className="border-t border-border-subtle bg-white/80 px-6 py-4 backdrop-blur-md md:hidden">
      <NavLinks className="w-full flex-col items-start gap-0" />
      {!user && (
        <div className="mt-4 flex flex-col gap-3 border-t border-border-subtle pt-4">
          <Link to="/login">
            <Button variant="primary" size="sm" className="w-full justify-center rounded-full">
              Login
            </Button>
          </Link>
          <Link to="/register/donor">
            <Button variant="secondary" size="sm" className="w-full justify-center rounded-full">
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
