/**
 * This file defines all the routes and related helper functions necessary for route processing.
 *
 * Note: Since this module is loaded by Vite during build time, avoid importing
 * any application modules using aliased paths (e.g., ~/app/). Aliased paths are
 * not resolved at this early stage in the build lifecycle, which will cause
 * build errors.
 */

import { DefineRoutesFunction } from '@remix-run/dev/dist/config/routes';

/**
 * All languages supported by the i18n routing.
 */
export const languages = ['en', 'fr'] as const;
export type Language = (typeof languages)[number];

/**
 * Represents the base properties shared by all route types.
 */
type BaseRoute = { file: string; id: string };
type Paths = Record<Language, string> | string;

/**
 * Represents a layout route (with children)
 */
type LayoutRoute = BaseRoute & {
  children: Route[];
  index?: false;
  paths?: never;
};

/**
 * Represents a page route (with paths)
 */
type PageRoute = BaseRoute & {
  paths: Paths;
  index?: boolean;
  children?: never;
};

/**
 * Represents a route definition for the application.
 */
type Route = LayoutRoute | PageRoute;

/**
 * Utility to preserve literal types through `as const`.
 */
function asRoutes<T extends Route[]>(routes: T) {
  return routes;
}

/**
 * Recursively extracts the `id` values from a route with an optional filter.
 */
type ExtractIds<T, Filter = unknown> = T extends {
  id: infer Id;
  children?: readonly (infer Child)[];
}
  ? (T extends Filter ? Id : never) | ExtractIds<Child, Filter>
  : never;

export type LayoutRouteId = ExtractIds<(typeof routes)[number], LayoutRoute>;
export type PageRouteId = ExtractIds<(typeof routes)[number], PageRoute>;
export type RouteId = ExtractIds<(typeof routes)[number]>;

export function isRouteId(value?: unknown): value is RouteId {
  return findRouteById(value as RouteId) !== undefined;
}

export function isPageRouteId(value?: unknown): value is PageRouteId {
  return isRouteId(value) && 'paths' in (findRouteById(value) ?? {});
}

export function isLayoutRouteId(value?: unknown): value is LayoutRouteId {
  return isRouteId(value) && 'children' in (findRouteById(value) ?? {});
}

/**
 * Defines i18n routes for the application.
 */
export function i18nRoutes(defineRoutes: DefineRoutesFunction) {
  return defineRoutes((defineRoute) => {
    function defineI18nRoute(route: Route) {
      const { id, paths, file, index, children } = route;

      const defineChildren = children
        ? () => children.forEach(defineI18nRoute)
        : undefined;

      if (typeof paths === 'string' || typeof paths === 'undefined') {
        return defineRoute(paths, file, { id, index }, defineChildren);
      }

      Object.entries(paths).forEach(([language, path]) => {
        const localizedId = `{${language}}--${id}`;
        defineRoute(path, file, { id: localizedId, index }, defineChildren);
      });
    }

    routes.forEach(defineI18nRoute);
  });
}

/**
 * Recursively searches for a route by its id.
 * Returns `undefined` if route cannot be found.
 */
export function findRouteById(id: string) {
  function find(id: string, routes?: readonly Route[]): Route | undefined {
    for (const route of routes ?? []) {
      const matchedRoute = route.id === id ? route : find(id, route.children);
      if (matchedRoute) return matchedRoute;
    }
  }

  return find(id, routes);
}

/**
 * The application routes.
 */
export const routes = asRoutes([
  {
    id: '/',
    paths: '/',
    file: 'routes/index.tsx',
  },
  {
    id: '/api/health',
    paths: '/api/health',
    file: 'routes/api/health.ts',
  },
  {
    id: 'developers-layout',
    file: 'routes/developers/layout.tsx',
    children: [
      {
        id: '/developers',
        paths: { en: '/en/developers', fr: '/fr/developpeurs' },
        file: 'routes/developers/index.tsx',
        index: true,
      },
      {
        id: '/developers/:id',
        paths: { en: '/en/developers/:id', fr: '/fr/developpeurs/:id' },
        file: 'routes/developers/view-developer.tsx',
      },
    ],
  },
] as const);
