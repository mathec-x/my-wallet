#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
console.clear();
const privateRoutes = readdirSync('src/app/(private)', {
  recursive: true,
  withFileTypes: true
})
  .filter((file) => file.isFile())
  .map((file) => file
    .parentPath
    .replace('src/app/(private)', '')
    .replace(/\[([^\]]+)\]/g, ':$1')
  ).sort((a, b) => a.localeCompare(b));

if (!existsSync('./src/server/infra/routes')) {
  console.log('Creating directory: ./src/server/infra/routes');
  mkdirSync('./src/server/infra/routes', { recursive: true });
}

writeFileSync(
  './src/server/infra/routes/privateRoutes.ts',
  `export const privateRoutes = ${JSON.stringify(privateRoutes, null, 2).replace(/"/g, "'")} as string[];`
);
console.log('Generate private routes setup completed:', privateRoutes);