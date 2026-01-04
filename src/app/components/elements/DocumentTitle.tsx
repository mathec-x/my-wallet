'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DocumentTitle: React.FC = () => {
  const [title, setTitle] = useState<string>('Wallet');
  // const [subTitle, setSubtitle] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateTitle = () => {
      if (typeof document !== 'undefined') {
        const docTitle = document.title;
        setTitle(docTitle || 'Wallet');

        // const docDescription = document.querySelector('meta[name="description"]')?.textContent;
        // console.log({ docTitle, docDescription });
        // setSubtitle(docDescription || null);
      }
    };

    updateTitle();
    const observer = new MutationObserver(updateTitle);
    observer.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <Stack justifyContent='center'>
      <Typography variant='body1' component='h1'>
        {title}
      </Typography>
      {/* <Typography variant='caption' color='textDisabled'>
        {subTitle}
      </Typography> */}
    </Stack>
  );
};

export default DocumentTitle;