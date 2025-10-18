
import List, { type ListOwnProps } from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

export interface ListContainerProps extends ListOwnProps {
  header?: string | React.ReactNode;
}

const ListContainer: React.FC<ListContainerProps> = ({ header, children, sx, ...listProps }) => {
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

export default ListContainer;