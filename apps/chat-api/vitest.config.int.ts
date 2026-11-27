import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.int-spec.ts'],
    // Rodam no banco chat_test, como os testes de ponta a ponta.
    globalSetup: ['./test/support/global-setup.ts'],
    setupFiles: ['./test/support/test-env.ts'],
    fileParallelism: false,
  },
});
