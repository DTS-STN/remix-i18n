import { useLoaderData } from '@remix-run/react';
import { AppLink } from '~/components/app-link';

import { TypographyH1 } from '~/components/typography-h1';
import { Button } from '~/components/ui/button';

import { LoaderFunctionArgs } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import { TypographyP } from '~/components/typography-p';
import { developers } from './data.server';

export const handle = {
  i18nNamespaces: ['common', 'developers'],
} satisfies RouteHandle;

export function loader({ params }: LoaderFunctionArgs) {
  const developer = developers[params.id as keyof typeof developers];

  if (!developer) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return { developer };
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
      <div className="mt-4">
        <AppLink routeId="/developers">
          <Button size="lg" variant="destructive" className="mt-6">
            ← {t('common:back')}
          </Button>
        </AppLink>
      </div>
    </>
  );
}
