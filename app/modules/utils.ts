import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally add tailwind classes with `clsx()` and `twMerge()`.
 *
 * @param inputs - The classes to merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
