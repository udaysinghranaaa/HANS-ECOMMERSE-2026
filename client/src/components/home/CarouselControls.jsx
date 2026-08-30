import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CarouselNavButton({ direction, onClick, label }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-700 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-solar-200 hover:bg-solar-50 hover:text-solar-700 sm:flex"
      style={direction === 'left' ? { left: '-0.5rem' } : { right: '-0.5rem' }}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

export function CarouselFadeEdges({ from = 'from-white' }) {
  return (
    <>
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14 bg-gradient-to-r ${from} to-transparent sm:block`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-14 bg-gradient-to-l ${from} to-transparent sm:block`}
      />
    </>
  );
}
