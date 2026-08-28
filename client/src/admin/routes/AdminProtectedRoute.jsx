import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Admin route guard — mock auth only for now.
 * Redirects unauthenticated users to /admin/login.
 * Real JWT/session validation will replace this later.
 */
export default function AdminProtectedRoute() {
  const isAuthenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
