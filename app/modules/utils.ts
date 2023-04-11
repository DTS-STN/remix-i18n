import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally add tailwind classes with `clsx()` and `twMerge()`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Type guard to check if a given value is a valid RouteHandle.
 */
export function isRouteHandle(value?: unknown): value is RouteHandle {
  return typeof value === 'object' && 'i18nNamespaces' in (value ?? {});
}
