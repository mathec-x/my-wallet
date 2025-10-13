'use client';

import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    // mode: 'dark',
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
});

theme = createTheme(theme, {
  components: {
    MuiAvatar: {
      defaultProps: {
        variant: 'rounded',
      },
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.main,
        }
      }
    }
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        '&:-webkit-autofill': {
          boxShadow: '0 0 0 1000px #121212 inset',
          WebkitTextFillColor: '#fff',
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
});

export default theme;
