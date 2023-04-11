import { Location, useLocation } from '@remix-run/react';
import { describe, expect, it, vi } from 'vitest';

import { useCurrentLanguage } from '~/hooks/use-current-language';
import { getLanguage } from '~/modules/i18n';

vi.mock('@remix-run/react');
vi.mock('~/modules/i18n');

describe('useCurrentLanguage', () => {
  it('should call getLanguage() with the correct pathname', () => {
    const location: Partial<Location> = { pathname: '/fr/about' };
    vi.mocked(useLocation).mockReturnValue(location as Location);

    useCurrentLanguage();

    expect(vi.mocked(getLanguage)).toHaveBeenLastCalledWith('/fr/about');
  });
});
