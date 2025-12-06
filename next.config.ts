import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['react', 'next'],
  },
};

export default nextConfig;
