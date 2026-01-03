'use client';

import ListContainer from '@/app/components/elements/ListContainer';
import MenuLayout from '@/app/components/layouts/Menu/Menu.layout';
import { useAuthProvider } from '@/app/providers/auth/AuthProvider';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/navigation';

export default function MenuDrawer() {
  const { user } = useAuthProvider();
  const router = useRouter();
  const handleClose = (path?: string) => {
    return (path) ? router.push(path) : router.back();
  };

  return (
    <>
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
    </>
  );
};

