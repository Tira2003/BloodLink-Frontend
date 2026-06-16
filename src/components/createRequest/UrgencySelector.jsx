import { URGENCY_OPTIONS } from '../../constants';

export default function UrgencySelector({ value, onChange, error }) {
  return (
    <div className="mb-5">
      <label className="text-sm font-semibold text-text mb-2 block">Urgency Level *</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {URGENCY_OPTIONS.map(({ value: v, label, desc, color, bg, border }) => {
          const selected = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`p-4 text-left rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selected ? `${bg} ${border}` : 'border-border bg-bg hover:border-primary/40'
              }`}
            >
              <div className={`font-bold text-sm ${color}`}>{label}</div>
              <div className="text-xs text-text-secondary mt-0.5 leading-snug">{desc}</div>
            </button>
          );
        })}
      </div>
      {error && <span className="text-xs text-red mt-1 block" role="alert">{error}</span>}
    </div>
  );
}
