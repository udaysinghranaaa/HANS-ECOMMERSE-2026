import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateSession } from '@/admin/store/adminAuthSlice';
import AdminHeader from '@/admin/components/layout/AdminHeader';
import AdminSidebar from '@/admin/components/layout/AdminSidebar';
import { useAdminSessionHeartbeatMutation } from '@/services/adminAuthApi';

const SESSION_HEARTBEAT_MS = 60 * 1000;

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.adminAuth.admin);
  const [heartbeat] = useAdminSessionHeartbeatMutation();
  const heartbeatInFlight = useRef(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login', { replace: true });
  };

  useEffect(() => {
    const runHeartbeat = async () => {
      if (heartbeatInFlight.current) {
        return;
      }

      heartbeatInFlight.current = true;

      try {
        const response = await heartbeat().unwrap();
        dispatch(updateSession({ token: response.data.token }));
      } catch {
        // Session expiry logout is handled globally in api.js.
      } finally {
        heartbeatInFlight.current = false;
      }
    };

    runHeartbeat();

    const intervalId = window.setInterval(runHeartbeat, SESSION_HEARTBEAT_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, heartbeat]);

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
