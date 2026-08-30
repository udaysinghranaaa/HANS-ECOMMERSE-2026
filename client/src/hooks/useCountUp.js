import { useEffect, useState } from 'react';

export default function useCountUp(target, isActive, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }

    let frameId = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [target, isActive, duration]);

  return value;
}
