import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import ListContainer from './ListContainer';

function randomWidth(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const ListContainerSkeleton: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <ListContainer header={<Skeleton variant='rectangular' width={150} height={12} />} disablePadding>
      {props.children}
    </ListContainer>);
};

interface ListKeletonProps {
  lines: number;
  id: string;
}

export const ListItemSkeleton: React.FC<ListKeletonProps> = (props) => {
  return Array.from({ length: props.lines }).map((_, index) => (
    <ListItem key={`${props.id}-${index}`}>
      <ListItemAvatar>
        <Skeleton variant='rounded' width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant='rectangular' width={randomWidth(100, 200)} height={14} sx={{ mb: 2 }} />}
        secondary={<Skeleton variant='rectangular' width={randomWidth(200, 500)} height={12} />}
      />
    </ListItem>
  ));
};
