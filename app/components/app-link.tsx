import { Link, useHref } from '@remix-run/react';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '~/modules/i18n';

/**
 * Props for the AppLink component.
 */
type AppLinkProps = { language?: Language } & ComponentProps<typeof Link>;

/**
 * A component that renders a localized link.
 *
 * This component extends Remix's <Link> component by allowing a language
 * prop to be passed in. If a language is not passed in, the component will
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
export function AppLink({ language, to, ...props }: AppLinkProps) {
  const href = useHref(to);
  const { i18n } = useTranslation();

  const lang = language ?? i18n.language;
  const path = `/${lang}${href}`;

  return (
    <Link {...props} to={path}>
      {props.children}
    </Link>
  );
}
