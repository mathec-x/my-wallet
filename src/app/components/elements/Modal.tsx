import useModalHandler from '@/app/hooks/useModalHandler';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { forwardRef } from 'react';

export interface FullScreenModalHandle {
  open: (value?: string) => void;
  close: () => void;
  value: string | undefined;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FullScreenModalProps {
  children: React.ReactNode;
  name: string
  title?: React.ReactNode | string
  description?: React.ReactNode | string
  actions?: React.ReactNode
}

const FullScreenModal = (props: FullScreenModalProps) => {
  const fullScreen = useMediaQuery(theme => theme.breakpoints.down('md'));
  const { isOpen, close } = useModalHandler(props.name);

  return (
    <Dialog
      fullScreen={fullScreen}
      aria-hidden={!isOpen}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      keepMounted={false}
      open={!!isOpen}
      onClose={close}
      slots={fullScreen ? { transition: Transition } : undefined}
      slotProps={{
        paper: !fullScreen && {
          sx: {
            userSelect: 'none',
            width: '550px',
            padding: 2,
            maxWidth: '90%',
            borderRadius: '8px',
          }
        }
      }}>
      <DialogTitle id="dialog-title">
        {props.title}
        <Button sx={{ float: 'right' }} onClick={close}>Fechar</Button>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='dialog-description' sx={{ mb: 2 }}>
          {props.description}
        </DialogContentText>
        {props.children}
      </DialogContent>
      {props.actions &&
        <DialogActions>
          {props.actions}
        </DialogActions>}
    </Dialog>
  );
};

export default FullScreenModal;
