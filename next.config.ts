import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ['react', 'next'],
    viewTransition: true
  },
};

export default nextConfig;
