import { RouteModule } from '@remix-run/react/dist/routeModules';
import { createInstance as createI18NextInstance } from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { initReactI18next } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { getLanguage, getNamespaces } from '~/modules/i18n';
import {
  createInstance,
  getFixedT,
  getLoadPath,
  initInstance,
} from '~/modules/i18n.server';

vi.mock('i18next');
vi.mock('node:path');
vi.mock('~/modules/i18n');

vi.mock('~/modules/i18n.server', async (importOriginal) => {
  vi.stubGlobal('process', {
    ...process,
    env: {
      DEBUG_I18N_SERVER: 'true',
    },
  });

  return await importOriginal();
});

describe('createInstance', () => {
  it('should call getLanguage(..) and getNamespaces(..) with the correct language and namespace', async () => {
    vi.mocked(createI18NextInstance, { partial: true }).mockReturnValue({
      init: vi.fn(),
      use: vi.fn().mockReturnThis(),
    });

    const route: Partial<RouteModule> = {
      handle: {
        i18nNamespaces: ['namespace'],
      },
    };

    await createInstance(new Request('http://example.com/fr/about'), {
      route: route as RouteModule,
    });

    expect(vi.mocked(getLanguage)).toHaveBeenCalledWith('/fr/about');
    expect(vi.mocked(getNamespaces)).toHaveBeenCalledWith({ route });
  });
});

describe('initInstance', () => {
  it('should initialize i18next with the correct language and namespace', async () => {
    const i18next = {
      init: vi.fn(),
      use: vi.fn().mockReturnThis(),
    };

    vi.mocked(resolve).mockReturnValue('/locales/{{ns}}-{{lng}}.json');
    vi.mocked(createI18NextInstance, { partial: true }).mockReturnValue(
      i18next,
    );

    await initInstance('fr', ['common']);

    expect(vi.mocked(createI18NextInstance)).toHaveBeenCalledOnce();
    expect(i18next.use).toHaveBeenCalledWith(initReactI18next);
    expect(i18next.use).toHaveBeenCalledWith(I18NexFsBackend);
    expect(i18next.init).toHaveBeenCalledWith({
      appendNamespaceToMissingKey: true,
      backend: {
        loadPath: resolve('./public/locales/{{ns}}-{{lng}}.json'),
      },
      debug: true,
      defaultNS: [],
      fallbackLng: false,
      interpolation: {
        escapeValue: false,
      },
      lng: 'fr',
      ns: ['common'],
    });
  });
});

describe('getFixedT', () => {
  it('should call i18next.getFixedT(..) with the correct language and namespaces', async () => {
    const i18next = {
      getFixedT: vi.fn(),
    };

    vi.mocked(createI18NextInstance, { partial: true }).mockReturnValue({
      ...i18next,
      init: vi.fn(),
      use: vi.fn().mockReturnThis(),
    });

    await getFixedT('fr', ['common']);

    expect(i18next.getFixedT).toHaveBeenCalledWith('fr', ['common']);
  });
});

describe('getLoadPath', () => {
  it('should call resolve(..) with the correct path', () => {
    getLoadPath();

    expect(vi.mocked(resolve)).toHaveBeenCalledWith(
      './public/locales/{{ns}}-{{lng}}.json',
    );
  });
});
