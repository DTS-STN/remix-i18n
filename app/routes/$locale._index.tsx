import { useTranslation } from 'react-i18next';

import { AppLink } from '~/components/app-link';

export const handle = {
  i18nNamespaces: ['test'],
};

export default () => {
  const { t } = useTranslation('test');

  return (
    <section className="container mt-24">
      <p>
        <AppLink to="/about">{t('about-us')}</AppLink>
      </p>
    </section>
  );
};
