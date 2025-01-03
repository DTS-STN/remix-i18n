import {
  generatePath,
  Link,
  useParams,
  useSearchParams,
} from '@remix-run/react';
import { render } from '@testing-library/react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { LanguageSwitcher } from '~/components/language-switcher';
import { useCurrentLanguage } from '~/hooks/use-current-language';
import { useCurrentRouteId } from '~/hooks/use-current-route-id';
import { useI18nPath } from '~/hooks/use-i18n-path';
import { getAltLanguage } from '~/modules/i18n';

vi.mock('@remix-run/react', () => ({
  Link: vi.fn(),
  generatePath: vi.fn(),
  useParams: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('react-i18next');

vi.mock('~/hooks/use-current-language');
vi.mock('~/hooks/use-current-route-id');
vi.mock('~/hooks/use-i18n-path');
vi.mock('~/modules/i18n');
vi.mock('~/modules/utils');

describe('LanguageSwitcher', () => {
  it('should render the correct link for current language', () => {
    vi.mocked(useCurrentLanguage).mockReturnValue('en');
    vi.mocked(useCurrentRouteId).mockReturnValue('/');
    vi.mocked(getAltLanguage).mockReturnValue('fr');
    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    vi.mocked(useI18nPath).mockReturnValue('/fr/developpeurs');
    vi.mocked(useSearchParams, { partial: true }).mockReturnValue([
      new URLSearchParams({ foo: 'bar' }),
    ]);
    vi.mocked(useTranslation, { partial: true }).mockReturnValue({
      t: vi.fn() as TFunction & { $TFunctionBrand?: never },
    });
    vi.mocked(generatePath).mockReturnValue(
      '/fr/developpeurs/000000000000-0000-0000-0000-00000000',
    );

    render(<LanguageSwitcher>Français</LanguageSwitcher>);

    expect(vi.mocked(Link)).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Français',
        reloadDocument: true,
        to: {
          pathname: '/fr/developpeurs/000000000000-0000-0000-0000-00000000',
          search: 'foo=bar',
        },
      }),
      expect.anything(),
    );
  });
});
