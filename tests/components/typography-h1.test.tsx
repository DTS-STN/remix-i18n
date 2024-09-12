import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TypographyH1 } from '~/components/typography-h1';

describe('TypographyH1', () => {
  it('should render with the correct text and tag name', () => {
    render(<TypographyH1 data-testid="h1">Hello world</TypographyH1>);

    const element = screen.getByTestId('h1');

    expect(element.tagName).toEqual('H1');
    expect(element.textContent).toEqual('Hello world');
  });
});
