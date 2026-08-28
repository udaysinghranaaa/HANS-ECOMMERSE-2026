import { Bell, Menu } from 'lucide-react';
import { getPageTitle } from '@/admin/constants/navigation';

export default function AdminHeader({ pathname, adminName, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-amber-600">
            Admin
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            {getPageTitle(pathname)}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-slate-900">
            {adminName?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{adminName}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
