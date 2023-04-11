import { RouteModule } from '@remix-run/react/dist/routeModules';
import i18next from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { getNamespaces } from '~/modules/i18n';
import { createInstance } from '~/modules/i18n.client';

/* eslint-disable import/no-named-as-default-member */

vi.mock('i18next');
vi.mock('~/modules/i18n');

vi.mock('~/modules/i18n.client', async (importOriginal) => {
  vi.stubGlobal('window', {
    ...window,
    env: {
      DEBUG_I18N_CLIENT: 'true',
    },
  });

  return await importOriginal();
});

describe('createInstance', () => {
  it('should initialize i18next with the correct configuration', async () => {
    vi.spyOn(document.documentElement, 'lang', 'get').mockReturnValue('fr');

    vi.mocked(getNamespaces).mockReturnValue(['common']);
    vi.mocked(i18next.use).mockReturnThis();
    vi.mocked(i18next.init).mockReturnThis();

    const route: Partial<RouteModule> = {
      handle: {
        i18nNamespaces: ['namespace'],
      },
    };

    await createInstance({ route: route as RouteModule });

    expect(i18next.use).toHaveBeenCalledWith(initReactI18next);
    expect(i18next.use).toHaveBeenCalledWith(I18NextHttpBackend);
    expect(i18next.use).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'languageDetector' }),
    );

    expect(i18next.init).toHaveBeenCalledWith({
      appendNamespaceToMissingKey: true,
      backend: {
        loadPath: '/locales/{{ns}}-{{lng}}.json',
      },
      debug: true,
      defaultNS: [],
      fallbackLng: false,
      ns: ['common'],
    });
  });
});
