import { Routes, Route } from 'react-router-dom';
import AdminRoutes from '@/admin/routes/AdminRoutes';
import PublicLayout from '@/components/layout/PublicLayout';
import HomePage from '@/pages/HomePage';
import PlaceholderPage from '@/pages/PlaceholderPage';

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
        <Route
          path="/shop"
          element={placeholder(
            'Shop',
            'Browse our complete range of solar panels, inverters, batteries and accessories.',
            'Explore Homepage',
            '/',
          )}
        />
        <Route
          path="/shop/:category"
          element={placeholder(
            'Product Category',
            'Product listings for this category will appear here once connected to the backend API.',
            'View All Categories',
            '/shop',
          )}
        />
        <Route
          path="/contact"
          element={placeholder(
            'Contact Us',
            'Reach out to our solar experts for product guidance, quotes and support.',
            'Get a Quote',
            '/quote',
          )}
        />
        <Route
          path="/quote"
          element={placeholder(
            'Get a Quote',
            'Request a customised solar quote for your home, business or industrial project.',
            'Contact Us',
            '/contact',
          )}
        />
        <Route
          path="/distributor"
          element={placeholder(
            'Become a Distributor',
            'Partner with HANS Solar and grow your business with trusted products and support.',
            'Contact Us',
            '/contact',
          )}
        />
        <Route
          path="/learn/:topic"
          element={placeholder(
            'Solar Learning Center',
            'Educational content about solar energy, buying guides and subsidy information.',
            'Back to Home',
            '/',
          )}
        />
        <Route
          path="/subsidy/:topic"
          element={placeholder(
            'Solar Subsidy Information',
            'Detailed subsidy scheme information and application guidance will be available here.',
            'Learn About Subsidy',
            '/learn/solar-subsidy-guide',
          )}
        />
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
