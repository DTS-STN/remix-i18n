import { LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography/typography-h1';
import { TypographyP } from '~/components/typography/typography-p';
import { Button } from '~/components/ui/button';

import { developers } from './data.server';

export const handle = {
  i18nNamespaces: ['common', 'developers'],
} satisfies RouteHandle;

export function loader({ params }: LoaderFunctionArgs) {
  const developer = developers.find(({ id }) => id === params.id);

  if (!developer) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return json({ developer });
}

export default function Developer() {
  const { developer } = useLoaderData<typeof loader>();
  const { t } = useTranslation(handle.i18nNamespaces);

  return (
    <>
      <TypographyH1>{developer.name}!</TypographyH1>
      <TypographyP>
        {t('developers:view.rating', { rating: developer.rating })}
      </TypographyP>
      <div className="mt-6">
        <AppLink routeId="/developers">
          <Button size="lg" variant="destructive">
            ← {t('common:back')}
          </Button>
        </AppLink>
      </div>
    </>
  );
}
