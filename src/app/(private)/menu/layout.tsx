import Grid from '@mui/material/Grid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Your wallet menu page',
};

export default function MenuPageLayout(props: { children: React.ReactNode }) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12, sm: 4 }}>
        {props.children}
      </Grid>
    </Grid >
  );
}