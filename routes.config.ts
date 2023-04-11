import {
  createRouteId,
  DefineRouteOptions,
  DefineRoutesFunction,
} from '@remix-run/dev/dist/config/routes';

/**
 * All languages supported by the i18n routing.
 */
const languages = ['en', 'fr'] as const;

/**
 * Represents a supported language type, derived from `supportedLanguages`.
 */
type Language = (typeof languages)[number];

/**
 * Represents the path configuration for routes. It can be either a record
 * mapping supported languages to their respective paths, or a single path
 * applicable for all languages.
 */
type Paths = Record<Language, string> | string;

/**
 * Represents options for defining a route.
 * Imported from Remix's configuration types.
 */
type Options = DefineRouteOptions;

/**
 * Represents either route options or a function to define child routes. If a
 * function is provided, it will be used to define child routes; otherwise,
 * options are applied.
 */
type OptionsOrChildrenFunction = Options | ChildrenFunction;

/**
 * Represents a callback function to define child routes. This function is used
 * when the route options are provided as a function rather than an object.
 */
type ChildrenFunction = () => void;

/**
 * Represents a function to define a route.
 */
type DefineRouteFunction = (
  paths: Paths,
  file: string,
  optionsOrChildren?: OptionsOrChildrenFunction,
  children?: ChildrenFunction,
) => void;

export function i18nRoutes(
  defineRoutes: DefineRoutesFunction,
  callback: (defineRoute: DefineRouteFunction) => void,
) {
  return defineRoutes((defineRoute) => {
    return callback((paths, file, optionsOrChildren, children) => {
      if (typeof paths === 'string') {
        // route is a unilingual route
        return defineRoute(paths, file, optionsOrChildren, children);
      }

      // the routeId is derived from the english pathname
      // or filename if no path is provided (ie: layout routes)
      const routeId = stripLanguagePrefix(createRouteId(paths['en'] ?? file));

      Object.entries(paths).forEach(([language, path]) => {
        // route is a multilingual route
        const localizedRouteId = `${routeId}-${language}`;

        defineRoute(
          path,
          file,
          getOptions(localizedRouteId, optionsOrChildren),
          getChildren(optionsOrChildren, children),
        );
      });
    });
  });
}

function getChildren(
  optionsOrChildren?: OptionsOrChildrenFunction,
  children?: ChildrenFunction,
) {
  return typeof optionsOrChildren === 'function' ? optionsOrChildren : children;
}

function getOptions(routeId?: string, options?: OptionsOrChildrenFunction) {
  const baseOptions = { ...(typeof options === 'object' && options) };
  return { ...baseOptions, id: routeId };
}

function stripLanguagePrefix(str: string) {
  const langPattern = languages.join('|');
  return str.replace(new RegExp(`^/(${langPattern})`, 'i'), '');
}
