'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useModalHandler(name: string) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const value = useMemo(() => searchParams.get(name), [searchParams, name]);
  const isOpen = useMemo(() => searchParams.has(name), [searchParams, name]);

  function setRoute(path: string) {
    router.push(path, { scroll: false });
  }

  function setOpen(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    setRoute('?' + params.toString());
  };

  function setClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    setRoute('?' + params.toString());
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