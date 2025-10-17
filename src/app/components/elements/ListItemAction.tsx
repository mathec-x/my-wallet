import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem, { type ListItemProps } from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

interface ListItemActionProps extends ListItemProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  primary: string;
  secondary?: string;
  caption?: string | null;
  onClick: () => void;
}

const ListItemAction: React.FC<ListItemActionProps> = ({ onClick, primary, children, isLoading, secondary, caption, ...listItemProps }) => {
  return (
    <ListItem
      {...listItemProps}
      secondaryAction={isLoading ? <CircularProgress size={15} /> : children}>
      <ListItemButton onClick={onClick} disabled={isLoading}>
        <ListItemAvatar>
          <Avatar>
            <WalletIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<>
            {caption && <Typography variant='caption' color='textDisabled' display='block'>{caption}</Typography>}
            {primary}
          </>}
          secondary={secondary} />
      </ListItemButton>
    </ListItem >
  );
};

export default ListItemAction;