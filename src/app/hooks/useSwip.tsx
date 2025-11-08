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

  // #region Mouse events for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!onSwipeLeft && !onSwipeRight) return;
    startX.current = e.clientX;
    setIsSwiping(true);
    isDragging.current = true;
    e.preventDefault();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSwiping || !isDragging.current) return;
    const currentX = e.clientX;
    const offset = currentX - startX.current;
    if (!onSwipeLeft && offset < 0) { setDragOffset(0);; return; };
    if (!onSwipeRight && offset > 0) { setDragOffset(0); return; };


    if (threshould < Math.abs(offset)) {
      setDragOffset(offset > 0 ? threshould : -threshould);
    } else {
      setDragOffset(offset);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwiping, threshould]);

  // #region Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!onSwipeLeft && !onSwipeRight) return;

    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
    isDragging.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping || !isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const offset = currentX - startX.current;
    if (!onSwipeLeft && offset < 0) { setDragOffset(0);; return; };
    if (!onSwipeRight && offset > 0) { setDragOffset(0); return; };

    if (threshould < Math.abs(offset)) {
      setDragOffset(offset > 0 ? threshould : -threshould);
    } else {
      setDragOffset(offset);
    }
    e.preventDefault();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwiping, threshould]);

  const handleSwipEnd = useCallback(() => {
    if (!isSwiping || !isDragging.current) return;

    const percentArea = threshould * 0.1; // 10% of the threshould
    if (dragOffset < -(threshould - percentArea) && onSwipeLeft) {
      onSwipeLeft();
      // console.log('swipe to the left');
    } else if (dragOffset > (threshould - percentArea) && onSwipeRight) {
      onSwipeRight();
      // console.log('swipe to the right');
    }

    setDragOffset(0);
    setIsSwiping(false);
    isDragging.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwiping, dragOffset, threshould]);

  useEffect(() => {
    if (isSwiping) {
      // Mouse events
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleSwipEnd);

      // Touch events
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleSwipEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleSwipEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleSwipEnd);
    };
  }, [isSwiping, handleMouseMove, handleSwipEnd, handleTouchMove]);

  return {
    dragOffset,
    isSwiping,
    handleMouseDown,
    handleTouchStart,
  };
}

export default useSweep;