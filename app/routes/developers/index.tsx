import { json, Link, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography/typography-h1';
import { Button } from '~/components/ui/button';

import { developers } from './data.server';

export const handle = {
  i18nNamespaces: ['common', 'developers'],
} satisfies RouteHandle;

export function loader() {
  return json({ developers });
}

export default function DevelopersIndex() {
  const { developers } = useLoaderData<typeof loader>();
  const { t } = useTranslation(handle.i18nNamespaces);

  return (
    <>
      <TypographyH1>{t('developers:index.page-title')}</TypographyH1>
      <ul className="mt-6 list-inside list-disc">
        {developers.map(({ id, name }) => (
          <li key={id}>
            <AppLink routeId="/developers/:id" params={{ id }}>
              {name}
            </AppLink>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link to="/">
          <Button size="lg" variant="destructive">
            ← {t('common:back')}
          </Button>
        </Link>
      </div>
    </>
  );
}
