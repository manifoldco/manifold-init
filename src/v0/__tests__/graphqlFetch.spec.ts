import fetchMock from 'fetch-mock';

/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line import/first
import { createGraphqlFetch } from '../graphqlFetch';

describe('graphqlFetch', () => {
  const graphqlEndpoint = 'http://test.test/graphql';

  beforeEach(() => fetchMock.mock('begin:https://analytics.manifold.co', 200));

  afterEach(() => {
    fetchMock.restore();
  });

  describe('general', () => {
    it('defaults to api.manifold.co/graphql', async () => {
      const fetcher = createGraphqlFetch({
        version: 'version',
      });
      fetchMock.mock('https://api.manifold.co/graphql', {
        status: 200,
        body: { data: {} },
      });
      await fetcher({ query: '' });
      expect(fetchMock.called('https://api.manifold.co/graphql')).toBe(true);
    });

    it('returns data from server', async () => {
      const body = {
        data: {
          test: 1,
        },
      };
      const fetcher = createGraphqlFetch({
        endpoint: () => graphqlEndpoint,
        version: 'test',
      });

      fetchMock.mock(graphqlEndpoint, {
        status: 200,
        body,
      });

      const result = await fetcher({
        query: '',
      });

      expect(fetchMock.called(graphqlEndpoint)).toBe(true);
      expect(result).toEqual(body);
    });

    it('throws if the fetch errored', () => {
      const err = new Error('ohnoes');
      const fetcher = createGraphqlFetch({
        endpoint: () => graphqlEndpoint,
        version: 'test',
      });

      fetchMock.mock(graphqlEndpoint, { throws: err });

      expect.assertions(2);
      return fetcher({
        query: 'myQuery',
      }).catch(result => {
        expect(fetchMock.called(graphqlEndpoint)).toBe(true);
        expect(result).toEqual(err);
      });
    });

    it('emits component name and npm version', async () => {
      const tagName = 'my-custom-tag';
      const version = 'test';
      const element = document.createElement(tagName);

      fetchMock.mock(graphqlEndpoint, { data: {} });
      const fetcher = createGraphqlFetch({
        endpoint: () => graphqlEndpoint,
        version: 'test',
        element,
      });
      await fetcher({ query: '' });

      const [, req] = fetchMock.calls()[0];
      const headers = (req && req.headers) as any;
      expect(headers['x-mui-component']).toBe(`${tagName.toUpperCase()}@${version}`); // expect our component name to be there
    });
  });
});