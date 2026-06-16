export default function InfoBanner({ icon: Icon, children, variant = 'info', className = '' }) {
  const styles = {
    info: 'bg-primary-light border-border text-primary-dark',
    success: 'bg-green-light border-cta text-cta-dark',
    warning: 'bg-amber-light border-amber text-amber',
  };

  return (
    <div className={`flex gap-3 items-start p-3.5 px-5 rounded-lg border text-sm ${styles[variant]} ${className}`}>
      {Icon && <Icon size={16} className="shrink-0 mt-0.5" />}
      <span>{children}</span>
    </div>
  );
}
