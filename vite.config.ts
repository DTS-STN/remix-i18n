import { vitePlugin as remix } from '@remix-run/dev';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, coverageConfigDefaults } from 'vitest/config';

import { i18nRoutes } from './routes.config';

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === 'test'
      ? react() // see https://github.com/remix-run/remix/issues/9871
      : remix({
          ignoredRouteFiles: ['**/**'],
          routes: (defineRoutes) => {
            return i18nRoutes(defineRoutes, (defineRoute) => {
              //
              // routes with no translated paths
              //
              defineRoute('/', 'routes/index.tsx', { index: true });
              defineRoute('/api/health', 'routes/api/health.ts');

              //
              // routes with translated paths
              //
              defineRoute('/', 'routes/layout.tsx', () => {
                //
                // no layout/children
                //
                defineRoute(
                  { en: '/en/help', fr: '/fr/aide' },
                  'routes/help.tsx',
                );

                //
                // with layout/children
                //
                defineRoute('', 'routes/actors/layout.tsx', () => {
                  defineRoute(
                    { en: '/en/actors', fr: '/fr/acteurs' },
                    'routes/actors/index.tsx',
                    { index: true },
                  );
                  defineRoute(
                    { en: '/en/actors/:id', fr: '/fr/acteurs/:id' },
                    'routes/actors/view-actor.tsx',
                  );
                });
              });
            });
          },
          future: {
            unstable_optimizeDeps: true,
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
      exclude: [
        '**/build/**',
        '**/{postcss,tailwind}.config.*',
        ...coverageConfigDefaults.exclude,
      ],
    },
    environment: 'jsdom',
    exclude: ['**/build/**', ...configDefaults.exclude],
    setupFiles: ['./tests/setup.ts'],
  },
});
