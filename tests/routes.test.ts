import { describe, expect, it } from 'vitest';

import {
  findRouteById,
  isLayoutRouteId,
  isPageRouteId,
  isRouteId,
} from '~/routes';

describe('routes', () => {
  describe('findRouteById', () => {
    it('should find a route by its id', () => {
      expect(findRouteById('/')).toEqual({
        id: '/',
        paths: '/',
        file: 'routes/index.tsx',
      });

      expect(findRouteById('/developers/:id')).toEqual({
        id: '/developers/:id',
        paths: { en: '/en/developers/:id', fr: '/fr/developpeurs/:id' },
        file: 'routes/developers/view-developer.tsx',
      });
    });

    it('should return undefined if no route is found', () => {
      expect(findRouteById('/foo')).toBeUndefined();
    });
  });

  describe('isRouteId', () => {
    it('should return true for valid route ids', () => {
      expect(isRouteId('/')).toBe(true);
      expect(isRouteId('/developers')).toBe(true);
      expect(isRouteId('/developers/:id')).toBe(true);
    });

    it('should return false for invalid route ids', () => {
      expect(isRouteId('/foo')).toBe(false);
      expect(isRouteId(undefined)).toBe(false);
      expect(isRouteId(null)).toBe(false);
    });
  });

  describe('isPageRouteId', () => {
    it('should return true for valid page route ids', () => {
      expect(isPageRouteId('/')).toBe(true);
      expect(isPageRouteId('/developers')).toBe(true);
      expect(isPageRouteId('/developers/:id')).toBe(true);
    });

    it('should return false for invalid route ids', () => {
      expect(isPageRouteId('root-layout')).toBe(false);
      expect(isPageRouteId('developers-layout')).toBe(false);
      expect(isPageRouteId(undefined)).toBe(false);
      expect(isPageRouteId(null)).toBe(false);
    });
  });

  describe('isLayoutRouteId', () => {
    it('should return true for valid layout route ids', () => {
      expect(isLayoutRouteId('developers-layout')).toBe(true);
    });

    it('should return false for invalid route ids', () => {
      expect(isLayoutRouteId('/')).toBe(false);
      expect(isLayoutRouteId('/developers')).toBe(false);
      expect(isLayoutRouteId('/developers/:id')).toBe(false);
      expect(isLayoutRouteId(undefined)).toBe(false);
      expect(isLayoutRouteId(null)).toBe(false);
    });
  });
});
