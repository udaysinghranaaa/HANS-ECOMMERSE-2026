import { useEffect, useRef, useState } from 'react';

export default function useRevealOnScroll(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -32px 0px',
        ...options,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
