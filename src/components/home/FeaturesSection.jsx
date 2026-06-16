import SectionHeader from '../ui/SectionHeader';
import { HOME_FEATURES } from '../../data/homeData';

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="container max-w-6xl mx-auto px-6">
        <SectionHeader
          pill="Platform Features"
          title={<>Everything You Need to <span className="text-gradient">Save Lives</span></>}
          subtitle="A complete platform for donors, patients, hospitals, and blood banks — built for emergencies."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOME_FEATURES.map(({ icon: Icon, title, desc, iconBg }) => (
            <div
              key={title}
              className="bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-13 h-13 rounded-lg flex items-center justify-center mb-5 w-[52px] h-[52px] ${iconBg}`}>
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
