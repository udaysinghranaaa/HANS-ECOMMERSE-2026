import PageHeader from '@/admin/components/ui/PageHeader';
import StatusBadge from '@/admin/components/ui/StatusBadge';
import {
  enquiryStatusLabels,
  formatDate,
  mockEnquiries,
} from '@/admin/data/mockData';

export default function AdminEnquiriesPage() {
  return (
    <div>
      <PageHeader
        title="Enquiries"
        description="Review and track customer messages from the Contact Us form."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Subject
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {enquiry.name}
                    </p>
                    <p className="text-xs text-slate-500">{enquiry.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {enquiry.subject}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(enquiry.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      status={enquiry.status}
                      label={enquiryStatusLabels[enquiry.status]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
