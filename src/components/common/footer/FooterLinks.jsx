import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/requests', label: 'Blood Requests' },
  { to: '/camps', label: 'Donation Camps' },
  { to: '/register/donor', label: 'Become a Donor' },
  { to: '/request/create', label: 'Request Blood' },
];

export default function FooterLinks() {
  return (
    <div>
      <h4 className="text-white font-heading font-bold mb-4 text-sm uppercase tracking-widest">
        Quick Links
      </h4>
      <div className="flex flex-col gap-2.5">
        {FOOTER_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-sm text-white/70 hover:text-secondary transition-colors no-underline"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
