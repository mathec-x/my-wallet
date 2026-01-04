'use client';

import { SxProps } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

interface DrawerProps {
  onClose: () => void;
  open: boolean;
  onOpen: () => void;
  children: React.ReactNode;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  sx?: SxProps
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
          sx: props.sx
        }
      }}>
      {props.children}
    </SwipeableDrawer>);
};


export default Drawer;