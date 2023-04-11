import { describe, expect, it, vi } from 'vitest';

import { useI18nPath } from '~/hooks/use-i18n-path';
import { findRouteById } from '~/routes';

vi.mock('@remix-run/react');

vi.mock('~/routes');

describe('useI18nPath', () => {
  it('should return the correct path for a multilingual route', () => {
    vi.mocked(findRouteById).mockReturnValue({
      id: 'id',
      file: 'file.tsx',
      paths: { en: '/en/home', fr: '/fr/accueil' },
    });

    const i18nPath = useI18nPath('/', 'fr');

    expect(i18nPath).toEqual('/fr/accueil');
  });

  it('should return the correct path for a unilingual route', () => {
    vi.mocked(findRouteById).mockReturnValue({
      id: 'id',
      file: 'file.tsx',
      paths: '/:id',
    });

    const i18nPath = useI18nPath('/', 'fr');

    expect(i18nPath).toEqual('/:id');
  });

  it('should throw an error if the route is not found', () => {
    expect(() => useI18nPath('/', 'fr')).toThrowError(
      'Route not found for id: /',
    );
  });

  it('should throw an error if the route path is undefined', () => {
    vi.mocked(findRouteById).mockReturnValue({
      id: 'id',
      file: 'file.tsx',
      children: [],
    });

    expect(() => useI18nPath('/', 'en')).toThrowError(
      'Paths not defined for route: /',
    );
  });
});
