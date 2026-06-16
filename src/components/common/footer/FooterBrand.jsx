import Logo from '../../ui/Logo';

export default function FooterBrand() {
  return (
    <div>
      <div className="mb-4">
        <Logo size="sm" />
      </div>
      <p className="text-sm leading-relaxed max-w-[220px] text-white/70">
        Connecting blood donors, recipients, and hospitals across Sri Lanka — in real time.
      </p>
    </div>
  );
}
