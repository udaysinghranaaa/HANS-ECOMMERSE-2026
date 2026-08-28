import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';

/**
 * Application route definitions.
 *
 * Future route groups:
 * - Public routes (home, products, categories, etc.)
 * - Protected customer routes (cart, checkout, profile, orders)
 * - Protected admin routes (dashboard, inventory, users)
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
