import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cn } from '~/modules/utils';

vi.mock('clsx', () => ({
  clsx: vi.fn(),
}));

vi.mock('tailwind-merge');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('cn', () => {
  it('calls clsx() and twMerge() with the correct arguments', () => {
    vi.mocked(clsx).mockReturnValue('class1 class2');

    const _result = cn('class1', 'class2');

    expect(clsx).toHaveBeenCalledWith(['class1', 'class2']);
    expect(twMerge).toHaveBeenCalledWith('class1 class2');
  });
});
