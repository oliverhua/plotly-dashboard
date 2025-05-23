import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (enabled = import.meta.env.DEV) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStartTime.current;

    // Performance tracking without logging
    if (renderTime > 16) {
      // More than one frame (60fps) - could add analytics here instead
    }
  });

  return {
    renderCount: renderCount.current,
    markStart: () => {
      if (enabled) {
        renderStartTime.current = performance.now();
      }
    },
    markEnd: () => {
      if (enabled) {
        const duration = performance.now() - renderStartTime.current;
        return duration;
      }
      return 0;
    },
  };
};
