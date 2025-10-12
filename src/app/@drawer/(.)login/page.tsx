'use client';

import LoginForm from '@/app/components/composites/LoginForm/LoginForm';
import Drawer from '@mui/material/Drawer';
import { useLayoutEffect, useState } from 'react';

export default function LoginDrawer() {
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    setOpen(true);
    return () => setOpen(false);
  }, []);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => { }}
      slotProps={{
        paper: {
          sx: {
            height: '100vh',
            width: {
              md: '450px',
              lg: '550px',
              xs: '100%'
            }
          }
        }
      }}
    >
      <LoginForm />
    </Drawer >
  );
}
