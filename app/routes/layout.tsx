import { Outlet } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '~/components/language-switcher';

export const handle = {
  i18nNamespaces: ['common'],
} satisfies RouteHandle;

function Header() {
  const { t } = useTranslation(handle.i18nNamespaces);

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <img src="/sig-blk-en.svg" alt="Government of Canada" width="283" />
            <LanguageSwitcher>{t('common:alt-language')}</LanguageSwitcher>
          </div>
        </div>
      </header>
    </>
  );
}

export default function Layout() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-3">
        <Outlet />
      </div>
    </>
  );
}
