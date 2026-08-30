export default function StatusBadge({ active, label, status }) {
  const styles = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    inactive: 'bg-slate-100 text-slate-600 ring-slate-500/10',
    NEW: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    CONTACTED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    IN_PROGRESS: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    CONVERTED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    CLOSED: 'bg-slate-100 text-slate-600 ring-slate-500/10',
    RESOLVED: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  };

  const displayLabel =
    label ??
    (typeof active === 'boolean' ? (active ? 'Active' : 'Inactive') : status);

  let styleKey = 'inactive';
  if (status && styles[status]) {
    styleKey = status;
  } else if (typeof active === 'boolean') {
    styleKey = active ? 'active' : 'inactive';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[styleKey]}`}
    >
      {displayLabel}
    </span>
  );
}
