'use client';

import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, 3000);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="splash-screen" role="status" aria-label="SPHINX loading">
      <div className="splash-pattern" aria-hidden="true" />
      <div className="splash-content">
        <svg
          className="splash-symbol"
          viewBox="0 0 90 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="45" cy="25" r="17" stroke="currentColor" strokeWidth="3" />
          <path d="M45 42V94M23 59H67M45 94C29 86 27 72 31 62M45 94C61 86 63 72 59 62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="splash-wordmark">SPHINX</div>
        <div className="splash-line" aria-hidden="true" />
        <div className="splash-tagline">THE GUARDIAN</div>
      </div>
    </div>
  );
}
