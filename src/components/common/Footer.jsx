import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const containerRef = useRef(null);

  // Track how far the footer has scrolled into view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  // As user scrolls in: narrow+rounded → full-width+square
  const footerWidth  = useTransform(scrollYProgress, [0, 0.4], ['82%', '100%']);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], [28, 0]);

  return (
    <div ref={containerRef} className="w-full bg-white">
      <motion.footer
        style={{ width: footerWidth, borderRadius }}
        className="bg-text text-white/70 pb-6 mx-auto overflow-hidden"
      >

        {/* Banner: text overlaid absolutely on the image's teal area */}
        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10 pt-6 overflow-hidden">
          {/* Image — z-10 so it sits on top of the text */}
          <img
            src="/Background4.png"
            alt="BloodLink community banner"
            className="w-full h-auto block relative z-10"
          />
          {/* Text sits behind the image — z-0, pushed down so Counts. goes under the arm */}
          <div className="absolute top-14 sm:top-16 lg:top-20 left-6 lg:left-10 pointer-events-none select-none z-0">
            <p className="text-white font-black leading-none tracking-tight text-[6rem] sm:text-[9rem] lg:text-[12rem]">
              Every Drop
            </p>
            <p className="text-white font-black leading-none tracking-tight text-[6rem] sm:text-[9rem] lg:text-[12rem]">
              Counts.
            </p>
          </div>
        </div>

        {/* Main footer content */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pt-12">
          <div className="flex flex-wrap justify-between gap-y-12 lg:gap-x-8">

            {/* Brand */}
            <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">
              <Link to="/" className="flex items-center gap-2.5 font-extrabold no-underline">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-400 to-red-700 flex items-center justify-center shadow-md shrink-0">
                  <Heart size={18} fill="white" color="white" />
                </div>
                <span className="text-xl text-white">Blood<span className="text-red-400">Link</span></span>
              </Link>
              <div className="w-full max-w-52 h-px mt-8 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <p className="text-sm text-white/60 mt-6 max-w-sm leading-relaxed">
                Connecting blood donors, recipients, and hospitals across Sri Lanka — in real time.
              </p>
            </div>

            {/* Quick Links */}
            <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm text-white font-medium">Quick Links</h3>
              <div className="flex flex-col gap-2 mt-6">
                <Link to="/"               className="text-sm text-white/60 hover:text-white transition-colors">Home</Link>
                <Link to="/requests"       className="text-sm text-white/60 hover:text-white transition-colors">Blood Requests</Link>
                <Link to="/camps"          className="text-sm text-white/60 hover:text-white transition-colors">Donation Camps</Link>
                <Link to="/register/donor" className="text-sm text-white/60 hover:text-white transition-colors">Become a Donor</Link>
                <Link to="/request/create" className="text-sm text-white/60 hover:text-white transition-colors">Request Blood</Link>
                <Link to="/about"          className="text-sm text-white/60 hover:text-white transition-colors">About</Link>
              </div>
            </div>

            {/* Contact */}
            <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm text-white font-medium">Contact</h3>
              <div className="flex flex-col gap-2 mt-6">
                <a href="tel:+94112345678"            className="text-sm text-white/60 hover:text-white transition-colors">+94 11 234 5678</a>
                <a href="mailto:support@bloodlink.lk" className="text-sm text-white/60 hover:text-white transition-colors">support@bloodlink.lk</a>
                <span className="text-sm text-white/60">Colombo, Sri Lanka</span>
              </div>
            </div>

            {/* Let's make a contact */}
            <div className="w-full md:w-[45%] lg:w-[25%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm text-white font-medium">Let's make a contact</h3>
              <div className="flex items-center border gap-2 border-white/20 h-13 max-w-80 w-full rounded-full overflow-hidden mt-4">
                <input
                  type="email"
                  placeholder="Enter your email.."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full pl-6 outline-none text-sm bg-transparent text-white placeholder-white/60 placeholder:text-xs"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-b from-primary to-primary/80 active:scale-95 transition w-56 h-10 rounded-full text-sm text-white cursor-pointer mr-1.5"
                >
                  Contact
                </button>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="w-full h-px mt-16 mb-4 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/60">© {new Date().getFullYear()} BloodLink. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">Terms &amp; Conditions</a>
              <div className="w-px h-4 bg-white/20" />
              <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

      </motion.footer>
    </div>
  );
}
