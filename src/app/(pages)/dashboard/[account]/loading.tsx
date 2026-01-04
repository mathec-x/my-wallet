import { ListContainerSkeleton, ListItemSkeleton } from '@/app/components/elements';
import Grid from '@mui/material/Grid';

export default async function DashboardPageLoading() {
  return (
    <Grid container spacing={2} alignContent='flex-start' sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <ListContainerSkeleton>
        <ListItemSkeleton id='header-section' lines={1} />
      </ListContainerSkeleton>
      <Grid size={{ xs: 12 }}>
        <ListContainerSkeleton>
          <ListItemSkeleton id='balance-section' lines={3} />
        </ListContainerSkeleton>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainerSkeleton>
          <ListItemSkeleton id='incoming-section' lines={5} />
        </ListContainerSkeleton>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainerSkeleton>
          <ListItemSkeleton id='expense-section' lines={7} />
        </ListContainerSkeleton>
      </Grid>
    </Grid>
  );
}
