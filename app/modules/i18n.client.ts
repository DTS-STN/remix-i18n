/*
 * This file contains functions related to internationalization (i18n) that are
 * specifically designed to run in the browser. These functions might interact
 * with the DOM, access browser APIs, or perform other actions that are only
 * relevant in a client-side context.
 */

/* eslint-disable import/no-named-as-default-member */

import { UNSAFE_RouteModules as RouteModules } from '@remix-run/react';
import i18next, { LanguageDetectorModule } from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { getI18nNamespaces } from '~/modules/i18n';

// set to true to enable client-side i18next debug logging
// ex: DEBUG_I18N_CLIENT=true npm run dev
const { DEBUG_I18N_CLIENT } = window.env ?? {};

/**
 * Creates and initializes an i18next instance from the Remix route modules.
 */
export async function createInstance(routeModules: RouteModules) {
  const languageDetectorModule: LanguageDetectorModule = {
    type: 'languageDetector',
    detect: () => document.documentElement.lang,
  };

  const i18nNamespaces = getI18nNamespaces(routeModules);

  await i18next
    .use(initReactI18next)
    .use(languageDetectorModule)
    .use(I18NextHttpBackend)
    .init({
      appendNamespaceToMissingKey: true,
      backend: {
        loadPath: '/locales/{{ns}}-{{lng}}.json',
      },
      debug: DEBUG_I18N_CLIENT === 'true',
      defaultNS: [],
      fallbackLng: false,
      ns: i18nNamespaces,
    });

  return i18next;
}
