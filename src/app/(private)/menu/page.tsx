'use client';

import MenuLayout from '@/app/components/layouts/Menu/Menu.layout';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();

  const handleClose = (path?: string) => {
    router.replace(path || '/dashboard');
  };

  return (
    <Grid container spacing={2} sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12, sm: 4 }}>
        <MenuLayout onClose={handleClose} />
      </Grid>
    </Grid >
  );
}
