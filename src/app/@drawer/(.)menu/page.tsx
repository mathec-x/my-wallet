'use client';

import MenuLayout from '@/app/components/layouts/Menu/Menu.layout';
import { useAuthProvider } from '@/app/providers/auth/AuthProvider';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

export default function LoginDrawer() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthProvider();
  const router = useRouter();

  useLayoutEffect(() => {
    setOpen(true);

    return () => setOpen(false);
  }, []);

  const handleClose = (path?: string) => {
    setOpen(false);
    setTimeout(() => path ? router.push(path) : router.back(), 155);
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => handleClose()}
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
      }}>
      <Toolbar>
        <Avatar sx={{ mr: 2 }}></Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {user?.name}
          </Typography>
          <Typography variant="caption" component="div">
            {user?.email}
          </Typography>
        </Box>
        <IconButton onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <MenuLayout onClose={handleClose} />
    </SwipeableDrawer >
  );
}
