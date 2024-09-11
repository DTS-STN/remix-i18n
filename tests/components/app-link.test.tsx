import { Link, useHref } from '@remix-run/react';
import { render } from '@testing-library/react';
import { i18n } from 'i18next';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLink } from '~/components/app-link';

vi.mock('@remix-run/react', () => ({
  Link: vi.fn(),
  useHref: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// used to partially mock useTranslation()
type UseTranslationResponse = ReturnType<typeof useTranslation>;

describe('AppLink', () => {
  it('should render the correct link for current language', async () => {
    type PartialUseTranslation = () => {
      // we only need to mock i18n.language
      i18n: Pick<UseTranslationResponse['i18n'], 'language'>;
    };

    vi.mocked(Link).mockImplementation(({ children }) => <>{children}</>);
    vi.mocked(useHref).mockReturnValue('/about');
    vi.mocked<PartialUseTranslation>(useTranslation).mockReturnValue({
      i18n: { language: 'fr' },
    });

    const result = render(<AppLink to="/about">About</AppLink>);

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      expect.objectContaining({ children: 'About', to: '/fr/about' }),
      expect.anything(),
    );
  });

  it('should render the correct link for requested language', async () => {
    vi.mocked(useHref).mockReturnValue('/about');
    vi.mocked(Link).mockImplementation(({ children }) => <>{children}</>);

    render(
      <AppLink to="/about" language="fr">
        About
      </AppLink>,
    );

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      expect.objectContaining({ children: 'About', to: '/fr/about' }),
      expect.anything(),
    );
  });
});
