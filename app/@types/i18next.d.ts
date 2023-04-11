import 'i18next';

declare module 'i18next' {
  /**
   * Provides type definitions for the i18n resources used in the application.
   * This allows for intellisense autocompletion of i18n keys within the application.
   */
  interface CustomTypeOptions {
    resources: {
      common: typeof import('~/../public/locales/common-en.json') &
        typeof import('~/../public/locales/common-fr.json');
      developers: typeof import('~/../public/locales/developers-en.json') &
        typeof import('~/../public/locales/developers-fr.json');
    };
  }
}
