import 'i18next';

declare module 'i18next' {
  /**
   * Provides type definitions for the i18n resources used in the application.
   * This allows for intellisense autocompletion of i18n keys within the application.
   */
  interface CustomTypeOptions {
    resources: {
      actors: typeof import('~/../public/locales/actors-en.json') &
        typeof import('~/../public/locales/actors-fr.json');
      application: typeof import('~/../public/locales/application-en.json') &
        typeof import('~/../public/locales/application-fr.json');
      common: typeof import('~/../public/locales/common-en.json') &
        typeof import('~/../public/locales/common-fr.json');
    };
  }
}
