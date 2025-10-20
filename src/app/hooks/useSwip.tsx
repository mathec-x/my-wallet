'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSweepProps {
  threshould?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

function useSweep({
  threshould = 100,
  onSwipeLeft,
  onSwipeRight,
}: UseSweepProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef<number>(0);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsSwiping(true);
    isDragging.current = true;
    e.preventDefault();
  }, []);

  // #region Mouse events for desktop
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSwiping || !isDragging.current) return;
    const currentX = e.clientX;
    const offset = currentX - startX.current;

    if (threshould < Math.abs(offset)) {
      setDragOffset(offset > 0 ? threshould : -threshould);
    } else {
      setDragOffset(offset);
    }
  }, [isSwiping, threshould]);

  const handleMouseUp = useCallback(() => {
    if (!isSwiping || !isDragging.current) return;
    if (dragOffset < -(threshould / 2) && onSwipeLeft) {
      onSwipeLeft();
    } else if (dragOffset > (threshould / 2) && onSwipeRight) {
      onSwipeRight();
    }
    setDragOffset(0);
    setIsSwiping(false);
    isDragging.current = false;
  }, [isSwiping, dragOffset, onSwipeLeft, onSwipeRight, threshould]);

  // region Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping || !isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const offset = currentX - startX.current;
    if (threshould < Math.abs(offset)) {
      setDragOffset(offset > 0 ? threshould : -threshould);
    } else {
      setDragOffset(offset);
    }
    e.preventDefault();
  }, [isSwiping, threshould]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping || !isDragging.current) return;

    if (dragOffset < -(threshould / 2) && onSwipeLeft) {
      onSwipeLeft();
    } else if (dragOffset > (threshould / 2) && onSwipeRight) {
      onSwipeRight();
    }

    setDragOffset(0);
    setIsSwiping(false);
    isDragging.current = false;
  }, [isSwiping, dragOffset, onSwipeLeft, onSwipeRight, threshould]);

  useEffect(() => {
    if (isSwiping) {
      // Mouse events
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // Touch events
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSwiping, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    dragOffset,
    isSwiping,
    handleMouseDown,
    handleTouchStart,
  };
}

export default useSweep;