import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import AdminProtectedRoute from '@/admin/routes/AdminProtectedRoute';
import AdminLoginPage from '@/admin/pages/AdminLoginPage';
import AdminDashboardPage from '@/admin/pages/AdminDashboardPage';
import AdminProductsPage from '@/admin/pages/AdminProductsPage';
import AdminProductFormPage from '@/admin/pages/AdminProductFormPage';
import AdminCategoriesPage from '@/admin/pages/AdminCategoriesPage';
import AdminEnquiriesPage from '@/admin/pages/AdminEnquiriesPage';
import AdminSettingsPage from '@/admin/pages/AdminSettingsPage';
import AdminBannerManagementPage from '@/admin/pages/AdminBannerManagementPage';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:id/edit" element={<AdminProductFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route
            path="homepage/banners"
            element={<AdminBannerManagementPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
