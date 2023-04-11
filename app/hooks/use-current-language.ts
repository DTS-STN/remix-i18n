import { useLocation } from '@remix-run/react';

import { getLanguage } from '~/modules/i18n';

/**
 * Returns the current language based on the pathname.
 * Returns `undefined` if language could not be detected.
 */
export function useCurrentLanguage() {
  const { pathname } = useLocation();
  return getLanguage(pathname);
}
