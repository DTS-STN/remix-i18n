import { LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react';

import { getLanguage } from '~/modules/i18n';

import './tailwind.css';

export const handle = {
  i18nNamespaces: ['common'],
} satisfies RouteHandle;

export async function loader({ request }: LoaderFunctionArgs) {
  const language = getLanguage(new URL(request.url).pathname);

  return {
    env: {
      DEBUG_I18N_CLIENT: process.env.DEBUG_I18N_CLIENT,
    },
    language,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>('root');

  return (
    <html lang={loaderData?.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(loaderData?.env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
