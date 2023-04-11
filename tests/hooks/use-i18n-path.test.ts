import { generatePath, useRouteLoaderData } from '@remix-run/react';
import { describe, expect, it, vi } from 'vitest';

import { useI18nPath } from '~/hooks/use-i18n-path';

vi.mock('@remix-run/react');
vi.mock('~/root');

describe('useI18nPath', () => {
  it('should call generatePath(..) with the correct path and parameters', () => {
    vi.mocked(useRouteLoaderData).mockReturnValue({
      routes: [
        { id: '/home-en', path: '/en/home' },
        { id: '/home-fr', path: '/fr/accueil' },
      ],
    });

    useI18nPath('/home', 'fr');

    expect(vi.mocked(generatePath)).toHaveBeenCalledWith(
      '/fr/accueil',
      undefined,
    );
  });

  it('hould call generatePath(..) with the correct path and parameters', () => {
    vi.mocked(useRouteLoaderData).mockReturnValue({
      routes: [
        { id: '/posts/:id-en', path: '/en/posts/:id' },
        { id: '/posts/:id-fr', path: '/fr/articles/:id' },
      ],
    });

    useI18nPath('/posts/:id', 'fr', {
      id: '000000000000-0000-0000-0000-00000000',
    });

    expect(vi.mocked(generatePath)).toHaveBeenCalledWith('/fr/articles/:id', {
      id: '000000000000-0000-0000-0000-00000000',
    });
  });

  it('should throw an error if the root loader data is undefined', () => {
    expect(() => useI18nPath('/home', 'en')).toThrowError(
      'Expected rootLoaderData to be defined',
    );
  });

  it('should throw an error if the route is not found', () => {
    vi.mocked(useRouteLoaderData).mockReturnValue({
      routes: [{ id: '/home-en', path: '/home' }],
    });

    expect(() => useI18nPath('/about', 'en')).toThrowError(
      'Expected route to be defined',
    );
  });

  it('should throw an error if the route path is undefined', () => {
    vi.mocked(useRouteLoaderData).mockReturnValue({
      routes: [{ id: '/home-en' }],
    });

    expect(() => useI18nPath('/home', 'en')).toThrowError(
      'Expected route.path to be defined',
    );
  });
});
