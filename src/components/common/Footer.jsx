import { Heart } from 'lucide-react';
import FooterBrand from './footer/FooterBrand';
import FooterLinks from './footer/FooterLinks';
import FooterContact from './footer/FooterContact';

export default function Footer() {
  return (
    <footer className="bg-text text-white/70 pt-12 pb-6">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
          <FooterBrand />
          <FooterLinks />
          <FooterContact />
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex items-center justify-between flex-wrap gap-3 text-xs">
          <span>© {new Date().getFullYear()} BloodLink. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <Heart size={13} fill="var(--color-red)" className="text-red" />
            <span>Every drop counts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
