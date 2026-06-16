import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Droplets, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur';
import { mockStats } from '../../data/mockData';

const PARTNER_HOSPITALS = [
  'National Hospital Colombo',
  'Kandy Teaching Hospital',
  'Galle General Hospital',
  'Colombo South Hospital',
  'Lady Ridgeway Hospital',
  'Jaffna Teaching Hospital',
];

function PartnerItem({ name }) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap text-muted-foreground">
      <Building2 className="size-5 shrink-0 opacity-70" />
      <span className="text-sm font-semibold tracking-tight">{name}</span>
    </div>
  );
}

export default function HeroSection2() {
  return (
    <main>
      <section className="overflow-hidden bg-gradient-to-b from-bg to-background">
        <div className="relative pt-24 pb-4 md:pt-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold text-primary-dark shadow-sm">
                <span className="size-2 animate-pulse-dot rounded-full bg-red" />
                Live · {mockStats.activeRequests} active requests right now
              </div>

              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-balance text-foreground md:text-5xl lg:text-6xl">
                Save Lives Across{' '}
                <span className="text-gradient">Sri Lanka</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
                BloodLink connects donors, patients, and hospitals in real time.
                Register once — we notify you when someone nearby needs your blood type.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
                <Link to="/register/donor">
                  <Button
                    variant="cta"
                    size="lg"
                    className="h-12 rounded-full pl-5 pr-3"
                    id="hero-donate-btn"
                  >
                    <Heart size={18} fill="currentColor" />
                    Become a Donor
                    <span className="rounded-full bg-white/20 p-1">
                      <ChevronRight size={16} />
                    </span>
                  </Button>
                </Link>
                <Link to="/request/create">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 rounded-full px-5"
                    id="hero-request-btn"
                  >
                    <Droplets size={18} />
                    Request Blood
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative -mr-56 mt-10 overflow-hidden px-2 sm:mr-0 sm:mt-14 md:mt-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent from-35% to-background"
            />
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-background p-1 shadow-lg shadow-primary/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="aspect-video size-full rounded-xl object-cover"
                src="https://videos.pexels.com/video-files/7578602/7578602-uhd_2560_1440_25fps.mp4"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background pb-16 pt-12 md:pb-24">
        <div className="group relative m-auto max-w-5xl px-6">
          <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-44 md:border-r md:border-border md:pr-6">
              <p className="text-end text-sm text-muted-foreground md:text-start">
                Trusted by hospitals across the island
              </p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              <InfiniteSlider speedOnHover={20} speed={40} gap={80}>
                {PARTNER_HOSPITALS.map((name) => (
                  <PartnerItem key={name} name={name} />
                ))}
              </InfiniteSlider>

              <ProgressiveBlur
                className="pointer-events-none absolute top-0 left-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute top-0 right-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
