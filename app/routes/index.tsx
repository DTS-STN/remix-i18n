import type { MetaFunction } from '@remix-run/node';

import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography-h1';
import { TypographyP } from '~/components/typography-p';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: 'My Remix App / Mon Application Remix' }];
};

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

export default function Index() {
  return (
    <>
      <Header />
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <TypographyH1>Remix i18n demo / Démo Remix i18n</TypographyH1>
          <TypographyP>Pick a language / Choisir un langue</TypographyP>
          <div className="mt-4 flex justify-center space-x-4">
            <AppLink routeId="/developers" lang="en">
              <Button size="lg">English</Button>
            </AppLink>
            <AppLink routeId="/developers" lang="fr">
              <Button size="lg">Français</Button>
            </AppLink>
          </div>
        </div>
      </section>
    </>
  );
}
