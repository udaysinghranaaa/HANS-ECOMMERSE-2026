import { useEffect, useState } from 'react';

const getRemainingTime = (endsAt) => {
  const endsAtTime = new Date(endsAt).getTime();

  if (!endsAt || Number.isNaN(endsAtTime)) {
    return null;
  }

  const difference = endsAtTime - Date.now();

  if (difference <= 0) {
    return null;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, totalMs: difference };
};

export default function useFestivalCountdown(endsAt) {
  const [remaining, setRemaining] = useState(() => getRemainingTime(endsAt));

  useEffect(() => {
    setRemaining(getRemainingTime(endsAt));

    const timer = window.setInterval(() => {
      setRemaining(getRemainingTime(endsAt));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [endsAt]);

  return remaining;
}
