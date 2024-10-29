import * as React from 'react';

import type { Params, Path } from '@remix-run/react';
import { generatePath, Link } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { useCurrentLanguage } from '~/hooks/use-current-language';
import { useI18nPath } from '~/hooks/use-i18n-path';
import type { Language } from '~/modules/i18n';
import { cn } from '~/modules/utils';
import type { PageRouteId } from '~/routes';

/**
 * The Remix <Link> props.
 */
type LinkProps = React.ComponentProps<typeof Link>;

/**
 * Props for the AppLink component.
 */
export type AppLinkProps = Omit<LinkProps, 'to'> & {
  routeId: PageRouteId;
  hash?: Path['hash'];
  lang?: Language;
  params?: Params;
  search?: Path['search'];
};

/**
 * A component that renders a localized link by extending Remix's `Link`.
 * It uses `routeId` to determine the correct path for the specified language.
 * If `lang` is not provided, the language is detected from the current location.
 *
 * Examples:
 * ```typescript
 * <AppLink to="/about">About Us</AppLink> // renders: <a href="/en/about">About Us</a>
 * <AppLink to="/about" lang="fr">À propos</AppLink> // renders: <a href="/fr/about">À propos</a>
 * ```
 */
export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  (
    { children, className, hash, lang, params, routeId, search, ...props },
    ref,
  ) => {
    const currentLanguage = useCurrentLanguage();
    const language = lang ?? currentLanguage;

    invariant(language, 'Expected targetLang to be defined');

    const pathname = generatePath(useI18nPath(routeId, language), params);
    const reloadDocument = props.reloadDocument ?? lang !== undefined;

    return (
      <Link
        ref={ref}
        to={{ hash, pathname, search }}
        lang={language}
        reloadDocument={reloadDocument}
        className={cn(
          'font-medium text-blue-600 hover:underline dark:text-blue-500',
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

AppLink.displayName = 'AppLink';
