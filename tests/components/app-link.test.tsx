import { Link } from '@remix-run/react';
import { render } from '@testing-library/react';
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
    vi.mocked<PartialUseTranslation>(useTranslation).mockReturnValue({
      i18n: { language: 'fr' },
    });

    const _result = render(
      <AppLink
        routeId="/actors/:id"
        params={{ id: '000000000000-0000-0000-0000-00000000' }}
      >
        Tom Cruise
      </AppLink>,
    );

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Tom Cruise',
        to: expect.objectContaining({
          pathname: '/fr/acteurs/000000000000-0000-0000-0000-00000000',
        }),
      }),
      expect.anything(),
    );
  });

  it('should render the correct link for requested language', async () => {
    vi.mocked(Link).mockImplementation(({ children }) => <>{children}</>);

    render(
      <AppLink routeId="/actors" language="fr">
        L&apos;acteurs
      </AppLink>,
    );

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      expect.objectContaining({
        children: `L'acteurs`,
        to: expect.objectContaining({
          pathname: '/fr/acteurs',
        }),
      }),
      expect.anything(),
    );
  });
});
