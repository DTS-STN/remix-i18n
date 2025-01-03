import type { UIMatch } from '@remix-run/react';
import { useMatches } from '@remix-run/react';
import { describe, expect, it, vi } from 'vitest';

import { useCurrentRouteId } from '~/hooks/use-current-route-id';

vi.mock('@remix-run/react');

describe('useCurrentRouteId', () => {
  it('should return the ID of the current route', () => {
    const match: Partial<UIMatch> = { id: '/' };
    vi.mocked(useMatches).mockReturnValue([match as UIMatch]);
    expect(useCurrentRouteId()).toEqual('/');
  });

  it('should throw an error if the current route is undefined', () => {
    vi.mocked(useMatches).mockReturnValue([]);
    expect(() => useCurrentRouteId()).toThrowError(
      'Expected match to be defined',
    );
  });
});
