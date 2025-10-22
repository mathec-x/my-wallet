import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';

interface ListItemCollapseProps {
  isOpenOn: ((value?: string | null) => boolean);
  children: React.ReactNode;
  openValue?: string | null;
  primary?: string | null;
  secondary?: string | null;
  icon?: React.ReactNode;
  disablePadding?: boolean;
}

const ListItemCollapse: React.FC<ListItemCollapseProps> = (props) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(props.isOpenOn(props?.openValue) ? !open : false);
  };

  if (!props.primary) {
    return props.children;
  }

  return (
    <ListItem sx={{ display: 'block' }} disablePadding={props.disablePadding} divider>
      <ListItemButton onClick={handleClick}>
        <ListItemAvatar>
          <Avatar variant='default'>
            {props.icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.primary} secondary={props.secondary} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div">
          {props.children}
        </List>
      </Collapse>
    </ListItem>
  );
};

export default ListItemCollapse;