import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography-h1';

import { actors } from './data.server';

export const handle = {
  i18nNamespaces: ['actors'],
} satisfies RouteHandle;

export function loader() {
  return { actors };
}

export default function ActorsIndex() {
  const loaderData = useLoaderData<typeof loader>();
  const { t } = useTranslation(handle.i18nNamespaces);

  return (
    <>
      <TypographyH1>{t('actors:actors.page-title')}</TypographyH1>
      <ul className="mt-6 max-w-md list-inside list-disc space-y-1 text-gray-500 dark:text-gray-400">
        {Object.entries(loaderData.actors).map(([id, name]) => (
          <li key={id}>
            <AppLink routeId="/actors/:id" params={{ id }}>
              {name}
            </AppLink>
          </li>
        ))}
      </ul>
    </>
  );
}
