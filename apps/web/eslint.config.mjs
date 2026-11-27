import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Só o módulo de configuração lê o ambiente.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/app/config/**'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            'Leia a configuração por getEnv(), de src/app/config/env.ts.',
        },
      ],
    },
  },
  // Só os services chamam a API do chat: nenhum componente nem Server Action usa `fetch` direto.
  {
    files: ['src/app/**/*.{ts,tsx}'],
    ignores: ['src/app/services/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Chame a API do chat por um service de src/app/services/.',
        },
      ],
    },
  },
  // O `use` das fixtures do Playwright não é um hook do React.
  {
    files: ['e2e/**/*.ts'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'playwright-report/**',
    'test-results/**',
    '.playwright-cli/**',
  ]),
]);

export default eslintConfig;
