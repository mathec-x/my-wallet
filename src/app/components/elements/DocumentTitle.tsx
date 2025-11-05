'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DocumentTitle: React.FC = () => {
  const [title, setTitle] = useState<string>('Wallet');
  const [subTitle, setSubtitle] = useState<string | null>(null);
  const params = useParams<{ uuid: string }>();

  useEffect(() => {
    if (params.uuid && document) {
      const [docTitle, docSubTitle] = document.title.split(' | ') || [];
      setTitle(docTitle);
      setSubtitle(docSubTitle);
    }
  }, [params]);

  return (
    <Stack justifyContent='center'>
      <Typography variant='body1' component='h1'>
        {title}
      </Typography>
      <Typography variant='caption' color='textDisabled'>
        {subTitle}
      </Typography>
    </Stack>
  );
};

export default DocumentTitle;