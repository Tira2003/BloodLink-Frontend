import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function RegisterHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="flex justify-center mb-5">
        <Logo />
      </Link>
      <h1 className="text-3xl font-extrabold font-heading mb-2">{title}</h1>
      {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
    </div>
  );
}
