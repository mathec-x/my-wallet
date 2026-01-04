import { ListItemSkeleton } from '@/app/components/elements';
import ListContainer from '@/app/components/elements/ListContainer';
import { Skeleton } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';

export default async function MenuPageLoading() {
  return (
    <Stack flexDirection='column' alignItems='flex-start' justifyContent='space-between' height='100%'>
      <ListContainer header={<Skeleton variant='rectangular' width={150} height={16} />} disablePadding>
        <ListItemSkeleton id='top-fragment' lines={5} />
      </ListContainer>
      <ListContainer header={<Skeleton variant='rectangular' width={150} height={16} />} disablePadding>
        <ListItemSkeleton id='bottom-fragment' lines={2} />
        <ListItem>
          <Skeleton
            variant="rectangular"
            width='100%'
            height={48}
          />
        </ListItem>
      </ListContainer>
    </Stack>
  );
}
