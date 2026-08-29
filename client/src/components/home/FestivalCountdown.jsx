import useFestivalCountdown from '@/hooks/useFestivalCountdown';

export default function FestivalCountdown({ remaining }) {
  if (!remaining) {
    return null;
  }

  const units = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 sm:px-4 sm:py-5"
        >
          <p className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {String(value).padStart(2, '0')}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-amber-100/90 sm:text-xs">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
