
import List, { type ListProps } from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

export interface ListContainerProps extends ListProps {
  header?: string
}

export const ListContainer: React.FC<ListContainerProps> = ({ header, children, sx, ...listProps }) => {
  return (
    <List sx={{ userSelect: 'none', width: '100%', ...sx }}
      subheader={
        header && <ListSubheader sx={{ bgcolor: 'background.paper' }}>
          {header}
        </ListSubheader>
      } {...listProps}>
      {children}
    </List >
  );
};