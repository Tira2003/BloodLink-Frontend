import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { cn } from '@/lib/utils';
import { NAV_CONTENT_OFFSET } from '../../constants/layout';

export default function PageLayout({
  children,
  showFooter = true,
  flushTop = false,
  className = '',
  contentClassName = '',
}) {
  return (
    <div className={cn('min-h-screen bg-bg', className)}>
      <Navbar />
      <main
        className={cn(!flushTop && NAV_CONTENT_OFFSET, contentClassName)}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
