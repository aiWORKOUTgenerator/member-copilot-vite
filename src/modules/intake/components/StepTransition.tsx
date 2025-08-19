'use client';

import { ReactNode, useEffect, useState } from 'react';

interface StepTransitionProps {
  children: ReactNode;
}

/**
 * StepTransition
 * Lightweight enter transition for step content using Tailwind utilities.
 * Fades and slides content in on mount for a smooth step change.
 */
export function StepTransition({ children }: StepTransitionProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={
        `transition-all duration-300 ease-out ` +
        (entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')
      }
    >
      {children}
    </div>
  );
}
