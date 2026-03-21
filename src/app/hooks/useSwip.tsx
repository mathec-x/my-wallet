'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSweepProps {
  threshould?: number;
  holdDelay?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

function useSweep({
  threshould = 100,
  holdDelay = 300,
  onSwipeLeft,
  onSwipeRight,
}: UseSweepProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isDragging = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldActivated = useRef(false);

  const cancelHoldTimer = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  // #region Mouse events for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!onSwipeLeft && !onSwipeRight) return;
    startX.current = e.clientX;
    setIsSwiping(true);
    isDragging.current = true;
    isHoldActivated.current = true;
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
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
    isHoldActivated.current = false;
    setIsTouching(true);

    cancelHoldTimer();
    holdTimer.current = setTimeout(() => {
      isHoldActivated.current = true;
      setIsSwiping(true);
    }, holdDelay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdDelay, cancelHoldTimer]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const offsetX = currentX - startX.current;
    const offsetY = currentY - startY.current;

    // Before hold activates, check if user is scrolling vertically
    if (!isHoldActivated.current) {
      const isVerticalScroll = Math.abs(offsetY) > Math.abs(offsetX) || Math.abs(offsetY) > 10;
      if (isVerticalScroll) {
        cancelHoldTimer();
        isDragging.current = false;
        setIsTouching(false);
        return;
      }
      // Not yet activated — don't move anything, let the timer decide
      return;
    }

    // Hold activated — handle horizontal drag
    if (!onSwipeLeft && offsetX < 0) { setDragOffset(0); return; }
    if (!onSwipeRight && offsetX > 0) { setDragOffset(0); return; }

    if (threshould < Math.abs(offsetX)) {
      setDragOffset(offsetX > 0 ? threshould : -threshould);
    } else {
      setDragOffset(offsetX);
    }
    e.preventDefault();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshould, cancelHoldTimer]);

  const handleSwipEnd = useCallback(() => {
    cancelHoldTimer();

    if (!isDragging.current) {
      setIsTouching(false);
      return;
    }

    if (isHoldActivated.current) {
      const percentArea = threshould * 0.1; // 10% of the threshould
      if (dragOffset < -(threshould - percentArea) && onSwipeLeft) {
        onSwipeLeft();
      } else if (dragOffset > (threshould - percentArea) && onSwipeRight) {
        onSwipeRight();
      }
    }

    setDragOffset(0);
    setIsSwiping(false);
    setIsTouching(false);
    isDragging.current = false;
    isHoldActivated.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragOffset, threshould, cancelHoldTimer]);

  useEffect(() => {
    if (isTouching || isSwiping) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleSwipEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleSwipEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleSwipEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleSwipEnd);
    };
  }, [isTouching, isSwiping, handleMouseMove, handleSwipEnd, handleTouchMove]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => cancelHoldTimer();
  }, [cancelHoldTimer]);

  return {
    dragOffset,
    isSwiping,
    handleMouseDown,
    handleTouchStart,
  };
}

export default useSweep;