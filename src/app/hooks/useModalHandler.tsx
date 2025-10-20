'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useModalHandler(name: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const value = useMemo(() => searchParams.get(name), [searchParams, name]);
  const isOpen = useMemo(() => searchParams.has(name), [searchParams, name]);

  function setRoute(path: string) {
    router.replace(path);
  }

  function setOpen(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    setRoute(pathname + '?' + params.toString());
  };

  function setClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    setRoute(pathname + '?' + params.toString());
  };

  return {
    value,
    open: setOpen,
    close: setClose,
    isOpen,
    name
  };
}

export default useModalHandler;