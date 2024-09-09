import { LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { getLang } from '~/modules/i18n.server';
import './tailwind.css';

export const handle = {
  i18nNamespaces: ['common'] as const,
} as const satisfies RouteHandle;

export async function loader({ request }: LoaderFunctionArgs) {
  const language = getLang(request);
  return { language } as const;
}

function Header() {
  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-800">
              <img
                src="/sig-blk-en.svg"
                alt="Government of Canada"
                width="283"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <html lang={loaderData.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
