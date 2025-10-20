import FlexBox from '@/app/components/elements/FlexBox';
import WalletIcon from '@mui/icons-material/Wallet';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function LoginPageLayout(props: { children: React.ReactNode }) {
  return (
    <Stack
      py={2}
      alignItems='center'
      justifyContent='center'
      bgcolor='background.main'
      height='100%'
      width='100%'
      boxSizing='border-box'
    >
      <Card sx={{ maxWidth: { md: 650, xs: 550 }, width: '100%', position: 'relative' }} variant='outlined'>
        <CardContent>
          <FlexBox col p={{ md: 4, xs: 2 }} overflow='hidden'>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'aliceblue' }} variant='circular'>
              <WalletIcon fontSize='large' color='primary' />
            </Avatar>
            <Typography variant="button" fontSize='1.36rem' component="h1" color='primary.light' gutterBottom sx={{ mt: 2 }}>
              My Wallet
            </Typography>
            {props.children}
          </FlexBox>
        </CardContent>
      </Card>
    </Stack>
  );
}