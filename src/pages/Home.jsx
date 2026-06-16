import PageLayout from '../components/layout/PageLayout';
import HeroSection from '../components/home/HeroSection';
import ImpactStatsSection from '../components/home/ImpactStatsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import VoicesSection from '../components/home/VoicesSection';
import CommunityStoriesSection from '../components/home/CommunityStoriesSection';
import FaqSection from '../components/home/FaqSection';
export default function Home() {
  return (
    <PageLayout showFooter flushTop>
      <HeroSection />
      <ImpactStatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <VoicesSection />
      <CommunityStoriesSection />
      <FaqSection />
    </PageLayout>
  );
}
