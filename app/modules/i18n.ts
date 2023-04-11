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

import { UNSAFE_RouteModules as RouteModules } from '@remix-run/react';

/**
 * An array of supported language codes.
 *
 * This constant holds the valid language codes for the routes. It is
 * defined as a readonly tuple using `as const` to ensure that the array is
 * immutable and its values are treated as literal types.
 */
export const languages = ['en', 'fr'] as const;

/**
 * A type representing a supported language code.
 *
 * This type alias extracts the literal values from the `supportedLanguages`
 * array, allowing only the values 'en' or 'fr' as valid language codes. It
 * ensures type safety by constraining values to the predefined literals.
 */
export type Language = (typeof languages)[number];

/**
 * Type guard to check if a given value is a valid Language.
 *
 * @param value - The value to check.
 */
export function isLanguage(value: unknown): value is Language {
  const isString = value !== null && typeof value === 'string';
  return isString && (languages as readonly string[]).includes(value);
}

/**
 * Returns the alternate language for the given input language.
 * (ie: 'en' → 'fr'; 'fr' → 'en')
 */
export function getAltLanguage(language: Language) {
  switch (language) {
    case 'en':
      return 'fr';
    case 'fr':
      return 'en';
  }
}

/**
 * Returns the current language based on the pathname.
 * Returns `undefined` if language could not be detected.
 */
export function getLanguage(pathname: string) {
  switch (true) {
    case pathname === '/en' || pathname.startsWith('/en'):
      return 'en';
    case pathname === '/fr' || pathname.startsWith('/fr'):
      return 'fr';
  }
}

/**
 * Get a unique array of i18n namespaces from the route modules.
 *
 * @param routeModules - The route modules to get the namespaces from.
 */
export function getNamespaces(routeModules: RouteModules) {
  const routeHandles = Object.values(routeModules)
    .filter((routeModule) => !!routeModule)
    .map((routeModule) => routeModule.handle)
    .filter(isRouteHandle);

  const i18nNamespaces = routeHandles
    .flatMap((routeHandle) => routeHandle.i18nNamespaces)
    .filter((i18nNamespaces) => !!i18nNamespaces);

  return [...new Set(i18nNamespaces)];
}

/**
 * Type guard to check if a given value is a valid RouteHandle.
 *
 * @param value - The value to check.
 */
function isRouteHandle(value?: unknown): value is RouteHandle {
  const isObject = value !== null && typeof value === 'object';
  return isObject && (value as RouteHandle).i18nNamespaces !== undefined;
}
