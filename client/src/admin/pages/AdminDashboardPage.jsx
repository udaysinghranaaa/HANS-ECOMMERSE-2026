import {
  Clock,
  Inbox,
  Layers,
  Loader2,
  Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/admin/components/ui/StatCard';
import PageHeader from '@/admin/components/ui/PageHeader';
import StatusBadge from '@/admin/components/ui/StatusBadge';
import {
  getEnquiryStatusLabel,
  formatDateTime,
} from '@/admin/data/mockData';
import { useGetAdminCategoriesQuery } from '@/services/categoriesApi';
import { useGetAdminEnquiriesQuery } from '@/services/enquiriesApi';
import { useGetAdminProductsQuery } from '@/services/productsApi';

const RECENT_ENQUIRIES_LIMIT = 5;

export default function AdminDashboardPage() {
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetAdminProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetAdminCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: enquiriesData,
    isLoading: enquiriesLoading,
    isError: enquiriesError,
  } = useGetAdminEnquiriesQuery(RECENT_ENQUIRIES_LIMIT, {
    refetchOnMountOrArgChange: true,
  });

  const products = productsData?.data?.products ?? [];
  const categories = categoriesData?.data?.categories ?? [];
  const recentEnquiries = enquiriesData?.data?.enquiries ?? [];
  const enquiryStats = enquiriesData?.data?.stats;

  const formatStatValue = (value, isLoading, isError) => {
    if (isLoading) {
      return '—';
    }

    if (isError) {
      return '—';
    }

    return value;
  };

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        description="Quick snapshot of your website content and customer enquiries."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={formatStatValue(products.length, productsLoading, productsError)}
          icon={Package}
          variant="amber"
        />
        <StatCard
          title="Total Categories"
          value={formatStatValue(
            categories.length,
            categoriesLoading,
            categoriesError,
          )}
          icon={Layers}
          variant="blue"
        />
        <StatCard
          title="New Enquiries"
          value={formatStatValue(
            enquiryStats?.new ?? 0,
            enquiriesLoading,
            enquiriesError,
          )}
          icon={Inbox}
          variant="emerald"
        />
        <StatCard
          title="Pending Enquiries"
          value={formatStatValue(
            enquiryStats?.pending ?? 0,
            enquiriesLoading,
            enquiriesError,
          )}
          icon={Clock}
          variant="orange"
        />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Enquiries
            </h2>
            <p className="text-sm text-slate-500">
              Latest customer messages from the Contact Us form
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
          >
            View All
          </Link>
        </div>

        {enquiriesLoading ? (
          <div className="flex items-center justify-center px-5 py-12">
            <Loader2 className="h-7 w-7 animate-spin text-amber-600" />
          </div>
        ) : enquiriesError ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">
            Unable to load enquiries. Please refresh the page.
          </div>
        ) : recentEnquiries.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            No enquiries yet. New customer messages will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{enquiry.name}</p>
                  <p className="text-sm text-slate-500">
                    {enquiry.email}
                    {enquiry.phone ? ` · ${enquiry.phone}` : ''}
                  </p>
                  <p className="text-sm text-slate-500">{enquiry.subject}</p>
                  {enquiry.message && (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {enquiry.message}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                  <StatusBadge
                    status={enquiry.status}
                    label={getEnquiryStatusLabel(enquiry.status)}
                  />
                  <span className="text-xs text-slate-400">
                    {formatDateTime(enquiry.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
