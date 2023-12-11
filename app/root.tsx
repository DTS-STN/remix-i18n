import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { useContext } from 'react';

import tailwind from '~/tailwind.css';
import { getLocale } from '~/utils/locale-utils';
import { NonceContext } from './components/nonce-context';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwind }
];

export const loader: LoaderFunction = async ({ request }) => {
  return json({ locale: getLocale(request.url) });
};

const App: FC = () => {
  const { nonce } = useContext(NonceContext);
  const { locale } = useLoaderData<typeof loader>();

  return (
    <html lang={locale ?? 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <noscript><link rel="stylesheet" href="https://canada.ca/etc/designs/canada/wet-boew/css/noscript.min.css"/></noscript>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export default App;
