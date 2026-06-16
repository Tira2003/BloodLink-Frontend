const IMPACT_STATS = [
  { value: '12k+', label: 'Successful Donations' },
  { value: '480', label: 'Registered Hospitals' },
  { value: '9 min', label: 'Average Response Time' },
  { value: '85k', label: 'Lives Impacted' },
];

export default function ImpactStatsSection() {
  return (
    <section className="bg-gradient-to-b from-cyan-50 via-green-50/40 to-white py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_STATS.map(({ value, label }) => (
            <div key={label} className="space-y-2">
              <p className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-cta-dark via-cta to-primary-dark bg-clip-text text-transparent">
                {value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
