import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default async function LoadingLoginPage() {
  return (
    <Box position={'relative'} sx={{ width: '100%', minHeight: 550, typography: 'body1' }}>
      <Stack mb={2} spacing={2} alignItems='center' direction='row' justifyContent='center'>
        <Skeleton variant="rectangular" width={150} height={40} />
        <Skeleton variant="rectangular" width={150} height={40} />
      </Stack>
      <Stack spacing={2} alignItems='center' justifyContent='center'>
        <Skeleton variant="rectangular" width='100%' height={56} />
        <Skeleton variant="rectangular" width='100%' height={56} />
        <Skeleton variant="rectangular" width='75%' height={56} />
        <Skeleton variant="rectangular" width={350} height={40} sx={{ mt: 4 }} />
        <Skeleton variant="rectangular" width={250} height={20} sx={{ mt: 4 }} />
        <Skeleton variant="rectangular" width={200} height={10} sx={{ mt: 4 }} />
      </Stack>
    </Box >
  );
}
