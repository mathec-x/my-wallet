'use client';

import Drawer from '@/app/components/elements/Drawer';
import { Puller } from '@/app/components/ui/Puller';
import { parseSegment } from '@/shared/utils/parse-segment';
import Box from '@mui/material/Box';
import { usePathname, useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function ModalLayout(props: PropsWithChildren) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    if (parseSegment(segment) === pathname) {
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
        borderRadius: 2
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
      <Box pb={3}>
        <Puller sx={{ visibility: { md: 'hidden' } }} />
      </Box>

      {props.children}
    </Drawer >
  );
};

