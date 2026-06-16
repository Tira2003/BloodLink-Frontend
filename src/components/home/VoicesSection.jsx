import { HOME_VOICES } from '../../data/homeData';

export default function VoicesSection() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-dark">
            Voices
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl lg:text-[2.75rem]">
            What{' '}
            <span className="text-gradient italic">donors and hospitals</span> say.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {HOME_VOICES.map(({ name, role, text }) => (
            <article
              key={name}
              className="rounded-3xl border border-border-subtle bg-bg p-8 shadow-sm md:p-10"
            >
              <span
                className="font-heading text-5xl leading-none text-primary/40"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
                {text}
              </p>
              <hr className="my-6 border-border-subtle" />
              <p className="font-heading font-bold text-text">{name}</p>
              <p className="mt-1 text-sm text-text-muted">{role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
