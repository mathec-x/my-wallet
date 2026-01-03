'use client';

import Drawer from '@/app/components/elements/Drawer';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function DrawerLayout(props: PropsWithChildren) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (['/menu', '/login'].includes(pathname)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        if (open) {
          setOpen(false);
          setTimeout(() => router.back(), 255);
        }
      }}
      onOpen={() => {
        if (!open) {
          setOpen(true);
          router.push('/menu');
        }
      }}
    >
      {props.children}
    </Drawer >
  );
};

