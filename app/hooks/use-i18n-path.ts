import invariant from 'tiny-invariant';

import type { Language } from '~/modules/i18n';
import { findRouteById } from '~/routes';

/**
 * Returns the localized path for a given route id and language.
 * Throws an error if the route or its paths are undefined.
 */
export function useI18nPath(routeId: string, language: Language) {
  const route = findRouteById(routeId);

  invariant(route, `Route not found for id: ${routeId}`);
  invariant(route.paths, `Paths not defined for route: ${routeId}`);

  // prettier-ignore
  return typeof route.paths === 'string'
   ? route.paths
   : route.paths[language];
}
