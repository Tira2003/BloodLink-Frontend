const STEPS = [
  {
    num: '01',
    title: 'Register Interest',
    desc: 'Quickly and securely join our donor database with your blood type and district.',
  },
  {
    num: '02',
    title: 'Get Notified',
    desc: 'Receive alerts when your specific blood type is needed nearby via SMS and email.',
  },
  {
    num: '03',
    title: 'Give & Earn',
    desc: 'Visit the hospital, donate, and earn community reward points for your generosity.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-br from-bg via-surface to-red-light/40 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div className="flex justify-center md:justify-start">
            <img
              src="/Background3.png"
              alt="Two hands clasped together, symbolizing community and support"
              className="w-full max-w-md object-contain opacity-90 md:max-w-lg lg:max-w-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div>
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-text md:text-4xl lg:text-[2.75rem]">
              The Path to{' '}
              <span className="italic text-red-dark">Saving Life</span>
            </h2>

            <ol className="mt-10 flex flex-col gap-10">
              {STEPS.map(({ num, title, desc }) => (
                <li key={num} className="flex gap-6 md:gap-8">
                  <span
                    className="shrink-0 font-heading text-4xl font-medium italic leading-none text-cta/30 md:text-5xl"
                    aria-hidden
                  >
                    {num}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-heading text-lg font-bold text-text md:text-xl">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
