import { useEffect } from 'react';

export function useBackListener(open: boolean, onClose: (event?: PopStateEvent) => void) {
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ modalOpen: true }, '');
    const handlePopState = (event: PopStateEvent) => {
      onClose(event);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [open, onClose]);
}