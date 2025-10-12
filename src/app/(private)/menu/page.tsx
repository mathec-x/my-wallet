'use client';

import FlexBox from '@/app/components/elements/FlexBox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function LoginPage() {
  return (
    <FlexBox py={1}>
      <Card sx={{ maxWidth: { md: 650, xs: 550 }, width: '100%', position: 'relative' }} variant='outlined'>
        <CardContent>
          Menu Page
        </CardContent>
      </Card>
    </FlexBox>
  );
}
