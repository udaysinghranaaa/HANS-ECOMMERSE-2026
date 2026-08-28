import {
  Clock,
  Inbox,
  Layers,
  Package,
} from 'lucide-react';
import StatCard from '@/admin/components/ui/StatCard';
import PageHeader from '@/admin/components/ui/PageHeader';
import { dashboardStats, mockEnquiries } from '@/admin/data/mockData';

export default function AdminDashboardPage() {
  const recentEnquiries = mockEnquiries.slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        description="Quick snapshot of your website content and customer enquiries."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={dashboardStats.totalProducts}
          icon={Package}
          variant="amber"
        />
        <StatCard
          title="Total Categories"
          value={dashboardStats.totalCategories}
          icon={Layers}
          variant="blue"
        />
        <StatCard
          title="New Enquiries"
          value={dashboardStats.newEnquiries}
          icon={Inbox}
          variant="emerald"
        />
        <StatCard
          title="Pending Enquiries"
          value={dashboardStats.pendingEnquiries}
          icon={Clock}
          variant="orange"
        />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Enquiries
          </h2>
          <p className="text-sm text-slate-500">
            Latest customer messages from the Contact Us form
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {recentEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{enquiry.name}</p>
                <p className="text-sm text-slate-500">{enquiry.subject}</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {enquiry.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
