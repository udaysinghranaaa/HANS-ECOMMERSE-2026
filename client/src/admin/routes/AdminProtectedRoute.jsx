import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdminSessionActive } from '@/admin/utils/adminSession';

export default function AdminProtectedRoute() {
  const isAuthenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated,
  );
  const token = useSelector((state) => state.adminAuth.token);

  if (!isAuthenticated || !isAdminSessionActive(token)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
