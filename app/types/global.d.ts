import { Namespace } from 'i18next';

/**
 * Client-side environment varibles (similar to server-side process.env).
 *
 * @see NodeJS.ProcessEnv
 */
interface WindowEnv {
  [key: string]: string | undefined;
}

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

  /**
   * The window.env property returns an object containing the client-side environment.
   */
  interface Window {
    env: WindowEnv;
  }
}
