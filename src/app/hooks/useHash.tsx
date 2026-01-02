import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

  useEffect(() => {
    // Função que atualiza o estado quando o hash muda
    const onHashChange = () => {
      setHash(window.location.hash.replace('#', ''));
    };

    // Adiciona listener
    window.addEventListener('hashchange', onHashChange);

    // Atualiza caso o hash mude sem disparar evento (ex: navegação inicial)
    onHashChange();

    // Remove listener ao desmontar
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const isOpen = useMemo(() => hash === initialState, [hash, initialState]);

  const setOpen = useCallback((value: boolean) => {
    if (value) {
      router.push(`#${initialState}`, { scroll: false });
    } else {
      router.replace('#', { scroll: false });
    }
  }, [router, initialState]);

  console.log('useHash', { hash, isOpen });
  return [isOpen, setOpen] as const;
}