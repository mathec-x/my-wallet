'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ba68c8',
      main: '#9c27b0',
      dark: '#7b1fa2',
    },
    secondary: {
      light: '#42a5f5',
      main: '#1976d2',
      dark: '#1565c0',
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  }
});

export default theme;
