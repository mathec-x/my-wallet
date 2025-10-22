import Header from '@/app/components/layouts/Header/Header.layout';
import theme from '@/app/theme/theme';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { getCurrentUser } from './actions/user/user.actions';
import { AuthProvider } from './providers/auth/AuthProvider';
import PwaProvider from './providers/pwa/PwaProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const dynamic = 'force-dynamic'; // all routes needs ssr cookies

export const metadata: Metadata = {
  title: 'My Wallet',
  description: 'A simple wallet application to manage your finances.',
};

export default async function RootLayout(props: { children: React.ReactNode, drawer: React.ReactNode }) {
  const { children, drawer } = props;
  const user = await getCurrentUser();

  return (
    <html lang='pt-BR' className={roboto.variable}>
      <meta name="application-name" content="Wallet" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Wallet" />
      <meta name="description" content="My wallet" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      {/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}
      <meta name="msapplication-TileColor" content="#9c27b0" />
      <meta name="theme-color" content="#9c27b0" />
      <meta name="msapplication-tap-highlight" content="no" />

      {/* <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" /> */}
      {/* <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" /> */}

      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      {/* <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#9c27b0" /> */}

      <meta name="twitter:card" content="" />
      {/* <meta name="twitter:url" content="https://yourdomain.com" /> */}
      <meta name="twitter:title" content="Wallet" />
      <meta name="twitter:description" content="My wallet app" />
      {/* <meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" /> */}
      {/* <meta name="twitter:creator" content="@DavidWShadow" /> */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Wallet" />
      <meta property="og:description" content="My wallet app" />
      <meta property="og:site_name" content="Wallet" />
      {/* <meta property="og:url" content="https://yourdomain.com" />
      <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" /> */}

      {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}

      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
      />

      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme} defaultMode='system'>
            <CssBaseline />
            <AuthProvider user={user}>
              <PwaProvider>
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
              </PwaProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}