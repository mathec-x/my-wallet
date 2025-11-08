import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface ListItemCollapseProps {
  isOpenOn: ((value?: string | null) => boolean);
  children: React.ReactNode;
  defaultOpen?: boolean;
  openValue?: string | null;
  avatarVariant?: 'circular' | 'rounded' | 'square' | 'default';
  primary?: string | null;
  secondary?: string | null;
  caption?: string | null | false;
  actionLabel?: React.ReactNode;
  hideExpandIcon?: boolean;
  icon?: React.ReactNode;
  disablePadding?: boolean;
  divider?: boolean;
  component?: React.ElementType;
  id?: string;
}

const ListItemCollapse: React.FC<ListItemCollapseProps> = (props) => {
  const [open, setOpen] = useState(props.defaultOpen);

  const handleClick = () => {
    setOpen(props.isOpenOn(props?.openValue) ? !open : false);
  };

  if (!props.primary) {
    return props.children;
  }

  return (
    <ListItem
      id={props.id}
      component={props.component || 'li'}
      sx={{ display: 'block' }}
      disablePadding={props.disablePadding}
      divider={props.divider !== false}>
      <ListItemButton onClick={handleClick}>
        <ListItemAvatar>
          <Avatar variant={props.avatarVariant || 'default'}>
            {props.icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          sx={{ whiteSpace: 'nowrap' }}
          primary={<>
            {props.caption && <Typography variant='caption' color='textDisabled' display='block'>{props.caption}</Typography>}
            {props.primary}
          </>}
          secondary={props.secondary}
        />
        {<Box color='gray' whiteSpace='nowrap' fontSize={12}>{props.actionLabel}</Box>}
        {!props.hideExpandIcon &&
          <Avatar variant='default'>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Avatar>}
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