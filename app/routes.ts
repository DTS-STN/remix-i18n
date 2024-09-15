import { DefineRouteFunction } from '@remix-run/dev/dist/config/routes';
import { Params } from '@remix-run/react';
import invariant from 'tiny-invariant';

/**
 * An array of supported language codes.
 *
 * This constant holds the valid language codes for the routes. It is
 * defined as a readonly tuple using `as const` to ensure that the array is
 * immutable and its values are treated as literal types.
 */
export const supportedLanguages = ['en', 'fr'] as const;

/**
 * A type representing a supported language code.
 *
 * This type alias extracts the literal values from the `supportedLanguages`
 * array, allowing only the values 'en' or 'fr' as valid language codes. It
 * ensures type safety by constraining values to the predefined literals.
 */
export type SupportedLanguage = (typeof supportedLanguages)[number];

/**
 * Type guard function to check if a given value is a supported language.
 *
 * This function determines whether the provided `value` is a valid `SupportedLanguage`.
 * Supported languages are `'en'` and `'fr'`. If the value is one of these, it returns `true`.
 * Otherwise, it returns `false`.
 */
export function isSupportedLanguage(
  value?: string,
): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

/**
 * Represents a mapping of language codes to their corresponding path strings.
 *
 * This type dynamically creates an object structure where each key is a
 * language code (from the `Language` union type) and the value is a string
 * representing the path for that language.
 */
export type I18nPaths = {
  [key in SupportedLanguage]: string;
};

/**
 * Represents the base structure of a Route.
 */
export type BaseRoute = {
  id: string;
  file: string;
};

/**
 * Represents an index route, which typically serves as the default or main
 * entry point within a set of nested routes. An index route is often used to
 * render content when no specific child route is requested.
 *
 * - The `index` property is always set to `true` to indicate that this route is an index.
 * - The `paths` property contains localized paths for this route.
 * - Index routes do not have child routes, so the `children` property is
 *   explicitly set to `never`.
 */
export type IndexRoute = BaseRoute & {
  index: true;
  paths: I18nPaths;
  children?: never;
};

/**
 * Represents a layout route that serves as a container for child routes within
 * the application. Layout routes do not have their own paths but provide a
 * shared layout for nested routes.
 *
 * - The `index` property is set to `false` or omitted, indicating this is not an index route.
 * - The `paths` property is omitted for layout routes, as they do not have standalone paths.
 * - The `children` property is a required array of nested routes, defining the nested routes
 *   that can be rendered within this layout.
 */
export type LayoutRoute = BaseRoute & {
  index?: false;
  children: Routes;
  paths?: never;
};

/**
 * Represents a route that corresponds to a specific page within the
 * application. Unlike an index route, a page route has its own unique path and
 * does not act as a default entry point.
 *
 * - The `index` property is set to `false` or omitted, indicating this is not an index route.
 * - The `paths` property contains the localized paths for this page.
 * - Page routes do not have child routes, so the `children` property is
 *   explicitly set to `never`.
 */
export type PageRoute = BaseRoute & {
  index?: false;
  paths: I18nPaths;
  children?: Routes;
};

/**
 * Represents a route definition.
 */
export type Route = IndexRoute | LayoutRoute | PageRoute;

/**
 * Represents an array of route definitions.
 */
export type Routes = Route[];

/**
 * Recursively extracts the `id` values from a given route type and its nested children.
 *
 * This utility type checks if the given route type `T` has an `id` property and
 * optionally a `children` array. If so, it extracts the `id` and recursively
 * extracts IDs from the `children`.
 */
type ExtractRouteIds<T> = T extends {
  id: infer U;
  children?: readonly (infer V)[];
}
  ? U | ExtractRouteIds<V>
  : never;

/**
 * Represents a route identifier extracted from the `routes` array.
 *
 * This type alias defines `RouteId` as a union of all possible `id` values from
 * the `routes` array. It ensures that the `id` can only be one of the
 * predefined literals specified in the `routes` data.
 */
export type RouteId = ExtractRouteIds<(typeof routes)[number]>;

