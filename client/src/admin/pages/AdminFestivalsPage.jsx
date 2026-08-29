import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import {
  useDeleteFestivalMutation,
  useGetAdminFestivalsQuery,
} from '@/services/festivalsApi';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  upcoming: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  expired: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  disabled: 'bg-red-50 text-red-700 ring-red-600/20',
};

const formatDateTime = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

function FestivalStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[status] || statusStyles.expired}`}
    >
      {status}
    </span>
  );
}

export default function AdminFestivalsPage() {
  const { data, isLoading, isError, error } = useGetAdminFestivalsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteFestival, { isLoading: isDeleting }] = useDeleteFestivalMutation();
  const [deletingId, setDeletingId] = useState('');

  const festivals = data?.data?.festivals ?? [];

  const handleDelete = async (festival) => {
    const confirmed = window.confirm(
      `Delete "${festival.name}"? Assigned products will be unlinked from this festival.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(festival.id);

    try {
      await deleteFestival(festival.id).unwrap();
    } catch (error) {
      window.alert(error?.data?.message || 'Failed to delete festival.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div>
      <PageHeader
        title="Festival / Sale"
        description="Create festival sales, assign products and set separate temporary discounts."
        action={
          <Link
            to="/admin/festivals/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400"
          >
            <Plus className="h-4 w-4" />
            Create Festival / Sale
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          {error?.data?.message ||
            'Unable to load festivals. Please refresh and try again.'}
        </div>
      ) : festivals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm text-slate-600">
            No festivals yet. Create your first festival sale to highlight products
            on the homepage.
          </p>
          <Link
            to="/admin/festivals/new"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            <Plus className="h-4 w-4" />
            Create Festival / Sale
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Festival
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Schedule
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Products
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {festivals.map((festival) => (
                  <tr key={festival.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {festival.imageUrl ? (
                          <img
                            src={festival.imageUrl}
                            alt={festival.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Sparkles className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">
                            {festival.name}
                          </p>
                          <p className="text-xs text-slate-500">{festival.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <p>{formatDateTime(festival.startsAt)}</p>
                      <p className="text-xs text-slate-400">
                        to {formatDateTime(festival.endsAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <FestivalStatusBadge status={festival.status} />
                      {!festival.isEnabled && festival.status !== 'disabled' && (
                        <p className="mt-1 text-xs text-slate-400">Disabled</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {festival.productCount ?? 0}
                    </td>
                    <td className="px-4 py-4 text-slate-700">{festival.priority}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/festivals/${festival.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(festival)}
                          disabled={isDeleting && deletingId === festival.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
