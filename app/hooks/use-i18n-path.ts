import { generatePath, Params, useRouteLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { Language } from '~/modules/i18n';
import { loader as rootLoader } from '~/root';

/**
 * A filter function that checks if a route object matches the given routeId and language.
 */
function byIdAndLanguage(routeId: string, language: Language) {
  return ({ id }: { id: string }) => id === `${routeId}-${language}`;
}

export function useI18nPath(
  routeId: string,
  language: Language,
  params?: Params,
) {
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root');
  invariant(rootLoaderData, 'Expected rootLoaderData to be defined');

  const route = rootLoaderData.routes.find(byIdAndLanguage(routeId, language));
  invariant(route, 'Expected route to be defined');
  invariant(route.path, 'Expected route.path to be defined');

  return generatePath(route.path, params);
}
