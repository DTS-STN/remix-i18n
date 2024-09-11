import { Link, useMatches, useParams, useSearchParams } from '@remix-run/react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '~/components/language-switcher';
import { getAltLanguage, isLanguage } from '~/modules/i18n';

vi.mock('@remix-run/react', () => ({
  Link: vi.fn(),
  useMatches: vi.fn(),
  useParams: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('~/modules/i18n', () => ({
  getAltLanguage: vi.fn(),
  isLanguage: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LanguageSwitcher', () => {
  it('should render the correct link for current language', async () => {
    // we only need to mock useMatches[].pathname
    type UseMatchesResponse = ReturnType<typeof useMatches>[number];
    type PartialUseMatches = () => Pick<UseMatchesResponse, 'pathname'>[];

    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    vi.mocked(isLanguage).mockReturnValue(true);
    vi.mocked<PartialUseMatches>(useMatches).mockReturnValue([
      { pathname: '/en/about' },
    ]);
    vi.mocked(useSearchParams, { partial: true }).mockReturnValue([
      new URLSearchParams({ foo: 'bar' }),
    ]);
    vi.mocked(getAltLanguage).mockReturnValue('fr');

    render(<LanguageSwitcher>Français</LanguageSwitcher>);

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      {
        children: 'Français',
        reloadDocument: true,
        to: {
          pathname: '/fr/about',
          search: 'foo=bar',
        },
      },
      expect.anything(),
    );
  });
});
