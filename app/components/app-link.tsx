import * as React from 'react';

import { Link, Params, Path } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';
import { cn } from '~/modules/utils';
import {
  getPathForLanguage,
  isSupportedLanguage,
  RouteId,
  SupportedLanguage,
} from '~/routes';

/**
 * Props for the AppLink component.
 */
export type AppLinkProps = Omit<React.ComponentProps<typeof Link>, 'to'> & {
  routeId: RouteId;
  hash?: Path['hash'];
  language?: SupportedLanguage;
  params?: Params;
  search?: Path['search'];
};

/**
 * A component that renders a localized link.
 *
 * This component extends Remix's `Link` component by adding support for
 * localization. It accepts a `language` prop to specify the language for the
 * link path. If a `language` is not provided, the component uses the detected
 * language from `i18next`. The component also supports route path lookups using
 * a `routeId`.
 *
 * It uses the `routeId` to determine the correct path for the given language by
 * calling `getPathForLanguage()` from the `routes` module. The `pathname` is
 * determined based on the provided `routeId` and `language`, while the `search`
 * and `hash` props, if provided, are used as-is.
 *
 * Examples:
 *
 * ``` typescript
 * // if current locale is en...
 * <AppLink to="/about">About Us</AppLink>
 * // will render: <a href="/en/about">About Us</a>
 *
 * // passing in a language...
 * <AppLink to="/about" language="fr">À propos</AppLink>
 * // will render: <a href="/fr/about">À propos</a>
 * ```
 */
export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  (
    { children, className, hash, language, params, routeId, search, ...props },
    ref,
  ) => {
    const { i18n } = useTranslation();

    const supportedLanguage = language ?? i18n.language;

    invariant(
      isSupportedLanguage(supportedLanguage),
      'Expected lang to be a supported language',
    );

    const pathname = getPathForLanguage(routeId, supportedLanguage, params);

    return (
      <Link
        ref={ref}
        to={{ hash, pathname, search }}
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
