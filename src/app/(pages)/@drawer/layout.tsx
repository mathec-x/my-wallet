'use client';

import Drawer from '@/app/components/elements/Drawer';
import { parseSegment } from '@/shared/utils/parse-segment';
import { usePathname, useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function DrawerLayout(props: PropsWithChildren) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    if (parseSegment(segment) === pathname) {
      // console.log('Open DrawerLayout', { pathname, current });
      setOpen(true);
    } else {
      // console.log('Close DrawerLayout', { pathname, current });
      setOpen(false);
    }
  }, [pathname, segment]);

  return (
    <Drawer
      open={open}
      sx={{
        height: '100dvh',
        width: {
          md: '450px',
          lg: '550px',
          xs: '100%'
        }
      }}
      onClose={() => {
        if (open) {
          setOpen(false);
          if (pathname === parseSegment(segment)) {
            setTimeout(() => router.back(), 255);
          }
        }
      }}
      onOpen={() => {
        if (!open) {
          setOpen(true);
          router.push(parseSegment(segment));
        }
      }}
    >
      {props.children}
    </Drawer >
  );
};

