import { generatePath } from '@remix-run/react';
import { describe, expect, it, vi } from 'vitest';

import { useI18nPath } from '~/hooks/use-i18n-path';
import { findRouteById } from '~/routes';

vi.mock('@remix-run/react');
vi.mock('~/routes');

describe('useI18nPath', () => {
  it('should call generatePath(..) with the correct path and parameters', () => {
    vi.mocked(findRouteById).mockReturnValue({
      id: 'id',
      file: 'file.tsx',
      paths: { en: '/en/home', fr: '/fr/accueil' },
    });

    useI18nPath('id', 'fr');

    expect(vi.mocked(generatePath)).toHaveBeenCalledWith(
      '/fr/accueil',
      undefined,
    );
  });

  it('should call generatePath(..) with the correct path and parameters', () => {
    vi.mocked(findRouteById).mockReturnValue({
      id: 'id',
      file: 'file.tsx',
      paths: { en: '/en/:id', fr: '/fr/:id' },
    });

    useI18nPath('id', 'fr', { id: '000000000000-0000-0000-0000-00000000' });

    expect(vi.mocked(generatePath)).toHaveBeenCalledWith('/fr/:id', {
      id: '000000000000-0000-0000-0000-00000000',
    });
  });

  it('should throw an error if the route is not found', () => {
    expect(() => useI18nPath('/sleep-token', 'fr')).toThrowError(
      'Expected route to be defined',
    );
  });

  it('should throw an error if the route path is undefined', () => {
    vi.mocked(findRouteById).mockReturnValue({
      id: 'id',
      file: 'file.tsx',
      children: [],
    });

    expect(() => useI18nPath('id', 'en')).toThrowError(
      'Expected paths to be defined',
    );
  });
});
