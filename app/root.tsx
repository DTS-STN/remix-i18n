import { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '~/components/language-switcher';
import { TypographyH1 } from '~/components/typography/typography-h1';
import { TypographyP } from '~/components/typography/typography-p';
import { useCurrentLanguage } from '~/hooks/use-current-language';
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

function ClientEnv({ env }: { env?: SerializeFrom<typeof loader>['env'] }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.env = ${JSON.stringify(env)}`,
      }}
    />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const isRouteError = isRouteErrorResponse(error);
  const title = isRouteError ? `${error.status} ${error.statusText}` : 'Error!';
  const message = isRouteError ? error.data : 'Unknown error';

  return (
    <>
      <TypographyH1>{title}</TypographyH1>
      <TypographyP>{message}</TypographyP>
    </>
  );
}

function Header() {
  const currentLanguage = useCurrentLanguage();
  const { t } = useTranslation(['common']);

  return (
    <header className="py-3 shadow">
      <div className="container mx-auto flex items-center justify-between">
        <img src="/sig-blk-en.svg" alt="Government of Canada" width="283" />
        {currentLanguage && (
          <>
            <LanguageSwitcher>{t('common:alt-language')}</LanguageSwitcher>
          </>
        )}
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>('root');
  const env = loaderData?.env;

  return (
    <html lang={loaderData?.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main className="container m-10 mx-auto">{children}</main>
        <ClientEnv env={env} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
