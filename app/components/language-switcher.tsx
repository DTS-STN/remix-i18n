import * as React from 'react';

import { Link, useMatches, useParams, useSearchParams } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getAltLanguage, isLanguage } from '~/modules/i18n';

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
>(({ children, ...props }, ref) => {
  const { lang } = useParams();
  invariant(isLanguage(lang));

  const altLanguage = getAltLanguage(lang);
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const pathname = currentRoute.pathname.replace(lang, altLanguage);

  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  return (
    <Link reloadDocument={true} ref={ref} to={{ pathname, search }} {...props}>
      {children}
    </Link>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
