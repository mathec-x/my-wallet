
import List, { type ListOwnProps } from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

export interface ListContainerProps extends ListOwnProps {
  header?: string | React.ReactNode;
  headerAppend?: string | React.ReactNode;
  component?: React.ElementType;
  hide?: boolean;
}

const ListContainer: React.FC<ListContainerProps> = ({ header, children, sx, headerAppend, hide, ...listProps }) => {
  if (hide) return null;

  return (
    <List sx={{ userSelect: 'none', width: '100%', ...sx }}
      subheader={
        header &&
        <ListSubheader sx={{ bgcolor: 'background.paper' }}>
          {header}
          {headerAppend && <Typography variant='caption' sx={{ float: 'right' }}>{headerAppend}</Typography>}
        </ListSubheader>
      } {...listProps}>
      {children}
    </List >
  );
};

export default ListContainer;