import { createRemixStub } from '@remix-run/testing';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLink } from '~/components/app-link';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe('AppLink', () => {
  it('should render the correct link for current language', async () => {
    type PartialUseTranslationFn = () => {
      i18n: { language: string };
    };

    vi.mocked<PartialUseTranslationFn>(useTranslation).mockReturnValue({
      i18n: { language: 'fr' },
    });

    const RemixStub = createRemixStub([
      {
        Component: () => <AppLink to="/about">About</AppLink>,
        path: '/',
      },
    ]);

    render(<RemixStub />);

    const element = await waitFor(() => screen.findByText('About'));
    expect(element.getAttribute('href')).toBe('/fr/about');
  });

  it('should render the correct link for requested language', async () => {
    const RemixStub = createRemixStub([
      {
        Component: () => (
          <AppLink to="/about" language="fr">
            About
          </AppLink>
        ),
        path: '/',
      },
    ]);

    render(<RemixStub />);

    const element = await waitFor(() => screen.findByText('About'));
    expect(element.getAttribute('href')).toBe('/fr/about');
  });
});
