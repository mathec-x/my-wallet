import MenuLayout from '@/app/components/layouts/Menu/Menu.layout';
import { NextAsyncPageProps } from '@/server/interfaces/next';
import Grid from '@mui/material/Grid';

export default async function MenuPage(props: NextAsyncPageProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12, sm: 4 }}>
        <MenuLayout />
      </Grid>
    </Grid >
  );
}
