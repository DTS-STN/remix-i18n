import type { MetaFunction } from '@remix-run/node';

import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography/typography-h1';
import { TypographyP } from '~/components/typography/typography-p';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: 'My Remix App / Mon Application Remix' }];
};

export default function Index() {
  return (
    <>
      <div className="text-center">
        <TypographyH1>
          <span lang="en">Remix i18n demo</span>
          <> / </>
          <span lang="fr">Démo Remix i18n</span>
        </TypographyH1>
        <TypographyP>
          <span lang="en">Pick a language</span>
          <> / </>
          <span lang="fr">Choisir un langue</span>
        </TypographyP>

        <div className="mt-4 flex justify-center space-x-2">
          <AppLink routeId="/developers" lang="en">
            <Button size="lg">English</Button>
          </AppLink>
          <AppLink routeId="/developers" lang="fr">
            <Button size="lg">Français</Button>
          </AppLink>
        </div>
      </div>
    </>
  );
}
