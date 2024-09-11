import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { AppLink } from '~/components/app-link';
import { Button } from '~/components/ui/button';
import { TypographyH1 } from '~/components/ui/typography-h1';
import { TypographyP } from '~/components/ui/typography-p';

export const meta: MetaFunction = () => {
  return [{ title: 'My Remix App / Mon Application Remix' }] as const;
};

export default function Index() {
  return (
    <>
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <TypographyH1>Remix i18n demo / Démo Remix i18n</TypographyH1>
          <TypographyP>Pick a language / Choisir un langue</TypographyP>
          <div className="mt-4 flex justify-center space-x-4">
            <AppLink
              to={{ pathname: '/', search: 'foo=bar' }}
              lang="en"
              language="en"
              reloadDocument={true}
            >
              <Button size="lg">English</Button>
            </AppLink>
            <AppLink
              to={{ pathname: '/', search: 'foo=bar' }}
              lang="fr"
              language="fr"
              reloadDocument={true}
            >
              <Button size="lg">Français</Button>
            </AppLink>
          </div>
        </div>
      </section>
    </>
  );
}
