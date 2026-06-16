export default function LoadingSpinner({ light = false, className = '' }) {
  return (
    <span
      className={`inline-block w-4 h-4 rounded-full border-2 animate-spin ${
        light
          ? 'border-white/30 border-t-white'
          : 'border-border border-t-primary'
      } ${className}`}
      style={{ animationName: 'spin' }}
    />
  );
}

export function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner className="w-6 h-6" />
      {message && <p className="text-sm text-text-muted">{message}</p>}
    </div>
  );
}
