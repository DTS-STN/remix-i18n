import * as React from 'react';

import { Link, useParams, useSearchParams } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { useCurrentLanguage } from '~/hooks/use-current-language';
import { useCurrentRouteId } from '~/hooks/use-current-route-id';
import { useI18nPath } from '~/hooks/use-i18n-path';
import { getAltLanguage } from '~/modules/i18n';
import { cn } from '~/modules/utils';

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
  const currentLanguage = useCurrentLanguage();
  invariant(currentLanguage, 'Expected currentLanguage to be defined');

  const currentRouteId = useCurrentRouteId();
  const routeId = currentRouteId.replace(/-(en|fr)$/, '');

  const altLanguage = getAltLanguage(currentLanguage);
  const params = useParams();
  const pathname = useI18nPath(routeId, altLanguage, params);

  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  return (
    <Link
      className={cn(
        'font-medium text-blue-600 hover:underline dark:text-blue-500',
        className,
      )}
      lang={altLanguage}
      reloadDocument={true}
      ref={ref}
      to={{ pathname, search }}
      {...props}
    >
      {children}
    </Link>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
