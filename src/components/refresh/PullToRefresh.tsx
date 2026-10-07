import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HybitRefreshIndicator } from './HybitRefreshIndicator';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  isRefreshing: boolean;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  isRefreshing,
  children,
  threshold = 70,
  className = '',
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef<number | null>(null);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRefreshing) return;
    const windowScrollY = window.scrollY || document.documentElement.scrollTop;
    if (windowScrollY <= 4) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  // Touch Move with physical dampening
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || startY.current === null || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    const windowScrollY = window.scrollY || document.documentElement.scrollTop;
    if (windowScrollY <= 4 && deltaY > 0) {
      // Natural logarithmic dampening curve
      const resistance = 0.45;
      const distance = Math.min(100, deltaY * resistance);
      setPullDistance(distance);
    } else {
      setPullDistance(0);
    }
  };

  // Touch End
  const handleTouchEnd = useCallback(() => {
    if (!isPulling.current) return;
    isPulling.current = false;
    startY.current = null;

    if (pullDistance >= threshold && !isRefreshing) {
      setPullDistance(0);
      onRefresh();
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  // Desktop Mouse Drag Support (allows testing pull-to-refresh on desktop easily)
  const isMouseDown = useRef(false);
  const mouseStartY = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRefreshing) return;
    const windowScrollY = window.scrollY || document.documentElement.scrollTop;
    if (windowScrollY <= 4) {
      mouseStartY.current = e.clientY;
      isMouseDown.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || mouseStartY.current === null || isRefreshing) return;
    const deltaY = e.clientY - mouseStartY.current;
    if (deltaY > 0) {
      const resistance = 0.4;
      const distance = Math.min(95, deltaY * resistance);
      setPullDistance(distance);
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    mouseStartY.current = null;
    if (pullDistance >= threshold && !isRefreshing) {
      setPullDistance(0);
      onRefresh();
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown.current) {
        handleMouseUp();
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  });

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      className={`relative min-h-full ${className}`}
    >
      {/* Pull To Refresh Indicator */}
      <HybitRefreshIndicator
        pullDistance={pullDistance}
        threshold={threshold}
        isRefreshing={isRefreshing}
      />

      {/* Content Container with subtle downward translation while pulling */}
      <div
        className="transition-transform duration-150 ease-out"
        style={{
          transform:
            pullDistance > 0 && !isRefreshing
              ? `translateY(${pullDistance * 0.25}px)`
              : 'translateY(0px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
