import theme from '@/app/theme/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { getCurrentUser } from './actions/user/user.actions';
import MainLayout from './components/layouts/Main/Main.layout';

interface RootLayoutProps {
  children: React.ReactNode,
  drawer: React.ReactNode
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const dynamic = 'force-dynamic'; // all routes needs ssr cookies

// export const viewport: Viewport = {
// height: 'device-height',
// width: 'device-width',
// initialScale: 1,
// maximumScale: 1,
// minimumScale: 1,
// userScalable: false,
// viewportFit: 'cover',
// themeColor: '#9c27b0',
// colorScheme: 'light dark',
// interactiveWidget: 'overlays-content',
// };

export const metadata: Metadata = {
  title: 'My Wallet',
  description: 'A simple wallet application to manage your finances.',
};

export default async function RootLayout(props: RootLayoutProps) {
  const { children, drawer } = props;
  const user = await getCurrentUser();

  return (
    <html lang='pt-BR' className={roboto.variable} suppressHydrationWarning>
      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
      />
      <meta name="application-name" content="Wallet" />
      <meta name="description" content="My wallet" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#9c27b0" />
      <meta name="theme-color" content="#9c27b0" />
      <meta name="msapplication-tap-highlight" content="no" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Wallet" />

      <link rel='apple-touch-startup-image' href='/splashscreen.png' sizes='2048x2732' />
      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/pwa/ios/152.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/pwa/ios/167.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/pwa/ios/180.png" />


      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="mask-icon" href="/logo.svg" color="#9c27b0" />

      <meta name="twitter:card" content="" />
      <meta name="twitter:url" content="https://ecarteira.vercel.app" />
      <meta name="twitter:title" content="Wallet" />
      <meta name="twitter:description" content="My wallet app" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content="Wallet" />
      <meta property="og:description" content="My wallet app" />
      <meta property="og:site_name" content="Wallet" />
      <meta property="og:url" content="https://ecarteira.vercel.app" />

      <body>
        <InitColorSchemeScript attribute="class" defaultMode='system' colorSchemeStorageKey='theme' />
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MainLayout user={user} drawer={drawer}>
              {children}
            </MainLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}