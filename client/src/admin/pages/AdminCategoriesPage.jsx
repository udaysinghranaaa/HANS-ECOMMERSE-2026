import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import StatusBadge from '@/admin/components/ui/StatusBadge';
import {
  useDeleteCategoryMutation,
  useGetAdminCategoriesQuery,
} from '@/services/categoriesApi';

export default function AdminCategoriesPage() {
  const { data, isLoading, isError } = useGetAdminCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [deletingId, setDeletingId] = useState('');

  const categories = data?.data?.categories ?? [];

  const handleDelete = async (category) => {
    if (category.productCount > 0) {
      window.alert(
        `"${category.name}" has ${category.productCount} product(s). Reassign or delete those products before removing this category.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);

    try {
      await deleteCategory(category.id).unwrap();
    } catch (error) {
      window.alert(error?.data?.message || 'Failed to delete category.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize products into browsable categories for the shop and navigation."
        action={
          <Link
            to="/admin/categories/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          Unable to load categories. Please refresh and try again.
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Layers className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm text-slate-600">
            No categories yet. Create your first category to organize products.
          </p>
          <Link
            to="/admin/categories/new"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Layers className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <StatusBadge active={category.isActive} />
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                  /shop/{category.slug}
                </p>
                <p className="mt-4 text-sm font-medium text-slate-700">
                  {category.productCount ?? 0} product
                  {(category.productCount ?? 0) === 1 ? '' : 's'}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={isDeleting && deletingId === category.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {isDeleting && deletingId === category.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
