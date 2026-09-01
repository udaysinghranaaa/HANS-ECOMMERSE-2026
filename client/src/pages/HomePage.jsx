import Hero from '@/components/home/Hero';
import FestivalSaleSection from '@/components/home/FestivalSaleSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ProductShowcase from '@/components/home/ProductShowcase';
import FeatureSection from '@/components/home/FeatureSection';
import InstallationGallerySection from '@/components/home/InstallationGallerySection';
import CorporateOfficeSection from '@/components/home/CorporateOfficeSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FestivalSaleSection />
      <WhyChooseUs />
      <FeaturedProductsSection section="all" />
      <ProductShowcase />
      <FeatureSection />
      <InstallationGallerySection />
      <CorporateOfficeSection />
    </>
  );
}
