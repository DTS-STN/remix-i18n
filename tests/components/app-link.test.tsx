import { Link } from '@remix-run/react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AppLink } from '~/components/app-link';
import { useCurrentLanguage } from '~/hooks/use-current-language';
import { useI18nPath } from '~/hooks/use-i18n-path';
import { cn } from '~/modules/utils';

vi.mock('@remix-run/react', () => ({
  Link: vi.fn(),
}));

vi.mock('~/hooks/use-current-language');
vi.mock('~/hooks/use-i18n-path');
vi.mock('~/modules/i18n');
vi.mock('~/modules/utils');

describe('AppLink', () => {
  it('should render the correct link for current language', async () => {
    vi.mocked(cn).mockReturnValue('flex');
    vi.mocked(useCurrentLanguage).mockReturnValue('fr');
    vi.mocked(useI18nPath).mockReturnValue(
      '/fr/acteurs/000000000000-0000-0000-0000-00000000',
    );

    render(
      <AppLink
        routeId="/actors/:id"
        params={{ id: '000000000000-0000-0000-0000-00000000' }}
        search="foo=bar&bar=foo"
        hash="#foo"
      >
        Tom Cruise
      </AppLink>,
    );

    expect(vi.mocked(useCurrentLanguage)).toHaveBeenCalled();
    expect(vi.mocked(useI18nPath)).toHaveBeenCalledWith('/actors/:id', 'fr', {
      id: '000000000000-0000-0000-0000-00000000',
    });

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      {
        children: 'Tom Cruise',
        className: 'flex',
        lang: 'fr',
        to: {
          hash: '#foo',
          pathname: '/fr/acteurs/000000000000-0000-0000-0000-00000000',
          search: 'foo=bar&bar=foo',
        },
      },
      expect.objectContaining({}),
    );
  });

  it('should render the correct link for requested language', async () => {
    vi.mocked(cn).mockReturnValue('flex');
    vi.mocked(useI18nPath).mockReturnValue(
      '/fr/acteurs/000000000000-0000-0000-0000-00000000',
    );

    render(
      <AppLink
        routeId="/actors/:id"
        params={{ id: '000000000000-0000-0000-0000-00000000' }}
        search="foo=bar&bar=foo"
        hash="#foo"
        lang="fr"
      >
        Tom Cruise
      </AppLink>,
    );

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      {
        children: 'Tom Cruise',
        className: 'flex',
        lang: 'fr',
        to: {
          hash: '#foo',
          pathname: '/fr/acteurs/000000000000-0000-0000-0000-00000000',
          search: 'foo=bar&bar=foo',
        },
      },
      expect.objectContaining({}),
    );
  });
});
