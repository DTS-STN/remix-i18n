import { Namespace } from 'i18next';

declare global {
  /**
   * Represents the route handle with optional `i18nNamespaces`.
   *
   * Example usage:
   *
   * ``` typescript
   * export const handle = {
   *   i18nNamespaces: ['common'],
   * } satisfies RouteHandle;
   * ```
   */
  interface RouteHandle extends Record<string, unknown> {
    i18nNamespaces?: Namespace;
  }

  /**
   * Client-side environment variables accessible through `window.env`.
   */
  interface Window {
    env: Record<string, string | undefined>;
  }
}
