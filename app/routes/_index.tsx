import type { MetaFunction } from '@remix-run/node';
import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography-h1';
import { TypographyP } from '~/components/typography-p';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: 'My Remix App / Mon Application Remix' }];
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
