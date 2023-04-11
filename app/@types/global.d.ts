import { Namespace } from 'i18next';

/* eslint-disable no-var */

declare global {
  /**
   * A `RouteHandle` interface that includes the `i18nNamespaces` property.
   * To be used inside Remix routes as follows:
   *
   * Example:
   *
   * ``` typescript
   * export const handle = {
   *   i18nNamespaces: ['application', 'common'],
   * } satisfies RouteHandle;
   * ```
   */
  interface RouteHandle extends Record<string, unknown> {
    i18nNamespaces?: Namespace;
  }

  /**
   * The window.env property returns an object containing the client-side environment.
   */
  interface Window {
    env: {
      [key: string]: string | undefined;
    };
  }

  /**
   * An array of all the routes in the application.
   * Each route object has an `id` and an optional `path` property.
   */
  var __ROUTES__: Array<{ id: string; path: string | undefined }>;
}
