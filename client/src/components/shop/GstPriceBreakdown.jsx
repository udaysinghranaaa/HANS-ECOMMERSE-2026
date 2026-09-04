import { formatCurrency } from '@/utils/format';

export default function GstPriceBreakdown({
  actualPrice,
  gstPercentage,
  gstAmount,
  finalPrice,
}) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-500">Actual Price</span>
          <span className="text-sm font-medium tabular-nums text-slate-700 sm:text-[15px]">
            {formatCurrency(actualPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-600 sm:text-xs">
            {gstPercentage}% GST
          </span>
          <span className="text-sm font-medium tabular-nums text-slate-700 sm:text-[15px]">
            +{formatCurrency(gstAmount)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
        <span className="text-sm font-semibold text-slate-800 sm:text-[15px]">
          Final Price
        </span>
        <span className="text-[1.65rem] font-bold leading-none tabular-nums tracking-tight text-solar-700 sm:text-3xl">
          {formatCurrency(finalPrice)}
        </span>
      </div>
    </div>
  );
}
