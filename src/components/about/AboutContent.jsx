import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import PageHero from '../layout/PageHero';
import { HOME_FEATURES } from '../../data/homeData';
import Button from '../ui/Button';
import { mockStats } from '../../data/mockData';

export default function AboutContent() {
  return (
    <PageLayout flushTop contentClassName="pb-16">
      <PageHero
        badgeIcon={Heart}
        badgeLabel="About Us"
        title="About BloodLink"
        description="BloodLink connects blood donors, patients, and hospitals across Sri Lanka in real time — making emergency blood sourcing faster and more reliable."
        actions={
          <Link to="/register/donor">
            <Button variant="primary" size="sm">
              <Heart size={15} fill="currentColor" /> Join as Donor
            </Button>
          </Link>
        }
      />

      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="bg-surface border border-border-subtle rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-extrabold font-heading mb-3">Our Mission</h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            Every day, patients across Sri Lanka need blood urgently. BloodLink bridges the gap
            between those who need blood and those willing to donate — with smart matching by blood
            type and district, instant SMS and email alerts, and a network of{' '}
            {mockStats.hospitalsConnected}+ hospitals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOME_FEATURES.map(({ icon: Icon, title, desc, iconBg }) => (
            <div
              key={title}
              className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold font-heading mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
