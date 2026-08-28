import Hero from '@/components/home/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ProductShowcase from '@/components/home/ProductShowcase';
import DistributorCTA from '@/components/home/DistributorCTA';
import LearnSection from '@/components/home/LearnSection';
import ContactCTA from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProductsSection />
      <ProductShowcase />
      <FeatureSection />
      <WhyChooseUs />
      <DistributorCTA />
      <LearnSection />
      <ContactCTA />
    </>
  );
}
