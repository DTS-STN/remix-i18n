import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { AppLink } from '~/components/app-link';

export const meta: MetaFunction = () => {
  return [{ title: 'My Remix App / Mon Application Remix' }] as const;
};

export default function Index() {
  return (
    <>
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Remix i18n demo / Démo Remix i18n
          </h1>
          <p className="mt-4 text-gray-600">
            Pick a language / Choisir un langue
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <AppLink
              to={{ pathname: '/', search: 'foo=bar' }}
              lang="en"
              language="en"
              className="btn-blue"
              reloadDocument={true}
            >
              English
            </AppLink>
            <AppLink
              to={{ pathname: '/', search: 'foo=bar' }}
              lang="fr"
              language="fr"
              className="btn-blue"
              reloadDocument={true}
            >
              Français
            </AppLink>
          </div>
        </div>
      </section>
    </>
  );
}
