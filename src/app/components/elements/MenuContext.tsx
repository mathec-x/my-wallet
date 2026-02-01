'use client';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const StyledListHeader = styled(ListSubheader)({
  backgroundImage: 'var(--Paper-overlay)',
});


export interface MenuContextProps {
  header?: React.ReactNode;
  suffix?: React.ReactNode;
  options: { label: React.ReactNode, icon: React.ElementType, action: () => void, caption?: React.ReactNode }[]
  children: React.ReactNode;
}

export const MenuContext: React.FC<MenuContextProps> = ({ children, options, header, suffix }) => {
  const [contextMenu, setOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setOpened(true);
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement>) => {
    event.preventDefault();
    setAnchorEl(null);
    setOpened(false);
  };

  return (
    <div onContextMenu={handleOpen}>
      {children}
      <Menu
        anchorEl={anchorEl}
        open={contextMenu}
        onClose={handleClose}
        onContextMenu={handleClose}
      >
        <MenuList sx={{ minWidth: 240, maxWidth: '100%' }}>
          <StyledListHeader>{header}</StyledListHeader>
          {options.map((item, index) => (
            <MenuItem key={`menu-context-${index}`} onClick={(event) => {
              event.preventDefault();
              item.action();
              handleClose(event);
            }}>

              {item.icon && (
                <ListItemIcon>
                  <item.icon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText secondary={item.caption}>{item.label}</ListItemText>
              {suffix && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {suffix}
                </Typography>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default MenuContext;