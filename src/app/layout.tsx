import Header from '@/app/components/layouts/Header/Header';
import theme from '@/app/theme/create';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'My Wallet',
  description: 'A simple wallet application to manage your finances.',
};

export default async function RootLayout(props: { children: React.ReactNode, drawer: React.ReactNode }) {
  const { children, drawer } = props;
  return (
    <html lang='pt-BR' className={roboto.variable}>
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Header />
            <Container
              maxWidth="xl"
              sx={{
                p: 1,
                minHeight: 'calc(100vh - 64px)',
              }}>
              {children}
            </Container>
            {drawer}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}