/**
 * Finds a route by its ID, including nested routes within `children`.
 *
 * This function recursively searches through the module's `routes` array and
 * its nested `children` arrays to locate a route with the specified ID.
 */
export function getRoute(routeId: RouteId) {
  function find(routes: Routes) {
    for (const route of routes) {
      if (route.id === routeId) return route;
      if (route.children) return find(route.children);
    }
  }

  return find(routes)!;
}

/**
 * Retrieves a route from the `routes` array based on the specified route identifier.
 *
 * This function searches through the `routes` array to find a route whose `id`
 * matches the provided `routeId`. The function assumes that `routeId` is always
 * valid and exists in the `routes` array, hence it uses a non-null assertion to
 * return a `Route` object without handling the possibility of `undefined`.
 */
export function getPathForLanguage(
  routeId: RouteId,
  language: SupportedLanguage,
  params?: Params,
) {
  const route = getRoute(routeId);

  invariant(
    isIndexRoute(route) || isPageRoute(route),
    'Expected routeId to be an index route or a page route',
  );

  // replace all :var params with the values from params object
  return route.paths[language].replace(
    /:([a-zA-Z]+)/g,
    (_, key) => params?.[key] ?? ':$1',
  );
}

/**
 * Creates a curried function that processes a route and defines localized
 * routes for each supported language.
 *
 * This function takes a `DefineRouteFunction` function and returns a new
 * function that handles the route based on whether it is an index route, a
 * layout route, or a page route.
 *
 * For each supported language, it calls `defineRoute` with the appropriate
 * parameters.
 */
export function getDefineI18nRoute(defineRoute: DefineRouteFunction) {
  return function (route: Route, language?: SupportedLanguage) {
    const languages = language ? [language] : [...supportedLanguages];

    languages.forEach((language) => {
      if (isIndexRoute(route)) {
        defineRoute(route.paths[language], route.file, {
          id: `${route.id}-${language}`,
          index: true,
        });
      }

      if (isLayoutRoute(route) || isPageRoute(route)) {
        const id = `${route.id}-${language}`;
        const path = isPageRoute(route) ? route.paths[language] : '';

        const defineRouteChildren = () => {
          route.children?.forEach((childRoute) => {
            // child routes must be recursively processed
            getDefineI18nRoute(defineRoute)(childRoute, language);
          });
        };

        defineRoute(path, route.file, { id }, defineRouteChildren);
      }
    });
  };
}

/**
 * Register all the i18n routes.
 */
export function defineI18nRoutes(defineRoute: DefineRouteFunction) {
  const defineI18nRoute = getDefineI18nRoute(defineRoute);
  routes.forEach((route) => defineI18nRoute(route));
}

/**
 * Type guard to determine if a given route is an `IndexRoute`.
 */
function isIndexRoute(route: Route): route is IndexRoute {
  return route.index === true;
}

/**
 * Type guard to determine if a given route is a `LayoutRoute`.
 */
function isLayoutRoute(route: Route): route is LayoutRoute {
  return route.paths === undefined;
}

/**
 * Type guard to determine if a given route is a `PageRoute`.
 */
function isPageRoute(route: Route): route is PageRoute {
  return route.index !== true && route.paths !== undefined;
}

/**
 * Type guard to determine if a given string is a `RouteId`.
 */
export function isRouteId(routeId: string): routeId is RouteId {
  return getRoute(routeId as RouteId) !== undefined;
}

///
/// Routes...
///

export const routes = [
  {
    id: 'main-layout',
    file: 'routes/layout.tsx',
    children: [
      {
        id: 'actors-layout',
        file: 'routes/actors/layout.tsx',
        children: [
          {
            id: '/actors',
            file: 'routes/actors/index.tsx',
            index: true,
            paths: {
              en: '/en/actors',
              fr: '/fr/acteurs',
            },
          },
          {
            id: '/actors/:id',
            file: 'routes/actors/view-actor.tsx',
            paths: {
              en: '/en/actors/:id',
              fr: '/fr/acteurs/:id',
            },
          },
        ],
      },
    ],
  },
] as const satisfies Routes;
