'use client';

import { createTheme, type Theme } from '@mui/material/styles';

declare module '@mui/material/Avatar' {
  interface AvatarPropsVariantOverrides {
    default: true;
    primary: true;
  }
}

const globalTheme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
  palette: {
    primary: {
      light: '#ba68c8',
      main: '#9c27b0',
      dark: '#7b1fa2',
    },
    secondary: {
      light: '#1CAFE9',
      main: '#105edbff',
      dark: '#0026ffff'
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  components: {
    MuiAvatar: {
      defaultProps: {
        variant: 'rounded',
      },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.primary.main,
        })
      },
      variants: [
        {
          props: { variant: 'default' },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: 'transparent',
            color: theme.palette.text.primary
          }),
        },
        {
          props: { variant: 'primary' },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: 'transparent',
            color: theme.palette.primary.main
          }),
        },
      ],
    },
    MuiInputBase: {
      styleOverrides: {
        input: ({ theme }: { theme: Theme }) => ({
          // remove yellow bg when autofill inputs
          '&:-webkit-autofill': {
            boxShadow: `0 0 0 50px ${theme.palette.primary.contrastText} inset`,
            WebkitTextFillColor: theme.palette.getContrastText(theme.palette.primary.contrastText)
          },
        }),
      },
    },
  },
});

export default globalTheme;
