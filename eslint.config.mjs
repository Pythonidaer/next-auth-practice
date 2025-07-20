import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      '.next/',
      'node_modules/',
      'out/',
      'public/',
      '.prettierrc',
      'src/generated/prisma/',
      'prisma/seed.mjs',
      'prisma/update-active-program.mjs',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    rules: {
      indent: ['error', 2], // 2 spaces
      'prettier/prettier': 'off',
      'max-len': ['warn', { code: 100 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      // independent code paths within a function -- might be off by 3
      complexity: ['warn', { max: 10 }],
      'no-unused-vars': 'warn',
      // errors when console.log is left, but allows console.warn
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: 'error',
      curly: ['error', 'all'],
      'no-implicit-globals': 'error',
    },
  },
];

export default config;
