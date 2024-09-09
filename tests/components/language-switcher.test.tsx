import { useMatches, useParams, useSearchParams } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '~/components/language-switcher';

vi.mock('@remix-run/react', async (actual) => {
  const { Link, useHref } = await actual<typeof import('@remix-run/react')>();

  return {
    Link,
    useHref,
    useMatches: vi.fn(),
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe('LanguageSwitcher', () => {
  it('should render the correct link for current language', async () => {
    type PartialUseMatchesFn = () => Array<{
      pathname: string;
    }>;

    type PartialUseSearchParamsFn = () => {
      0: URLSearchParams;
    };

    vi.mocked<PartialUseMatchesFn>(useMatches).mockReturnValue([
      { pathname: '/en/about' },
    ]);

    vi.mocked(useParams).mockReturnValue({ lang: 'en' });

    vi.mocked<PartialUseSearchParamsFn>(useSearchParams).mockReturnValue([
      new URLSearchParams(),
    ]);

    const RemixStub = createRemixStub([
      {
        Component: () => <LanguageSwitcher>Français</LanguageSwitcher>,
        path: '/',
      },
    ]);

    render(<RemixStub />);

    const element = await waitFor(() => screen.findByText('Français'));
    expect(element.getAttribute('href')).toBe('/fr/about');
  });

  it('should preserve query parameters', async () => {
    type PartialUseMatchesFn = () => Array<{ pathname: string }>;
    type PartialUseSearchParamsFn = () => { 0: URLSearchParams };

    vi.mocked<PartialUseMatchesFn>(useMatches).mockReturnValue([
      { pathname: '/fr/about' },
    ]);

    vi.mocked(useParams).mockReturnValue({ lang: 'fr' });

    vi.mocked<PartialUseSearchParamsFn>(useSearchParams).mockReturnValue([
      new URLSearchParams({ id: '00000000-0000-0000-0000-000000000000' }),
    ]);

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <LanguageSwitcher>English</LanguageSwitcher>,
      },
    ]);

    render(<RemixStub />);

    const element = await waitFor(() => screen.findByText('English'));
    expect(element.getAttribute('href')).toBe(
      '/en/about?id=00000000-0000-0000-0000-000000000000',
    );
  });
});
