import { Link, useLocation, type LinkProps } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the LanguageSwitcher component.
 */
export type LanguageSwitcherProps = Omit<LinkProps, 'to'>;

/**
 * A component that renders a link to switch between languages.
 */
export const LanguageSwitcher = ({ ...props }: LanguageSwitcherProps) => {
  const { pathname } = useLocation();
  const { i18n, t } = useTranslation('wet-boew');

  const altLang = i18n.language === 'fr' ? 'en' : 'fr';
  const linkPath = pathname.replace(i18n.language, altLang);

  return (
    <Link {...props} to={linkPath} reloadDocument>
      <span className="hidden-xs">{t('alt-lang')}</span>
      <abbr title="Français" className="visible-xs h3 mrgn-tp-sm mrgn-bttm-0 text-uppercase">{t('alt-lang-abbr')}</abbr>
    </Link>
  );
};
