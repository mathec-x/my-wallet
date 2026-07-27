'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSweepProps {
  threshold?: number;
  holdDelay?: number;
  onHold?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function useSweep({
  threshold = 100,
  holdDelay = 300,
  onHold,
  onSwipeLeft,
  onSwipeRight,
}: UseSweepProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const hasMoved = useRef(false);

  const startX = useRef(0);
  const startY = useRef(0);

  const isDragging = useRef(false);
  const isHolding = useRef(false);

  const holdTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const beginPress = useCallback((x: number, y: number) => {
    if (!onSwipeLeft && !onSwipeRight && !onHold) {
      return;
    }

    startX.current = x;
    startY.current = y;

    hasMoved.current = false;
    isDragging.current = true;
    isHolding.current = false;

    setDragOffset(0);
    setIsSwiping(false);

    cancelHold();

    if (onHold) {
      holdTimer.current = setTimeout(() => {
        if (!isDragging.current || hasMoved.current) {
          return;
        }

        isHolding.current = true;
        onHold();
      }, holdDelay);
    }
  }, [cancelHold, holdDelay, onHold, onSwipeLeft, onSwipeRight]);

  const updateSwipe = useCallback((offset: number) => {
    if (!onSwipeLeft && offset < 0) {
      return;
    }
    if (!onSwipeRight && offset > 0) {
      return;
    }

    setIsSwiping(true);
    setDragOffset(Math.max(-threshold, Math.min(threshold, offset)));
  },
    [threshold, onSwipeLeft, onSwipeRight],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    beginPress(e.clientX, e.clientY);
    e.preventDefault();
  },
    [beginPress],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    beginPress(
      e.touches[0].clientX,
      e.touches[0].clientY,
    );
  },
    [beginPress],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) {
      return;
    }

    const dx = e.clientX - startX.current;

    if (Math.abs(dx) > 8) {
      hasMoved.current = true;
      cancelHold();
    }

    updateSwipe(dx);
  },
    [cancelHold, updateSwipe],
  );

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) {
      return;
    }

    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (!hasMoved.current) {
      const vertical =
        Math.abs(dy) > Math.abs(dx) &&
        Math.abs(dy) > 10;

      if (vertical) {
        cancelHold();
        isDragging.current = false;
        return;
      }

      if (Math.abs(dx) > 8) {
        hasMoved.current = true;
        cancelHold();
      }
    }

    updateSwipe(dx);

    if (hasMoved.current) {
      e.preventDefault();
    }
  },
    [cancelHold, updateSwipe],
  );

  const finish = useCallback(() => {
    cancelHold();

    if (isSwiping) {
      const limit = threshold * 0.9;

      if (dragOffset <= -limit) { onSwipeLeft?.(); }
      if (dragOffset >= limit) { onSwipeRight?.(); }
    }

    isDragging.current = false;
    isHolding.current = false;

    setDragOffset(0);
    setIsSwiping(false);

    // mantém hasMoved=true até o click terminar
    requestAnimationFrame(() => {
      hasMoved.current = false;
    });
  }, [cancelHold, dragOffset, isSwiping, onSwipeLeft, onSwipeRight, threshold]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', finish);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', finish);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', finish);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', finish);
    };
  }, [finish, handleMouseMove, handleTouchMove]);

  useEffect(() => cancelHold, [cancelHold]);

  return { dragOffset, isSwiping, hasMoved, handleMouseDown, handleTouchStart };
}