import { Plus } from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import StatusBadge from '@/admin/components/ui/StatusBadge';
import { mockCategories } from '@/admin/data/mockData';

export default function AdminCategoriesPage() {
  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize products into browsable categories."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockCategories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {category.name}
              </h3>
              <StatusBadge active={category.isActive} />
            </div>
            <p className="text-sm text-slate-500">{category.description}</p>
            <p className="mt-4 text-sm font-medium text-slate-700">
              {category.productCount} products
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
