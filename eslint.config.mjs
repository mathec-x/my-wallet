import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/server/infra/prisma/generated/**',
    ],
    rules: {
      'camelcase': 'off',
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'semi': ['error', 'always'],
      'max-lines': ['error', { 'max': 150, 'skipBlankLines': true, 'skipComments': true }],
      'max-len': ['error', { 'code': 150, 'ignoreComments': true, 'ignoreTrailingComments': true }],
    },
  }
]);
