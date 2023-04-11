import { useLocation } from '@remix-run/react';

import { getLanguage } from '~/modules/i18n';
import { Language } from '~/routes';

/**
 * Returns the current language based on the pathname.
 * Returns `undefined` if language could not be detected.
 */
export function useCurrentLanguage(): Language | undefined {
  return getLanguage(useLocation().pathname);
}
