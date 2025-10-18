'use client';

import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import { forwardRef, useLayoutEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SlidePanel = forwardRef(function SlidePanel({ in: enabled, ...props }: any, ref) {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (enabled) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [enabled]);

  return (
    <Fade in={enabled}>
      <Slide {...props} in={!!show}>
        <div ref={ref} {...props} style={{
          position: 'absolute',
          width: '100%',
        }} />
      </Slide>
    </Fade>
  );
});

export default SlidePanel;
