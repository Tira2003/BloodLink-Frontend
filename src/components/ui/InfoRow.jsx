export function InfoRow({ label, value }) {
  return (
    <div className="flex gap-2.5 py-3 border-b border-border-subtle text-sm last:border-b-0">
      <span className="font-semibold text-text min-w-[140px] shrink-0">{label}</span>
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}

export function Avatar({ name, size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-light to-secondary text-primary-dark font-heading font-bold flex items-center justify-center shrink-0`}
    >
      {(name || '?')[0].toUpperCase()}
    </div>
  );
}
