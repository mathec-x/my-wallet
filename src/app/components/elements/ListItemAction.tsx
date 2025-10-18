
import useSweep from '@/app/hooks/useSwip';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Box, styled, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem, { type ListItemOwnProps } from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React, { useCallback } from 'react';

// Background action components
const SwipOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  zIndex: 0,
}));

const ListItemBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
}));

interface ListItemActionProps extends Omit<ListItemOwnProps, 'onTouchStart' | 'onTouchMove' | 'onTouchEnd'> {
  children?: React.ReactNode;
  isLoading?: boolean;
  primary: string;
  secondary?: React.ReactNode | string;
  caption?: string | null;
  icon?: React.ReactNode | string;
  onClick: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  SwipRightLabel?: string | React.ReactNode;
  SwipLeftLabel?: string | React.ReactNode;
}

const ListItemAction: React.FC<ListItemActionProps> = ({
  onClick,
  primary,
  children,
  isLoading,
  secondary,
  caption,
  icon,
  onSwipeLeft,
  onSwipeRight,
  SwipRightLabel,
  SwipLeftLabel,
  ...listItemProps
}) => {
  const { dragOffset, isSwiping, handleMouseDown, handleTouchStart } = useSweep({
    threshould: 100,
    onSwipeLeft,
    onSwipeRight,
  });

  const handleClick = useCallback(() => {
    if (!isSwiping) {
      onClick();
    }
  }, [onClick, isSwiping]);

  return (
    <ListItem
      {...listItemProps}
      sx={{ position: 'relative', overflow: 'hidden' }}
      onDragOver={e => e.preventDefault()}
    >
      {SwipRightLabel && (
        <SwipOverlay justifyContent='flex-start' left={0}>
          {SwipRightLabel}
        </SwipOverlay>
      )}

      {SwipLeftLabel && (
        <SwipOverlay justifyContent='flex-end' right={0}>
          {SwipLeftLabel}
        </SwipOverlay>
      )}

      <ListItemBox
        onMouseDown={(onSwipeRight || onSwipeLeft) && handleMouseDown}
        onTouchStart={(onSwipeRight || onSwipeLeft) && handleTouchStart}
        sx={{
          transform: `translateX(${dragOffset}px)`,
          transition: 'transform 0.1s cubic-bezier(0.65, 0.1, 0.46, 1.07)',
        }}
      >
        <ListItemButton onClick={handleClick} disabled={isLoading}>
          <ListItemAvatar>
            <Avatar>
              {icon || <WalletIcon />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<>
              {caption && <Typography variant='caption' color='textDisabled' display='block'>{caption}</Typography>}
              {primary}
            </>}
            secondary={secondary}
          />
          {isLoading ? (
            <Avatar sx={{ backgroundColor: 'transparent' }}>
              <CircularProgress size={20} />
            </Avatar>
          ) : children}
        </ListItemButton>
      </ListItemBox>
    </ListItem>
  );
};

export default ListItemAction;