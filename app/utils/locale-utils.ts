import type { UNSAFE_RouteModules as RouteModules } from "@remix-run/react";

/**
 * Retrieves the locale from the provided URL if it starts with '/en' or '/fr'.
 *
 * @param {string} url - The URL to retrieve the locale from.
 * @returns {'en' | 'fr' | undefined} - The locale of the URL, or undefined if it does not start with '/en' or '/fr'.
 */
export function getLocale(url: string): 'en' | 'fr' | undefined {
  const pathname = new URL(url).pathname;

  if (pathname.startsWith('/en')) {
    return 'en';
  }

  if (pathname.startsWith('/fr')) {
    return 'fr';
  }

  return undefined;
}

/**
 * Returns all namespaces required by the given routes by examining the route's i18nNamespaces handle property.
 *
 * @param {RouteModules} routeModules - Object containing route modules
 * @returns {string[]} - Array of namespaces
 * @see https://remix.run/docs/en/main/route/handle
 */
export function getNamespaces(routeModules: RouteModules): string[] {
  const namespaces = new Set(
    Object.values(routeModules)
      .filter((route) => route.handle?.i18nNamespaces)
      .flatMap((route) => route.handle.i18nNamespaces)
  );

  return [...namespaces];
}
