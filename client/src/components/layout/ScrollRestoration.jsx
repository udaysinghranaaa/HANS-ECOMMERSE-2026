import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Resets scroll position on forward navigations (PUSH/REPLACE).
 * Back/forward (POP) is left to the browser so list pages keep their scroll position.
 */
export default function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      return;
    }

    if (location.hash) {
      const targetId = location.hash.replace(/^#/, '');

      if (targetId) {
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({ block: 'start' });
          return;
        }
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search, location.hash, navigationType]);

  return null;
}
