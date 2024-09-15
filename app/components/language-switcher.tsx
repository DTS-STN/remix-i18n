import * as React from 'react';

import {
  Link,
  useLocation,
  useMatches,
  useParams,
  useSearchParams,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getAltLanguage, getLang } from '~/modules/i18n';
import { cn } from '~/modules/utils';
import { getPathForLanguage, isRouteId, isSupportedLanguage } from '~/routes';

/**
 * Props for the LanguageSwitcher component. Omits the `to` and `reloadDocument`
 * props from the `Link` component since those values are derived from the
 * current route.
 */
export type LanguageSwitcherProps = Omit<
  React.ComponentProps<typeof Link>,
  'to' | 'reloadDocument'
>;

/**
 * Component that can be used to switch from one language to another.
 * (ie: 'en' → 'fr'; 'fr' → 'en')
 */
export const LanguageSwitcher = React.forwardRef<
  HTMLAnchorElement,
  LanguageSwitcherProps
>(({ children, className, ...props }, ref) => {
  const { pathname } = useLocation();
  const lang = getLang(pathname);
  const matches = useMatches();
  const params = useParams();

  invariant(
    isSupportedLanguage(lang),
    'Expected lang to be a supported language',
  );

  const altLanguage = getAltLanguage(lang);

  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const currentRoute = matches[matches.length - 1];
  const routeId = currentRoute.id.replace(/-(en|fr)$/, '');
  invariant(isRouteId(routeId), 'Expected routeId to be a valid routeId');

  const altPathname = getPathForLanguage(routeId, altLanguage, params);

  return (
    <Link
      reloadDocument={true}
      ref={ref}
      to={{ pathname: altPathname, search }}
      className={cn(
        'font-medium text-blue-600 hover:underline dark:text-blue-500',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
