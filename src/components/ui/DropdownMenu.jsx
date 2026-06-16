export default function DropdownMenu({
  className = '',
  children,
}) {
  return (
    <div
      className={`absolute right-0 top-[calc(100%+0.5rem)] z-[2000] w-56 overflow-visible rounded-lg border border-border-subtle bg-surface shadow-md animate-slideDown ${className}`}
      role="menu"
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  className = '',
  children,
  danger = false,
  ...props
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
        danger
          ? 'text-red hover:bg-red-light/30'
          : 'text-text-secondary hover:bg-primary-light/40'
      } ${className}`}
      role="menuitem"
      {...props}
    >
      {children}
    </button>
  );
}

