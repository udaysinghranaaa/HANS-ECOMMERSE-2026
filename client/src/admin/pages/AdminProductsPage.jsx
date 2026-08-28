import { Plus } from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import StatusBadge from '@/admin/components/ui/StatusBadge';
import {
  formatCurrency,
  mockProducts,
} from '@/admin/data/mockData';

export default function AdminProductsPage() {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage solar products shown on the public website."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Stock
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">
                    {product.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {product.category}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {product.stock}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge active={product.isActive} />
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
