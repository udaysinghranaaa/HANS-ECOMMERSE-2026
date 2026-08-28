import { Bell, Globe, Shield, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import PageHeader from '@/admin/components/ui/PageHeader';

const settingsSections = [
  {
    icon: User,
    title: 'Profile',
    description: 'Update admin name, email, and contact details.',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Change password and manage login preferences.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure alerts for new customer enquiries.',
  },
  {
    icon: Globe,
    title: 'Website',
    description: 'Manage company info shown on the public website.',
  },
];

export default function AdminSettingsPage() {
  const admin = useSelector((state) => state.adminAuth.admin);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Admin account and website configuration options."
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Signed in as</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          {admin?.name ?? 'Admin'}
        </p>
        <p className="text-sm text-slate-500">{admin?.email ?? '—'}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map(({ icon: Icon, title, description }) => (
          <button
            key={title}
            type="button"
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <p className="mt-3 text-xs font-medium text-amber-600">
              Coming soon
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
