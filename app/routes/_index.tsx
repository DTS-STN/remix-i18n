import type { MetaFunction } from '@remix-run/react';
import { Link, useLoaderData } from '@remix-run/react';
import { json, type LinksFunction, type LoaderFunction } from '@remix-run/server-runtime';

export const links: LinksFunction = () => [
  { rel: 'apple-touch-icon', href: 'https://canada.ca/etc/designs/canada/wet-boew/assets/favicon-mobile.png', sizes: '57x57 72x72 114x114 144x144 150x150' },
  { rel: 'icon', href: 'https://canada.ca/etc/designs/canada/wet-boew/assets/favicon.ico', type: 'image/x-icon' },
  { rel: 'stylesheet', href: 'https://canada.ca/etc/designs/canada/wet-boew/css/theme.min.css' },
  { rel: 'stylesheet', href: 'https://canada.ca/etc/designs/canada/wet-boew/css/messages.min.css' },
];

export const loader: LoaderFunction = () => {
  return json({ backgroundNumber: Math.floor(Math.random() * 5) });
};

export const meta: MetaFunction = () => [
  { title: 'The Remix i18n demo / La démo de Remix i18n' },
];

const RandomBackground = () => {
  const { backgroundNumber } = useLoaderData<typeof loader>();

  return (
    <div id="bg">
      {[
        <img key="1" src="https://canada.ca/content/dam/canada/splash/sp-bg-1.jpg" alt="" />,
        <img key="2" src="https://canada.ca/content/dam/canada/splash/sp-bg-2.jpg" alt="" />,
        <img key="3" src="https://canada.ca/content/dam/canada/splash/sp-bg-3.jpg" alt="" />,
        <img key="4" src="https://canada.ca/content/dam/canada/splash/sp-bg-4.jpg" alt="" />,
        <img key="5" src="https://canada.ca/content/dam/canada/splash/sp-bg-5.jpg" alt="" />,
        <img key="6" src="https://canada.ca/content/dam/canada/splash/sp-bg-6.jpg" alt="" />,
        <img key="7" src="https://canada.ca/content/dam/canada/splash/sp-bg-7.jpg" alt="" />,
        <img key="8" src="https://canada.ca/content/dam/canada/splash/sp-bg-8.jpg" alt="" />,
        <img key="9" src="https://canada.ca/content/dam/canada/splash/sp-bg-9.jpg" alt="" />,
        <img key="10" src="https://canada.ca/content/dam/canada/splash/sp-bg-10.jpg" alt="" />,
        <img key="11" src="https://canada.ca/content/dam/canada/splash/sp-bg-11.jpg" alt="" />,
        <img key="12" src="https://canada.ca/content/dam/canada/splash/sp-bg-12.jpg" alt="" />,
      ][backgroundNumber]}
    </div>
  );
};

export default () => {
  return (
    <div className="splash">
      <RandomBackground />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement">
        <div className="sp-hb">
          <div className="sp-bx col-xs-12">
            <h1 property="name" className="wb-inv">Canada.ca</h1>
              <div className="row">
                <div className="col-xs-11 col-md-8" property="publisher" resource="#wb-publisher" typeof="GovernmentOrganization">
                  <img src="https://canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg" alt="Government of Canada" property="logo" width="283" />
                  <span className="wb-inv"> / <span lang="fr">Gouvernement du Canada</span></span>
                  <meta property="name" content="Government of Canada" />
                  <meta property="name" lang="fr" content="Gouvernement du Canada" />
                  <meta property="areaServed" typeof="Country" content="Canada" />
                </div>
            </div>
            <div className="row">
              <section className="col-xs-6 text-right">
                <h2 className="wb-inv">Government of Canada</h2>
                <p>
                  <Link to="/en" reloadDocument>
                    <button className="btn btn-primary">English</button>
                  </Link>
                </p>
              </section>
              <section className="col-xs-6" lang="fr">
                <h2 className="wb-inv">Gouvernement du Canada</h2>
                <p>
                  <Link to="/fr" reloadDocument>
                    <button className="btn btn-primary">Français</button>
                  </Link>
                </p>
              </section>
            </div>
          </div>
          <div className="sp-bx-bt col-xs-12">
            <div className="row">
              <div className="col-xs-7 col-md-8">
                <a href="https://canada.ca/en/transparency/terms.html" className="sp-lk">Terms & conditions</a>
                <span className="glyphicon glyphicon-asterisk mx-4"></span>
                <a href="https://canada.ca/fr/transparence/avis.html" className="sp-lk" lang="fr">Avis</a>
              </div>
              <div className="col-xs-5 col-md-4 text-right mrgn-bttm-md">
                <img src="https://canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" width="127" alt="Symbol of the Government of Canada" />
                <span className="wb-inv"> / <span lang="fr">Symbole du gouvernement du Canada</span></span>
              </div>
            </div>
         </div>
        </div>
      </main>
    </div>
  );
};
