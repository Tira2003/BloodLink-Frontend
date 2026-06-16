import { Link } from 'react-router-dom';
import { Heart, Droplets, ArrowRight } from 'lucide-react';
import { mockStats } from '../../data/mockData';
import Button from '../ui/Button';

export default function CtaBanner() {
  return (
    <section className="py-20 bg-bg">
      <div className="container max-w-3xl mx-auto px-6">
        <div className="relative bg-surface border border-border-subtle rounded-3xl p-12 text-center shadow-sm overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/5 pointer-events-none" />

          <div className="w-14 h-14 mx-auto mb-5 bg-gradient-to-br from-red-light to-red-100 rounded-xl flex items-center justify-center">
            <Heart size={28} className="text-red animate-heartbeat" fill="var(--color-red)" />
          </div>

          <h2 className="text-3xl font-extrabold font-heading mb-3">
            Ready to Make a Difference?
          </h2>
          <p className="text-text-secondary max-w-sm mx-auto leading-relaxed mb-8">
            Join {mockStats.totalDonors.toLocaleString()}+ registered donors. Registration takes less than 2 minutes and costs nothing.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register/donor">
              <Button variant="primary" size="lg" id="cta-register-btn">
                <Heart size={17} fill="currentColor" /> Register as Donor <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/request/create">
              <Button variant="secondary" size="lg">
                <Droplets size={17} /> Request Blood
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
