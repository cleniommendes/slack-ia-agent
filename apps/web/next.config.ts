import type { NextConfig } from 'next';
import { getEnv } from './src/app/config/env';

// Valida a configuração ao carregar este arquivo: o processo falha na subida, antes de abrir a porta.
getEnv();

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
