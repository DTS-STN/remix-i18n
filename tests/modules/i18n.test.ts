import { RouteModules } from '@remix-run/react/dist/routeModules';
import i18next, { createInstance } from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import I18NextHttpBackend from 'i18next-http-backend';
import { resolve } from 'node:path';
import { initReactI18next } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNamespaces } from '~/modules/i18n';
import { createInstance as createClientInstance } from '~/modules/i18n.client';
import {
  createInstance as createServerInstance,
  getFixedT,
  getLang,
  getLoadPath,
} from '~/modules/i18n.server';

vi.mock('i18next', () => {
  const i18next = {
    getFixedT: vi.fn(),
    init: vi.fn(),
    use: vi.fn().mockReturnThis(),
  };

  return {
    default: i18next,
    createInstance: vi.fn().mockReturnValue(i18next),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getFixedT', () => {
  it('should call i18next.getFixedT() with the correct language and namespaces', async () => {
    const lang = 'fr';
    const namespaces = ['common'] as const;

    await getFixedT(lang, namespaces);

    expect(i18next.getFixedT).toHaveBeenCalledWith(lang, namespaces);
  });
});

describe('getLang', () => {
  it('should return undefined if the pathname does not start with /en/ or /fr/', () => {
    const lang = getLang(new Request('http://localhost/'));
    expect(lang).toBeUndefined();
  });

  it('should return en if the pathname starts with /en/', () => {
    const lang = getLang(new Request('http://localhost/en/about'));
    expect(lang).toBe('en');
  });

  it('should return fr if the pathname starts with /fr/', () => {
    const lang = getLang(new Request('http://localhost/fr/about'));
    expect(lang).toBe('fr');
  });
});

describe('getLoadPath', () => {
  it('should return the correct path', () => {
    const loadPath = getLoadPath();
    expect(loadPath).toEqual(resolve('./public/locales/{{ns}}-{{lng}}.json'));
  });
});

describe('getNamespaces', () => {
  it('should return an empty array if there are no route modules', () => {
    const namespaces = getNamespaces({});
    expect(namespaces).toEqual([]);
  });

  it('should return an empty array if there are no route handles', () => {
    const routeModules = {
      route1: {},
      route2: {},
    } as unknown as RouteModules;

    const namespaces = getNamespaces(routeModules);

    expect(namespaces).toEqual([]);
  });

  it('should return an empty array if the route handles are invalid', () => {
    const routeModules = {
      route1: {
        handle: 3,
      },
      route2: {
        handle: console.log,
      },
    } as unknown as RouteModules;

    const namespaces = getNamespaces(routeModules);

    expect(namespaces).toEqual([]);
  });

  it('should return an empty array if there are no i18n namespaces', () => {
    const routeModules = {
      route1: {
        handle: {},
      },
      route2: {
        handle: {},
      },
    } as unknown as RouteModules;

    const namespaces = getNamespaces(routeModules);

    expect(namespaces).toEqual([]);
  });

  it('should return an array of i18n namespaces', () => {
    const routeModules = {
      route1: {
        handle: {
          i18nNamespaces: ['namespace1', 'namespace2'],
        },
      },
      route2: {
        handle: {
          i18nNamespaces: ['namespace2', 'namespace3'],
        },
      },
    } as unknown as RouteModules;

    const namespaces = getNamespaces(routeModules);

    expect(namespaces).toEqual(['namespace1', 'namespace2', 'namespace3']);
  });

  it('should return an array of unique i18n namespaces', () => {
    const routeModules = {
      route1: {
        handle: {
          i18nNamespaces: ['namespace1', 'namespace2'],
        },
      },
      route2: {
        handle: {
          i18nNamespaces: ['namespace2', 'namespace1'],
        },
      },
    } as unknown as RouteModules;

    const namespaces = getNamespaces(routeModules);

    expect(namespaces).toEqual(['namespace1', 'namespace2']);
  });
});

describe('createClientInstance', () => {
  it('should initialize i18next with the correct configuration', async () => {
    vi.spyOn(document.documentElement, 'lang', 'get').mockReturnValue('fr');

    const routeModules = {
      route1: {
        handle: {
          i18nNamespaces: ['namespace1', 'namespace2'],
        },
      },
      route2: {
        handle: {
          i18nNamespaces: ['namespace2', 'namespace3'],
        },
      },
    } as unknown as RouteModules;

    await createClientInstance(routeModules);

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
      defaultNS: false,
      fallbackLng: false,
      keySeparator: false,
      ns: ['namespace1', 'namespace2', 'namespace3'],
    });
  });
});

describe('createServerInstance', () => {
  it('should initialize i18next with the correct configuration', async () => {
    const request = new Request('http://localhost/fr/about');

    const routeModules = {
      route1: {
        handle: {
          i18nNamespaces: ['namespace1', 'namespace2'],
        },
      },
      route2: {
        handle: {
          i18nNamespaces: ['namespace2', 'namespace3'],
        },
      },
    } as unknown as RouteModules;

    await createServerInstance(request, routeModules);

    expect(vi.mocked(createInstance)).toHaveBeenCalledOnce();
    expect(i18next.use).toHaveBeenCalledWith(initReactI18next);
    expect(i18next.use).toHaveBeenCalledWith(I18NexFsBackend);
    expect(i18next.init).toHaveBeenCalledWith({
      appendNamespaceToMissingKey: true,
      backend: {
        loadPath: resolve('./public/locales/{{ns}}-{{lng}}.json'),
      },
      defaultNS: false,
      fallbackLng: false,
      interpolation: {
        escapeValue: false,
      },
      lng: 'fr',
      keySeparator: false,
      ns: ['namespace1', 'namespace2', 'namespace3'],
    });
  });
});
