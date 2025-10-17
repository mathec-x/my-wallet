import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'my wallet',
    short_name: 'wallet',
    start_url: '/menu',
    background_color: '#9c27b0',
    theme_color: '#9c27b0',
    display: 'standalone',
    icons: [
      {
        src: '/pwa/android-launchericon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa/android-launchericon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}