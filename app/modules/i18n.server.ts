/*
 * This file contains functions related to internationalization (i18n) that are
 * specifically designed to run on the server. These functions might handle
 * tasks such as:
 *
 * - Determining the user's preferred language from the request headers or the URL
 * - Pre-rendering translations for initial page loads
 * - Providing a consistent i18n context for server-side rendering
 */

import type { UNSAFE_RouteModules as RouteModules } from '@remix-run/react';
import type { Namespace } from 'i18next';
import { createInstance as createI18NextInstance } from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { initReactI18next } from 'react-i18next';

import type { Language } from '~/modules/i18n';
import { getI18nNamespaces, getLanguage } from '~/modules/i18n';

// set to true to enable server-side i18next debug logging
// ex: DEBUG_I18N_SERVER=true npm run dev
const { DEBUG_I18N_SERVER } = process.env;

/**
 * Create an i18next instance from the request and Remix route modules.
 *
 * @param request - The request object.
 * @param routeModules - The route modules.
 */
export async function createInstance(
  request: Request,
  routeModules: RouteModules,
) {
  const language = getLanguage(new URL(request.url).pathname);
  const i18nNamespaces = getI18nNamespaces(routeModules);
  return await initInstance(language, i18nNamespaces);
}

/**
 * Initializes an i18next instance for the specified language and namespace.
 */
export async function initInstance(
  language: Language | undefined,
  namespace: Namespace | undefined,
) {
  const i18next = createI18NextInstance();
  const loadPath = getLoadPath();

  await i18next
    .use(initReactI18next)
    .use(I18NexFsBackend)
    .init({
      appendNamespaceToMissingKey: true,
      backend: {
        loadPath: loadPath,
      },
      debug: DEBUG_I18N_SERVER === 'true',
      defaultNS: [],
      fallbackLng: false,
      interpolation: {
        escapeValue: false,
      },
      lng: language,
      ns: namespace,
    });

  return i18next;
}

/**
 * Returns a t() function with a fixed language and namespace.
 */
export async function getFixedT(language: Language, namespace: Namespace) {
  const i18next = await initInstance(language, namespace);
  return i18next.getFixedT(language, namespace);
}

/**
 * Gets the load path for the i18n files.
 */
export function getLoadPath() {
  return resolve('./public/locales/{{ns}}-{{lng}}.json');
}
