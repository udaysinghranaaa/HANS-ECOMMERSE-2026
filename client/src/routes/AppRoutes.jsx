import { Routes, Route } from 'react-router-dom';
import AdminRoutes from '@/admin/routes/AdminRoutes';
import PublicLayout from '@/components/layout/PublicLayout';
import HomePage from '@/pages/HomePage';
import CategoriesPage from '@/pages/CategoriesPage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ContactPage from '@/pages/ContactPage';
import QuotePage from '@/pages/QuotePage';
import PlaceholderPage from '@/pages/PlaceholderPage';
import DistributorPage from '@/pages/DistributorPage';
import LearnPage from '@/pages/LearnPage';
import SubsidyPage from '@/pages/SubsidyPage';

const placeholder = (title, description, ctaLabel, ctaPath) => (
  <PlaceholderPage
    title={title}
    description={description}
    ctaLabel={ctaLabel}
    ctaPath={ctaPath}
  />
);

/**
 * Application route definitions.
 *
 * Public routes: home, shop, contact, learn, etc.
 * Admin routes: /admin/* (separate dashboard section)
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop/product/:id" element={<ProductDetailPage />} />
        <Route path="/shop/categories" element={<CategoriesPage />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/distributor" element={<DistributorPage />} />
        <Route path="/learn/:topic" element={<LearnPage />} />
        <Route path="/subsidy/:topic" element={<SubsidyPage />} />
        <Route
          path="/privacy-policy"
          element={placeholder(
            'Privacy Policy',
            'Our privacy policy content will be published here.',
          )}
        />
        <Route
          path="/terms-and-conditions"
          element={placeholder(
            'Terms & Conditions',
            'Our terms and conditions content will be published here.',
          )}
        />
      </Route>

      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
