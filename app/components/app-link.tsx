import type { LinkProps } from '@remix-run/react';
import { Link } from '@remix-run/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the AppLink component.
 */
export type AppLinkProps = { locale?: 'en' | 'fr' } & LinkProps;

/**
 * A component that renders a localized link.
 *
 * @param {AppLinkProps} props - The props for the AppLink component.
 * @returns {JSX.Element} - A link component with a localized path.
 */
const AppLink: FC<AppLinkProps> = ({ locale, ...props }) => {
  const { i18n } = useTranslation();

  const targetLocale = locale ?? i18n.language;
  const path = `/${targetLocale}${props.to}`;

  return <Link {...props} to={path}>{props.children}</Link>;
};

export default AppLink;
