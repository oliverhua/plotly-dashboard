import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string, enabled = import.meta.env.DEV) => {
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

    const metrics: PerformanceMetrics = {
      componentName,
      renderTime,
      timestamp: Date.now(),
    };

    // Log performance metrics in development
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`🐌 Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        timestamp: metrics.timestamp,
      });
    } else if (renderCount.current % 10 === 0) {
      console.log(`⚡ ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }
  });

  return {
    renderCount: renderCount.current,
    markStart: () => {
      if (enabled) {
        renderStartTime.current = performance.now();
      }
    },
    markEnd: (label?: string) => {
      if (enabled) {
        const duration = performance.now() - renderStartTime.current;
        console.log(`⏱️ ${componentName}${label ? ` - ${label}` : ''}: ${duration.toFixed(2)}ms`);
        return duration;
      }
      return 0;
    },
  };
}; 