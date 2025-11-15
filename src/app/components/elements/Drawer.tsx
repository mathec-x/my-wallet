'use client';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

interface DrawerProps {
  onClose: () => void;
  open: boolean;
  onOpen: () => void;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = (props) => {
  return (
    <SwipeableDrawer
      disableSwipeToOpen
      keepMounted={false}
      anchor={props.anchor || 'left'}
      open={props.open}
      onOpen={props.onOpen}
      onClose={props.onClose}
      slotProps={{
        paper: {
          sx: {
            height: '100%',
            width: {
              md: '450px',
              lg: '550px',
              xs: '100%'
            }
          }
        }
      }}>
      {props.children}
    </SwipeableDrawer>);
};


export default Drawer;