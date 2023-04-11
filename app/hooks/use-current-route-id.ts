import { useMatches } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { isRouteId, RouteId } from '~/routes';

/**
 * Returns the id of the current route.
 */
export function useCurrentRouteId(): RouteId | undefined {
  const match = useMatches().at(-1);
  invariant(match, 'Expected match to be defined');
  const currentRouteId = match.id.replace(/^{(en|fr)}--/, '');
  return isRouteId(currentRouteId) ? currentRouteId : undefined;
}
