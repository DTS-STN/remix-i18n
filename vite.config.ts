import { vitePlugin as remix } from '@remix-run/dev';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, coverageConfigDefaults } from 'vitest/config';

// important, do not use aliased imports (ex: ~/routes)
// here or vite will not be able to resolve it
import { defineI18nRoutes } from './app/routes';

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === 'test'
      ? react() // see https://github.com/remix-run/remix/issues/9871
      : remix({
          ignoredRouteFiles: ['**/**'],
          routes: (defineRoutes) => {
            return defineRoutes((defineRoute) => {
              // register all non-translated routes
              // ie: APIs, healthchecks, etc.
              defineRoute('/', 'routes/index.tsx');

              // register all i18n-translated routes for all supported languages
              defineI18nRoutes(defineRoute);
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
  },
});
