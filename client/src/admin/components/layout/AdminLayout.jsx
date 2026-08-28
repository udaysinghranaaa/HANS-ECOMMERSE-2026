import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/admin/store/adminAuthSlice';
import AdminHeader from '@/admin/components/layout/AdminHeader';
import AdminSidebar from '@/admin/components/layout/AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.adminAuth.admin);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          pathname={location.pathname}
          adminName={admin?.name ?? 'Admin'}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
