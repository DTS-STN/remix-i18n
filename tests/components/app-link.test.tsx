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
        routeId="/developers/:id"
        params={{ id: '000000000000-0000-0000-0000-00000000' }}
        search="foo=bar&bar=foo"
        hash="#foo"
      >
        John Carmack
      </AppLink>,
    );

    expect(vi.mocked(useCurrentLanguage)).toHaveBeenCalled();
    expect(vi.mocked(useI18nPath)).toHaveBeenCalledWith(
      '/developers/:id',
      'fr',
      {
        id: '000000000000-0000-0000-0000-00000000',
      },
    );

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      {
        children: 'John Carmack',
        className: 'flex',
        lang: 'fr',
        reloadDocument: false,
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
        routeId="/developers/:id"
        params={{ id: '000000000000-0000-0000-0000-00000000' }}
        search="foo=bar&bar=foo"
        hash="#foo"
        lang="fr"
      >
        John Carmack
      </AppLink>,
    );

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      {
        children: 'John Carmack',
        className: 'flex',
        lang: 'fr',
        reloadDocument: true,
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
