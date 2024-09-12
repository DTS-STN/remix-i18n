import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TypographyP } from '~/components/typography-p';

describe('TypographyP', () => {
  it('should render with the correct text and tag name', () => {
    render(<TypographyP data-testid="p">Hello world</TypographyP>);

    const element = screen.getByTestId('p');

    expect(element.tagName).toEqual('P');
    expect(element.textContent).toEqual('Hello world');
  });
});
