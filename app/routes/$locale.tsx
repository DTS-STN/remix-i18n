import { json, type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet, type MetaFunction } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '~/components/language-switcher';
import { getLocale } from '~/utils/locale-utils';
import { getFixedT } from '~/utils/locale-utils.server';

export const handle = {
  i18nNamespaces: ['common', 'wet-boew'],
};

export const links: LinksFunction = () => [
  { rel: 'apple-touch-icon', href: 'https://canada.ca/etc/designs/canada/wet-boew/assets/favicon-mobile.png', sizes: '57x57 72x72 114x114 144x144 150x150' },
  { rel: 'icon', href: 'https://canada.ca/etc/designs/canada/wet-boew/assets/favicon.ico', type: 'image/x-icon' },
  { rel: 'stylesheet', href: 'https://canada.ca/etc/designs/canada/wet-boew/css/theme.min.css' },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = getLocale(request.url);
  const { pathname } = new URL(request.url);

  if (pathname !== '/' && locale === undefined) {
    throw new Response('Not found', { status: 404, statusText: 'Not found' });
  }

  const t = await getFixedT(request, 'common');
  return json({ pageTitle: t('app-title') });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.pageTitle }];
};

function GlobalHeader() {
  const { i18n, t } = useTranslation('wet-boew');

  return (
    <div className="global-header">
      <nav>
        <ul id="wb-tphp" className="wb-init wb-disable-inited">
          <li className="wb-slc">
            <a className="wb-sl" href="#wb-cont">
              {t('skip-to-content')}
            </a>
          </li>
          <li className="wb-slc">
            <a className="wb-sl" href="#wb-info">
              {t('skip-to-info')}
            </a>
          </li>
        </ul>
      </nav>
      <header>
        <div id="wb-bnr" className="container">
          <div className="row">
            <section id="wb-lng" className="col-xs-3 col-sm-12 pull-right text-right">
              <h2 className="wb-inv">{t('language-selection')}</h2>
              <div className="row">
                <div className="col-md-12">
                  <ul className="list-inline mrgn-bttm-0">
                    <li>
                      <LanguageSwitcher />
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            <div className="brand col-xs-9 col-sm-5 col-md-4" property="publisher" resource="#wb-publisher" typeof="GovernmentOrganization">
              <link href={`https://canada.ca/content/canadasite/${i18n.language}.html`} property="url" />
              <img src={`https://canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-${i18n.language}.svg`} alt={t('government-of-canada')} property="logo" />
              <span className="wb-inv">/ <span lang={i18n.language === 'fr' ? 'en' : 'fr'}>{t('alt-government-of-canada')}</span></span>
              <meta property="name" content={t('government-of-canada')} />
              <meta property="areaServed" typeof="Country" content="Canada" />
              <link property="logo" href="https://canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default function () {
  const { t } = useTranslation('common');

  return (
    <>
      <GlobalHeader />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement">
        <div className="bg-cover">
          <div className="p-sm-3 container p-0">
            <div className="well header-rwd brdr-0 brdr-rds-0 bg-gctheme opct-90 mt-8 text-white">
              <h1 property="name" id="wb-cont">
                <Link to="/" className="text-white no-underline hover:text-white hover:no-underline">
                  {t('app-title')}
                </Link>
              </h1>
              <p className="mrgn-tp-md">{t('message', { language: t('language') })}</p>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </>
  );
};
