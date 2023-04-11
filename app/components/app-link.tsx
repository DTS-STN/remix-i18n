import * as React from 'react';

import { Link, Params, Path } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { useCurrentLanguage } from '~/hooks/use-current-language';
import { useI18nPath } from '~/hooks/use-i18n-path';
import { Language } from '~/modules/i18n';
import { cn } from '~/modules/utils';

/**
 * Props for the AppLink component.
 */
export type AppLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  'lang' | 'to'
> & {
  routeId: string;
  hash?: Path['hash'];
  lang?: Language;
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
 * <AppLink to="/about" lang="fr">À propos</AppLink>
 * // will render: <a href="/fr/about">À propos</a>
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

    const pathname = useI18nPath(routeId, language, params);

    return (
      <Link
        className={cn(
          'font-medium text-blue-600 hover:underline dark:text-blue-500',
          className,
        )}
        lang={language}
        ref={ref}
        reloadDocument={lang !== undefined}
        to={{ hash, pathname, search }}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

AppLink.displayName = 'AppLink';
