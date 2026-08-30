export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  align = 'left',
  className = '',
  showAccent = true,
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={`${isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-solar-600 ${isCenter ? 'justify-center' : ''}`}
        >
          {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          {subtitle}
        </p>
      )}

      {showAccent && (
        <div
          className={`mt-5 flex items-center gap-2.5 ${isCenter ? 'justify-center' : ''}`}
          aria-hidden
        >
          <span className="h-px w-10 bg-solar-500/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-solar-500" />
          <span className="h-px w-6 bg-solar-500/40" />
        </div>
      )}
    </div>
  );
}
