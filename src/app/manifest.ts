/* eslint-disable max-lines */
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: 'pt-BR',
    name: 'my wallet',
    short_name: 'wallet',
    description: 'Organize suas finanças pessoais de forma simples e eficiente com o My Walle  t.',
    scope: '/',
    id: '/menu',
    start_url: '/menu',
    background_color: '#FFFFFF',
    theme_color: '#9c27b0',
    display: 'standalone',
    display_override: ['standalone', 'window-controls-overlay'],
    categories: [
      'business',
      'productivity',
      'utilities'
    ],
    screenshots: [
      {
        src: '/pwa/screenshot-1.png',
        sizes: '1290x2796',
        type: 'image/png',
        form_factor: 'narrow'
      },
      {
        src: '/pwa/screenshot-2.png',
        sizes: '1290x2796',
        type: 'image/png',
      },
    ],
    icons: [
      {
        src: '/pwa/windows/Square150x150Logo.scale-200.png',
        sizes: '300x300'
      },
      {
        src: '/pwa/windows/Wide310x150Logo.scale-200.png',
        sizes: '620x300'
      },
      {
        src: '/pwa/windows/LargeTile.scale-200.png',
        sizes: '620x620'
      },
      {
        src: '/pwa/windows/SplashScreen.scale-400.png',
        sizes: '2480x1200'
      },
      {
        src: '/pwa/android/android-launchericon-192-192.png',
        sizes: '192x192',
      },
      {
        src: '/pwa/android/android-launchericon-144-144.png',
        sizes: '144x144',
      },
      {
        src: '/pwa/android/android-launchericon-96-96.png',
        sizes: '96x96',
      },
      {
        src: '/pwa/android/android-launchericon-72-72.png',
        sizes: '72x72',
      },
      {
        src: '/pwa/android/android-launchericon-48-48.png',
        sizes: '48x48',
      },
      {
        src: '/pwa/ios/16.png',
        sizes: '16x16'
      },
      {
        src: '/pwa/ios/20.png',
        sizes: '20x20'
      },
      {
        src: '/pwa/ios/29.png',
        sizes: '29x29'
      },
      {
        src: '/pwa/ios/32.png',
        sizes: '32x32'
      },
      {
        src: '/pwa/ios/40.png',
        sizes: '40x40'
      },
      {
        src: '/pwa/ios/50.png',
        sizes: '50x50'
      },
      {
        src: '/pwa/ios/57.png',
        sizes: '57x57'
      },
      {
        src: '/pwa/ios/58.png',
        sizes: '58x58'
      },
      {
        src: '/pwa/ios/60.png',
        sizes: '60x60'
      },
      {
        src: '/pwa/ios/64.png',
        sizes: '64x64'
      },
      {
        src: '/pwa/ios/72.png',
        sizes: '72x72'
      },
      {
        src: '/pwa/ios/76.png',
        sizes: '76x76'
      },
      {
        src: '/pwa/ios/80.png',
        sizes: '80x80'
      },
      {
        src: '/pwa/ios/87.png',
        sizes: '87x87'
      },
      {
        src: '/pwa/ios/100.png',
        sizes: '100x100'
      },
      {
        src: '/pwa/ios/114.png',
        sizes: '114x114'
      },
      {
        src: '/pwa/ios/120.png',
        sizes: '120x120'
      },
      {
        src: '/pwa/ios/128.png',
        sizes: '128x128'
      },
      {
        src: '/pwa/ios/144.png',
        sizes: '144x144'
      },
      {
        src: '/pwa/ios/152.png',
        sizes: '152x152'
      },
      {
        src: '/pwa/ios/167.png',
        sizes: '167x167'
      },
      {
        src: '/pwa/ios/180.png',
        sizes: '180x180'
      },
      {
        src: '/pwa/ios/192.png',
        sizes: '192x192'
      },
      {
        src: '/pwa/ios/256.png',
        sizes: '256x256',
        purpose: 'maskable'
      },
      {
        src: '/pwa/ios/512.png',
        sizes: '512x512',
        purpose: 'maskable'
      },
      {
        src: '/pwa/ios/1024.png',
        sizes: '1024x1024',
        purpose: 'maskable'
      }
    ]
  };
}