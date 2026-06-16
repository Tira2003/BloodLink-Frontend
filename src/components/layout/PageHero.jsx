import { NAV_HERO_OFFSET } from '../../constants/layout';

export default function PageHero({
  badgeIcon: BadgeIcon,
  badgeLabel,
  title,
  description,
  actions,
}) {
  return (
    <div
      className={`bg-gradient-to-br from-primary-light to-green-50 border-b border-border-subtle ${NAV_HERO_OFFSET} pb-12`}
    >
      <div className="container max-w-6xl mx-auto px-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold text-primary-dark shadow-sm">
          {BadgeIcon && <BadgeIcon size={14} />}
          {badgeLabel}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold font-heading mb-2">{title}</h1>
            <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
              {description}
            </p>
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
