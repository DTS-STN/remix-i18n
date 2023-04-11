import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TypographyP } from '~/components/typography-p';

describe('TypographyP', () => {
  it('should render with the correct text and tag name', async () => {
    render(<TypographyP data-testid="p">Hello world</TypographyP>);

    const element = await waitFor(() => screen.getByTestId('p'));

    expect(element.tagName).toEqual('P');
    expect(element.textContent).toEqual('Hello world');
  });
});
