'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTimeout } from './useTimeout';

/**
 * Hook para escutar mudanças no hash da URL.
 * Retorna o hash atual (sem o #) e atualiza automaticamente.
 */
export function useHash(initialState: string) {
  const router = useRouter();
  const [hash, setHash] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.replace('#', '');
    }
    return '';
  });

  const handleChangeHash = useCallback((value: string) => {
    if (value) {
      router.push(`#${value}`, { scroll: false });
    } else {
      router.replace('#', { scroll: false });
    }
  }, [router]);

  const isOpen = useMemo(() => {
    return hash === initialState;
  }, [hash, initialState]);

  const setOpen = useCallback((value: boolean) => {
    handleChangeHash(value ? initialState : '');
  }, [handleChangeHash, initialState]);

  const onHashChange = useTimeout(() => {
    const location = window.location.hash.replace('#', '');
    setHash(location);
  }, 255);

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [isOpen, onHashChange]);


  return [isOpen, setOpen] as const;
}