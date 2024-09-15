import { describe, expect, it } from 'vitest';
import { getPathForLanguage, getRoute } from '~/routes';

///
/// TODO :: GjB :: add tests for curried getDefineI18nRoute(defineRoute)
///

describe('routes', () => {
  describe('getRoute', () => {
    it('should return the correct route for a given top-level routeId', () => {
      const route = getRoute('/actors');
      expect(route.id).toBe('/actors');
    });

    it('should return the correct route for a given child routeId', () => {
      const route = getRoute('/actors/:id');
      expect(route.id).toBe('/actors/:id');
    });
  });

  describe('getPathForLanguage', () => {
    it('should return the correct path for a given routeId and language', () => {
      const path = getPathForLanguage('/actors/:id', 'fr', {
        id: '000000000000-0000-0000-00000-00000000',
      });
      expect(path).toBe('/fr/acteurs/000000000000-0000-0000-00000-00000000');
    });

    it('should replace route parameters with values from the params object', () => {
      const path = getPathForLanguage('/actors/:id', 'fr', {
        id: '000000000000-0000-0000-0000-00000000',
      });

      expect(path).toBe('/fr/acteurs/000000000000-0000-0000-0000-00000000');
    });

    it('should throw an error if the routeId is a layout route', () => {
      expect(() => getPathForLanguage('main-layout', 'en')).toThrowError(
        'Expected routeId to be an index route or a page route',
      );
    });
  });
});
