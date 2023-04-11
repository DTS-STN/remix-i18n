import { UNSAFE_RouteModules as RouteModules } from '@remix-run/react';
import { RouteModule } from '@remix-run/react/dist/routeModules';
import { describe, expect, it } from 'vitest';

import {
  getAltLanguage,
  getLanguage,
  getNamespaces,
  isLanguage,
  languages,
} from '~/modules/i18n';

describe('languages', () => {
  it('should contain the correct language codes', () => {
    expect(languages).toEqual(['en', 'fr']);
  });
});

describe('isLanguage', () => {
  it('should return true for valid language codes', () => {
    expect(isLanguage('en')).toEqual(true);
    expect(isLanguage('fr')).toEqual(true);
  });

  it('should return false for invalid language codes', () => {
    expect(isLanguage('de')).toEqual(false);
    expect(isLanguage('es')).toEqual(false);
    expect(isLanguage('')).toEqual(false);
    expect(isLanguage(undefined)).toEqual(false);
    expect(isLanguage(null)).toEqual(false);
    expect(isLanguage(123)).toEqual(false);
    expect(isLanguage({})).toEqual(false);
  });
});

describe('getAltLanguage', () => {
  it('should return the correct alternate language', () => {
    expect(getAltLanguage('en')).toEqual('fr');
    expect(getAltLanguage('fr')).toEqual('en');
  });
});

describe('getLanguage', () => {
  it('should return the correct language code', () => {
    expect(getLanguage('/')).toEqual(undefined);
    expect(getLanguage('/en')).toEqual('en');
    expect(getLanguage('/en/about')).toEqual('en');
    expect(getLanguage('/fr')).toEqual('fr');
    expect(getLanguage('/fr/about')).toEqual('fr');
  });
});

describe('getNamespaces', () => {
  it('should return an empty array if there are no route modules', () => {
    expect(getNamespaces({})).toEqual([]);
  });

  it('should return an empty array if there are no i18n namespaces', () => {
    const route: Partial<RouteModule> = {
      handle: {},
    };

    expect(getNamespaces({ route } as RouteModules)).toEqual([]);
  });

  it('should return a unique array of i18n namespaces from the route modules', () => {
    const routes: Record<string, Partial<RouteModule>> = {
      route1: {
        handle: {
          i18nNamespaces: ['namespace1'],
        },
      },
      route2: {
        handle: {
          i18nNamespaces: ['namespace2'],
        },
      },
    };

    expect(getNamespaces(routes as RouteModules)).toEqual([
      'namespace1',
      'namespace2',
    ]);
  });
});
