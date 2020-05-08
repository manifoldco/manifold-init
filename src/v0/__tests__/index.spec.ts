import fetchMock from 'fetch-mock';
import { endpoint } from '../analytics';
import connection from '../index';

describe('connection', () => {
  describe('analytics', () => {
    afterEach(fetchMock.restore);

    it('sends an analytics component load event for a component on initialization', async () => {
      const componentVersion = 'v0.0.0';
      fetchMock.mock(endpoint.local, {});
      connection({
        env: 'local',
        componentVersion,
        element: document.createElement('manifold-product'),
        getAuthToken: () => '',
        getOwnerId: () => '',
        clearAuthToken: () => {},
        clientId: '123',
      });
      expect(fetchMock.called(endpoint.local)).toBe(true);
      const res = fetchMock.calls()[0][1];
      expect(res && res.body && JSON.parse(res.body.toString())).toEqual({
        source: 'MANIFOLD-PRODUCT',
        name: 'component-load',
        description: 'Track component load event',
        type: 'component-analytics',
        properties: {
          componentName: 'MANIFOLD-PRODUCT',
          version: componentVersion,
          clientId: '123', // numbers should submit as strings
        },
      });
    });
  });
});
