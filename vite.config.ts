import { vitePlugin as remix } from '@remix-run/dev';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === 'test'
      ? react()
      : remix({
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
          },
        }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
  test: {
    coverage: {
      exclude: ['**/build/**', ...coverageConfigDefaults.exclude],
    },
    environment: 'jsdom',
    exclude: ['**/build/**', ...configDefaults.exclude],
  },
});
