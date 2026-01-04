'use client';

import Drawer from '@/app/components/elements/Drawer';
import { usePathname, useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function ModalLayout(props: PropsWithChildren) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    const current = segment?.replace('(.)', '/') || '';
    if (current === pathname) {
      // console.log('Open ModalLayout', { pathname, current });
      setOpen(true);
    } else {
      // console.log('Close ModalLayout', { pathname, current });
      setOpen(false);
    }
  }, [pathname, segment]);

  return (
    <Drawer
      open={open}
      anchor='bottom'
      sx={{
        minHeight: '30dvh',
      }}
      onClose={() => {
        if (open) {
          setOpen(false);
          setTimeout(() => router.back(), 255);
        }
      }}
      onOpen={() => {
        if (!open) {
          setOpen(true);
          router.push(pathname);
        }
      }}
    >
      {props.children}
    </Drawer >
  );
};

