/*
 * This file contains functions and types related to internationalization (i18n)
 * that are designed to be used by both the client and the server. This allows
 * for consistent handling of i18n logic across the application.
 *
 * For example, the `getNamespaces()` function can be used by both the client
 * and the server to determine which i18n namespaces are required for a
 * particular route. This ensures that the correct translations are loaded in
 * all contexts.
 */

import type { UNSAFE_RouteModules as RouteModules } from '@remix-run/react';
import type { Namespace } from 'i18next';

import { isRouteHandle } from '~/modules/utils';
import type { Language } from '~/routes';
import { languages } from '~/routes';

// re-export the languages from the routes modules
export { languages, type Language };

/**
 * Type guard to check if a given value is a valid Language.
 */
export function isLanguage(value?: unknown): value is Language {
  return languages.includes(value as Language);
}

/**
 * Returns the alternate language for the given input language.
 * (ie: 'en' → 'fr'; 'fr' → 'en')
 */
export function getAltLanguage(language: Language): Language {
  return language === 'en' ? 'fr' : 'en';
}

/**
 * Returns the current language based on the pathname.
 * Returns `undefined` if language could not be detected.
 */
export function getLanguage(pathname: string): Language | undefined {
  switch (true) {
    case pathname === '/en' || pathname.startsWith('/en/'):
      return 'en';
    case pathname === '/fr' || pathname.startsWith('/fr/'):
      return 'fr';
  }
}

/**
 * Get a unique array of i18n namespaces from the route modules.
 */
export function getI18nNamespaces(routeModules: RouteModules): Namespace {
  const routeHandles = Object.values(routeModules)
    .filter((routeModule) => !!routeModule)
    .map((routeModule) => routeModule.handle)
    .filter(isRouteHandle);

  const i18nNamespaces = routeHandles
    .flatMap((routeHandle) => routeHandle.i18nNamespaces)
    .filter((i18nNamespaces) => !!i18nNamespaces);

  return Array.from(new Set(i18nNamespaces));
}
