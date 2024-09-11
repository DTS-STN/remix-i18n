import * as React from 'react';

import { Link, useHref } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Language } from '~/modules/i18n';

/**
 * Props for the AppLink component.
 */
export interface AppLinkProps extends React.ComponentProps<typeof Link> {
  language?: Language;
}

/**
 * A component that renders a localized link.
 *
 * This component extends Remix's `Link` component by allowing a `language`
 * prop to be passed in. If a `language` is not passed in, the component will
 * instead use the detected language from i18next.
 *
 * @example
 * // if current locale is en...
 * <AppLink to="/about">About Us</AppLink>
 * // will render: <a href="/en/about">About Us</a>
 *
 * @example
 * // passing in a language...
 * <AppLink to="/about" language="fr">À propos</AppLink>
 * // will render: <a href="/fr/about">À propos</a>
 */
export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ children, language, to, ...props }, ref) => {
    const href = useHref(to);
    const { i18n } = useTranslation();

    const lang = language ?? i18n.language;
    const path = `/${lang}${href}`;

    return (
      <Link {...props} ref={ref} to={path}>
        {children}
      </Link>
    );
  },
);

AppLink.displayName = 'AppLink';
