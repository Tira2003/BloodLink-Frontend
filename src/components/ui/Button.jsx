const variants = {
  primary: 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-md hover:shadow-lg hover:-translate-y-px',
  secondary: 'bg-surface text-text border-2 border-border shadow-sm hover:border-primary hover:text-primary',
  cta: 'bg-gradient-to-br from-cta to-cta-dark text-white shadow-md hover:shadow-lg hover:-translate-y-px',
  ghost: 'bg-transparent text-text-secondary hover:bg-primary-light hover:text-primary',
  danger: 'bg-red text-white shadow-md hover:bg-red-dark hover:-translate-y-px',
};

const sizes = {
  sm: 'text-sm px-4 py-1.5 gap-1.5',
  md: 'text-sm px-5 py-2 gap-2',
  lg: 'text-base px-7 py-3 gap-2',
  icon: 'p-2.5 w-10 h-10',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-heading font-semibold rounded-full transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <a
      className={`inline-flex items-center justify-center font-heading font-semibold rounded-full transition-all duration-200 no-underline ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

// Named export for shadcn / Tailark-style imports
export { Button };
