import type { NextConfig } from 'next';
import { getEnv } from './src/app/config/env';

// Valida a configuração ao carregar este arquivo: o processo falha na subida, antes de abrir a porta.
getEnv();

const nextConfig: NextConfig = {
  // O Playwright, no contêiner e2e, abre a web por http://web:3000 (não é localhost).
  allowedDevOrigins: ['web'],
  // O indicador do `next dev` ficava sobre o avatar do Rail (canto inferior esquerdo) e engolia o clique.
  devIndicators: { position: 'bottom-right' },
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
