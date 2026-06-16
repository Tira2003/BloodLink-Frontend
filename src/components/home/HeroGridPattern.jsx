/**
 * Dashed grid with top fade — sits behind hero content.
 * Grid line color uses BloodLink green palette (cta / emerald tones).
 */
export default function HeroGridPattern({ className = '' }) {
  const gridColor = '#6ee7b7'; // emerald-300 — green variant aligned with --color-cta

  const maskImage = `
    repeating-linear-gradient(
      to right,
      black 0px,
      black 3px,
      transparent 3px,
      transparent 8px
    ),
    repeating-linear-gradient(
      to bottom,
      black 0px,
      black 3px,
      transparent 3px,
      transparent 8px
    ),
    radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
  `;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 0',
        maskImage,
        WebkitMaskImage: maskImage,
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}
    />
  );
}
