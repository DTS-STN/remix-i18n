import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Trans, useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';
import { LanguageSwitcher } from '~/components/language-switcher';
import { Button } from '~/components/ui/button';
import { TypographyH1 } from '~/components/ui/typography-h1';
import { TypographyP } from '~/components/ui/typography-p';
import { getFixedT, getLang } from '~/modules/i18n.server';

export const handle = {
  i18nNamespaces: ['application', 'common'] as const,
} satisfies RouteHandle;

export async function loader({ request }: LoaderFunctionArgs) {
  const language = getLang(request);

  invariant(language);

  const t = await getFixedT(language, handle.i18nNamespaces);
  const title = t('application:page-title');

  return { title } as const;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  invariant(data);

  return [{ title: data.title }] as const;
};

export default function Index() {
  const { t, i18n } = useTranslation(handle.i18nNamespaces);

  return (
    <>
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <TypographyH1>{t('application:page-title')}</TypographyH1>
          <TypographyP>
            <Trans
              i18nKey="application:current-language"
              values={{ language: t('common:language') }}
            />
          </TypographyP>
          <div className="mt-4 flex justify-center space-x-4">
            <LanguageSwitcher>
              <Button size="lg">{t('application:switch-language')}</Button>
            </LanguageSwitcher>
            <Link to="/" reloadDocument={true}>
              <Button size="lg" variant="destructive">
                Back
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
