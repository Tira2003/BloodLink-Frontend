
import { useNavigate } from 'react-router-dom';
import { Heart, Droplets, ChevronRight } from 'lucide-react';
import { mockStats } from '../../data/mockData';
import Button from '../ui/Button';
import HeroGridPattern from './HeroGridPattern';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    // HERO SECTION
    
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-bg via-cyan-50 to-green-50 pt-24 pb-12 md:pt-28 md:pb-16">
      <HeroGridPattern />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center animate-slideUp">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold text-primary-dark shadow-sm">
            <span className="size-2 rounded-full bg-red animate-pulse-dot" />
            Live · {mockStats.activeRequests} active requests right now
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-text md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Bringing Hope Through
            <br />
            <span className="text-gradient">Every Donation</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Join a network dedicated to connecting blood donors with patients and hospitals in need.
            Your next donation could be someone&apos;s lifeline.
          </p>

          {/* relative z-20 keeps buttons above the hero image (image uses -mt-* overlap) */}
          <div className="relative z-20 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              id="hero-donate-btn"
              type="button"
              onClick={() => navigate('/register/donor')}
            >
              <Heart size={18} fill="currentColor" /> Become a Donor
            </Button>
            <Button
              variant="secondary"
              size="lg"
              id="hero-request-btn"
              type="button"
              onClick={() => navigate('/request/create')}
            >
              <Droplets size={18} /> Request Blood <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        
        <img
          src="/Background1.png"
          alt="Cupped hands receiving a drop of blood, symbolizing life-saving donation"
          className="relative z-0 mx-auto -mt-16 block w-full h-auto pointer-events-none object-contain object-top mix-blend-screen md:-mt-16 lg:-mt-16"
          loading="eager"
          decoding="async"
        />
      </div>
    </section>
  );
}
