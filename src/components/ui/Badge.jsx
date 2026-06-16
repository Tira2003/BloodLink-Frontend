const variants = {
  critical: 'bg-red-light text-red-dark',
  medium: 'bg-amber-light text-amber',
  low: 'bg-green-light text-cta-dark',
  primary: 'bg-primary-light text-primary-dark',
  pending: 'bg-amber-light text-amber',
  matched: 'bg-green-light text-cta-dark',
  completed: 'bg-primary-light text-primary-dark',
  blood: 'bg-red-light text-red-dark font-extrabold',
};

export default function Badge({ variant = 'primary', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </span>
  );
}

export function BloodTypeBadge({ type, className = '' }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 text-sm font-extrabold rounded-md bg-red-light text-red-dark ${className}`}
    >
      {type}
    </span>
  );
}
