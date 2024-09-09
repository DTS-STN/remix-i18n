import { Namespace } from 'i18next';

declare global {
  /**
   * A `RouteHandle` interface that includes the `i18nNamespaces` property.
   * To be used inside Remix routes as follows:
   *
   * @example
   * export const handle = {
   *   i18nNamespaces: ['application', 'common'] as const,
   * } satisfies RouteHandle;
   */
  interface RouteHandle extends Record<string, unknown> {
    i18nNamespaces?: Namespace;
  }
}
