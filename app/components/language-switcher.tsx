import type { LinkProps } from '@remix-run/react';
import { Link, useLocation } from '@remix-run/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the LanguageSwitcher component.
 */
export type LanguageSwitcherProps = Omit<LinkProps, 'to'>;

/**
 * A component that renders a link to switch between languages.
 *
 * @param {LanguageSwitcherProps} props - The props for the LanguageSwitcher component.
 * @returns {JSX.Element} - A link component that switches between languages when clicked.
 */
const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ ...props }) => {
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

export default LanguageSwitcher;
