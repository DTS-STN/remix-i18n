import { Link, useHref, type LinkProps } from '@remix-run/react';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '~/modules/i18n';

/**
 * Props for the AppLink component.
 */
type AppLinkProps = { language?: Language } & ComponentProps<typeof Link>;

/**
 * A component that renders a localized link.
 */
export function AppLink({ language, to, ...props }: AppLinkProps) {
  const href = useHref(to);
  const { i18n } = useTranslation();

  const targetLanguage = language ?? i18n.language;
  const path = `/${targetLanguage}${href}`;

  return (
    <Link {...props} to={path}>
      {props.children}
    </Link>
  );
}
