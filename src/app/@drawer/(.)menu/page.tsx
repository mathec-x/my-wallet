'use client';

import Drawer from '@/app/components/elements/Drawer';
import ListContainer from '@/app/components/elements/ListContainer';
import MenuLayout from '@/app/components/layouts/Menu/Menu.layout';
import { useAuthProvider } from '@/app/providers/auth/AuthProvider';
import { NextAsyncPageProps } from '@/server/interfaces/next';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function MenuDrawer(props: NextAsyncPageProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthProvider();
  const router = useRouter();

  useEffect(() => {
    setOpen(true);
    return () => setOpen(false);
  }, [props]);

  const handleClose = useCallback((path?: string) => {
    setOpen(false);
    setTimeout(() => path ? router.push(path, { scroll: false }) : router.back(), 255);
  }, [router]);

  return (
    <Drawer
      open={open}
      onClose={() => handleClose()}
      onOpen={() => {
        setOpen(true);
        router.push('/menu');
      }}>
      <ListContainer>
        <ListItem
          secondaryAction={
            <IconButton onClick={() => handleClose()}>
              <CloseIcon />
            </IconButton>
          }>
          <ListItemAvatar>
            <Avatar></Avatar>
          </ListItemAvatar>
          <ListItemText primary={user?.name} secondary={user?.email} />
        </ListItem>
      </ListContainer>
      <MenuLayout onClose={handleClose} />
    </Drawer >
  );
}
