import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'my wallet',
    short_name: 'wallet',
    scope: '/',
    id: '/menu',
    start_url: '/menu',
    background_color: '#fff',
    theme_color: '#9c27b0',
    display: 'standalone',
    display_override: ['standalone', 'window-controls-overlay'],
    icons: [
      {
        src: '/pwa/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}