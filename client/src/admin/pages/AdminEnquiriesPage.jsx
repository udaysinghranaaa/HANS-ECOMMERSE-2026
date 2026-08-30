import { useState } from 'react';
import { Download, Loader2, Trash2 } from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import {
  enquiryStatusOptions,
  formatDateTime,
  getEnquiryStatusLabel,
  normalizeEnquiryStatus,
} from '@/admin/data/mockData';
import { exportEnquiriesToExcel } from '@/admin/utils/exportEnquiriesExcel';
import {
  useDeleteEnquiryMutation,
  useGetAdminEnquiriesQuery,
  useUpdateEnquiryStatusMutation,
} from '@/services/enquiriesApi';

export default function AdminEnquiriesPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetAdminEnquiriesQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });
  const [updateEnquiryStatus] = useUpdateEnquiryStatusMutation();
  const [deleteEnquiry] = useDeleteEnquiryMutation();
  const [updatingId, setUpdatingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [statusErrorId, setStatusErrorId] = useState('');
  const [deleteErrorId, setDeleteErrorId] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const enquiries = data?.data?.enquiries ?? [];

  const handleStatusChange = async (enquiryId, status) => {
    setUpdatingId(enquiryId);
    setStatusErrorId('');

    try {
      await updateEnquiryStatus({ id: enquiryId, status }).unwrap();
    } catch {
      setStatusErrorId(enquiryId);
    } finally {
      setUpdatingId('');
    }
  };

  const handleDelete = async (enquiry) => {
    const confirmed = window.confirm(
      `Delete enquiry from "${enquiry.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(enquiry.id);
    setDeleteErrorId('');

    try {
      await deleteEnquiry(enquiry.id).unwrap();
    } catch {
      setDeleteErrorId(enquiry.id);
    } finally {
      setDeletingId('');
    }
  };

  const handleExport = async () => {
    setExportError('');
    setIsExporting(true);

    try {
      const result = await refetch();
      const exportRows = result.data?.data?.enquiries ?? [];

      if (exportRows.length === 0) {
        setExportError('No enquiries available to export.');
        return;
      }

      exportEnquiriesToExcel(exportRows);
    } catch {
      setExportError('Unable to export enquiries. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Enquiries"
        description="Review and track customer messages from the Contact Us form."
        action={
          <button
            type="button"
            onClick={handleExport}
            disabled={isLoading || isFetching || isExporting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export Excel
          </button>
        }
      />

      {exportError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {exportError}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : isError ? (
          <div className="px-5 py-12 text-center text-sm text-red-600">
            Unable to load enquiries. Please try again later.
          </div>
        ) : enquiries.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No enquiries yet. Customer messages from the Contact Us form will
            appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subject
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Requirement
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date / Time
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enquiry) => {
                  const normalizedStatus = normalizeEnquiryStatus(enquiry.status);

                  return (
                    <tr key={enquiry.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {enquiry.name}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {enquiry.phone}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {enquiry.email}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {enquiry.subject}
                      </td>
                      <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                        <p className="line-clamp-3 whitespace-pre-wrap">
                          {enquiry.message}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDateTime(enquiry.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex min-w-40 flex-col gap-1">
                          <div className="relative">
                            <select
                              value={normalizedStatus}
                              onChange={(event) =>
                                handleStatusChange(enquiry.id, event.target.value)
                              }
                              disabled={updatingId === enquiry.id}
                              aria-label={`Update status for ${enquiry.name}`}
                              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {enquiryStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {updatingId === enquiry.id && (
                              <Loader2 className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-amber-600" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {getEnquiryStatusLabel(enquiry.status)}
                          </span>
                          {statusErrorId === enquiry.id && (
                            <span className="text-xs text-red-600">
                              Failed to update status
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(enquiry)}
                          disabled={deletingId === enquiry.id}
                          aria-label={`Delete enquiry from ${enquiry.name}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === enquiry.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                        {deleteErrorId === enquiry.id && (
                          <p className="mt-1 text-xs text-red-600">
                            Failed to delete
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
