import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: [
      'src/app',
      'src/shared',
      'src/server/application',
      'src/server/domain',
    ],
  },
};

export default nextConfig;
