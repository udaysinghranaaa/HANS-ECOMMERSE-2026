import { Fragment } from 'react';
import useFestivalCountdown from '@/hooks/useFestivalCountdown';

const variants = {
  sale: {
    wrapper: 'flex items-stretch justify-between gap-1 sm:gap-2',
    card: 'relative min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center backdrop-blur-md transition duration-300 hover:border-solar-400/40 hover:bg-white/10 sm:px-3 sm:py-4',
    value:
      'text-xl font-bold tabular-nums text-white sm:text-2xl lg:text-3xl',
    label:
      'mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-solar-200/90 sm:text-[11px]',
    separator:
      'flex shrink-0 items-center self-center pb-4 text-lg font-light text-solar-400/70',
  },
  light: {
    wrapper: 'grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4',
    card: 'rounded-2xl border border-gray-200 bg-gray-50 px-3 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-solar-200 hover:bg-white sm:px-4 sm:py-5',
    value: 'text-2xl font-bold tabular-nums text-charcoal sm:text-3xl',
    label:
      'mt-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal-light sm:text-xs',
    separator: 'hidden',
  },
  dark: {
    wrapper: 'grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4',
    card: 'rounded-2xl border border-white/15 bg-white/10 px-3 py-4 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 sm:px-4 sm:py-5',
    value: 'text-2xl font-bold tabular-nums text-white sm:text-3xl',
    label:
      'mt-1 text-[11px] font-semibold uppercase tracking-wider text-amber-100/90 sm:text-xs',
    separator: 'hidden',
  },
};

export default function FestivalCountdown({ remaining, variant = 'dark' }) {
  if (!remaining) {
    return null;
  }

  const styles = variants[variant] ?? variants.dark;

  const units = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds },
  ];

  if (variant === 'sale') {
    return (
      <div className={styles.wrapper}>
        {units.map(({ label, value }, index) => (
          <Fragment key={label}>
            <div className={styles.card}>
              <p className={styles.value}>{String(value).padStart(2, '0')}</p>
              <p className={styles.label}>{label}</p>
            </div>
            {index < units.length - 1 && (
              <span className={styles.separator} aria-hidden>
                :
              </span>
            )}
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {units.map(({ label, value }) => (
        <div key={label} className={styles.card}>
          <p className={styles.value}>{String(value).padStart(2, '0')}</p>
          <p className={styles.label}>{label}</p>
        </div>
      ))}
    </div>
  );
}
