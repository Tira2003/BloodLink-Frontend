export default function SectionHeader({ pill, title, subtitle, className = '' }) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {pill && (
        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-sm font-semibold text-primary-dark shadow-sm mb-4">
          {pill}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary max-w-lg mx-auto leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
