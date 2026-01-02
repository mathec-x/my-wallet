'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export enum MODALS {
  BALANCE_MODAL = 'balance',
  ENTRY_EDITOR = 'entry'
}

export function useModalHandler(name: string) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const value = useMemo(() => searchParams.get(name), [searchParams, name]);
  const isOpen = useMemo(() => searchParams.has(name), [searchParams, name]);

  function setQueryParams(path: string) {
    router.push(pathName + '?' + path, { scroll: false });
  }

  function setOpen(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    setQueryParams(params.toString());
  };

  function setClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    setQueryParams(params.toString());
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