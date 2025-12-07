import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ['react', 'next'],
  },
};

export default nextConfig;
