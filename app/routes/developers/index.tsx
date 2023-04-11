import { Link, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography-h1';
import { Button } from '~/components/ui/button';

import { developers } from './data.server';

export const handle = {
  i18nNamespaces: ['common', 'developers'],
} satisfies RouteHandle;

export function loader() {
  return { developers };
}

export default function DevelopersIndex() {
  const { developers } = useLoaderData<typeof loader>();
  const { t } = useTranslation(handle.i18nNamespaces);

  return (
    <>
      <TypographyH1>{t('developers:index.page-title')}</TypographyH1>
      <ul className="mt-6 max-w-md list-inside list-disc space-y-1 text-gray-500 dark:text-gray-400">
        {Object.entries(developers).map(([id, { name }]) => (
          <li key={id}>
            <AppLink routeId="/developers/:id" params={{ id }}>
              {name}
            </AppLink>
          </li>
        ))}
      </ul>
      <Link to="/">
        <Button size="lg" variant="destructive" className="mt-6">
          ← {t('common:back')}
        </Button>
      </Link>
    </>
  );
}
