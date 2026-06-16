import { HOME_IMPACT_STORIES } from '../../data/homeData';

export default function CommunityStoriesSection() {
  return (
    <section className="bg-gradient-to-br from-bg via-primary-light/30 to-green-light/40 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-dark">
              Impact
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl lg:text-[2.75rem]">
              Stories from the{' '}
              <span className="text-gradient italic">community.</span>
            </h2>
          </div>
          <a
            href="#"
            className="shrink-0 text-sm font-medium text-primary-dark underline underline-offset-4 transition-colors hover:text-primary"
          >
            Read all stories
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {HOME_IMPACT_STORIES.map(({ category, time, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {category} · {time}
              </p>
              <h3 className="mt-4 font-heading text-xl font-bold italic text-text">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
