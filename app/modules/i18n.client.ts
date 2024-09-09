/*
 * This file contains functions related to internationalization (i18n) that are
 * specifically designed to run in the browser. These functions might interact
 * with the DOM, access browser APIs, or perform other actions that are only
 * relevant in a client-side context.
 */

import { RouteModules } from '@remix-run/react/dist/routeModules';
import i18next, { LanguageDetectorModule } from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { getNamespaces } from '~/modules/i18n';

/**
 * Create an i18next instance from the Remix route modules.
 *
 * @param routeModules - The route modules.
 */
export async function createInstance(routeModules: RouteModules) {
  const languageDetector = getLanguageDetector();
  const namespaces = getNamespaces(routeModules);

  await i18next
    .use(initReactI18next)
    .use(languageDetector)
    .use(I18NextHttpBackend)
    .init({
      appendNamespaceToMissingKey: true,
      backend: {
        loadPath: '/locales/{{ns}}-{{lng}}.json',
      },
      defaultNS: false,
      fallbackLng: false,
      keySeparator: false,
      ns: namespaces,
    });

  return i18next;
}

/**
 * Return a language detector that uses the HTML document's `lang` attribute.
 *
 * @returns A language detector.
 */
function getLanguageDetector(): LanguageDetectorModule {
  return {
    type: 'languageDetector',
    detect: () => document.documentElement.lang,
  } as const;
}
