import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AppLink from '~/components/app-link';

export const handle = {
  i18nNamespaces: ['test'],
};

const About: FC = () => {
  const { t } = useTranslation('test');

  return (
    <section className="container mt-24">
      <p>{t('about-us-content')}</p>
      <p>
        <AppLink to="/">
          {t('go-back')}
        </AppLink>
      </p>
    </section>
  );
};

export default About;
