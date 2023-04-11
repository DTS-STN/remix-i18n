import 'i18next';

declare module 'i18next' {
  /**
   * Enables IntelliSense for i18n keys by defining the
   * application's localization resources.
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
