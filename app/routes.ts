import { DefineRoutesFunction } from '@remix-run/dev/dist/config/routes';

/**
 * All languages supported by the i18n routing.
 */
export const languages = ['en', 'fr'] as const;

/**
 * Represents a supported language type, derived from `languages`.
 */
export type Language = (typeof languages)[number];

/**
 * Represents the path configuration for routes. It can be either a record
 * mapping supported languages to their respective paths, or a single path
 * applicable for all languages.
 */
type Paths = Record<Language, string> | string;

/**
 * Represents the base properties shared by all route types.
 */
type BaseRoute = {
  file: string;
  id: string;
};

/**
 * Represents a layout route, which is not routable via a path and contains child routes.
 */
type LayoutRoute = BaseRoute & {
  children: Route[];
  index?: undefined;
  paths?: undefined;
};

/**
 * Represents a page route, which renders a specific view or component.
 */
type PageRoute = BaseRoute & {
  index?: boolean;
  paths: Paths;
  children?: undefined;
};

/**
 * Represents a route definition for the application.
 */
type Route = LayoutRoute | PageRoute;

/**
 * A utility function to enforce that the given routes array conforms to the `Route[]` type
 * while preserving literal types through `as const`.
 *
 * This function ensures that TypeScript correctly infers the type of the `routes` array,
 * including any nested routes, and maintains the immutability of the array elements.
 */
function defineRoutes<T extends Route[]>(routes: T) {
  return routes;
}

/**
 * Recursively extracts the `id` values from a given route type and its nested children.
 *
 * This utility type checks if the given route type `T` has an `id` property and
 * optionally a `children` array. If so, it extracts the `id` and recursively
 * extracts IDs from the `children`.
 */
type ExtractIdsRecursively<T> = T extends {
  id: infer Id;
  children?: readonly (infer Child)[];
}
  ? Id | ExtractIdsRecursively<Child>
  : never;

/**
 * Represents all the available route ids.
 */
export type RouteId = ExtractIdsRecursively<(typeof routes)[number]>;

/**
 * Defines i18n routes for the application. It iterates through over the
 * `routes` array and calls Remix's `defineRoute()` function to register each
 * route with the framework.
 */
export function i18nRoutes(defineRoutes: DefineRoutesFunction) {
  return defineRoutes((defineRoute) => {
    function defineI18nRoute(route: Route) {
      const { id, paths, file, index, children } = route;

      const defineChildren = children
        ? () => children.forEach(defineI18nRoute)
        : undefined;

      if (!paths || typeof paths === 'string') {
        return defineRoute(paths, file, { id, index }, defineChildren);
      }

      Object.entries(paths).forEach(([language, path]) => {
        const localizedId = `${id}-${language}`;
        defineRoute(path, file, { id: localizedId, index }, defineChildren);
      });
    }

    routes.forEach(defineI18nRoute);
  });
}

/**
 * Recursively searches for a route by its ID within the `routes` array.
 */
export function findRouteById(id: string) {
  function find<T extends readonly Route[]>(
    id: string,
    routes?: T,
  ): Route | undefined {
    for (const route of routes ?? []) {
      const match = route.id === id ? route : find(id, route.children);

      if (match) {
        return match;
      }
    }
  }

  return find(id, routes);
}

/**
 * The application routes.
 */
export const routes = defineRoutes([
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
    id: 'root-layout',
    file: 'routes/layout.tsx',
    children: [
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
    ],
  },
] as const);
